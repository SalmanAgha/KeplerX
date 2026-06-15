const express = require('express');
const router = express.Router();
const path = require('path');
const vpsPurchasesController = require('../controllers/vpsPurchasesController');
const { authenticateJWT } = require('../middleware/auth');

router.use(authenticateJWT);

router.get('/', vpsPurchasesController.getPurchases);

// Use multer middleware for create/update to handle file upload
router.post('/', vpsPurchasesController.uploadMiddleware, vpsPurchasesController.createPurchase);
router.put('/:id', vpsPurchasesController.uploadMiddleware, vpsPurchasesController.updatePurchase);
router.delete('/:id', vpsPurchasesController.deletePurchase);

// Remove attached bill only
router.delete('/:id/bill', vpsPurchasesController.removeBill);

// Download / view bill PDF
router.get('/:id/bill', authenticateJWT, async (req, res) => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const fs = require('fs');
    try {
        const purchase = await prisma.vpsPurchase.findUnique({ where: { id: req.params.id }, select: { billPath: true, billName: true } });
        if (!purchase?.billPath) return res.status(404).json({ status: 'error', message: 'No bill attached' });
        const filePath = path.join(__dirname, '../../uploads/bills', purchase.billPath);
        if (!fs.existsSync(filePath)) return res.status(404).json({ status: 'error', message: 'File not found' });
        res.setHeader('Content-Disposition', `inline; filename="${purchase.billName || 'bill.pdf'}"`);
        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(filePath);
    } catch (e) {
        res.status(500).json({ status: 'error', message: 'Failed to retrieve bill' });
    }
});

module.exports = router;
