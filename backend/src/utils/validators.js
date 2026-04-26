const mongoose = require('mongoose');

// RFC 5322-lite email regex: requires local-part, '@', domain with at least one dot and TLD of 2+ letters
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const isValidEmail = (email) => typeof email === 'string' && EMAIL_REGEX.test(email);

// Strong password: min 8 chars, must contain at least one letter and one digit
const isStrongPassword = (password) => {
  if (typeof password !== 'string') return false;
  if (password.length < 8) return false;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasDigit = /\d/.test(password);
  return hasLetter && hasDigit;
};

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
  isValidObjectId,
  exceedsMaxLength,
  MAX_SHORT_TEXT,
  MAX_MEDIUM_TEXT,
  MAX_LONG_TEXT,
};
