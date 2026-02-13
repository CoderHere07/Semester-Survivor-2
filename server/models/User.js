const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String, // Will be hashed
        required: true,
        minlength: 6
    },
    highScore: {
        type: Number,
        default: 1
    },
    gpa: {
        type: Number,
        default: 4.0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
