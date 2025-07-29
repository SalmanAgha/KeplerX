import express, { Request, Response } from 'express';
import pool from '../config/mysql';

const router = express.Router();

// Get all app services
router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM app_services ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching app services:', error);
    res.status(500).json({ error: 'Failed to fetch app services' });
  }
});

// Create a new app service
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO app_services (name, description) VALUES (?, ?)',
      [name, description || '']
    );

    const insertId = (result as any).insertId;
    const [newService] = await pool.execute('SELECT * FROM app_services WHERE id = ?', [insertId]);
    res.status(201).json((newService as any[])[0]);
  } catch (error) {
    console.error('Error creating app service:', error);
    res.status(500).json({ error: 'Failed to create app service' });
  }
});

// Update existing app service
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const [result] = await pool.execute(
      'UPDATE app_services SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'App service not found' });
    }

    const [updated] = await pool.execute('SELECT * FROM app_services WHERE id = ?', [id]);
    res.json((updated as any[])[0]);
  } catch (error) {
    console.error('Error updating app service:', error);
    res.status(500).json({ error: 'Failed to update app service' });
  }
});

// Delete app service
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM app_services WHERE id = ?', [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'App service not found' });
    }

    res.json({ message: 'App service deleted successfully' });
  } catch (error) {
    console.error('Error deleting app service:', error);
    res.status(500).json({ error: 'Failed to delete app service' });
  }
});

export default router; 