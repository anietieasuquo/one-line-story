import {
    AnyAction,
    combineReducers,
    configureStore,
    Reducer
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    persistReducer,
    persistStore
} from 'redux-persist';
import { gameReducer } from './slices/game/slice';
import { userReducer } from './slices/users/slice';
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    version: 1,
    storage
};

const reducers = combineReducers({
    game: gameReducer,
    users: userReducer
});

export type RootState = ReturnType<typeof reducers>;

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
    if (action.type === 'users/signOut/fulfilled' || action.type === 'users/signOut/rejected') {
        persistConfig.storage.removeItem('persist:root').then(() => {
            console.warn('Redux persist removed all records');
        });

        state = {} as RootState;
    }

    return reducers(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        }).concat(logger)
});

const persistor = persistStore(store);

export { store, persistor };
export type AppDispatch = typeof store.dispatch;
