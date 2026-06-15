const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getJobs = async (req, res) => {
    try {
        const { type } = req.query; // 'EMAIL' or 'NOTIFICATION'
        const where = type ? { type } : {};
        
        const jobs = await prisma.jobQueue.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 100 // limit to last 100 for audit
        });
        
        res.status(200).json({ status: 'success', data: jobs });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch jobs' });
    }
};

exports.getSmtpConfig = async (req, res) => {
    try {
        const config = await prisma.smtpConfig.findFirst();
        res.status(200).json({ status: 'success', data: config });
    } catch (error) {
        console.error('Error fetching SMTP config:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch SMTP config' });
    }
};

exports.updateSmtpConfig = async (req, res) => {
    try {
        const { host, port, user, password, fromEmail } = req.body;
        
        if (!host || !port || !user || !password || !fromEmail) {
            return res.status(400).json({ status: 'error', message: 'All SMTP fields are required' });
        }

        const existing = await prisma.smtpConfig.findFirst();
        let config;

        if (existing) {
            config = await prisma.smtpConfig.update({
                where: { id: existing.id },
                data: { host, port: parseInt(port), user, password, fromEmail }
            });
        } else {
            config = await prisma.smtpConfig.create({
                data: { host, port: parseInt(port), user, password, fromEmail }
            });
        }

        res.status(200).json({ status: 'success', data: config, message: 'SMTP Configuration saved successfully' });
    } catch (error) {
        console.error('Error updating SMTP config:', error);
        res.status(500).json({ status: 'error', message: 'Failed to save SMTP configuration' });
    }
};
