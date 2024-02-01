import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import './Navigation.css';
import { useAppDispatch, useAppSelector } from '../../core/hooks/useRedux.ts';
import { clearRequestStateAndType, userSelector } from '../../core/store/slices/users/slice.ts';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Navigation = () => {
    const dispatch = useAppDispatch();
    const { user, actionState, actionType } = useAppSelector(userSelector);
    const navigate = useNavigate();

    useEffect(() => {
        if (actionType !== 'SignOutUser') return;
        if (actionState === 'success') {
            dispatch(clearRequestStateAndType());
            navigate('/');
        }
    }, [actionState, actionType]);

    return (
        <div className="navigation">
            <Nav defaultActiveKey="/" className="flex-column" variant="pills">
                <LinkContainer to="/">
                    <Nav.Link>{user && user.username ? 'Home' : 'Welcome'}</Nav.Link>
                </LinkContainer>
                {user?.username && (
                    <>
                        <LinkContainer to="/stories/create">
                            <Nav.Link>Create Story</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/stories">
                            <Nav.Link>Stories</Nav.Link>
                        </LinkContainer>
                    </>
                )}
            </Nav>
        </div>
    );
}

export { Navigation };
