const mongoose = require('mongoose');

// RFC 5322-lite email regex: requires local-part, '@', domain with at least one dot and TLD of 2+ letters
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 24;

const isValidEmail = (email) => typeof email === 'string' && EMAIL_REGEX.test(email);

// Policy: same for student, company, and admin (register, admin-create, profile update).
// Min/max length + at least one letter and one digit (blocks trivial passwords without matching frontend-only rules).
const isStrongPassword = (password) => {
  if (typeof password !== 'string') return false;
  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    return false;
  }
  const hasLetter = /[A-Za-z]/.test(password);
  const hasDigit = /\d/.test(password);
  return hasLetter && hasDigit;
};

/** Single message used by API responses; keep in sync with frontend `passwordRules.js`. */
const PASSWORD_POLICY_MESSAGE = `Password must be ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} characters and include at least one letter and one number`;

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
