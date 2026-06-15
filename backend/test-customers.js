const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

async function test() {
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst();
    if (!user) { console.log('No user found'); return; }
    
    const token = jwt.sign({ id: user.id }, 'secret_key_2026', { expiresIn: '1h' });
    
    const res = await fetch('http://localhost:5001/api/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Status:', res.status);
    console.log('Body:', await res.text());
}
test();
