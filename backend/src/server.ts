import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import pool, { testConnection, initializeDatabase } from './config/mysql';
import formsRouter from './routes/forms';
import appServicesRouter from './routes/appServices';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const sliderUploadsDir = path.join(uploadsDir, 'slider');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(sliderUploadsDir)) {
  fs.mkdirSync(sliderUploadsDir, { recursive: true });
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'sliderImages') {
      cb(null, sliderUploadsDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter function to accept only images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Set up multer upload
const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize database on startup
const initApp = async () => {
  try {
    await initializeDatabase();
    await testConnection();
    console.log('🚀 Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/forms', formsRouter);
app.use('/api/app-services', appServicesRouter);

// Test route
app.get('/test', (req: Request, res: Response) => {
  res.json({ 
    message: 'Backend is working!', 
    database: 'MySQL with XAMPP',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      server: 'running'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: (error as Error).message
    });
  }
});

// Helper to parse JSON columns safely
const parseJSONSafe = (value: any) => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
};

// Flexible parsers for incoming form-data fields that might be plain strings
const parseArrayFlexible = (value: any): string[] => {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length === 0) return [];
    // Only support comma-separated lists for robustness
    return trimmed.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

const parseObjectFlexible = <T>(value: any, fallback: T): T => {
  if (value && typeof value === 'object') return value as T;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return JSON.parse(trimmed) as T;
      } catch {
        return fallback;
      }
    }
  }
  return fallback;
};

const transformPortfolioRow = (row: any) => {
  return {
    ...row,
    _id: row.id?.toString(),
    categories: parseJSONSafe(row.categories),
    displayCategories: parseJSONSafe(row.displayCategories),
    images: parseJSONSafe(row.images),
    testimonial: parseJSONSafe(row.testimonial),
    whatWeDelivered: parseJSONSafe(row.whatWeDelivered),
  };
};

// Portfolio routes
app.get('/api/portfolio', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM portfolio ORDER BY createdAt DESC');
    const data = (rows as any[]).map(transformPortfolioRow);
    res.json(data);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single portfolio item
app.get('/api/portfolio/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM portfolio WHERE id = ?', [id]);
    const portfolio = (rows as any[])[0];
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }
    
    res.json(transformPortfolioRow(portfolio));
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload middleware for portfolio images
const portfolioUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'sliderImages', maxCount: 3 }
]);

// Create portfolio item
app.post('/api/portfolio', (req: Request, res: Response) => {
  portfolioUpload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      console.error('Unknown error:', err);
      return res.status(500).json({ error: `Unknown error: ${err.message}` });
    }
    
    try {
      console.log('Processing portfolio data...');
      const portfolioData = req.body;
      console.log('Incoming fields (raw):', {
        title: portfolioData?.title,
        categories: portfolioData?.categories,
        displayCategories: portfolioData?.displayCategories,
        testimonial: portfolioData?.testimonial,
        whatWeDelivered: portfolioData?.whatWeDelivered,
      });
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Process main image
      let mainImage = 'https://via.placeholder.com/300x200';
      if (files && files.image && files.image.length > 0) {
        mainImage = `/uploads/${files.image[0].filename}`;
      }
      
      // Process slider images
      let sliderImages = ['https://via.placeholder.com/800x600'];
      if (files && files.sliderImages && files.sliderImages.length > 0) {
        sliderImages = files.sliderImages.map(file => `/uploads/slider/${file.filename}`);
      }

      // Prepare data for MySQL
      const categories = parseArrayFlexible(portfolioData.categories);
      console.log('Parsed categories:', categories);

      const displayCategories = Array.isArray(portfolioData.displayCategories)
        ? portfolioData.displayCategories
        : (typeof portfolioData.displayCategories === 'string'
            ? parseArrayFlexible(portfolioData.displayCategories)
            : categories);
      console.log('Parsed displayCategories:', displayCategories);

      const testimonial = parseObjectFlexible(portfolioData.testimonial, { text: '', author: '', position: '' });
      console.log('Parsed testimonial:', testimonial);

      const whatWeDelivered = parseObjectFlexible(portfolioData.whatWeDelivered, { description: '', items: [] as string[] });
      console.log('Parsed whatWeDelivered:', whatWeDelivered);

      // Insert into MySQL
      const [result] = await pool.execute(`
        INSERT INTO portfolio (
          title, description, client, date, categories, displayCategories,
          image, images, testimonial, whatWeDelivered, bgColor
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        portfolioData.title,
        portfolioData.description,
        portfolioData.client,
        portfolioData.date,
        JSON.stringify(categories),
        JSON.stringify(displayCategories),
        mainImage,
        JSON.stringify(sliderImages),
        JSON.stringify(testimonial),
        JSON.stringify(whatWeDelivered),
        portfolioData.bgColor || '#2d2150'
      ]);

      console.log('Portfolio item created successfully');
      res.status(201).json({ 
        message: 'Portfolio item created successfully', 
        id: (result as any).insertId
      });
    } catch (error) {
      console.error('Error creating portfolio item:', error);
      res.status(500).json({ error: 'Internal server error: ' + (error as Error).message });
    }
  });
});

// Update portfolio item
app.put('/api/portfolio/:id', (req: Request, res: Response) => {
  portfolioUpload(req, res, async function(err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: `Upload error: ${err.message}` });
    }
    
    try {
      const { id } = req.params;
      const portfolioData = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Get existing portfolio item
      const [existing] = await pool.execute('SELECT * FROM portfolio WHERE id = ?', [id]);
      const existingItem = (existing as any[])[0];
      
      if (!existingItem) {
        return res.status(404).json({ error: 'Portfolio item not found' });
      }
      
      // Process images
      let mainImage = existingItem.image;
      if (files && files.image && files.image.length > 0) {
        mainImage = `/uploads/${files.image[0].filename}`;
      }
      
      let sliderImages = JSON.parse(existingItem.images);
      if (files && files.sliderImages && files.sliderImages.length > 0) {
        sliderImages = files.sliderImages.map(file => `/uploads/slider/${file.filename}`);
      }

      // Update in MySQL
      await pool.execute(`
        UPDATE portfolio SET 
          title = ?, description = ?, client = ?, date = ?,
          categories = ?, displayCategories = ?, image = ?, 
          images = ?, testimonial = ?, whatWeDelivered = ?, bgColor = ?
        WHERE id = ?
      `, [
        portfolioData.title || existingItem.title,
        portfolioData.description || existingItem.description,
        portfolioData.client || existingItem.client,
        portfolioData.date || existingItem.date,
        JSON.stringify(
          Array.isArray(portfolioData.categories)
            ? portfolioData.categories
            : (typeof portfolioData.categories === 'string'
                ? parseArrayFlexible(portfolioData.categories)
                : JSON.parse(existingItem.categories))
        ),
        JSON.stringify(
          Array.isArray(portfolioData.displayCategories)
            ? portfolioData.displayCategories
            : (typeof portfolioData.displayCategories === 'string'
                ? parseArrayFlexible(portfolioData.displayCategories)
                : JSON.parse(existingItem.displayCategories))
        ),
        mainImage,
        JSON.stringify(sliderImages),
        JSON.stringify(
          portfolioData.testimonial
            ? parseObjectFlexible(portfolioData.testimonial, JSON.parse(existingItem.testimonial))
            : JSON.parse(existingItem.testimonial)
        ),
        JSON.stringify(
          portfolioData.whatWeDelivered
            ? parseObjectFlexible(portfolioData.whatWeDelivered, JSON.parse(existingItem.whatWeDelivered))
            : JSON.parse(existingItem.whatWeDelivered)
        ),
        portfolioData.bgColor || existingItem.bgColor,
        id
      ]);

      res.json({ message: 'Portfolio item updated successfully' });
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      res.status(500).json({ error: 'Internal server error: ' + (error as Error).message });
    }
  });
});

// Delete portfolio item
app.delete('/api/portfolio/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM portfolio WHERE id = ?', [id]);
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }
    
    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const startServer = async () => {
  await initApp();
  
  app.listen(port, () => {
    console.log('🌐 KeplerX Backend Server Started');
    console.log(`🔗 Server: http://localhost:${port}`);
    console.log(`🧪 Test API: http://localhost:${port}/test`);
    console.log(`💊 Health Check: http://localhost:${port}/api/health`);
    console.log(`📁 Portfolio API: http://localhost:${port}/api/portfolio`);
    console.log('✅ Ready to accept requests');
  });
};

startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}); 