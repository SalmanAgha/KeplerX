import express, { Request, Response } from 'express';
import pool from '../config/mysql';

const router = express.Router();

const transformFormRow = (row: any) => ({
  ...row,
  _id: row.id?.toString(),
  submittedAt: row.createdAt,
});

// Get all form submissions
router.get('/contact', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contact_forms ORDER BY `createdAt` DESC');
    const data = (rows as any[]).map(transformFormRow);
    res.json(data);
  } catch (error) {
    console.error('Error fetching contact forms:', error);
    res.status(500).json({ error: 'Failed to fetch contact forms' });
  }
});

router.get('/enquiry', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM enquiry_forms ORDER BY `createdAt` DESC');
    const data = (rows as any[]).map(transformFormRow);
    res.json(data);
  } catch (error) {
    console.error('Error fetching enquiry forms:', error);
    res.status(500).json({ error: 'Failed to fetch enquiry forms' });
  }
});

router.get('/quote', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM quote_forms ORDER BY `createdAt` DESC');
    const data = (rows as any[]).map(transformFormRow);
    res.json(data);
  } catch (error) {
    console.error('Error fetching quote forms:', error);
    res.status(500).json({ error: 'Failed to fetch quote forms' });
  }
});

router.get('/free-offer', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM free_offer_forms ORDER BY `createdAt` DESC');
    const data = (rows as any[]).map(transformFormRow);
    res.json(data);
  } catch (error) {
    console.error('Error fetching free offer forms:', error);
    res.status(500).json({ error: 'Failed to fetch free offer forms' });
  }
});

// Submit new contact form
router.post('/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO contact_forms (`name`, `email`, `phone`, `subject`, `message`) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || '', subject || '', message]
    );
    
    const insertId = (result as any).insertId;
    const [newForm] = await pool.execute('SELECT * FROM contact_forms WHERE `id` = ?', [insertId]);
    
    console.log('Contact form submitted successfully');
    const transformed = transformFormRow((newForm as any[])[0]);
    res.status(201).json(transformed);
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: (error as Error).message || 'Failed to submit contact form' });
  }
});

// Submit new enquiry form
router.post('/enquiry', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, company, service, message } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO enquiry_forms (`name`, `email`, `phone`, `company`, `service`, `message`) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone || '', company || '', service || '', message]
    );
    
    const insertId = (result as any).insertId;
    const [newForm] = await pool.execute('SELECT * FROM enquiry_forms WHERE `id` = ?', [insertId]);
    
    console.log('Enquiry form submitted successfully');
    const transformed = transformFormRow((newForm as any[])[0]);
    res.status(201).json(transformed);
  } catch (error) {
    console.error('Error submitting enquiry form:', error);
    res.status(500).json({ error: (error as Error).message || 'Failed to submit enquiry form' });
  }
});

// Submit new quote form
router.post('/quote', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, company, service, budget, timeline, projectDetails, description } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO quote_forms (`name`, `email`, `phone`, `company`, `service`, `budget`, `timeline`, `projectDetails`, `description`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone || '', company || '', service || '', budget || '', timeline || '', projectDetails || '', description || '']
    );
    
    const insertId = (result as any).insertId;
    const [newForm] = await pool.execute('SELECT * FROM quote_forms WHERE `id` = ?', [insertId]);
    
    console.log('Quote form submitted successfully');
    const transformed = transformFormRow((newForm as any[])[0]);
    res.status(201).json(transformed);
  } catch (error) {
    console.error('Error submitting quote form:', error);
    res.status(500).json({ error: (error as Error).message || 'Failed to submit quote form' });
  }
});

// Submit new free offer form
router.post('/free-offer', async (req: Request, res: Response) => {
  try {
    const { email, message } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO free_offer_forms (`email`, `message`) VALUES (?, ?)',
      [email, message || '']
    );

    const insertId = (result as any).insertId;
    const [newForm] = await pool.execute('SELECT * FROM free_offer_forms WHERE `id` = ?', [insertId]);

    console.log('Free offer form submitted successfully');
    const transformed = transformFormRow((newForm as any[])[0]);
    res.status(201).json(transformed);
  } catch (error) {
    console.error('Error submitting free offer form:', error);
    res.status(500).json({ error: (error as Error).message || 'Failed to submit free offer form' });
  }
});

// Delete form submissions
router.delete('/contact/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM contact_forms WHERE `id` = ?', [id]);
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Contact form not found' });
    }
    
    res.json({ message: 'Contact form deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact form:', error);
    res.status(500).json({ error: 'Failed to delete contact form' });
  }
});

router.delete('/enquiry/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM enquiry_forms WHERE `id` = ?', [id]);
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Enquiry form not found' });
    }
    
    res.json({ message: 'Enquiry form deleted successfully' });
  } catch (error) {
    console.error('Error deleting enquiry form:', error);
    res.status(500).json({ error: 'Failed to delete enquiry form' });
  }
});

router.delete('/quote/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM quote_forms WHERE `id` = ?', [id]);
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Quote form not found' });
    }
    
    res.json({ message: 'Quote form deleted successfully' });
  } catch (error) {
    console.error('Error deleting quote form:', error);
    res.status(500).json({ error: 'Failed to delete quote form' });
  }
});

router.delete('/free-offer/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM free_offer_forms WHERE `id` = ?', [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Free offer form not found' });
    }

    res.json({ message: 'Free offer form deleted successfully' });
  } catch (error) {
    console.error('Error deleting free offer form:', error);
    res.status(500).json({ error: 'Failed to delete free offer form' });
  }
});

// Get single form submissions
router.get('/contact/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM contact_forms WHERE `id` = ?', [id]);
    const form = (rows as any[])[0];
    
    if (!form) {
      return res.status(404).json({ error: 'Contact form not found' });
    }
    
    res.json(transformFormRow(form));
  } catch (error) {
    console.error('Error fetching contact form:', error);
    res.status(500).json({ error: 'Failed to fetch contact form' });
  }
});

router.get('/enquiry/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM enquiry_forms WHERE `id` = ?', [id]);
    const form = (rows as any[])[0];
    
    if (!form) {
      return res.status(404).json({ error: 'Enquiry form not found' });
    }
    
    res.json(transformFormRow(form));
  } catch (error) {
    console.error('Error fetching enquiry form:', error);
    res.status(500).json({ error: 'Failed to fetch enquiry form' });
  }
});

router.get('/quote/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM quote_forms WHERE `id` = ?', [id]);
    const form = (rows as any[])[0];
    
    if (!form) {
      return res.status(404).json({ error: 'Quote form not found' });
    }
    
    res.json(transformFormRow(form));
  } catch (error) {
    console.error('Error fetching quote form:', error);
    res.status(500).json({ error: 'Failed to fetch quote form' });
  }
});

router.get('/free-offer/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM free_offer_forms WHERE `id` = ?', [id]);
    const form = (rows as any[])[0];

    if (!form) {
      return res.status(404).json({ error: 'Free offer form not found' });
    }

    res.json(transformFormRow(form));
  } catch (error) {
    console.error('Error fetching free offer form:', error);
    res.status(500).json({ error: 'Failed to fetch free offer form' });
  }
});

// Update form status (contact, enquiry, quote)
router.patch('/:type/:id/status', async (req: Request, res: Response) => {
  try {
    const { type, id } = req.params;
    const { status } = req.body;

    const tableMap: { [key: string]: string } = {
      contact: 'contact_forms',
      enquiry: 'enquiry_forms',
      quote: 'quote_forms',
      'free-offer': 'free_offer_forms',
    };

    const tableName = tableMap[type];
    if (!tableName) {
      return res.status(400).json({ error: 'Invalid form type' });
    }

    const [result] = await pool.execute(`UPDATE ${tableName} SET status = ? WHERE \`id\` = ?`, [status, id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const [updated] = await pool.execute(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
    res.json(transformFormRow((updated as any[])[0]));
  } catch (error) {
    console.error('Error updating form status:', error);
    res.status(500).json({ error: 'Failed to update form status' });
  }
});

export default router; 