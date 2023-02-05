import rootApi from "../api";
import { Survey, User } from "../../types";

type SurveyInput = Pick<Survey, 'body'|'shipper'|'subject'|'title'> & {
    choices: string[];
    recipients: string[];
}

const extendedSurveyApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        sendSurvey: builder.mutation<{survey: Survey, user: User}, SurveyInput>({
            query: (body) => ({
                url: 'surveys',
                body,
                method: 'POST'
            }),
            invalidatesTags: (result, error, args) => {
                if(!result || error) {
                    return [];
                }
                return ['Survey']
            }
        })
    })
})

export const {useSendSurveyMutation} = extendedSurveyApi;
export const {sendSurvey}  = extendedSurveyApi.endpoints;
