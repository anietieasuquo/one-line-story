import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'react-notifications-component/dist/theme.css';
import './index.css';
import { startWebsocketConnection } from './websocket.ts';
import { persistor, store } from './core/store';
import { Provider } from 'react-redux';
import { ReactNotifications } from 'react-notifications-component';
import { WebSocketHandler } from './handlers/WebSocketHandler.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <ReactNotifications />
                    <WebSocketHandler/>
                    <App/>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </React.StrictMode>,
);
startWebsocketConnection();
