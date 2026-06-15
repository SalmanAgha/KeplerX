const express = require('express');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.QUEUE_PORT || 5002;

// Basic Nodemailer configuration using Ethereal (for testing) or environment variables
let fallbackTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function getTransporter() {
    const config = await prisma.smtpConfig.findFirst({ where: { isActive: true } });
    if (!config) return { transporter: fallbackTransporter, fromEmail: process.env.SMTP_FROM || '"CRM System" <noreply@crm.local>' };
    
    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        auth: {
            user: config.user,
            pass: config.password
        }
    });
    return { transporter, fromEmail: config.fromEmail };
}

/**
 * Process a single job based on its type
 */
async function processJob(job) {
    if (job.type === 'EMAIL') {
        const { to, subject, body } = job.payload;
        
        const { transporter, fromEmail } = await getTransporter();

        const isMock = !transporter.options?.auth?.user && !process.env.SMTP_USER;
        if (isMock) {
            console.log(`[QUEUE] Mock Email sent to ${to}: ${subject}`);
        } else {
            await transporter.sendMail({
                from: fromEmail,
                to,
                subject,
                html: body
            });
            console.log(`[QUEUE] Email sent to ${to}`);
        }

        // Update reminder flags if applicable
        if (job.payload && job.payload.isReminder && job.payload.vpsSaleId) {
            try {
                const updateData = {};
                if (job.payload.reminderType === 'reminder1') {
                    updateData.reminder1Sent = true;
                } else if (job.payload.reminderType === 'reminder2') {
                    updateData.reminder2Sent = true;
                }

                if (Object.keys(updateData).length > 0) {
                    await prisma.vpsSale.update({
                        where: { id: job.payload.vpsSaleId },
                        data: updateData
                    });
                    console.log(`[QUEUE] Updated vpsSale ${job.payload.vpsSaleId} reminder flags:`, updateData);
                }
            } catch (err) {
                console.error(`[QUEUE] Failed to update reminder flags for sale ${job.payload.vpsSaleId}:`, err.message);
            }
        }
    } else if (job.type === 'NOTIFICATION') {
        const { userId, title, message, type } = job.payload;
        await prisma.notification.create({
            data: { userId, title, message, type }
        });
        console.log(`[QUEUE] Notification created for user ${userId}`);
    } else if (job.type === 'CREATE_TASK') {
        const { title, description, status, priority, dueDate, tags } = job.payload;
        await prisma.task.create({
            data: {
                title,
                description,
                status: status || 'TODO',
                priority: priority || 'MEDIUM',
                dueDate: dueDate ? new Date(dueDate) : null,
                tags: tags || []
            }
        });
        console.log(`[QUEUE] Created Kanban task from queue job: ${title}`);
    } else {
        throw new Error(`Unknown job type: ${job.type}`);
    }
}

/**
 * Polling function to find and process jobs
 */
async function pollQueue() {
    try {
        const job = await prisma.jobQueue.findFirst({
            where: { 
                status: 'PENDING',
                runAt: { lte: new Date() }
            },
            orderBy: { createdAt: 'asc' }
        });

        if (!job) {
            return;
        }

        await prisma.jobQueue.update({
            where: { id: job.id },
            data: { status: 'PROCESSING' }
        });

        try {
            await processJob(job);
            
            await prisma.jobQueue.update({
                where: { id: job.id },
                data: { status: 'COMPLETED' }
            });
        } catch (jobError) {
            console.error(`[QUEUE] Job ${job.id} failed:`, jobError.message);
            
            await prisma.jobQueue.update({
                where: { id: job.id },
                data: { 
                    status: 'FAILED',
                    error: jobError.message,
                    attempts: job.attempts + 1
                }
            });
        }
    } catch (error) {
        console.error('[QUEUE] Poller encountered an error:', error);
    }
}

/**
 * Scan active VPS sales and queue email reminders if expiring soon
 */
async function checkSubscriptionExpirations() {
    try {
        console.log('[REMINDER] Scanning for expiring subscriptions...');
        let settings = await prisma.vpsSetting.findFirst();
        if (!settings) {
            settings = {
                reminder1Days: 7,
                reminder1Enabled: true,
                reminder2Days: 3,
                reminder2Enabled: true,
                emailSubject: 'Subscription Expiry Reminder',
                emailBody: "Dear Customer,\n\nThis is a reminder that your VPS subscription ({invoice}) for product {product} is expiring in {days} days on {endDate}.\n\nPlease renew to avoid any service disruption.\n\nBest regards,\nKeplerX Team"
            };
        }

        const now = new Date();
        const sales = await prisma.vpsSale.findMany({
            where: {
                status: 'active',
                endDate: { not: null }
            },
            include: {
                customer: true,
                vpsProduct: true
            }
        });

        for (const sale of sales) {
            const endDate = new Date(sale.endDate);
            const timeDiff = endDate.getTime() - now.getTime();
            const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (daysRemaining <= 0) continue; // Subscription ended

            const formatEmail = (template, days) => {
                return template
                    .replace(/{invoice}/g, sale.invoiceNumber)
                    .replace(/{product}/g, sale.vpsProduct?.name || 'VPS')
                    .replace(/{days}/g, String(days))
                    .replace(/{endDate}/g, endDate.toLocaleDateString());
            };

            // Reminder 2 (Urgently expiring soon)
            if (settings.reminder2Enabled && daysRemaining <= settings.reminder2Days && !sale.reminder2Sent) {
                const subject = formatEmail(settings.emailSubject, daysRemaining);
                const body = formatEmail(settings.emailBody, daysRemaining);

                console.log(`[REMINDER] Queuing Reminder 2 for customer ${sale.customer?.email} (${daysRemaining} days left)`);

                await prisma.jobQueue.create({
                    data: {
                        type: 'EMAIL',
                        payload: {
                            to: sale.customer?.email,
                            subject,
                            body: body.replace(/\n/g, '<br/>')
                        }
                    }
                });

                await prisma.vpsSale.update({
                    where: { id: sale.id },
                    data: { reminder1Sent: true, reminder2Sent: true }
                });
            }
            // Reminder 1 (First expiry warning)
            else if (settings.reminder1Enabled && daysRemaining <= settings.reminder1Days && !sale.reminder1Sent) {
                const subject = formatEmail(settings.emailSubject, daysRemaining);
                const body = formatEmail(settings.emailBody, daysRemaining);

                console.log(`[REMINDER] Queuing Reminder 1 for customer ${sale.customer?.email} (${daysRemaining} days left)`);

                await prisma.jobQueue.create({
                    data: {
                        type: 'EMAIL',
                        payload: {
                            to: sale.customer?.email,
                            subject,
                            body: body.replace(/\n/g, '<br/>')
                        }
                    }
                });

                await prisma.vpsSale.update({
                    where: { id: sale.id },
                    data: { reminder1Sent: true }
                });
            }
        }
    } catch (error) {
        console.error('[REMINDER] Error scanning expiring subscriptions:', error);
    }
}

async function runRemindersCronJob() {
    let log;
    try {
        log = await prisma.cronJobLog.create({
            data: {
                name: 'Reminders Queue Processor',
                status: 'PROCESSING'
            }
        });
    } catch (e) {
        console.error('[CRON] Failed to create cron job log record:', e);
        return;
    }

    console.log(`[CRON] Starting cron job: ${log.name} at ${log.startedAt}`);
    
    let processedCount = 0;
    let details = [];

    try {
        const jobs = await prisma.jobQueue.findMany({
            where: { 
                status: 'PENDING',
                runAt: { lte: new Date() }
            },
            orderBy: { createdAt: 'asc' }
        });

        details.push(`Found ${jobs.length} pending jobs to process.`);

        for (const job of jobs) {
            // Update to PROCESSING
            await prisma.jobQueue.update({
                where: { id: job.id },
                data: { status: 'PROCESSING' }
            });

            try {
                await processJob(job);
                await prisma.jobQueue.update({
                    where: { id: job.id },
                    data: { status: 'COMPLETED' }
                });
                processedCount++;
                details.push(`- Job ${job.id} (${job.type}) processed successfully.`);
            } catch (jobErr) {
                console.error(`Job ${job.id} failed:`, jobErr.message);
                await prisma.jobQueue.update({
                    where: { id: job.id },
                    data: { 
                        status: 'FAILED',
                        error: jobErr.message,
                        attempts: job.attempts + 1
                    }
                });
                details.push(`- Job ${job.id} (${job.type}) failed: ${jobErr.message}`);
            }
        }

        await prisma.cronJobLog.update({
            where: { id: log.id },
            data: {
                status: 'SUCCESS',
                completedAt: new Date(),
                processedJobsCount: processedCount,
                details: details.join('\n')
            }
        });
        console.log(`[CRON] Completed cron job: ${log.name}. Processed ${processedCount} jobs.`);
    } catch (error) {
        console.error('[CRON] Cron job encountered an error:', error);
        details.push(`Cron job failed: ${error.message}`);
        await prisma.cronJobLog.update({
            where: { id: log.id },
            data: {
                status: 'FAILED',
                completedAt: new Date(),
                processedJobsCount: processedCount,
                details: details.join('\n'),
                error: error.message
            }
        });
    }
}

// Start polling every 5 seconds (Disabled to run only via 3-hour cron job or manual trigger)
// setInterval(pollQueue, 5000);

// Run reminders cron job every 3 hours
setInterval(runRemindersCronJob, 3 * 60 * 60 * 1000);

// Run subscription check on startup, and then every 1 hour (Disabled)
// checkSubscriptionExpirations();
// setInterval(checkSubscriptionExpirations, 60 * 60 * 1000);

// Simple health check endpoint for the queue service
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'Queue Service', time: new Date().toISOString() });
});

// Endpoint to manually run the reminders cron job
app.post('/run-cron', async (req, res) => {
    runRemindersCronJob();
    res.json({ status: 'success', message: 'Cron job execution started in background' });
});

app.listen(PORT, () => {
    console.log(`🔄 Queue Microservice running on http://localhost:${PORT}`);
    console.log(`[QUEUE] Cron job runner ready (3-hour interval)`);
});
