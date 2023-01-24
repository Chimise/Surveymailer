import rootApi from "../api";
import { User } from "../../types";

const extendedAuthApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        verifyPayment: builder.mutation<User, string>({
            query: (reference) => ({
                url: 'verify',
                body: {reference},
                method: 'POST'
            })
        })
    })
})

export const {useVerifyPaymentMutation} = extendedAuthApi;
export const {verifyPayment} = extendedAuthApi.endpoints