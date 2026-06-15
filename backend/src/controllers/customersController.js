const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// Generate a random Customer ID like CUST-10492
const generateCustomerId = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `CUST-${randomNum}`;
};

exports.getCustomers = async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: { createdAt: 'desc' }
        });
        
        // Remove passwords before sending to frontend
        const safeCustomers = customers.map(c => {
            const { password, ...rest } = c;
            return rest;
        });
        
        res.status(200).json({ status: 'success', data: safeCustomers });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch customers' });
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, country, status, password } = req.body;
        
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ status: 'error', message: 'First name, last name, email, and password are required.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const customerId = generateCustomerId();

        const newCustomer = await prisma.customer.create({
            data: { customerId, firstName, lastName, email, phone, country, status, password: hashedPassword }
        });

        const { password: _, ...safeCustomer } = newCustomer;
        res.status(201).json({ status: 'success', data: safeCustomer });
    } catch (error) {
        console.error('Error creating customer:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ status: 'error', message: 'A customer with this email already exists.' });
        }
        res.status(500).json({ status: 'error', message: 'Failed to create customer' });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, country, status, password } = req.body;

        const updateData = { firstName, lastName, email, phone, country, status };
        
        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedCustomer = await prisma.customer.update({
            where: { id },
            data: updateData
        });

        const { password: _, ...safeCustomer } = updatedCustomer;
        res.status(200).json({ status: 'success', data: safeCustomer });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ status: 'error', message: 'Failed to update customer' });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.customer.delete({ where: { id } });
        res.status(200).json({ status: 'success', message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ status: 'error', message: 'Failed to delete customer' });
    }
};
