# KeplerX Backend Server

## 🚀 Backend Setup with XAMPP MySQL

This backend server is configured to work with XAMPP's MySQL database on localhost.

### 📋 Prerequisites

1. **XAMPP installed** with MySQL service running
2. **Node.js** (v14 or higher)
3. **MySQL** service active in XAMPP

### 🔧 Setup Instructions

#### 1. Start XAMPP
- Open XAMPP Control Panel
- Start **Apache** and **MySQL** services
- Ensure MySQL is running on port 3306

#### 2. Install Dependencies
```bash
cd backend
npm install
```

#### 3. Configure Database
The backend will automatically:
- Create database `keplerx_db` if it doesn't exist
- Create all necessary tables on first run
- Connect to MySQL on localhost:3306

#### 4. Environment Variables
The `.env` file is already configured for XAMPP:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=keplerx_db
DB_PORT=3306
PORT=5000
```

#### 5. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Or use the batch file
start-backend.bat
```

### 🌐 API Endpoints

#### Server Status
- `GET /test` - Test if backend is working
- `GET /api/health` - Health check with database status

#### Portfolio API
- `GET /api/portfolio` - Get all portfolio items
- `GET /api/portfolio/:id` - Get single portfolio item
- `POST /api/portfolio` - Create new portfolio item (with file upload)
- `PUT /api/portfolio/:id` - Update portfolio item
- `DELETE /api/portfolio/:id` - Delete portfolio item

#### Forms API
- `GET /api/forms/contact` - Get all contact form submissions
- `POST /api/forms/contact` - Submit contact form
- `DELETE /api/forms/contact/:id` - Delete contact form

- `GET /api/forms/enquiry` - Get all enquiry form submissions
- `POST /api/forms/enquiry` - Submit enquiry form
- `DELETE /api/forms/enquiry/:id` - Delete enquiry form

- `GET /api/forms/quote` - Get all quote form submissions
- `POST /api/forms/quote` - Submit quote form
- `DELETE /api/forms/quote/:id` - Delete quote form

### 📊 Database Structure

#### Tables Created Automatically:
1. **portfolio** - Portfolio items with images
2. **contact_forms** - Contact form submissions
3. **enquiry_forms** - Enquiry form submissions
4. **quote_forms** - Quote form submissions

### 🖼️ File Upload

- **Upload Directory**: `backend/uploads/`
- **Slider Images**: `backend/uploads/slider/`
- **Supported Formats**: Images (jpg, png, webp, etc.)
- **File Size Limit**: 10MB

### 🧪 Testing the Backend

1. Start XAMPP MySQL service
2. Run the backend: `npm run dev`
3. Test endpoints:
   - http://localhost:5000/test
   - http://localhost:5000/api/health
   - http://localhost:5000/api/portfolio

### 🔍 Troubleshooting

#### Database Connection Issues:
1. Ensure XAMPP MySQL is running
2. Check if port 3306 is available
3. Verify MySQL credentials in `.env`

#### Common Errors:
- **ECONNREFUSED**: MySQL not running in XAMPP
- **ER_BAD_DB_ERROR**: Database creation failed
- **Port in use**: Change PORT in `.env` file

### 📝 Development Notes

- Backend automatically creates database and tables
- Uses MySQL2 for database operations
- TypeScript for type safety
- Express.js for API routing
- Multer for file uploads
- CORS enabled for frontend connections

### 🔗 Frontend Integration

The backend is configured to work with the React frontend:
- CORS enabled for localhost:3000
- API base URL: http://localhost:5000
- Image serving: http://localhost:5000/uploads/

---

**Server will be available at:** http://localhost:5000  
**Database:** keplerx_db on localhost:3306 