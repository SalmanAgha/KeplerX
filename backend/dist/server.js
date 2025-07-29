"use strict";
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
require("./config/db");
const Portfolio_1 = __importDefault(require("./models/Portfolio"));
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
// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});
// Portfolio routes
app.get('/api/portfolio', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const portfolios = yield Portfolio_1.default.find().sort({ createdAt: -1 });
        res.json(portfolios);
    }
    catch (error) {
        console.error('Error fetching portfolio items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Upload middleware for portfolio images
const portfolioUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'sliderImages', maxCount: 3 }
]);
app.post('/api/portfolio', (req, res) => {
    portfolioUpload(req, res, function (err) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err instanceof multer_1.default.MulterError) {
                // A Multer error occurred when uploading
                console.error('Multer error:', err);
                return res.status(500).json({ error: `Upload error: ${err.message}` });
            }
            else if (err) {
                // An unknown error occurred
                console.error('Unknown error:', err);
                return res.status(500).json({ error: `Unknown error: ${err.message}` });
            }
            // Everything went fine with multer, now process the request
            try {
                console.log('Processing portfolio data...');
                const portfolioData = req.body;
                const files = req.files;
                console.log('Files received:', files ? Object.keys(files) : 'none');
                // Process main image
                if (files && files.image && files.image.length > 0) {
                    portfolioData.image = `/uploads/${files.image[0].filename}`;
                    console.log('Main image processed:', portfolioData.image);
                }
                else {
                    portfolioData.image = 'https://via.placeholder.com/300x200';
                    console.log('Using placeholder for main image');
                }
                // Process slider images
                if (files && files.sliderImages && files.sliderImages.length > 0) {
                    portfolioData.images = files.sliderImages.map(file => `/uploads/slider/${file.filename}`);
                    console.log('Slider images processed:', portfolioData.images);
                }
                else {
                    portfolioData.images = ['https://via.placeholder.com/800x600'];
                    console.log('Using placeholder for slider images');
                }
                // Convert categories to array if it's a string
                if (typeof portfolioData.categories === 'string') {
                    portfolioData.categories = [portfolioData.categories];
                    console.log('Categories converted to array:', portfolioData.categories);
                }
                // Add displayCategories if not present
                if (!portfolioData.displayCategories) {
                    portfolioData.displayCategories = portfolioData.categories;
                    console.log('Added displayCategories:', portfolioData.displayCategories);
                }
                // Parse JSON strings if needed
                if (typeof portfolioData.testimonial === 'string') {
                    try {
                        portfolioData.testimonial = JSON.parse(portfolioData.testimonial);
                        console.log('Testimonial parsed from JSON');
                    }
                    catch (e) {
                        console.error('Error parsing testimonial JSON:', e);
                        portfolioData.testimonial = {
                            text: '',
                            author: '',
                            position: ''
                        };
                    }
                }
                if (typeof portfolioData.whatWeDelivered === 'string') {
                    try {
                        portfolioData.whatWeDelivered = JSON.parse(portfolioData.whatWeDelivered);
                        console.log('whatWeDelivered parsed from JSON');
                    }
                    catch (e) {
                        console.error('Error parsing whatWeDelivered JSON:', e);
                        portfolioData.whatWeDelivered = {
                            description: '',
                            items: []
                        };
                    }
                }
                // Create and save the portfolio item
                console.log('Creating new portfolio item...');
                const portfolioItem = new Portfolio_1.default(portfolioData);
                const savedItem = yield portfolioItem.save();
                console.log('Portfolio item saved successfully with ID:', savedItem._id);
                res.status(201).json({
                    message: 'Portfolio item created successfully',
                    result: savedItem
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
                const portfolioData = req.body;
                const files = req.files;
                // Process main image if uploaded
                if (files && files.image && files.image.length > 0) {
                    portfolioData.image = `/uploads/${files.image[0].filename}`;
                }
                // Process slider images if uploaded
                if (files && files.sliderImages && files.sliderImages.length > 0) {
                    portfolioData.images = files.sliderImages.map(file => `/uploads/slider/${file.filename}`);
                }
                // Convert categories to array if it's a string
                if (typeof portfolioData.categories === 'string') {
                    portfolioData.categories = [portfolioData.categories];
                }
                // Add displayCategories if not present
                if (!portfolioData.displayCategories) {
                    portfolioData.displayCategories = portfolioData.categories;
                }
                // Parse JSON strings if needed
                if (typeof portfolioData.testimonial === 'string') {
                    portfolioData.testimonial = JSON.parse(portfolioData.testimonial);
                }
                if (typeof portfolioData.whatWeDelivered === 'string') {
                    portfolioData.whatWeDelivered = JSON.parse(portfolioData.whatWeDelivered);
                }
                const updatedItem = yield Portfolio_1.default.findByIdAndUpdate(req.params.id, portfolioData, { new: true });
                if (!updatedItem) {
                    return res.status(404).json({ error: 'Portfolio item not found' });
                }
                res.json({
                    message: 'Portfolio item updated successfully',
                    result: updatedItem
                });
            }
            catch (error) {
                console.error('Error updating portfolio item:', error);
                res.status(500).json({ error: 'Internal server error: ' + error.message });
            }
        });
    });
});
// Delete portfolio item
app.delete('/api/portfolio/:id', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deletedItem = yield Portfolio_1.default.findByIdAndDelete(req.params.id);
            if (!deletedItem) {
                return res.status(404).json({ error: 'Portfolio item not found' });
            }
            res.json({ message: 'Portfolio item deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting portfolio item:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }))();
});
// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
