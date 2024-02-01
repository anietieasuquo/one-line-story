import { useEffect, useState } from 'react'
import TextInput from '../../components/TextInput';
import { useAppDispatch, useAppSelector } from '../../core/hooks/useRedux.ts';
import { signIn } from '../../core/store/slices/users/actions.ts';
import { User } from '../../../shared/core';
import { clearRequestStateAndType, userSelector } from '../../core/store/slices/users/slice.ts';
import { Button, Form } from 'react-bootstrap';
import NavigationContentHeader from '../../components/NavigationContentHeader';
import { errorNotification, successNotification } from '../../utils/notifications.ts';
import { Store } from 'react-notifications-component';
import './Onboarding.css';

const Onboarding = () => {
    const [username, setUsername] = useState<string>('');
    const dispatch = useAppDispatch();
    const { actionType, actionState, responseError } = useAppSelector(userSelector);
    const checkAndSubmit = (content: string) => {
        if (content.length > 0) {
            const user: User = { username: content };
            dispatch(signIn(user));
        }
    };

    const submit = (event: any) => {
        event.preventDefault();
        checkAndSubmit(username);
        setUsername('');
    };

    useEffect(() => {
        if (actionType !== 'SignInUser') return;

        if (actionState === 'success') {
            Store.addNotification({
                ...successNotification,
                message: 'Signed in successfully'
            });
        }

        if (actionState === 'error') {
            Store.addNotification({
                ...errorNotification,
                message: 'Failed to sign in'
            });
        }

        dispatch(clearRequestStateAndType());
    }, [actionType, actionState, responseError]);

    return (
        <div className="onboarding">
            <NavigationContentHeader title="Welcome"/>
            <Form className="onboarding-form">
                <TextInput value={username} onChange={setUsername} onSubmit={checkAndSubmit} clearAfterSubmit={true}
                           id="username" label="Username"/>
                <Button onClick={submit} type="submit" variant="primary">Submit</Button>
            </Form>
        </div>
    );
};

export { Onboarding };
