import api from '../api';
import type { Survey, Paginate } from '../../types';

type SurveyResponse = {
    surveys: Survey[];
    paginate: Paginate;
}

const extendedApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSurveys: builder.query<SurveyResponse, number | void>({
            query: (page = 1) => `surveys?_page=${page}`
        }),
        getSurvey: builder.query<Survey, string>({
            query: (id) => `surveys/${id}`
        })
    })
})

export const {useGetSurveysQuery, useGetSurveyQuery} = extendedApi;