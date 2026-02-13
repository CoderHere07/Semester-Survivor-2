import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const res = await axios.post('http://localhost:5001/api/auth/register', userData);
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
        }
        return res.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.msg) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        const res = await axios.post('http://localhost:5001/api/auth/login', userData);
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
        }
        return res.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.msg) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Load User
export const loadUser = createAsyncThunk('auth/loadUser', async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return thunkAPI.rejectWithValue('No token');

        const res = await axios.get('http://localhost:5001/api/auth/me', {
            headers: { 'x-auth-token': token }
        });
        return res.data; // Expecting user object
    } catch (error) {
        localStorage.removeItem('token');
        return thunkAPI.rejectWithValue('Invalid token');
    }
});

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(loadUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload; // Assuming payload is the user object
                state.token = localStorage.getItem('token');
            })
            .addCase(loadUser.rejected, (state) => {
                state.isLoading = false;
                state.isError = false; // Don't treat "not logged in" as a trigger-worthy error
                state.user = null;
                state.token = null;
            });
    }
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;
