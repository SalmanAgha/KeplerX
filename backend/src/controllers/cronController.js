const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const http = require('http');

// Helper to trigger microservice POST /run-cron
const triggerQueueCron = () => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5002,
            path: '/run-cron',
            method: 'POST',
            headers: {
                'Content-Length': 0
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (e) {
                    resolve({ status: 'success', message: data });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });
};

// Fetch last 50 logs of CronJobLog
exports.getCronLogs = async (req, res) => {
    try {
        const logs = await prisma.cronJobLog.findMany({
            orderBy: { startedAt: 'desc' },
            take: 50
        });
        res.status(200).json({ status: 'success', data: logs });
    } catch (error) {
        console.error('Error fetching cron logs:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch cron logs' });
    }
};

// Manually trigger the reminders cron job in queueService (port 5002)
exports.triggerCron = async (req, res) => {
    try {
        const result = await triggerQueueCron();
        res.status(200).json({ status: 'success', message: 'Cron job manual execution triggered successfully', data: result });
    } catch (error) {
        console.error('Error triggering cron job:', error);
        res.status(500).json({ status: 'error', message: `Failed to trigger cron job: ${error.message}` });
    }
};
