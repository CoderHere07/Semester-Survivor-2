require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const configuredClientOrigins = [
    process.env.CLIENT_URLS,
    process.env.CLIENT_URL
]
    .filter(Boolean)
    .flatMap(origins => origins.split(','))
    .map(origin => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);

const allowedOrigins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "https://semester-survivor-2.vercel.app",

    ...configuredClientOrigins
];

// Middleware
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

// Database Connection
mongoose.connect(
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    'mongodb://localhost:27017/semester-survivor'
)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/game', require('./routes/game'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
