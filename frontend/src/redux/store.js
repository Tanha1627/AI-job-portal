import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSlice from "./jobSlice"
import companySlice from  "./companySlice"
import companySlice1 from "./companyJobSlice";
// import { authApi } from "@/features/authapi.js";
// import {jobApi} from "@/features/jobapi.js";
import{
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ["auth"],
}


const rootReducer = combineReducers({
    auth:authSlice,
    job:jobSlice,
    company:companySlice,
    companyJob: companySlice1,
    //  [authApi.reducerPath]: authApi.reducer, 
    // [jobApi.reducerPath]: jobApi.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }
        ),
});

export  default store;
// .concat(authApi.middleware,
//             jobApi.middleware