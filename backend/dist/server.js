"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const postgres_1 = __importStar(require("./config/postgres"));
const forms_1 = __importDefault(require("./routes/forms"));
const appServices_1 = __importDefault(require("./routes/appServices"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Create uploads directory if it doesn't exist
const uploadsDir = path_1.default.join(__dirname, '../uploads');
const sliderUploadsDir = path_1.default.join(uploadsDir, 'slider');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs_1.default.existsSync(sliderUploadsDir)) {
    fs_1.default.mkdirSync(sliderUploadsDir, { recursive: true });
}
// Serve static files from the uploads directory
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Configure storage for multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'sliderImages') {
            cb(null, sliderUploadsDir);
        }
        else {
            cb(null, uploadsDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
// File filter function to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
// Set up multer upload
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
// Initialize database on startup
const initApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, postgres_1.initializeDatabase)();
        yield (0, postgres_1.testConnection)();
        console.log('🚀 Database initialized successfully');
    }
    catch (error) {
        console.error('❌ Failed to initialize database:', error);
        process.exit(1);
    }
});
// Routes
app.use('/api/forms', forms_1.default);
app.use('/api/app-services', appServices_1.default);
// Test route
app.get('/test', (req, res) => {
    res.json({
        message: 'Backend is working!',
        database: 'PostgreSQL',
        timestamp: new Date().toISOString()
    });
});
// Health check route
app.get('/api/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield postgres_1.default.getConnection();
        connection.release();
        res.json({
            status: 'healthy',
            database: 'connected',
            server: 'running'
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message
        });
    }
}));
// Helper to parse JSON columns safely
const parseJSONSafe = (value) => {
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        }
        catch (_a) {
            return value;
        }
    }
    return value;
};
// Flexible parsers for incoming form-data fields that might be plain strings
const parseArrayFlexible = (value) => {
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.length === 0)
            return [];
        // Only support comma-separated lists for robustness
        return trimmed.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
};
const parseObjectFlexible = (value, fallback) => {
    if (value && typeof value === 'object')
        return value;
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            try {
                return JSON.parse(trimmed);
            }
            catch (_a) {
                return fallback;
            }
        }
    }
    return fallback;
};
// Flexible date normalizer: accepts YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY, DD-MMM-YYYY (e.g., 22-Sep-2024)
const normalizeDateForMySQL = (value) => {
    if (!value)
        return null;
    if (value instanceof Date && !isNaN(value.getTime())) {
        const y = value.getFullYear();
        const m = String(value.getMonth() + 1).padStart(2, '0');
        const d = String(value.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    if (typeof value === 'string') {
        const str = value.trim();
        if (!str)
            return null;
        // If already YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(str))
            return str;
        // DD/MM/YYYY or DD-MM-YYYY
        let m = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
        if (m) {
            const d = m[1].padStart(2, '0');
            const mo = m[2].padStart(2, '0');
            const y = m[3];
            return `${y}-${mo}-${d}`;
        }
        // DD-MMM-YYYY (e.g., 22-Sep-2024)
        m = str.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
        if (m) {
            const day = m[1].padStart(2, '0');
            const monStr = m[2].toLowerCase();
            const months = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
            const mon = months[monStr];
            if (mon) {
                const y = m[3];
                return `${y}-${mon}-${day}`;
            }
        }
        // Fallback to Date.parse
        const dt = new Date(str);
        if (!isNaN(dt.getTime())) {
            const y = dt.getFullYear();
            const mo = String(dt.getMonth() + 1).padStart(2, '0');
            const d = String(dt.getDate()).padStart(2, '0');
            return `${y}-${mo}-${d}`;
        }
    }
    return null;
};
const transformPortfolioRow = (row) => {
    var _a;
    return Object.assign(Object.assign({}, row), { _id: (_a = row.id) === null || _a === void 0 ? void 0 : _a.toString(), categories: parseJSONSafe(row.categories), displayCategories: parseJSONSafe(row.displayCategories), images: parseJSONSafe(row.images), testimonial: parseJSONSafe(row.testimonial), whatWeDelivered: parseJSONSafe(row.whatWeDelivered) });
};
// Portfolio routes
app.get('/api/portfolio', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield postgres_1.default.execute('SELECT * FROM portfolio ORDER BY createdAt DESC');
        const data = rows.map(transformPortfolioRow);
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching portfolio items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get single portfolio item
app.get('/api/portfolio/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [rows] = yield postgres_1.default.execute('SELECT * FROM portfolio WHERE id = ?', [id]);
        const portfolio = rows[0];
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio item not found' });
        }
        res.json(transformPortfolioRow(portfolio));
    }
    catch (error) {
        console.error('Error fetching portfolio item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Upload middleware for portfolio images
const portfolioUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'sliderImages', maxCount: 3 }
]);
// Create portfolio item
app.post('/api/portfolio', (req, res) => {
    portfolioUpload(req, res, function (err) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err instanceof multer_1.default.MulterError) {
                console.error('Multer error:', err);
                return res.status(500).json({ error: `Upload error: ${err.message}` });
            }
            else if (err) {
                console.error('Unknown error:', err);
                return res.status(500).json({ error: `Unknown error: ${err.message}` });
            }
            try {
                console.log('Processing portfolio data...');
                const portfolioData = req.body;
                console.log('Incoming fields (raw):', {
                    title: portfolioData === null || portfolioData === void 0 ? void 0 : portfolioData.title,
                    categories: portfolioData === null || portfolioData === void 0 ? void 0 : portfolioData.categories,
                    displayCategories: portfolioData === null || portfolioData === void 0 ? void 0 : portfolioData.displayCategories,
                    testimonial: portfolioData === null || portfolioData === void 0 ? void 0 : portfolioData.testimonial,
                    whatWeDelivered: portfolioData === null || portfolioData === void 0 ? void 0 : portfolioData.whatWeDelivered,
                });
                const files = req.files;
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
                const whatWeDelivered = parseObjectFlexible(portfolioData.whatWeDelivered, { description: '', items: [] });
                console.log('Parsed whatWeDelivered:', whatWeDelivered);
                // Insert into MySQL
                // Normalize date
                const normalizedDate = normalizeDateForMySQL(portfolioData.date) || null;
                const [rows] = yield postgres_1.default.execute(`
        INSERT INTO portfolio (
          title, description, client, date, categories, displayCategories,
          image, images, testimonial, whatWeDelivered, bgColor
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
      `, [
                    portfolioData.title,
                    portfolioData.description,
                    portfolioData.client,
                    normalizedDate,
                    JSON.stringify(categories),
                    JSON.stringify(displayCategories),
                    mainImage,
                    JSON.stringify(sliderImages),
                    JSON.stringify(testimonial),
                    JSON.stringify(whatWeDelivered),
                    portfolioData.bgColor || '#2d2150'
                ]);
                const newId = rows[0].id;
                console.log('Portfolio item created successfully');
                res.status(201).json({
                    message: 'Portfolio item created successfully',
                    id: newId
                });
            }
            catch (error) {
                console.error('Error creating portfolio item:', error);
                res.status(500).json({ error: 'Internal server error: ' + error.message });
            }
        });
    });
});
// Update portfolio item
app.put('/api/portfolio/:id', (req, res) => {
    portfolioUpload(req, res, function (err) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.error('Upload error:', err);
                return res.status(500).json({ error: `Upload error: ${err.message}` });
            }
            try {
                const { id } = req.params;
                const portfolioData = req.body;
                const files = req.files;
                // Get existing portfolio item
                const [existing] = yield postgres_1.default.execute('SELECT * FROM portfolio WHERE id = ?', [id]);
                const existingItem = existing[0];
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
                // Normalize date
                const normalizedUpdateDate = normalizeDateForMySQL(portfolioData.date);
                yield postgres_1.default.execute(`
        UPDATE portfolio SET 
          title = ?, description = ?, client = ?, date = ?,
          categories = ?, displayCategories = ?, image = ?, 
          images = ?, testimonial = ?, whatWeDelivered = ?, bgColor = ?
        WHERE id = ?
      `, [
                    portfolioData.title || existingItem.title,
                    portfolioData.description || existingItem.description,
                    portfolioData.client || existingItem.client,
                    normalizedUpdateDate || existingItem.date,
                    JSON.stringify(Array.isArray(portfolioData.categories)
                        ? portfolioData.categories
                        : (typeof portfolioData.categories === 'string'
                            ? parseArrayFlexible(portfolioData.categories)
                            : JSON.parse(existingItem.categories))),
                    JSON.stringify(Array.isArray(portfolioData.displayCategories)
                        ? portfolioData.displayCategories
                        : (typeof portfolioData.displayCategories === 'string'
                            ? parseArrayFlexible(portfolioData.displayCategories)
                            : JSON.parse(existingItem.displayCategories))),
                    mainImage,
                    JSON.stringify(sliderImages),
                    JSON.stringify(portfolioData.testimonial
                        ? parseObjectFlexible(portfolioData.testimonial, JSON.parse(existingItem.testimonial))
                        : JSON.parse(existingItem.testimonial)),
                    JSON.stringify(portfolioData.whatWeDelivered
                        ? parseObjectFlexible(portfolioData.whatWeDelivered, JSON.parse(existingItem.whatWeDelivered))
                        : JSON.parse(existingItem.whatWeDelivered)),
                    portfolioData.bgColor || existingItem.bgColor,
                    id
                ]);
                res.json({ message: 'Portfolio item updated successfully' });
            }
            catch (error) {
                console.error('Error updating portfolio item:', error);
                res.status(500).json({ error: 'Internal server error: ' + error.message });
            }
        });
    });
});
// Delete portfolio item
app.delete('/api/portfolio/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [rows, result] = yield postgres_1.default.execute('DELETE FROM portfolio WHERE id = ?', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Portfolio item not found' });
        }
        res.json({ message: 'Portfolio item deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting portfolio item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Start server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield initApp();
    app.listen(port, () => {
        console.log('🌐 KeplerX Backend Server Started');
        console.log(`🔗 Server: http://localhost:${port}`);
        console.log(`🧪 Test API: http://localhost:${port}/test`);
        console.log(`💊 Health Check: http://localhost:${port}/api/health`);
        console.log(`📁 Portfolio API: http://localhost:${port}/api/portfolio`);
        console.log('✅ Ready to accept requests');
    });
});
startServer().catch(error => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});
