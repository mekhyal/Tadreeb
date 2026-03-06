const express = require('express'); // import express
const mongoose = require('mongoose'); // import mongoose
const cors = require('cors'); // import cors
const morgan = require('morgan'); // import morgan
require('dotenv').config(); // import dotenv

const app = express(); // create express app
const PORT = process.env.PORT || 3000; // set port

// Middleware
app.use(cors()); // use cors
app.use(morgan('dev')); // use morgan
app.use(express.json()); // use express.json

// Routes
app.get('/', (req, res) => { // get request
    res.json({ message: 'Tadreeb API is running' }); // send response
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI) // connect to mongodb
    .then(() => console.log('MongoDB connected')) // log success    
    .catch(err => console.log('MongoDB error:', err.message)); // log error

// Start server
app.listen(PORT, () => { // start server
    console.log(`Server running on http://localhost:${PORT}`);
});
