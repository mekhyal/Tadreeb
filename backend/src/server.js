const express = require('express'); // import Express to create the HTTP web server and define routes

const cors = require('cors'); // import CORS middleware so the frontend (different origin) can call this API
const morgan = require('morgan'); // import Morgan for HTTP request logging
require('dotenv').config(); // load variables from the .env file into process.env (PORT, MONGO_URI, JWT_SECRET, ...)

// console.log("1 server started");

const connectDB = require('./config/db'); // import the reusable DB connection helper from config/db.js

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); // import the admin/user route handlers (note: adminRoutes.js must export an express.Router)
const opportunityRoutes = require('./routes/opportunityRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const companyRequestRoutes = require('./routes/companyRequestRoutes');

const app = express(); // create the Express application instance

// middleware
// In production, set CORS_ORIGIN to your frontend origin(s), comma-separated, e.g. https://app.example.com
app.use(
    cors({
        origin: process.env.CORS_ORIGIN
            ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
            : true,
    })
);
app.use(morgan('dev')); // log HTTP requests to the console (method, URL, status, response time)
app.use(express.json()); // parse incoming JSON request bodies and attach the data to req.body

// for write requests on JSON endpoints, require Content-Type: application/json so we don't
// silently treat text/plain bodies as "missing fields" and return misleading errors (Test 64)
app.use((req, res, next) => {
    const writeMethods = ['POST', 'PUT', 'PATCH'];
    if (
        writeMethods.includes(req.method) &&
        req.path.startsWith('/api') &&
        req.headers['content-length'] && req.headers['content-length'] !== '0' &&
        !req.is('application/json')
    ) {
        return res.status(415).json({
            message: 'Unsupported Content-Type. Expected application/json',
        });
    }
    next();
});

// routes
app.use('/api/company-requests', companyRequestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);

// health check
app.get('/', (req, res) => {
    res.send('Tadreeb API is running');
});

// 404 for any unknown /api route — keeps responses uniform JSON instead of an HTML page
app.use('/api', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// central error handler: turns common Mongoose errors and bad JSON into clean 4xx responses
// instead of leaking 500s with raw stack details to the client (Tests 19, 50, 63)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'Invalid JSON body' });
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
    }
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        return res.status(400).json({ message: `${field} already exists` });
    }
    console.error(err);
    return res.status(500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5001; // use the port defined in .env, otherwise fall back to 5001

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set. Add it to your .env file.');
    process.exit(1);
}

connectDB().then(() => { // connect to MongoDB using the helper in config/db.js, then start the server only after it succeeds
    app.listen(PORT, () => { // start the Express server and listen for incoming HTTP requests on PORT
        console.log(`server is running on port ${PORT}`); // confirm in the console that the server started successfully
    });
});
