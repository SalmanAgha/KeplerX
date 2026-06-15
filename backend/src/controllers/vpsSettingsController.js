const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSettings = async (req, res) => {
    try {
        let settings = await prisma.vpsSetting.findFirst();
        if (!settings) {
            settings = await prisma.vpsSetting.create({
                data: {
                    reminder1Days: 7,
                    reminder1Enabled: true,
                    reminder2Days: 3,
                    reminder2Enabled: true,
                    emailSubject: 'Subscription Expiry Reminder',
                    emailBody: "Dear Customer,\n\nThis is a reminder that your VPS subscription ({invoice}) for product {product} is expiring in {days} days on {endDate}.\n\nPlease renew to avoid any service disruption.\n\nBest regards,\nKeplerX Team"
                }
            });
        }
        res.status(200).json({ status: 'success', data: settings });
    } catch (error) {
        console.error('Error fetching VPS settings:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch settings' });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { reminder1Days, reminder1Enabled, reminder2Days, reminder2Enabled, emailSubject, emailBody } = req.body;
        
        let settings = await prisma.vpsSetting.findFirst();
        
        const data = {
            reminder1Days: parseInt(reminder1Days, 10),
            reminder1Enabled: reminder1Enabled === true || reminder1Enabled === 'true',
            reminder2Days: parseInt(reminder2Days, 10),
            reminder2Enabled: reminder2Enabled === true || reminder2Enabled === 'true',
            emailSubject,
            emailBody
        };

        if (settings) {
            settings = await prisma.vpsSetting.update({
                where: { id: settings.id },
                data
            });
        } else {
            settings = await prisma.vpsSetting.create({
                data
            });
        }
        res.status(200).json({ status: 'success', data: settings });
    } catch (error) {
        console.error('Error saving VPS settings:', error);
        res.status(500).json({ status: 'error', message: 'Failed to save settings' });
    }
};
