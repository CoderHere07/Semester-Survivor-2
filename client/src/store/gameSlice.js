import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    stage: 1,
    energy: 100,
    stress: 0,
    isGameOver: false,
    turn: 'teacher', // 'player' or 'teacher'
    gpa: 4.0,
    attackCount: 0
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        updateStats: (state, action) => {
            // Payload example: { energy: -10, stress: +5 }
            const { energy, stress } = action.payload;
            if (energy !== undefined) state.energy = Math.min(100, Math.max(0, state.energy + energy));
            if (stress !== undefined) state.stress = Math.min(100, Math.max(0, state.stress + stress));

            // Check Game Over conditions
            if (state.stress >= 100) {
                state.isGameOver = true;
            }
            if (state.energy <= 0) {
                state.isGameOver = true;
            }
        },
        setStage: (state, action) => {
            state.stage = action.payload;
            state.turn = 'teacher'; // Enforce Teacher turn on stage change
        },
        switchTurn: (state) => {
            state.turn = state.turn === 'player' ? 'teacher' : 'player';
        },
        incrementAttackCount: (state) => {
            state.attackCount += 1;
        },
        resetAttackCount: (state) => {
            state.attackCount = 0;
        },
        updateGpa: (state, action) => {
            state.gpa = action.payload;
        },
        setGameState: (state, action) => {
            // Load saved state
            const { stage, energy, stress, isGameOver, turn, gpa, attackCount } = action.payload;
            if (stage) state.stage = stage;
            if (energy !== undefined) state.energy = energy;
            if (stress !== undefined) state.stress = stress;
            if (isGameOver !== undefined) state.isGameOver = isGameOver;
            if (turn) state.turn = turn;
            if (gpa !== undefined) state.gpa = gpa;
            if (attackCount !== undefined) state.attackCount = attackCount;
        },
        resetGame: (state) => {
            return { ...initialState, turn: 'teacher' };
        }
    }
});

export const { updateStats, setStage, switchTurn, resetGame, setGameState, incrementAttackCount, resetAttackCount, updateGpa } = gameSlice.actions;
export default gameSlice.reducer;
