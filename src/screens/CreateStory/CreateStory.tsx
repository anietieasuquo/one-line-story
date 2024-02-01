import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import TextInput from '../../components/TextInput';
import { useAppDispatch, useAppSelector } from '../../core/hooks/useRedux.ts';
import { Story } from '../../../shared/core';
import { userSelector } from '../../core/store/slices/users/slice.ts';
import { Button, Form } from 'react-bootstrap';
import { createStory } from '../../core/store/slices/game/actions.ts';
import { clearRequestStateAndType, gameSelector } from '../../core/store/slices/game/slice.ts';
import NavigationContentHeader from '../../components/NavigationContentHeader';
import { Store } from 'react-notifications-component';
import { errorNotification, successNotification } from '../../utils/notifications.ts';
import './CreateStory.css';

const CreateStory = () => {
    const [title, setTitle] = useState<string>('');
    const [topic, setTopic] = useState<string>('');
    const [maxSentence, setMaxSentence] = useState<string>('0');
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(userSelector);
    const { newStory, actionType, actionState, responseError } = useAppSelector(gameSelector);
    const navigate = useNavigate();
    const submit = (event: any) => {
        event.preventDefault();
        if (title.length === 0 || maxSentence.length === 0 || parseInt(maxSentence) === 0) {
            Store.addNotification({
                ...errorNotification,
                message: 'Please fill out all fields. Note that the sentence limit must be greater than 0.'
            });
            return;
        }

        const story: Story = {
            title,
            topic,
            sentenceLimit: parseInt(maxSentence),
            creator: user?.username,
            status: 'open'
        };
        dispatch(createStory(story));
    };

    useEffect(() => {
        if (actionType !== 'CreateStory') return;

        if (actionState === 'success' && newStory) {
            Store.addNotification({
                ...successNotification,
                message: 'Story created successfully'
            });
            navigate('/stories');
            return;
        }

        if (actionState === 'error') {
            Store.addNotification({
                ...errorNotification,
                message: 'Failed to create story'
            });

            dispatch(clearRequestStateAndType());
        }
    }, [actionType, actionState, responseError, newStory]);

    return (
        <div className="create-story">
            <NavigationContentHeader title="New StoryView"/>
            <Form>
                <TextInput value={title} onChange={setTitle} id="title" label="Title"/>
                <TextInput value={topic} onChange={setTopic} id="topic" label="Topic"/>
                <TextInput value={maxSentence} onChange={setMaxSentence} id="maxSentence" label="Sentence Limit"/>
                <Button onClick={submit} type="submit" variant="primary">Submit</Button>
            </Form>
        </div>
    );
};

export { CreateStory };
