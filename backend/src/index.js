const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('./config/passport');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: function(origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        return callback(null, true); // Allow all origins for now
    },
    credentials: true
}));
app.use(express.json());

// Session and Passport for OAuth
app.use(session({
    secret: process.env.SESSION_SECRET || 'platform_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // In production, provide true with HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

// Mock Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', api: 'KeplerX CRM API v1', time: new Date().toISOString() });
});

// Auth Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/system', require('./routes/system'));
app.use('/api/vps/products', require('./routes/vpsProducts'));
app.use('/api/vps/sales', require('./routes/vpsSales'));
app.use('/api/vps/purchases', require('./routes/vpsPurchases'));
app.use('/api/vps/settings', require('./routes/vpsSettings'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/cron', require('./routes/cron'));



app.listen(PORT, () => {
    console.log(`🚀 KeplerX CRM Backend running on http://localhost:${PORT}`);
});
