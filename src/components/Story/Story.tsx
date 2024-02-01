import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { HandlerProps, Story as SingleStory } from '../../../shared/core';
import { formatDate } from '../../core/utils.ts';
import { useAppSelector } from '../../core/hooks/useRedux.ts';
import { userSelector } from '../../core/store/slices/users/slice.ts';
import { gameSelector } from '../../core/store/slices/game/slice.ts';
import './Story.css';

const Story = ({
       id,
       title,
       topic,
       sentenceLimit,
       creator,
       dateCreated,
       status,
       handle
   }: Partial<SingleStory> & HandlerProps<string>) => {
    const { user } = useAppSelector(userSelector);
    const { storySentences } = useAppSelector(gameSelector);
    const sentenceCount = storySentences[id || '']?.length || 0;
    const storySentenceLimit = sentenceLimit || 0;
    const canPlay = (status === 'open' && sentenceCount < storySentenceLimit);

    const handleClose = () => {
        if (confirm('Are you sure you want to close this story?')) {
            handle(id || '');
        }
    };

    return (
        <div className="story">
            <div className="story-row">
                <div className="story-info">
                    <div><b>Title: </b>{title}</div>
                    <div><b>Topic: </b>{topic}</div>
                    <div><b>Sentences: </b>{sentenceCount} / {storySentenceLimit}</div>
                    <div><b>Created By: </b>{creator}</div>
                    <div><b>Date
                        Created: </b>{dateCreated ? formatDate(dateCreated) : 'N/A'}
                    </div>
                    <div className="text-capitalize"><b>Status: </b>{status}</div>
                </div>
                <div className="story-button">
                    <Link to={`/stories/${id}/join`} className={canPlay ? '' : 'disabled-link'}><Button
                        variant="primary" disabled={!canPlay}>Join</Button></Link>
                    <Link to={`/stories/${id}`} className={status === 'completed' ? '' : 'disabled-link'}><Button
                        variant="outline-primary" disabled={status !== 'completed'}>View</Button></Link>
                    {creator === user?.username && <Button variant="secondary" onClick={handleClose} disabled={status === 'completed'}>Close</Button>}
                </div>
            </div>
        </div>
    )
}

export { Story };
