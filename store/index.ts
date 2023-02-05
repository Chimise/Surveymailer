import { configureStore, createAsyncThunk } from "@reduxjs/toolkit";
import {setupListeners} from '@reduxjs/toolkit/query/react'
import { useDispatch } from "react-redux";
import authReducer from './auth';
import rootApi from './api';
import surveyReducer from './survey_form';
import uiReducer from './ui';
import { RequestError } from "../utils/client";

const store = configureStore({
    reducer: {
        auth: authReducer,
        [rootApi.reducerPath]: rootApi.reducer,
        survey: surveyReducer,
        ui: uiReducer
    },
    middleware: (getMiddleware) => getMiddleware().concat(rootApi.middleware)
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>;

export type Dispatch = typeof store.dispatch;

export const useAppDispatch: () => Dispatch = useDispatch;

export default store;