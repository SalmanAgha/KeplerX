const express = require('express');
const router = express.Router();
const path = require('path');
const vpsSalesController = require('../controllers/vpsSalesController');
const { authenticateJWT } = require('../middleware/auth');

router.use(authenticateJWT);

router.get('/', vpsSalesController.getSales);

// Use multer middleware for create/update to handle invoice file upload
router.post('/', vpsSalesController.uploadMiddleware, vpsSalesController.createSale);
router.put('/:id', vpsSalesController.uploadMiddleware, vpsSalesController.updateSale);
router.delete('/:id', vpsSalesController.deleteSale);

// Remove attached invoice only
router.delete('/:id/invoice-file', vpsSalesController.removeInvoice);

// Download / view invoice PDF
router.get('/:id/invoice-file', authenticateJWT, async (req, res) => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const fs = require('fs');
    try {
        const sale = await prisma.vpsSale.findUnique({ where: { id: req.params.id }, select: { invoicePath: true, invoiceName: true } });
        if (!sale?.invoicePath) return res.status(404).json({ status: 'error', message: 'No PDF invoice attached' });
        const filePath = path.join(__dirname, '../../uploads/invoices', sale.invoicePath);
        if (!fs.existsSync(filePath)) return res.status(404).json({ status: 'error', message: 'File not found' });
        res.setHeader('Content-Disposition', `inline; filename="${sale.invoiceName || 'invoice.pdf'}"`);
        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(filePath);
    } catch (e) {
        res.status(500).json({ status: 'error', message: 'Failed to retrieve invoice' });
    }
});

module.exports = router;
