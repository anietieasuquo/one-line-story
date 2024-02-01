import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../../../../shared/core';

const signIn = createAsyncThunk(
    'users/signIn',
    async (user: User, thunkAPI) => {
        try {
            if (user && user.username) {
                return user;
            }

            return thunkAPI.rejectWithValue('Failed to create user');
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);

const signOut = createAsyncThunk(
    'users/signOut',
    async (_, thunkAPI) => {
        try {
            return true;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export { signIn, signOut };
