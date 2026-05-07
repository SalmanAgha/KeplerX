const validator = require('validator');

/**
 * Validate email format
 */
function isValidEmail(email) {
  return validator.isEmail(email);
}

/**
 * Validate password strength
 * Minimum 8 characters, at least one letter and one number
 */
function isValidPassword(password) {
  if (!password || password.length < 8) {
    return false;
  }
  // At least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
}

/**
 * Validate user registration data
 */
function validateRegisterData(data) {
  const errors = [];

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.password || !isValidPassword(data.password)) {
    errors.push('Password must be at least 8 characters with letters and numbers');
  }

  if (data.name && data.name.length > 255) {
    errors.push('Name is too long (max 255 characters)');
  }

  if (data.role && !['user', 'viewer', 'editor', 'admin', 'super_admin'].includes(data.role)) {
    errors.push('Invalid role specified');
  }

  return errors;
}

/**
 * Validate login data
 */
function validateLoginData(data) {
  const errors = [];

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.password) {
    errors.push('Password is required');
  }

  return errors;
}

/**
 * Sanitize string input
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return validator.escape(str.trim());
}

/**
 * Validate UUID format
 */
function isValidUUID(uuid) {
  return validator.isUUID(uuid);
}

module.exports = {
  isValidEmail,
  isValidPassword,
  validateRegisterData,
  validateLoginData,
  sanitizeString,
  isValidUUID,
};

