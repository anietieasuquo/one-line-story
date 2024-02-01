import { useEffect, useState } from 'react'
import { Story } from '../../../shared/core';
import { useAppDispatch, useAppSelector } from '../../core/hooks/useRedux.ts';
import { clearRequestStateAndType, gameSelector } from '../../core/store/slices/game/slice.ts';
import SingleStory from '../../components/Story';
import { closeStory, fetchStories } from '../../core/store/slices/game/actions.ts';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import NavigationContentHeader from '../../components/NavigationContentHeader';
import { Store } from 'react-notifications-component';
import { errorNotification, successNotification } from '../../utils/notifications.ts';
import './Stories.css'
import { useSearchParams } from 'react-router-dom';

const Stories = () => {
    const { stories, actionState, actionType, responseError } = useAppSelector(gameSelector);
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState<string>('');
    const [filteredStories, setFilteredStories] = useState<Story[]>(stories || []);
    const [queryParameters] = useSearchParams();

    const handleClose = (storyId: string) => {
        dispatch(closeStory(storyId));
    }

    useEffect(() => {
        if (!stories) {
            dispatch(fetchStories());
        }
    }, [stories]);

    useEffect(() => {
        switch (queryParameters.get('filter')) {
            case 'open':
                setTitle('Open Stories');
                setFilteredStories(stories?.filter(story => story.status === 'open') || []);
                break;
            case 'completed':
                setTitle('Completed Stories');
                setFilteredStories(stories?.filter(story => story.status === 'completed') || []);
                break;
            default:
                setTitle('All Stories');
                setFilteredStories(stories || []);
                break;
        }
    }, [queryParameters, stories]);

    useEffect(() => {
        return () => {
            if (actionType !== 'CloseStory') return;

            if (actionState === 'success') {
                Store.addNotification({
                    ...successNotification,
                    message: 'Story closed'
                });
            }

            if (responseError) {
                Store.addNotification({
                    ...errorNotification,
                    message: 'Failed to close story'
                });
            }

            dispatch(clearRequestStateAndType());
        };
    }, [actionType, actionState, responseError, dispatch]);

    return filteredStories && (
        <div className="stories">
            <NavigationContentHeader title={title} more={
                <div className="stories-buttons">
                    <div className="stories-filter">
                        <DropdownButton id="filter" title="Filter By Status" variant="dark">
                            <Dropdown.Item href="?filter=all">All Stories</Dropdown.Item>
                            <Dropdown.Item href="?filter=open">Open Stories</Dropdown.Item>
                            <Dropdown.Item href="?filter=completed">Completed Stories</Dropdown.Item>
                        </DropdownButton>
                    </div>
                    <LinkContainer to="/stories/create">
                        <Button variant="primary">Create Story</Button>
                    </LinkContainer>
                </div>
            }/>
            <div className="stories-roll">
                {filteredStories.map(({
                      id,
                      title,
                      topic,
                      sentenceLimit,
                      creator,
                      dateCreated,
                      status
                  }: Story, i: number) => {
                    return (
                        <SingleStory
                            key={i}
                            id={id}
                            title={title}
                            topic={topic}
                            sentenceLimit={sentenceLimit}
                            creator={creator}
                            dateCreated={dateCreated}
                            status={status}
                            handle={handleClose}
                        />
                    );
                })}
            </div>
            {filteredStories.length === 0 && <p>No stories yet. Be the first to create one.</p>}
        </div>
    );
};

export { Stories };
