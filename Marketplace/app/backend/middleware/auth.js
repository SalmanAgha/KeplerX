const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token
 * Sets req.user with decoded token payload
 */
function verifyToken(req, res, next) {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    // Verify token using secret from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Optional middleware - checks for token but doesn't fail if missing
 * Useful for routes that work with or without authentication
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
      } catch (error) {
        // Ignore token errors for optional auth
      }
    }
  }
  
  next();
}

/**
 * Middleware to check if user has required role
 * Must be used after verifyToken
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
}

/**
 * Middleware to check if user is activated
 */
function checkActive(req, res, next) {
  if (req.user && !req.user.is_active) {
    return res.status(403).json({ error: 'Account is deactivated' });
  }
  next();
}

module.exports = {
  verifyToken,
  optionalAuth,
  authorize,
  checkActive,
};

