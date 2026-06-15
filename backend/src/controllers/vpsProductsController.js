const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProducts = async (req, res) => {
    try {
        const products = await prisma.vpsProduct.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ status: 'success', data: products });
    } catch (error) {
        console.error('Error fetching VPS products:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch VPS products' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, details, price, country, status } = req.body;
        
        if (!name || price === undefined) {
            return res.status(400).json({ status: 'error', message: 'Name and price are required.' });
        }

        const product = await prisma.vpsProduct.create({
            data: { name, details, price: parseFloat(price), country, status }
        });

        res.status(201).json({ status: 'success', data: product });
    } catch (error) {
        console.error('Error creating VPS product:', error);
        res.status(500).json({ status: 'error', message: 'Failed to create VPS product' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, details, price, country, status } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (details !== undefined) updateData.details = details;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (country !== undefined) updateData.country = country;
        if (status) updateData.status = status;

        const product = await prisma.vpsProduct.update({
            where: { id },
            data: updateData
        });

        res.status(200).json({ status: 'success', data: product });
    } catch (error) {
        console.error('Error updating VPS product:', error);
        res.status(500).json({ status: 'error', message: 'Failed to update VPS product' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.vpsProduct.delete({ where: { id } });
        res.status(200).json({ status: 'success', message: 'VPS product deleted successfully' });
    } catch (error) {
        console.error('Error deleting VPS product:', error);
        res.status(500).json({ status: 'error', message: 'Failed to delete VPS product' });
    }
};
