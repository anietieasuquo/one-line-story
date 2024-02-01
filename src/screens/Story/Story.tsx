import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import { Story as SingleStory, StorySentence } from '../../../shared/core';
import Sentence from '../../components/Sentence';
import { useAppDispatch, useAppSelector } from '../../core/hooks/useRedux.ts';
import TextInput from '../../components/TextInput';
import { userSelector } from '../../core/store/slices/users/slice.ts';
import { Button, Form } from 'react-bootstrap';
import { clearRequestStateAndType, gameSelector } from '../../core/store/slices/game/slice.ts';
import NavigationContentHeader from '../../components/NavigationContentHeader';
import { createSentence, fetchStorySentences } from '../../core/store/slices/game/actions.ts';

import './Story.css';
import { errorNotification, successNotification } from '../../utils/notifications.ts';

const Story = () => {
    const dispatch = useAppDispatch();
    const [story, setStory] = useState<SingleStory | undefined>();
    const { id } = useParams();
    const { user } = useAppSelector(userSelector);
    const { stories, actionType, actionState, responseError, storySentences, newSentence } = useAppSelector(gameSelector);
    const [sentence, setSentence] = useState<string>('');
    const sentences: StorySentence[] = useMemo<StorySentence[]>(() => (storySentences[id || ''] || []), [storySentences, id]);
    const lastSentence: StorySentence | undefined = useMemo<StorySentence | undefined>(() => sentences.slice(-1)[0], [sentences]);
    const lastTwoSentences: StorySentence[] = useMemo<StorySentence[]>(() => sentences.slice(-2), [sentences]);
    const sentenceCount: number = sentences.length || 0;
    const storySentenceLimit: number = story?.sentenceLimit || 0;

    const canSubmit = useCallback((): boolean => {
        return (user && story && story.id && story.status === 'open' && sentenceCount <= storySentenceLimit) == true;
    }, [user, story, sentenceCount, storySentenceLimit]);

    const submitSentence = useCallback((content: string) => {
        if (content.length === 0 || !canSubmit()) return;

        const storySentence: StorySentence = { username: user!.username, content, storyId: story!.id! };
        dispatch(createSentence(storySentence));
    }, [dispatch, story, user, canSubmit]);

    const submit = (event: any) => {
        event.preventDefault();
        submitSentence(sentence);
    };

    useEffect(() => {
        const story = stories?.find(story => story.id === id);
        setStory(story);
    }, [id, stories]);

    useEffect(() => {
        if (!id) return;
        dispatch(fetchStorySentences(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (actionType !== 'CreateStorySentence') return;

        if (actionState === 'success' && newSentence) {
            Store.addNotification({
                ...successNotification,
                message: 'Story sentence created successfully'
            });
        }

        if (actionState === 'error') {
            Store.addNotification({
                ...errorNotification,
                message: 'Failed to create story sentence'
            });
        }

        dispatch(clearRequestStateAndType());
    }, [actionType, actionState, responseError, newSentence]);

    return story && story.id && (
        <div className="story-screen">
            <NavigationContentHeader title={`Story: ${story.title}`} more={
                <div className="sentence-count">
                    <div><b>Count: </b>{sentenceCount} / {story.sentenceLimit}</div>
                </div>
            }/>
            <div className="sentence-row">
                {sentenceCount === 0 && <p className="text-center">No sentences.</p>}

                <div className="sentence-roll">
                    {lastTwoSentences.map((sentence: StorySentence, i: number) => {
                        return (
                            <Sentence
                                key={i}
                                storyId={sentence.storyId}
                                content={sentence.content}
                                username={sentence.username}
                                self={user?.username === sentence.username}
                            />
                        );
                    })}
                </div>

                {(sentenceCount < storySentenceLimit && story.status === 'open') &&
                    <Form className="sentence-form">
                        <TextInput
                            value={sentence}
                            onChange={setSentence}
                            onSubmit={submitSentence}
                            clearAfterSubmit={true}
                            id="sentence"
                            label="Sentence"
                            disabled={lastSentence?.username === user?.username}
                        />
                        <Button onClick={submit} type="submit" variant="primary"
                                disabled={lastSentence?.username === user?.username}>Submit</Button>
                    </Form>
                }
            </div>
        </div>
    );
};

export { Story };
