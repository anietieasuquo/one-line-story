import './NavigationContentHeader.css';
import React, { useEffect } from 'react';
import { dispatchLater, useAppDispatch, useAppSelector } from '../../core/hooks/useRedux.ts';
import { clearRequestStateAndType, gameSelector } from '../../core/store/slices/game/slice.ts';
import { Placeholder } from 'react-bootstrap';
import { Store } from 'react-notifications-component';
import { errorNotification } from '../../utils/notifications.ts';

const NavigationContentHeader = ({ title, more }: { title: string; more?: React.JSX.Element; }) => {
    const dispatch = useAppDispatch();
    const { actionState, responseError } = useAppSelector(gameSelector);

    useEffect(() => {
        if (actionState === 'error' && responseError) {
            console.error(responseError);
            Store.addNotification({
                ...errorNotification,
                message: responseError
            });

            dispatchLater(() => dispatch(clearRequestStateAndType()));
        }
    }, [actionState, responseError, dispatch]);

    return (
        <>
            <div className="navigation-content-header">
                <div className="title">
                    <h2>{title}</h2>
                </div>
                {more && <div className="more">{more}</div>}
            </div>
            <div className="navigation-loader">
                {actionState === 'loading' &&
                    <Placeholder as="p" animation="glow" size="xs">
                        <Placeholder xs={12} bg="success" size="xs"/>
                    </Placeholder>
                }
            </div>
        </>
    );
}

export { NavigationContentHeader };
