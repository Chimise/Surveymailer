import api from "../api";
import type { Survey, Paginate, Recipient } from "../../types";
import pusher from "../../pusher/client";
import { RootState } from "..";
import recipients from "../../pages/api/surveys/[id]/recipients";

type SurveyResponse = {
  surveys: Survey[];
  paginate: Paginate;
};

type SurveyRecipient = {
  recipients: Recipient[];
  paginate: Paginate;
};




const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSurveys: builder.query<SurveyResponse, { page?: number; sort: string }>({
      query: ({ page = 1, sort }) => {
        const query: Record<string, any> = { _page: page };
        if (sort) {
          query["_sort"] = sort;
        }
        return `surveys?${new URLSearchParams(query).toString()}`;
      },
      providesTags(result, error, arg) {
        if (!result || error) {
          return [];
        }
        return result.surveys.map((survey) => ({
          type: "Survey",
          id: survey._id,
        }));
      },
      async onCacheEntryAdded(
        args,
        { getState, cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        const user = (getState() as RootState).auth.user;
        const surveyChannel = pusher.subscribe('survey');
        try {
          await cacheDataLoaded;
          
          surveyChannel.bind(
            "response",
            function (data: { user: string; recipient: Recipient }) {
              if (user && user._id === data.user) {
                updateCachedData((surveyData) => {
                  const survey = surveyData.surveys.find((survey) => {
                    return survey._id === data.recipient.survey;
                  });
                  if (survey) {
                    const choiceIndex = survey.choices.findIndex(
                      (choice) => choice.action === data.recipient.choice
                    );
                    if (choiceIndex !== -1) {
                      survey.choices[choiceIndex].responses += 1;
                    }
                  }
                });
              }
            }
          );
        } catch (error) {}
        await cacheEntryRemoved;
        surveyChannel.unsubscribe();
      },
    }),
    getSurvey: builder.query<Survey, string>({
      query: (id) => `surveys/${id}`,
      providesTags(result, error, arg) {
        if (!result || error) {
          return [];
        }
        return [{ type: "Survey", id: arg }];
      },
      async onCacheEntryAdded(
        args,
        { getState, cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        const user = (getState() as RootState).auth.user;
        const surveyChannel = pusher.subscribe('survey');
        try {
          await cacheDataLoaded;
          surveyChannel.bind(
            "response",
            function (data: { user: string; recipient: Recipient }) {
              if (user && user._id === data.user) {
                updateCachedData((surveyData) => {
                  const choiceIndex = surveyData.choices.findIndex(
                    (choice) => choice.action === data.recipient.choice
                  );
                  if (choiceIndex !== -1) {
                    surveyData.choices[choiceIndex].responses += 1;
                  }
                });
              }
            }
          );
        } catch (error) {}
        await cacheEntryRemoved;
        surveyChannel.unsubscribe();
      },
    }),
    getRecipients: builder.query<
      SurveyRecipient,
      { id: string; page?: number }
    >({
      query: ({ id, page = 1 }) =>
        `surveys/${encodeURIComponent(id)}/recipients?_page=${page}`,
      async onCacheEntryAdded(
        args,
        { getState, cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        const user = (getState() as RootState).auth.user;
        const surveyChannel = pusher.subscribe('survey');
        try {
          await cacheDataLoaded;
          surveyChannel.bind(
            "response",
            function (data: { user: string; recipient: Recipient }) {
              if (user && user._id === data.user) {
                updateCachedData((surveyData) => {
                  const index = surveyData.recipients.findIndex(
                    (recipient) => recipient._id === data.recipient._id
                  );
                  if (index !== -1) {
                    surveyData.recipients[index] = data.recipient;
                  }
                });
              }
            }
          );
        } catch (error) {}
        await cacheEntryRemoved;
        surveyChannel.unsubscribe();
      },
    }),
  }),
});

export const { useGetSurveysQuery, useGetSurveyQuery, useGetRecipientsQuery } =
  extendedApi;
