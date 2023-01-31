import api from '../api';
import type { Survey, Paginate, Recipient } from '../../types';

type SurveyResponse = {
    surveys: Survey[];
    paginate: Paginate;
}

type SurveyRecipient = {
    recipients: Recipient[],
    paginate: Paginate
}

const extendedApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSurveys: builder.query<SurveyResponse, {page?: number; sort: string}>({
            query: ({page = 1, sort}) => {
                const query: Record<string, any> = {_page: page};
                if(sort) {
                    query['_sort'] = sort;
                }
                return `surveys?${new URLSearchParams(query).toString()}`;

            },
            providesTags(result, error, arg) {
                if(!result || error) {
                    return [];
                }
                return result.surveys.map(survey => ({type: 'Survey', id: survey._id}));
            }
        }),
        getSurvey: builder.query<Survey, string>({
            query: (id) => `surveys/${id}`,
            providesTags(result, error, arg) {
                if(!result || error) {
                    return [];
                }
                return [{type: 'Survey', id: arg}];
            },
        }),
        getRecipients: builder.query<SurveyRecipient, {id: string; page?: number}>({
            query: ({id, page = 1}) => `surveys/${encodeURIComponent(id)}/recipients?_page=${page}`
        })
    })
})

export const {useGetSurveysQuery, useGetSurveyQuery, useGetRecipientsQuery} = extendedApi;