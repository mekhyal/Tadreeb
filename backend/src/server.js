const express = require('express'); // import Express to create the HTTP web server and define routes

const cors = require('cors'); // import CORS middleware so the frontend (different origin) can call this API
const morgan = require('morgan'); // import Morgan for HTTP request logging
require('dotenv').config(); // load variables from the .env file into process.env (PORT, MONGO_URI, JWT_SECRET, ...)

const connectDB = require('./config/db'); // import the reusable DB connection helper from config/db.js
const authRoutes = require('./routes/authRoutes');

// const adminRoutes = require('./routes/adminRoutes'); // import the admin/user route handlers (note: adminRoutes.js must export an express.Router)
const app = express(); // create the Express application instance

// middleware
app.use(cors()); // enable Cross-Origin Resource Sharing for all incoming requests
app.use(morgan('dev')); // log HTTP requests to the console (method, URL, status, response time)
app.use(express.json()); // parse incoming JSON request bodies and attach the data to req.body

// routes
app.use('/api/auth', authRoutes); // mount the user routes so every request starting with /api/users is handled by userRoutes

// test route
app.get('/', (req, res) => { // handle GET requests to the root URL "/" (simple health-check endpoint)
    console.log('accessed the server :)'); // log a message to the terminal whenever the root URL is hit
    res.send('Tadreeb API is running'); // send a response back to the client so the request actually completes
});

const PORT = process.env.PORT || 5001; // use the port defined in .env, otherwise fall back to 5001

connectDB().then(() => { // connect to MongoDB using the helper in config/db.js, then start the server only after it succeeds
    app.listen(PORT, () => { // start the Express server and listen for incoming HTTP requests on PORT
        console.log(`server is running on port ${PORT}`); // confirm in the console that the server started successfully
    });
});
