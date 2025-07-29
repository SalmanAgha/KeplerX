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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/keplerx_portfolio';
// Set mongoose options
mongoose_1.default.set('strictQuery', false);
// Connection function
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Connecting to MongoDB...');
        console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Hide credentials in logs
        const conn = yield mongoose_1.default.connect(MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        // Test connection by fetching count of a collection
        try {
            if (mongoose_1.default.connection.db) {
                const collections = yield mongoose_1.default.connection.db.listCollections().toArray();
                console.log(`Available collections: ${collections.map(c => c.name).join(', ') || 'none'}`);
            }
            else {
                console.log('Database connection established but db object is undefined');
            }
        }
        catch (err) {
            console.log('Could not list collections, but connection is established');
        }
        return conn;
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
});
// Connect to MongoDB
connectDB();
// Handle connection events
mongoose_1.default.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('MongoDB disconnected, trying to reconnect...');
    setTimeout(connectDB, 5000);
});
exports.default = mongoose_1.default;
