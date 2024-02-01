import { iNotification } from 'react-notifications-component';

const notification: iNotification = {
    title: 'Success',
    message: 'Sentence created successfully',
    type: 'success',
    insert: 'top',
    container: 'top-left',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
        duration: 3000,
        onScreen: true
    }
};

const successNotification: iNotification = {
    ...notification,
    type: 'success',
    title: 'Success'
};

const errorNotification: iNotification = {
    ...notification,
    type: 'danger',
    title: 'Error'
};

export { successNotification, errorNotification };
