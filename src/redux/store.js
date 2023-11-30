import { configureStore, combineReducers, } from "@reduxjs/toolkit";
import collapsedReducer from './slices/collapsedSlice'
import loadingReducer from './slices/loadingSlice'
import {
    persistStore, 
    persistReducer, 
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web


const persistConfig = {
    key: 'persist',
    storage,
    blacklist: ['loading'],
}

const reducers = combineReducers({
    collapsed: collapsedReducer,
    loading: loadingReducer,
});
const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },

        }),
})

let persistor = persistStore(store)


export { store, persistor };