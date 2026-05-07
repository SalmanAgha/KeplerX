import express, { Request, Response } from 'express';
import db from '../config/postgres';

const router = express.Router();

const initialProjects = [
  {
    slug: 'healthai-diagnostics',
    title: 'HealthAI Diagnostics',
    category: 'Computer Vision',
    industry: 'Health',
    description: 'Enterprise-grade medical imaging analysis powered by state-of-the-art vision transformers. Detects anomalies in X-rays, MRIs, and CT scans with 99.4% accuracy.',
    metrics: JSON.stringify([
      { label: 'Accuracy', value: '99.4%' },
      { label: 'Processing Time', value: '< 2s' }
    ]),
    implementationTime: '2-4 weeks',
    icon: 'FaHeartbeat',
    color: '#06b6d4',
    features: JSON.stringify(['DICOM Integration', 'Real-time Analysis', 'FDA Cleared Algorithm']),
    integrations: JSON.stringify(['Epic', 'Cerner', 'Athenahealth'])
  },
  {
    slug: 'finpredict-pro',
    title: 'FinPredict Pro',
    category: 'Predictive Analytics',
    industry: 'Finance',
    description: 'Advanced timeseries forecasting for institutional investors. Uses deep learning to analyze market sentiment, historical data, and macroeconomic indicators.',
    metrics: JSON.stringify([
      { label: 'Alpha Gen', value: '+4.2%' },
      { label: 'Data Points', value: '10M+/day' }
    ]),
    implementationTime: '4-6 weeks',
    icon: 'FaChartLine',
    color: '#10b981',
    features: JSON.stringify(['Sentiment Analysis', 'Risk Modeling', 'Automated Trading APIs']),
    integrations: JSON.stringify(['Bloomberg Terminal', 'FIX Protocol'])
  },
  {
    slug: 'supply-chain-optimizer',
    title: 'Supply Chain Optimizer',
    category: 'Operations',
    industry: 'Management',
    description: 'AI-driven logistics and inventory optimization. Predicts supply chain disruptions before they happen using global logistics data and local weather patterns.',
    metrics: JSON.stringify([
      { label: 'Cost Reduction', value: '18%' },
      { label: 'On-time Delivery', value: '98%' }
    ]),
    implementationTime: '3-5 weeks',
    icon: 'FaBoxes',
    color: '#f59e0b',
    features: JSON.stringify(['Demand Forecasting', 'Route Optimization', 'Inventory Auto-replenishment']),
    integrations: JSON.stringify(['SAP', 'Oracle Netsuite', 'Salesforce'])
  },
  {
    slug: 'edu-tutor-llm',
    title: 'EduTutor LLM',
    category: 'Natural Language',
    industry: 'Education',
    description: 'Personalized AI tutoring system that adapts to each student\'s learning pace. Features a custom fine-tuned language model safe for K-12 education.',
    metrics: JSON.stringify([
      { label: 'Engagement', value: '+45%' },
      { label: 'Grade Impact', value: '+1.2 GPA' }
    ]),
    implementationTime: '1-2 weeks',
    icon: 'FaGraduationCap',
    color: '#8b5cf6',
    features: JSON.stringify(['Socratic Method', 'Plagiarism Checking', 'Parent Dashboard']),
    integrations: JSON.stringify(['Canvas', 'Blackboard', 'Google Classroom'])
  },
  {
    slug: 'retail-vision-analytics',
    title: 'Retail Vision Analytics',
    category: 'Computer Vision',
    industry: 'Retail',
    description: 'Transform physical retail spaces into measurable data. Tracks foot traffic, heatmaps, and dwell times using existing security camera infrastructure.',
    metrics: JSON.stringify([
      { label: 'Conversion Lift', value: '12%' },
      { label: 'Hardware Cost', value: '$0' }
    ]),
    implementationTime: '2-3 weeks',
    icon: 'FaShoppingBag',
    color: '#ec4899',
    features: JSON.stringify(['Heatmapping', 'Queue Management', 'Demographic Analysis']),
    integrations: JSON.stringify(['Shopify POS', 'Square', 'Cisco Meraki'])
  }
];

// Seed projects if table is empty
const seedProjects = async () => {
  try {
    const [rows] = await db.execute('SELECT COUNT(*) as count FROM marketplace_projects');
    const count = parseInt((rows as any)[0].count, 10);
    
    if (count === 0) {
      console.log('Seeding marketplace_projects...');
      for (const p of initialProjects) {
        await db.execute(
          `INSERT INTO marketplace_projects 
          (slug, title, category, industry, description, metrics, "implementationTime", icon, color, features, integrations)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.slug, p.title, p.category, p.industry, p.description, 
            p.metrics, p.implementationTime, p.icon, p.color, 
            p.features, p.integrations
          ]
        );
      }
      console.log('Marketplace seeded!');
    }
  } catch (error) {
    console.error('Failed to seed marketplace_projects:', error);
  }
};

seedProjects();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute('SELECT * FROM marketplace_projects ORDER BY title ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute('SELECT * FROM marketplace_projects WHERE slug = ?', [req.params.slug]);
    const items = rows as any[];
    if (items.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(items[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { slug, title, category, industry, description, metrics, implementationTime, icon, color, features, integrations } = req.body;
    
    // Convert arrays/objects to JSON strings for Postgres JSONB compatibility
    const safeJson = (val: any) => typeof val === 'string' ? val : JSON.stringify(val || []);
    
    await db.execute(
      `INSERT INTO marketplace_projects 
      (slug, title, category, industry, description, metrics, "implementationTime", icon, color, features, integrations)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug, title, category, industry, description, 
        safeJson(metrics), implementationTime, icon, color, 
        safeJson(features), safeJson(integrations)
      ]
    );
    res.status(201).json({ message: 'Project created' });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.put('/:slug', async (req: Request, res: Response) => {
  try {
    const { title, category, industry, description, metrics, implementationTime, icon, color, features, integrations } = req.body;
    const safeJson = (val: any) => typeof val === 'string' ? val : JSON.stringify(val || []);
    
    await db.execute(
      `UPDATE marketplace_projects SET 
      title = ?, category = ?, industry = ?, description = ?, metrics = ?, 
      "implementationTime" = ?, icon = ?, color = ?, features = ?, integrations = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE slug = ?`,
      [
        title, category, industry, description, safeJson(metrics), 
        implementationTime, icon, color, safeJson(features), safeJson(integrations), req.params.slug
      ]
    );
    res.json({ message: 'Project updated' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/:slug', async (req: Request, res: Response) => {
  try {
    await db.execute('DELETE FROM marketplace_projects WHERE slug = ?', [req.params.slug]);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
