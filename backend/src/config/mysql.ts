import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration for XAMPP localhost
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // XAMPP default has no password for root
  database: process.env.DB_NAME || 'keplerx_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection function
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Connected to XAMPP localhost');
    console.log(`📍 Database: ${dbConfig.database}`);
    console.log(`🔗 Host: ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error);
    return false;
  }
};

// Initialize database and create tables
export const initializeDatabase = async () => {
  try {
    // Create database if it doesn't exist
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    console.log(`✅ Database ${dbConfig.database} ready`);
    
    await connection.end();

    // Create tables
    await createTables();
    
  } catch (error) {
    console.error('❌ Database Initialization Error:', error);
    throw error;
  }
};

// Create necessary tables
const createTables = async () => {
  try {
    // Portfolio table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        client VARCHAR(255),
        date DATE,
        categories JSON,
        displayCategories JSON,
        image VARCHAR(255),
        images JSON,
        testimonial JSON,
        whatWeDelivered JSON,
        bgColor VARCHAR(50),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Contact Form table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS contact_forms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(255),
        message TEXT,
        status ENUM('new','read','responded') DEFAULT 'new',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Enquiry Form table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS enquiry_forms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        company VARCHAR(255),
        service VARCHAR(255),
        message TEXT,
        status ENUM('new','read','responded') DEFAULT 'new',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Quote Form table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS quote_forms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        company VARCHAR(255),
        service VARCHAR(255),
        budget VARCHAR(100),
        timeline VARCHAR(100),
        projectDetails TEXT,
        description TEXT,
        status ENUM('new','read','quoted','accepted','rejected') DEFAULT 'new',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Free Offer Form table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS free_offer_forms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        message TEXT,
        status ENUM('new','read','responded') DEFAULT 'new',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Maintenance & Support table already last

    // App Services table (for App Development page)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS app_services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ App services table ready');

    // Helper to add column safely (older MariaDB may not support IF NOT EXISTS)
    const addColumnSafely = async (table: string, column: string, definition: string) => {
      try {
        // Check if column exists
        const [cols] = await pool.query(
          'SELECT COUNT(*) as cnt FROM information_schema.columns WHERE table_schema = ? AND table_name = ? AND column_name = ?',
          [dbConfig.database, table, column]
        );
        const exists = (cols as any)[0].cnt > 0;
        if (!exists) {
          await pool.execute(`ALTER TABLE ${table} ADD COLUMN ${definition}`);
          console.log(`✅ Added column ${column} to ${table}`);
        }
      } catch (err) {
        console.error(`⚠️  Could not add column ${column} to ${table}:`, err);
      }
    };

    // Ensure columns / enums exist
    await addColumnSafely('contact_forms', 'status', "ENUM('new','read','responded') DEFAULT 'new'");
    await addColumnSafely('enquiry_forms', 'company', 'VARCHAR(255)');
    await addColumnSafely('enquiry_forms', 'status', "ENUM('new','read','responded') DEFAULT 'new'");
    await addColumnSafely('quote_forms', 'status', "ENUM('new','read','quoted','accepted','rejected') DEFAULT 'new'");

    // Additional safe columns (in case of legacy tables)
    await addColumnSafely('contact_forms', 'phone', 'VARCHAR(20)');
    await addColumnSafely('contact_forms', 'subject', 'VARCHAR(255)');
    await addColumnSafely('contact_forms', 'message', 'TEXT');

    await addColumnSafely('quote_forms', 'description', 'TEXT');
    await addColumnSafely('quote_forms', 'budget', 'VARCHAR(100)');
    await addColumnSafely('quote_forms', 'timeline', 'VARCHAR(100)');
    await addColumnSafely('quote_forms', 'projectDetails', 'TEXT');

    // Free offer safe columns
    await addColumnSafely('free_offer_forms', 'status', "ENUM('new','read','responded') DEFAULT 'new'");
    await addColumnSafely('free_offer_forms', 'message', 'TEXT');

    console.log('✅ All database tables created successfully');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

export default pool; 