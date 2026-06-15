const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer config — save PDFs to uploads/invoices/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../uploads/invoices');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `invoice-${unique}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Only PDF files are allowed'));
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

exports.uploadMiddleware = upload.single('invoiceFile');

// Helper to generate next sequential invoice number: INV-000001
async function generateInvoiceNumber() {
    const lastSale = await prisma.vpsSale.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { invoiceNumber: true }
    });

    if (!lastSale || !lastSale.invoiceNumber) {
        return 'INV-000001';
    }

    const lastNum = parseInt(lastSale.invoiceNumber.replace('INV-', ''), 10);
    const nextNum = lastNum + 1;
    return `INV-${String(nextNum).padStart(6, '0')}`;
}

const INCLUDE_ALL = {
    customer: true,
    vpsProduct: true,
    vpsPurchase: true,
    referredBy: true
};

exports.getSales = async (req, res) => {
    try {
        const sales = await prisma.vpsSale.findMany({
            include: INCLUDE_ALL,
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ status: 'success', data: sales });
    } catch (error) {
        console.error('Error fetching VPS sales:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch VPS sales' });
    }
};

exports.createSale = async (req, res) => {
    try {
        const { customerId, vpsProductId, vpsPurchaseId, price, status, endDate, referredById } = req.body;

        if (!customerId || !vpsProductId || price === undefined) {
            return res.status(400).json({ status: 'error', message: 'Customer, product, and price are required.' });
        }

        const invoiceNumber = await generateInvoiceNumber();

        const data = {
            invoiceNumber,
            customerId,
            vpsProductId,
            vpsPurchaseId: vpsPurchaseId || null,
            price: parseFloat(price),
            status: status || 'active',
            endDate: endDate ? new Date(endDate) : null,
            referredById: referredById || null
        };

        if (req.file) {
            data.invoicePath = req.file.filename;
            data.invoiceName = req.file.originalname;
        }

        const sale = await prisma.vpsSale.create({
            data,
            include: INCLUDE_ALL
        });

        // Instantly schedule renewal email reminders
        await scheduleReminderJobs(sale.id);

        res.status(201).json({ status: 'success', data: sale });
    } catch (error) {
        console.error('Error creating VPS sale:', error);
        res.status(500).json({ status: 'error', message: 'Failed to create VPS sale' });
    }
};

exports.updateSale = async (req, res) => {
    try {
        const { id } = req.params;
        const { customerId, vpsProductId, vpsPurchaseId, price, status, endDate, referredById } = req.body;

        const updateData = {};
        if (customerId) updateData.customerId = customerId;
        if (vpsProductId) updateData.vpsProductId = vpsProductId;
        if (vpsPurchaseId !== undefined) updateData.vpsPurchaseId = vpsPurchaseId || null;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (status) updateData.status = status;
        if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
        if (referredById !== undefined) updateData.referredById = referredById || null;

        if (req.file) {
            const existing = await prisma.vpsSale.findUnique({ where: { id }, select: { invoicePath: true } });
            if (existing?.invoicePath) {
                const oldPath = path.join(__dirname, '../../uploads/invoices', existing.invoicePath);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            updateData.invoicePath = req.file.filename;
            updateData.invoiceName = req.file.originalname;
        }

        const sale = await prisma.vpsSale.update({
            where: { id },
            data: updateData,
            include: INCLUDE_ALL
        });

        // Instantly reschedule renewal email reminders
        await scheduleReminderJobs(sale.id);

        res.status(200).json({ status: 'success', data: sale });
    } catch (error) {
        console.error('Error updating VPS sale:', error);
        res.status(500).json({ status: 'error', message: 'Failed to update VPS sale' });
    }
};

exports.deleteSale = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete pending reminders associated with this sale
        await deletePendingReminders(id);

        const existing = await prisma.vpsSale.findUnique({ where: { id }, select: { invoicePath: true } });
        if (existing?.invoicePath) {
            const filePath = path.join(__dirname, '../../uploads/invoices', existing.invoicePath);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await prisma.vpsSale.delete({ where: { id } });
        res.status(200).json({ status: 'success', message: 'VPS sale deleted successfully' });
    } catch (error) {
        console.error('Error deleting VPS sale:', error);
        res.status(500).json({ status: 'error', message: 'Failed to delete VPS sale' });
    }
};

exports.removeInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await prisma.vpsSale.findUnique({ where: { id }, select: { invoicePath: true } });
        if (existing?.invoicePath) {
            const filePath = path.join(__dirname, '../../uploads/invoices', existing.invoicePath);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await prisma.vpsSale.update({ where: { id }, data: { invoicePath: null, invoiceName: null } });
        res.status(200).json({ status: 'success', message: 'Invoice removed' });
    } catch (error) {
        console.error('Error removing invoice:', error);
        res.status(500).json({ status: 'error', message: 'Failed to remove invoice' });
    }
};

const deletePendingReminders = async (saleId) => {
    try {
        const pendingJobs = await prisma.jobQueue.findMany({
            where: { status: 'PENDING', type: 'EMAIL' }
        });
        const jobsToDelete = pendingJobs.filter(job => job.payload && job.payload.vpsSaleId === saleId && job.payload.isReminder === true);
        if (jobsToDelete.length > 0) {
            await prisma.jobQueue.deleteMany({
                where: {
                    id: { in: jobsToDelete.map(j => j.id) }
                }
            });
            console.log(`Deleted ${jobsToDelete.length} pending reminder jobs for sale ${saleId}`);
        }
    } catch (err) {
        console.error(`Error deleting pending reminders for sale ${saleId}:`, err);
    }
};

const scheduleReminderJobs = async (saleId) => {
    try {
        // 1. Delete any existing pending reminders
        await deletePendingReminders(saleId);

        // 2. Fetch the sale details
        const sale = await prisma.vpsSale.findUnique({
            where: { id: saleId },
            include: {
                customer: true,
                vpsProduct: true
            }
        });

        // Reset sent flags on the sale
        await prisma.vpsSale.update({
            where: { id: saleId },
            data: { reminder1Sent: false, reminder2Sent: false }
        });

        if (!sale || sale.status !== 'active' || !sale.endDate || !sale.customer || !sale.vpsProduct) {
            return;
        }

        const endDate = new Date(sale.endDate);
        if (endDate <= new Date()) {
            return;
        }

        // 3. Fetch reminder settings
        let settings = await prisma.vpsSetting.findFirst();
        if (!settings) {
            settings = {
                reminder1Days: 7,
                reminder1Enabled: true,
                reminder2Days: 3,
                reminder2Enabled: true,
                emailSubject: "Subscription Expiry Reminder",
                emailBody: "Dear Customer,\n\nThis is a reminder that your VPS subscription ({invoice}) for product {product} is expiring in {days} days on {endDate}.\n\nPlease renew to avoid any service disruption.\n\nBest regards,\nKeplerX Team"
            };
        }

        const formatEmail = (template, days) => {
            return template
                .replace(/{invoice}/g, sale.invoiceNumber)
                .replace(/{product}/g, sale.vpsProduct.name)
                .replace(/{days}/g, String(days))
                .replace(/{endDate}/g, endDate.toLocaleDateString());
        };

        // Schedule Reminder 1
        if (settings.reminder1Enabled) {
            const runAt1 = new Date(endDate.getTime());
            runAt1.setDate(runAt1.getDate() - settings.reminder1Days);

            const subject = formatEmail(settings.emailSubject, settings.reminder1Days);
            const body = formatEmail(settings.emailBody, settings.reminder1Days).replace(/\n/g, '<br/>');

            await prisma.jobQueue.create({
                data: {
                    type: 'EMAIL',
                    runAt: runAt1,
                    payload: {
                        to: sale.customer.email,
                        subject,
                        body,
                        isReminder: true,
                        vpsSaleId: sale.id,
                        reminderType: 'reminder1',
                        saleCreatedAt: sale.createdAt
                    }
                }
            });
            console.log(`Scheduled Reminder 1 for sale ${sale.id} at ${runAt1}`);
        }

        // Schedule Reminder 2
        if (settings.reminder2Enabled) {
            const runAt2 = new Date(endDate.getTime());
            runAt2.setDate(runAt2.getDate() - settings.reminder2Days);

            const subject = formatEmail(settings.emailSubject, settings.reminder2Days);
            const body = formatEmail(settings.emailBody, settings.reminder2Days).replace(/\n/g, '<br/>');

            await prisma.jobQueue.create({
                data: {
                    type: 'EMAIL',
                    runAt: runAt2,
                    payload: {
                        to: sale.customer.email,
                        subject,
                        body,
                        isReminder: true,
                        vpsSaleId: sale.id,
                        reminderType: 'reminder2',
                        saleCreatedAt: sale.createdAt
                    }
                }
            });
            console.log(`Scheduled Reminder 2 for sale ${sale.id} at ${runAt2}`);
        }
    } catch (err) {
        console.error(`Error scheduling reminder jobs for sale ${saleId}:`, err);
    }
};
