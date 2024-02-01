import { createSlice, Draft } from '@reduxjs/toolkit';
import { GameState, SortOrder, Story, StorySentence } from '../../../../../shared/core.d';
import {
    closeStory,
    createSentence,
    createStory,
    fetchStories,
    fetchStorySentences,
    pushSentence,
    pushStory,
    updateClosedStory
} from './actions.ts';
import { RootState } from '../../index.ts';
import { addToListUniqueSorted, addToMap, combineMap, sort, updateListItem } from '../../../utils.ts';


const initialState: GameState = {
    storySentences: {},
    actionState: null,
    actionType: 'None',
    responseError: null
};

const clearGameState = (state: Draft<GameState>) => {
    state.stories = undefined;
    state.newStory = undefined;
    state.newSentence = undefined;
    state.storySentences = {};
    state.actionState = null;
    state.actionType = 'None';
    state.responseError = undefined;
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        clearState: (state: Draft<GameState>) => {
            console.warn('Clear game state');
            clearGameState(state);
        },
        clearRequestStateAndType: (state: Draft<GameState>) => {
            state.actionState = null;
            state.actionType = 'None';
            state.responseError = undefined;
        }
    },
    extraReducers: (builder) => {
        // Create story
        builder.addCase(createStory.fulfilled, (state, action) => {
            state.stories = sort<Story>([...(state.stories || []), action.payload]);
            state.newStory = action.payload;
            state.actionState = 'success';
            state.actionType = 'CreateStory';
        });

        builder.addCase(createStory.pending, (state) => {
            state.actionState = 'loading';
            state.actionType = 'CreateStory';
        });

        builder.addCase(createStory.rejected, (state, action) => {
            clearGameState(state);
            state.responseError = action.payload;
            state.actionState = 'error';
            state.actionType = 'CreateStory';
        });

        // Push story
        builder.addCase(pushStory.fulfilled, (state, action) => {
            state.stories = sort<Story>([...(state.stories || []), action.payload]);
            state.actionState = 'success';
            state.actionType = 'PushStory';
        });

        builder.addCase(pushStory.pending, (state) => {
            state.actionState = 'loading';
            state.actionType = 'PushStory';
        });

        builder.addCase(pushStory.rejected, (state, action) => {
            clearGameState(state);
            state.responseError = action.payload;
            state.actionState = 'error';
            state.actionType = 'PushStory';
        });

        // Fetch stories
        builder.addCase(fetchStories.fulfilled, (state, action) => {
            state.stories = sort<Story>(action.payload);
            state.actionState = 'success';
            state.actionType = 'FetchStories';
        });

        builder.addCase(fetchStories.pending, (state) => {
            state.actionState = 'loading';
            state.actionType = 'FetchStories';
        });

        builder.addCase(fetchStories.rejected, (state, action) => {
            clearGameState(state);
            state.responseError = action.payload;
            state.actionState = 'error';
            state.actionType = 'FetchStories';
        });

        // Push story sentence
        builder.addCase(pushSentence.fulfilled, (state, action) => {
            state.storySentences = addToMap<StorySentence>(state.storySentences, action.payload, action.payload.storyId, SortOrder.ASC);
            state.actionState = 'success';
            state.actionType = 'PushStorySentence';
        });

        builder.addCase(pushSentence.pending, (state) => {
            state.actionState = 'loading';
            state.actionType = 'PushStorySentence';
        });

        builder.addCase(pushSentence.rejected, (state, action) => {
            clearGameState(state);
            state.responseError = action.payload;
            state.actionState = 'error';
            state.actionType = 'PushStorySentence';
        });

        // Create story sentence
        builder.addCase(createSentence.fulfilled, (state, action) => {
            const sentences = addToMap<StorySentence>(state.storySentences, action.payload, action.payload.storyId, SortOrder.ASC);
            const story: Story | undefined = state.stories?.find((s) => s.id === action.payload.storyId);
            if (story && story.id && (sentences[story.id].length >= story.sentenceLimit)) {
                state.stories = updateListItem<Story>(state.stories || [], { id: story.id, status: 'completed' });
            }

            state.storySentences = sentences;
            state.newSentence = action.payload;
            state.actionState = 'success';
            state.actionType = 'CreateStorySentence';
        });

        builder.addCase(createSentence.pending, (state) => {
            state.actionState = 'loading';
            state.actionType = 'CreateStorySentence';
        });

        builder.addCase(createSentence.rejected, (state, action) => {
            clearGameState(state);
            state.responseError = action.payload;
            state.actionState = 'error';
            state.actionType = 'CreateStorySentence';
        });

        // Fetch story sentences
        builder.addCase(fetchStorySentences.fulfilled, (state, action) => {
            state.storySentences = combineMap<StorySentence>(state.storySentences, action.payload, action.meta.arg, SortOrder.ASC);
            state.actionState = 'success';
            state.actionType = 'FetchStorySentences';
        });

        builder.addCase(fetchStorySentences.pending, (state) => {
            state.actionState = 'loading';
            state.actionType = 'FetchStorySentences';
        });

        builder.addCase(fetchStorySentences.rejected, (state, action) => {
            clearGameState(state);
            state.responseError = action.payload;
            state.actionState = 'error';
            state.actionType = 'FetchStorySentences';
        });

        // Close story
        builder.addCase(closeStory.fulfilled, (state, action) => {
            state.stories = addToListUniqueSorted<Story>(state.stories || [], action.payload);
            state.actionState = 'success';
            state.actionType = 'CloseStory';
        });

        builder.addCase(closeStory.pending, (state) => {
            state.actionState = 'loading';
            state.actionType = 'CloseStory';
        });

        builder.addCase(closeStory.rejected, (state, action) => {
            clearGameState(state);
            state.responseError = action.payload;
            state.actionState = 'error';
            state.actionType = 'CloseStory';
        });

        // Update closed story
        builder.addCase(updateClosedStory.fulfilled, (state, action) => {
            state.stories = updateListItem<Story>(state.stories || [], { id: action.payload, status: 'completed' });
            state.actionState = 'success';
            state.actionType = 'UpdateClosedStory';
        });

        builder.addCase(updateClosedStory.pending, (state) => {
            state.actionState = 'loading';
            state.actionType = 'UpdateClosedStory';
        });

        builder.addCase(updateClosedStory.rejected, (state, action) => {
            clearGameState(state);
            state.responseError = action.payload;
            state.actionState = 'error';
            state.actionType = 'UpdateClosedStory';
        });
    }
});

export const gameReducer = gameSlice.reducer;
export const { clearState, clearRequestStateAndType } =
    gameSlice.actions;
export const gameSelector = (state: RootState): GameState => state.game;
