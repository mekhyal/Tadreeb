const mongoose = require('mongoose');
const { EMAIL_REGEX } = require('../utils/validators');

const studentSchema = new mongoose.Schema({
    universityID: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: [4, 'universityID is too short'],
        maxlength: [15, 'universityID is too long'],
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: [30, 'firstName is too long'],
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: [40, 'lastName is too long'],
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        maxlength: [100, 'email is too long'],
        match: [EMAIL_REGEX, 'Invalid email format'],
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'password must be at least 8 characters'],
        select: false,
    },
    mobileNo: {
    type: String,
    required: true,
    trim: true,
    maxlength: [8, 'mobileNo is too long'],
    match: [/^[965]\d{7}$/, 'Invalid Kuwait mobile number'],
},
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true,
    },
    universityName: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'universityName is too long'],
    },
    major: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'major is too long'],
    },
    year: {
        type: String,
        required: true,
        enum: ['First', 'Second', 'Third', 'Fourth', 'Fifth'],
    },

     // --- Optional profile fields (filled after registration) ---
    universityIdImage: {
    type: String,   // admin-only access; server-controlled path
    trim: true,
    },
    skills: {
    type: [{ type: String, trim: true, maxlength: [40, 'skill is too long'] }],
    default: [],
    validate: [
        (arr) => arr.length <= 30,
        'Too many skills (max 30)',
    ],
    },
    gpa: {
        type: Number,
        min: [0, 'gpa cannot be below 0'],
        max: [4, 'gpa cannot be above 4'],
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [500, 'bio is too long'],
    },
    cvFile: {
        type: String,
        trim: true,
    },
    linkedinUsername: {
        type: String,
        trim: true,
        maxlength: [100, 'linkedinUsername is too long'],
        match: [/^[a-zA-Z0-9-]+$/, 'Invalid LinkedIn username'],
    },
    // end of optional profile fields
    role: {
        type: String,
        default: 'student',
        immutable: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'pending',
    },
},
{ timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);