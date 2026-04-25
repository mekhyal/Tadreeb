const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    universityID: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: String,
        required: true,
        trim: true,
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
    },
    major: {
        type: String,
        required: true,
        trim: true,
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