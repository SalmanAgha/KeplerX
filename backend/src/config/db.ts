import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/keplerx_portfolio';

// Set mongoose options
mongoose.set('strictQuery', false);

// Connection function
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Hide credentials in logs
    
    const conn = await mongoose.connect(MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Test connection by fetching count of a collection
    try {
      if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`Available collections: ${collections.map(c => c.name).join(', ') || 'none'}`);
      } else {
        console.log('Database connection established but db object is undefined');
      }
    } catch (err) {
      console.log('Could not list collections, but connection is established');
    }
    
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected, trying to reconnect...');
  setTimeout(connectDB, 5000);
});

export default mongoose; 