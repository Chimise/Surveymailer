import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type { RootState } from '.';

const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders(headers, {getState}){
        const state = getState() as RootState;
        if(state.auth.token) {
            headers.set('Authorization', `Bearer ${state.auth.token}`);
        }
        return headers;
    }

})

const rootApi = createApi({
    reducerPath: 'root',
    tagTypes: ['Survey'],
    baseQuery: baseQuery,
    endpoints: () => ({})
})

export default rootApi;