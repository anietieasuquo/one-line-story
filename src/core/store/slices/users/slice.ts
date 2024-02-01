import { createSlice, Draft } from '@reduxjs/toolkit';
import { UserState } from '../../../../../shared/core';
import { signIn, signOut } from './actions.ts';
import { RootState } from '../../index.ts';


const initialState: UserState = {
    user: undefined,
    actionState: null,
    actionType: 'None',
    responseError: null
};

const clearUserState = (state: Draft<UserState>) => {
    state.user = undefined;
    state.actionState = null;
    state.actionType = 'None';
    state.responseError = undefined;
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearState: (state: Draft<UserState>) => {
            console.warn('Clear user state');
            clearUserState(state);
        },
        clearRequestStateAndType: (state: Draft<UserState>) => {
            state.actionState = null;
            state.actionType = 'None';
            state.responseError = undefined;
        }
    },
    extraReducers: (builder) => {
        // Sign In
        builder.addCase(signIn.fulfilled, (state, action) => {
            clearUserState(state);
            state.user = action.payload;
            state.actionState = state.user && state.user.username ? 'success' : 'error';
            state.actionType = 'SignInUser';
        });

        builder.addCase(signIn.pending, (state) => {
            state.actionState = 'loading';
            state.actionType = 'SignInUser';
        });

        builder.addCase(signIn.rejected, (state, action) => {
            clearUserState(state);
            state.responseError = action.payload;
            state.actionState = 'error';
            state.actionType = 'SignInUser';
        });

        // Sign Out
        builder.addCase(signOut.fulfilled, (state) => {
            clearUserState(state);
            state.actionState = 'success';
            state.actionType = 'SignOutUser';
        });

        builder.addCase(signOut.pending, (state) => {
            state.actionState = 'loading';
            state.actionType = 'SignOutUser';
        });

        builder.addCase(signOut.rejected, (state, action) => {
            clearUserState(state);
            state.responseError = action.payload;
            state.actionState = 'error';
            state.actionType = 'SignOutUser';
        });
    }
});

export const userReducer = userSlice.reducer;
export const { clearState, clearRequestStateAndType } =
    userSlice.actions;
export const userSelector = (state: RootState): UserState => state.users;
