const mongoose = require('mongoose');
const { EMAIL_REGEX } = require('../utils/validators');

const studentSchema = new mongoose.Schema({
    universityID: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: [50, 'universityID is too long'],
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'firstName is too long'],
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'lastName is too long'],
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
    },
    mobileNo: {
        type: String,
        required: true,
        trim: true,
        maxlength: [20, 'mobileNo is too long'],
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
        enum: ["First","Second","Third","Fourth","Fifth"],
    },
    skills: [
        {
            type: String,
            trim: true,
        },
    ],
    role: {
        type: String,
        default: 'student',
        immutable: true,
    },
    status: {
        type: String,
        default: 'active',
    },
},
{ timestamps: true}
);

module.exports = mongoose.model('Student', studentSchema);