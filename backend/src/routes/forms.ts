import express, { Request, Response } from 'express';
import pool from '../config/postgres';

const router = express.Router();

const transformFormRow = (row: any) => ({
  ...row,
  _id: row.id?.toString(),
  submittedAt: row.createdat || row.createdAt,
});

// ── GET ALL ──────────────────────────────────────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM mission_briefs ORDER BY createdAt DESC');
    res.json((rows as any[]).map(transformFormRow));
  } catch (error) {
    console.error('Error fetching mission briefs:', error);
    res.status(500).json({ error: 'Failed to fetch mission briefs' });
  }
});

// ── POST (SUBMIT MISSION BRIEF) ──────────────────────────────
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const { name, email, company, service, budget, message } = req.body;
    
    const [rows] = await pool.execute(
      'INSERT INTO mission_briefs (name, email, company, service, budget, message) VALUES (?, ?, ?, ?, ?, ?) RETURNING id',
      [name, email, company || '', service || '', budget || '', message || '']
    );
    
    const newId = (rows as any)[0].id;
    const [newForm] = await pool.execute('SELECT * FROM mission_briefs WHERE id = ?', [newId]);
    res.status(201).json(transformFormRow((newForm as any[])[0]));
  } catch (error) {
    console.error('Error submitting mission brief:', error);
    res.status(500).json({ error: 'Failed to submit mission brief' });
  }
});

// ── GET SINGLE ───────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM mission_briefs WHERE id = ?', [req.params.id]);
    const form = (rows as any[])[0];
    if (!form) return res.status(404).json({ error: 'Mission brief not found' });
    res.json(transformFormRow(form));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mission brief' });
  }
});

// ── DELETE ───────────────────────────────────────────────────
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [, result] = await pool.execute('DELETE FROM mission_briefs WHERE id = ?', [id]);
    if ((result as any).rowCount === 0) return res.status(404).json({ error: 'Mission brief not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete mission brief' });
  }
});

// ── STATUS UPDATE ─────────────────────────────────────────────
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const [, result] = await pool.execute('UPDATE mission_briefs SET status = ? WHERE id = ?', [status, id]);
    if ((result as any).rowCount === 0) return res.status(404).json({ error: 'Mission brief not found' });
    
    const [updated] = await pool.execute('SELECT * FROM mission_briefs WHERE id = ?', [id]);
    res.json(transformFormRow((updated as any[])[0]));
  } catch (error) {
    console.error('Error updating mission brief status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;