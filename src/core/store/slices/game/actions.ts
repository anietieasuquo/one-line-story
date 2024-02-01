import { createAsyncThunk } from '@reduxjs/toolkit';
import { Story, StorySentence } from '../../../../../shared/core';
import { get, patch, post } from '../../api-handler.ts';
import { mapErrorMessage } from '../../../utils.ts';

const createStory = createAsyncThunk(
    'game/createStory',
    async (story: Story, thunkAPI) => {
        try {
            return await post<Story, Story>('/stories', story);
        } catch (err: any) {
            return thunkAPI.rejectWithValue(mapErrorMessage(err));
        }
    }
);

const pushStory = createAsyncThunk(
    'game/pushStory',
    async (story: Story, thunkAPI) => {
        try {
            return story;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(mapErrorMessage(err));
        }
    }
);

const fetchStories = createAsyncThunk(
    'game/fetchStories',
    async (_, thunkAPI) => {
        try {
            return await get<Story>('/stories');
        } catch (err: any) {
            return thunkAPI.rejectWithValue(mapErrorMessage(err));
        }
    }
);

const pushSentence = createAsyncThunk(
    'game/pushSentence',
    async (sentence: StorySentence, thunkAPI) => {
        try {
            return sentence;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(mapErrorMessage(err));
        }
    }
);

const createSentence = createAsyncThunk(
    'game/createSentence',
    async (storySentence: StorySentence, thunkAPI) => {
        try {
            return await post<StorySentence, StorySentence>(`/stories/${storySentence.storyId}/sentences`, storySentence);
        } catch (err: any) {
            return thunkAPI.rejectWithValue(mapErrorMessage(err));
        }
    }
);

const fetchStorySentences = createAsyncThunk(
    'game/fetchStorySentences',
    async (storyId: string, thunkAPI) => {
        try {
            return await get<StorySentence>(`/stories/${storyId}/sentences`);
        } catch (err: any) {
            return thunkAPI.rejectWithValue(mapErrorMessage(err));
        }
    }
);

const closeStory = createAsyncThunk(
    'game/closeStory',
    async (storyId: string, thunkAPI) => {
        try {
            return await patch<object, Story>(`/stories/${storyId}/completion`, {});
        } catch (err: any) {
            return thunkAPI.rejectWithValue(mapErrorMessage(err));
        }
    }
);

const updateClosedStory = createAsyncThunk(
    'game/updateClosedStory',
    async (storyId: string, thunkAPI) => {
        try {
            return storyId;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(mapErrorMessage(err));
        }
    }
);

export {
    createStory,
    pushStory,
    fetchStories,
    pushSentence,
    createSentence,
    fetchStorySentences,
    closeStory,
    updateClosedStory
};
