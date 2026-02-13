const mongoose = require('mongoose');

const GameStateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stage: {
        type: Number,
        default: 1
    },
    // Active stats for the current run
    energy: { type: Number, default: 100 },
    stress: { type: Number, default: 0 },

    gpa: { type: Number, default: 4.0 },
    attackCount: { type: Number, default: 0 },

    isGameOver: {
        type: Boolean,
        default: false
    },

    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GameState', GameStateSchema);
