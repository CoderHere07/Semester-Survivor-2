const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const GameState = require('../models/GameState');
const User = require('../models/User');


// Get current game state
router.get('/', auth, async (req, res) => {
    try {
        let gameState = await GameState.findOne({ userId: req.user.id });
        if (!gameState) {
            // Create new initial state if not exists
            gameState = new GameState({
                userId: req.user.id
            });
            await gameState.save();
        }
        res.json(gameState);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update game state (e.g., after a turn)
router.post('/save', auth, async (req, res) => {
    try {
        const { stage, energy, stress, isGameOver, gpa, attackCount } = req.body;

        // Upsert
        let gameState = await GameState.findOne({ userId: req.user.id });
        if (!gameState) {
            gameState = new GameState({ userId: req.user.id });
        }

        gameState.stage = stage;
        gameState.energy = energy;
        gameState.stress = stress;
        gameState.isGameOver = isGameOver;
        if (gpa !== undefined) gameState.gpa = gpa;
        if (attackCount !== undefined) gameState.attackCount = attackCount;
        gameState.lastUpdated = Date.now();

        await gameState.save();

        // Check if this stage is a new high score for the user
        const user = await User.findById(req.user.id);
        // Stage is 1-indexed. If they passed stage 1, they are on stage 2. 
        // High score should probably represent "Semesters Cleared" (stage - 1) or just "Highest Semester Reached" (stage).
        // Let's use "Highest Semester Reached" (stage).
        if (stage > user.highScore) {
            user.highScore = stage;
            if (gpa !== undefined) user.gpa = gpa;
            await user.save();
        } else if (stage === user.highScore && gpa > user.gpa) {
            user.gpa = gpa;
            await user.save();
        }

        res.json(gameState);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update High Score (if game over or semester passed)
router.post('/score', auth, async (req, res) => {
    try {
        const { score } = req.body;
        const user = await User.findById(req.user.id);

        if (score > user.highScore) {
            user.highScore = score;
            await user.save();
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find().sort({ highScore: -1, gpa: -1 }).limit(10).select('username highScore gpa');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
