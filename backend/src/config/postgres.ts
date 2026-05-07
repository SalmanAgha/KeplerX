import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration for PostgreSQL
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'salmanagha',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'keplerx_db',
  port: parseInt(process.env.DB_PORT || '5432'),
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test connection function
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL Connected');
    console.log(`📍 Database: ${dbConfig.database}`);
    console.log(`🔗 Host: ${dbConfig.host}:${dbConfig.port}`);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL Connection Error:', error);
    return false;
  }
};

// Initialize database and create tables
export const initializeDatabase = async () => {
  try {
    // Note: Creating database dynamically in Postgres is harder than MySQL 
    // because you can't be connected to a DB you're trying to create.
    // We assume the user has created the database 'keplerx_db' already.
    
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
    await pool.query(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        client VARCHAR(255),
        date DATE,
        categories JSONB,
        displayCategories JSONB,
        image VARCHAR(255),
        images JSONB,
        testimonial JSONB,
        whatWeDelivered JSONB,
        bgColor VARCHAR(50),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Unified Mission Briefs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mission_briefs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        service VARCHAR(255),
        budget VARCHAR(100),
        message TEXT,
        status VARCHAR(20) DEFAULT 'new',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);



    // Admin Users table (for User Management)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        smtp_host VARCHAR(255),
        smtp_port INTEGER,
        smtp_user VARCHAR(255),
        smtp_pass VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed default admin if table is empty
    const adminCheck = await pool.query('SELECT COUNT(*) FROM admin_users');
    if (parseInt(adminCheck.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO admin_users (name, email, password, role)
        VALUES ('KeplerX Admin', 'admin@keplerx.com', 'admin123', 'superadmin')
      `);
      console.log('✅ Default admin user seeded');
    }

    // Marketplace Projects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS marketplace_projects (
        slug VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(255),
        industry VARCHAR(255),
        description TEXT,
        metrics JSONB,
        "implementationTime" VARCHAR(255),
        icon VARCHAR(255),
        color VARCHAR(50),
        features JSONB,
        integrations JSONB,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ All database tables created successfully');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

// Compatibility wrapper to match mysql2 API
const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  execute: async (text: string, params?: any[]) => {
    // Convert MySQL-style '?' to Postgres-style '$1, $2, ...'
    let index = 1;
    const pgText = text.replace(/\?/g, () => `$${index++}`);
    const result = await pool.query(pgText, params);
    return [result.rows, result];
  },
  getConnection: async () => {
    const client = await pool.connect();
    return {
      release: () => client.release(),
      execute: async (text: string, params?: any[]) => {
        let index = 1;
        const pgText = text.replace(/\?/g, () => `$${index++}`);
        const result = await client.query(pgText, params);
        return [result.rows, result];
      }
    };
  }
};

export default db;
