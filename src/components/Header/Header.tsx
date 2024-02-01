import { Button, Col, Row } from 'react-bootstrap';
import './Header.css';
import { useAppDispatch, useAppSelector } from '../../core/hooks/useRedux.ts';
import { signOut } from '../../core/store/slices/users/actions.ts';
import { userSelector } from '../../core/store/slices/users/slice.ts';

const Header = () => {
    const { user } = useAppSelector(userSelector);
    const dispatch = useAppDispatch();
    const signOutUser = () => {
        dispatch(signOut());
    };

    return (
        <div className="header">
            <Row>
                <Col xs={9}>
                    <h2>One Line Story</h2>
                </Col>
                <Col>
                    {user?.username && <Row>
                        <Col><h6>User: <b>{user.username}</b></h6></Col>
                        <Col xs={5}><Button onClick={signOutUser} variant="secondary" size="sm">Sign Out</Button></Col>
                    </Row>}
                </Col>
            </Row>
        </div>
    );
}

export { Header };
