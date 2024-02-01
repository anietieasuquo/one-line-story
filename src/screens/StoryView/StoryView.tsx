import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom';
import { Story, StorySentence } from '../../../shared/core';
import Sentence from '../../components/Sentence';
import { useAppDispatch, useAppSelector } from '../../core/hooks/useRedux.ts';
import { userSelector } from '../../core/store/slices/users/slice.ts';
import { clearRequestStateAndType, gameSelector } from '../../core/store/slices/game/slice.ts';
import NavigationContentHeader from '../../components/NavigationContentHeader';

import './StoryView.css';

const StoryView = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(userSelector);
    const { storySentences, stories } = useAppSelector(gameSelector);
    const { id } = useParams();
    const sentences: StorySentence[] = useMemo<StorySentence[]>(() => (storySentences[id || ''] || []), [storySentences, id]);
    const story: Story | undefined = useMemo<Story | undefined>(() => stories?.find(story => story.id === id), [id, stories]);

    useEffect(() => {
        dispatch(clearRequestStateAndType());
    }, []);

    return story && story.id && (
        <div className="story-view">
            <NavigationContentHeader title={`Story: ${story.title}`} more={
                <div className="story-info-row">
                    <div className="story-info">
                        <div><b>Topic: </b>{story.topic}</div>
                        <div><b>Sentences: </b>{sentences.length} / {story.sentenceLimit}</div>
                        <div className="text-capitalize"><b>Status: </b>{story.status}</div>
                    </div>
                    <div className="story-info">
                        <div><b>Created By: </b>{story.creator}</div>
                        <div><b>Date Created: </b>{story.dateCreated}</div>
                    </div>
                </div>
            }/>
            <div className="sentence-row">
                <div className="sentence-roll">
                    {sentences.map((sentence: StorySentence, i: number) => {
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
            </div>
        </div>
    );
};

export { StoryView };
