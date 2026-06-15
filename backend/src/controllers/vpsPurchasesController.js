const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer config — save PDFs to uploads/bills/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../uploads/bills');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `bill-${unique}${path.extname(file.originalname)}`);
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

exports.uploadMiddleware = upload.single('bill');

exports.getPurchases = async (req, res) => {
    try {
        const purchases = await prisma.vpsPurchase.findMany({
            include: { 
                vpsSales: { include: { customer: true } },
                referredBy: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ status: 'success', data: purchases });
    } catch (error) {
        console.error('Error fetching VPS purchases:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch VPS purchases' });
    }
};

exports.createPurchase = async (req, res) => {
    try {
        const { vendorName, nodeName, ipAddress, cost, status, renewalDate, username, password, referredById } = req.body;

        if (!vendorName || !nodeName || cost === undefined) {
            return res.status(400).json({ status: 'error', message: 'Vendor name, node name, and cost are required.' });
        }

        const data = {
            vendorName,
            nodeName,
            ipAddress,
            cost: parseFloat(cost),
            status: status || 'active',
            renewalDate: renewalDate ? new Date(renewalDate) : null,
            username: username || null,
            password: password || null,
            referredById: referredById || null
        };

        if (req.file) {
            data.billPath = req.file.filename;
            data.billName = req.file.originalname;
        }

        const purchase = await prisma.vpsPurchase.create({ data });

        // Instantly schedule a todo task reminder 3 days before renewal
        await schedulePurchaseTaskJob(purchase.id);

        res.status(201).json({ status: 'success', data: purchase });
    } catch (error) {
        console.error('Error creating VPS purchase:', error);
        res.status(500).json({ status: 'error', message: 'Failed to create VPS purchase' });
    }
};

exports.updatePurchase = async (req, res) => {
    try {
        const { id } = req.params;
        const { vendorName, nodeName, ipAddress, cost, status, renewalDate, username, password, referredById } = req.body;

        const updateData = {};
        if (vendorName) updateData.vendorName = vendorName;
        if (nodeName) updateData.nodeName = nodeName;
        if (ipAddress !== undefined) updateData.ipAddress = ipAddress;
        if (cost !== undefined) updateData.cost = parseFloat(cost);
        if (status) updateData.status = status;
        if (renewalDate !== undefined) updateData.renewalDate = renewalDate ? new Date(renewalDate) : null;
        if (username !== undefined) updateData.username = username || null;
        if (password !== undefined) updateData.password = password || null;
        if (referredById !== undefined) updateData.referredById = referredById || null;

        // If a new file was uploaded, delete old one first
        if (req.file) {
            const existing = await prisma.vpsPurchase.findUnique({ where: { id }, select: { billPath: true } });
            if (existing?.billPath) {
                const oldPath = path.join(__dirname, '../../uploads/bills', existing.billPath);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            updateData.billPath = req.file.filename;
            updateData.billName = req.file.originalname;
        }

        const purchase = await prisma.vpsPurchase.update({ where: { id }, data: updateData });

        // Instantly reschedule todo task reminder
        await schedulePurchaseTaskJob(purchase.id);

        res.status(200).json({ status: 'success', data: purchase });
    } catch (error) {
        console.error('Error updating VPS purchase:', error);
        res.status(500).json({ status: 'error', message: 'Failed to update VPS purchase' });
    }
};

exports.deletePurchase = async (req, res) => {
    try {
        const { id } = req.params;
        // Delete attached bill file if exists
        const existing = await prisma.vpsPurchase.findUnique({ where: { id }, select: { billPath: true } });
        if (existing?.billPath) {
            const filePath = path.join(__dirname, '../../uploads/bills', existing.billPath);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        // Delete pending task creation jobs
        await deletePendingPurchaseTasks(id);

        await prisma.vpsPurchase.delete({ where: { id } });
        res.status(200).json({ status: 'success', message: 'VPS purchase deleted successfully' });
    } catch (error) {
        console.error('Error deleting VPS purchase:', error);
        res.status(500).json({ status: 'error', message: 'Failed to delete VPS purchase' });
    }
};

exports.removeBill = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await prisma.vpsPurchase.findUnique({ where: { id }, select: { billPath: true } });
        if (existing?.billPath) {
            const filePath = path.join(__dirname, '../../uploads/bills', existing.billPath);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await prisma.vpsPurchase.update({ where: { id }, data: { billPath: null, billName: null } });
        res.status(200).json({ status: 'success', message: 'Bill removed' });
    } catch (error) {
        console.error('Error removing bill:', error);
        res.status(500).json({ status: 'error', message: 'Failed to remove bill' });
    }
};

const deletePendingPurchaseTasks = async (purchaseId) => {
    try {
        const pendingJobs = await prisma.jobQueue.findMany({
            where: { status: 'PENDING', type: 'CREATE_TASK' }
        });
        const jobsToDelete = pendingJobs.filter(job => job.payload && job.payload.vpsPurchaseId === purchaseId);
        if (jobsToDelete.length > 0) {
            await prisma.jobQueue.deleteMany({
                where: {
                    id: { in: jobsToDelete.map(j => j.id) }
                }
            });
            console.log(`Deleted ${jobsToDelete.length} pending task creation jobs for purchase ${purchaseId}`);
        }
    } catch (err) {
        console.error(`Error deleting pending task jobs for purchase ${purchaseId}:`, err);
    }
};

const schedulePurchaseTaskJob = async (purchaseId) => {
    try {
        // 1. Delete any existing pending tasks in the queue for this purchase
        await deletePendingPurchaseTasks(purchaseId);

        // 2. Fetch the purchase details
        const purchase = await prisma.vpsPurchase.findUnique({
            where: { id: purchaseId }
        });

        if (!purchase || purchase.status !== 'active' || !purchase.renewalDate) {
            return;
        }

        const renewalDate = new Date(purchase.renewalDate);
        if (renewalDate <= new Date()) {
            return;
        }

        // Calculate runAt: 3 days before renewalDate
        const runAt = new Date(renewalDate.getTime());
        runAt.setDate(runAt.getDate() - 3);

        const taskTitle = `VPS Purchase Renewal: ${purchase.vendorName} - ${purchase.nodeName}`;
        
        let details = [
            `VPS Purchase renewal reminder:`,
            `- Vendor: ${purchase.vendorName}`,
            `- Node: ${purchase.nodeName}`,
            `- IP: ${purchase.ipAddress || 'N/A'}`,
            `- Cost: $${purchase.cost.toFixed(2)}`,
            `- Renewal Date: ${renewalDate.toLocaleDateString()}`
        ];
        if (purchase.username) details.push(`- Username: ${purchase.username}`);
        if (purchase.password) details.push(`- Password: ${purchase.password}`);

        const description = details.join('\n');

        await prisma.jobQueue.create({
            data: {
                type: 'CREATE_TASK',
                runAt,
                payload: {
                    vpsPurchaseId: purchase.id,
                    title: taskTitle,
                    description,
                    status: 'TODO',
                    priority: 'HIGH',
                    dueDate: renewalDate.toISOString(),
                    tags: ['VPS', 'Purchase', 'Renewal'],
                    isReminder: true,
                    saleCreatedAt: purchase.createdAt,
                    to: 'To-Do List',
                    subject: taskTitle
                }
            }
        });
        console.log(`Scheduled task creation job for purchase ${purchase.id} at ${runAt}`);
    } catch (err) {
        console.error(`Error scheduling task creation job for purchase ${purchaseId}:`, err);
    }
};
