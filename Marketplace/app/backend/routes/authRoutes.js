const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  login,
  register,
  forgotPassword,
  resetPassword,
  guestAccess,
  getCurrentUser,
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all auth routes
router.use(authLimiter);

// Public routes
router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/guest', guestAccess);

// Protected route - requires authentication
router.get('/me', verifyToken, getCurrentUser);

module.exports = router;

