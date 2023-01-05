import { NextApiResponse } from "next"
import {ValidationError} from 'yup';
export const handleError = (res: NextApiResponse, error: any) => {
    if(error instanceof ValidationError) {
        return res.status(400).json(formatError(error.errors[0], error.errors));
    }else if (error instanceof Error) {
        return res.status(500).json(formatError('An error occurred'));
    }else {
        return res.status(500).json(formatError((error as Error).message));
    }

}

export const formatError = (message: string = 'An error occurred', payload?: any) => {
    return {error: {message, payload}};
}