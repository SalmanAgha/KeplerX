const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { validateRegisterData, validateLoginData } = require('../utils/validators');

/**
 * Generate JWT token
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
}

/**
 * Login controller
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    const validationErrors = validateLoginData({ email, password });
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Find user by email
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate token
    const token = generateToken(user);

    // Return success response
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Register controller
 */
async function register(req, res) {
  try {
    const { email, password, name, role } = req.body;

    // Validate input
    const validationErrors = validateRegisterData({ email, password, name, role });
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password - uses bcrypt salt rounds from environment variable if set
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Determine user role (default to 'user')
    const userRole = role || 'user';

    // Create user in database
    const result = await query(
      `INSERT INTO users (email, password_hash, name, role, is_active, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, name, role, created_at`,
      [email.toLowerCase(), passwordHash, name || null, userRole, true, false]
    );

    const newUser = result.rows[0];

    // Generate token
    const token = generateToken(newUser);

    // Return success response
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Forgot password controller
 */
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    // Don't reveal if email exists for security
    if (result.rows.length === 0) {
      return res.json({
        message: 'If an account exists with this email, a password reset link has been sent',
      });
    }

    const user = result.rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await query(
      'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
      [resetTokenHash, resetTokenExpiry, user.id]
    );

    // TODO: Send email with reset link
    // For now, just return a message
    // In production, you would send an email with the token
    
    console.log(`Reset token for ${email}: ${resetToken}`); // Remove in production

    res.json({
      message: 'If an account exists with this email, a password reset link has been sent',
      // Only include in development
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Reset password controller
 */
async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Hash the token to compare with database
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const result = await query(
      'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > CURRENT_TIMESTAMP',
      [resetTokenHash]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const user = result.rows[0];

    // Validate new password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    await query(
      `UPDATE users 
       SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL 
       WHERE id = $2`,
      [passwordHash, user.id]
    );

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Guest access controller
 */
async function guestAccess(req, res) {
  try {
    // Create a guest user entry (temporary, no password)
    const guestEmail = `guest_${uuidv4()}@guest.com`;
    
    const result = await query(
      `INSERT INTO users (email, password_hash, role, is_active, is_verified, name)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, name, role`,
      [
        guestEmail,
        'guest_no_password', // Guests don't need password
        'guest',
        true,
        true,
        'Guest User'
      ]
    );

    const guestUser = result.rows[0];

    // Generate token for guest
    const token = generateToken(guestUser);

    res.status(201).json({
      message: 'Guest access granted',
      token,
      user: {
        id: guestUser.id,
        email: guestUser.email,
        name: guestUser.name,
        role: guestUser.role,
      },
    });
  } catch (error) {
    console.error('Guest access error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get current user info
 */
async function getCurrentUser(req, res) {
  try {
    const result = await query(
      'SELECT id, email, name, role, created_at, last_login FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  guestAccess,
  getCurrentUser,
};

