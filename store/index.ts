import { configureStore } from "@reduxjs/toolkit";
import {setupListeners} from '@reduxjs/toolkit/query/react'
import { useDispatch } from "react-redux";
import authReducer from './auth';
import rootApi from './api';

const store = configureStore({
    reducer: {
        auth: authReducer,
        [rootApi.reducerPath]: rootApi.reducer
    },
    middleware: (getMiddleware) => getMiddleware().concat(rootApi.middleware)
})

setupListeners(store.dispatch)


export type RootState = ReturnType<typeof store.getState>;

export type Dispatch = typeof store.dispatch;

export const useAppDispatch: () => Dispatch = useDispatch;

export default store;