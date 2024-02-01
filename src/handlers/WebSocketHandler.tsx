import { useCallback, useEffect, useState } from 'react'
import { Story, StorySentence, WebSocketMessage } from '../../shared/core';
import { useAppDispatch, useAppSelector } from '../core/hooks/useRedux.ts';
import { userSelector } from '../core/store/slices/users/slice.ts';
import { pushSentence, pushStory, updateClosedStory } from '../core/store/slices/game/actions.ts';
import { registerOnMessageCallback } from '../websocket.ts';
import { gameSelector } from '../core/store/slices/game/slice.ts';
import { useNavigate } from 'react-router-dom';

const WebSocketHandler = () => {
    const navigation = useNavigate();
    const { user } = useAppSelector(userSelector);
    const { actionType, actionState } = useAppSelector(gameSelector);
    const [storyId, setStoryId] = useState<string>('');
    const dispatch = useAppDispatch();

    const handleNewStory = useCallback((story: Story) => {
        if (story.creator === user?.username) return;
        dispatch(pushStory(story));
    }, [user?.username]);

    const handleNewStorySentence = useCallback((sentence: StorySentence) => {
        if (sentence.username === user?.username) return;
        dispatch(pushSentence(sentence));
    }, [user?.username]);

    const handleCloseStory = useCallback((story: Story) => {
        if (story.status !== 'completed' || !story.id) return;
        setStoryId(story.id);
        dispatch(updateClosedStory(story.id));
    }, [user?.username]);

    const onMessageReceived = useCallback((payload: string) => {
        console.log(`Websocket message received: ${payload}`);
        const body: WebSocketMessage = JSON.parse(payload);
        switch (body.type) {
            case 'CreateStory':
                return handleNewStory(body.message as Story);
            case 'CreateStorySentence':
                return handleNewStorySentence(body.message as StorySentence);
            case 'CloseStory':
                return handleCloseStory(body.message as Story);
            default:
                return null;
        }
    }, [handleNewStory, handleNewStorySentence, handleCloseStory]);

    useEffect(() => {
        registerOnMessageCallback(onMessageReceived);
    }, [onMessageReceived]);

    useEffect(() => {
        if (!['UpdateClosedStory', 'CloseStory'].includes(actionType)) return;
        if (actionState === 'success') {
            navigation(`/stories/${storyId}`);
        }
    }, [actionType, actionState, storyId, navigation]);

    return (<></>);
};

export { WebSocketHandler };
