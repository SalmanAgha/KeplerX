import express, { Request, Response } from 'express';
import pool from '../config/postgres';

const router = express.Router();

// GET ALL USERS
router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute('SELECT id, name, email, role, smtp_host, smtp_port, smtp_user, createdat FROM admin_users ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// CREATE USER
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, password, smtp_host, smtp_port, smtp_user, smtp_pass } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO admin_users (name, email, password, smtp_host, smtp_port, smtp_user, smtp_pass) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id',
      [name, email, password, smtp_host || '', smtp_port || 587, smtp_user || '', smtp_pass || '']
    );
    res.status(201).json({ id: (result as any)[0].id, message: 'User created' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create user' });
  }
});

// UPDATE USER
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, smtp_host, smtp_port, smtp_user, smtp_pass } = req.body;
    
    let query = 'UPDATE admin_users SET name = ?, email = ?, smtp_host = ?, smtp_port = ?, smtp_user = ?, smtp_pass = ?';
    let params = [name, email, smtp_host, smtp_port, smtp_user, smtp_pass];
    
    if (password) {
      query += ', password = ?';
      params.push(password);
    }
    
    query += ' WHERE id = ?';
    params.push(id as any);
    
    await pool.execute(query, params);
    res.json({ message: 'User updated' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update user' });
  }
});

// DELETE USER
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM admin_users WHERE id = ?', [id]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
