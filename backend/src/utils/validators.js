const mongoose = require('mongoose');

// RFC 5322-lite email regex: requires local-part, '@', domain with at least one dot and TLD of 2+ letters
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 24;

const isValidEmail = (email) => typeof email === 'string' && EMAIL_REGEX.test(email);

// Policy: same for student, company, and admin (register, admin-create, profile update).
// Keep in sync with frontend `passwordRules.js`.
const isStrongPassword = (password) => {
  if (typeof password !== 'string') return false;
  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    return false;
  }
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return hasUppercase && hasLowercase && hasDigit && hasSpecial;
};

/** Single message used by API responses; keep in sync with frontend `passwordRules.js`. */
const PASSWORD_POLICY_MESSAGE = `Password must be ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} characters and include at least one uppercase letter, one lowercase letter, one number, and one special character`;

const isValidObjectId = (id) =>
  typeof id === 'string' && mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;

const MAX_SHORT_TEXT = 100;
const MAX_MEDIUM_TEXT = 200;
const MAX_LONG_TEXT = 2000;

const exceedsMaxLength = (value, max) =>
  typeof value === 'string' && value.length > max;

module.exports = {
  EMAIL_REGEX,
  isValidEmail,
  isStrongPassword,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_POLICY_MESSAGE,
  isValidObjectId,
  exceedsMaxLength,
  MAX_SHORT_TEXT,
  MAX_MEDIUM_TEXT,
  MAX_LONG_TEXT,
};
