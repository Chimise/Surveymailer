import { NextApiRequest, NextApiResponse } from "next";
import connectDb from '../../../../../utils/connectDb'
import { handleError } from "../../../../../utils";
import { surveyCompleted } from "../../../../../controllers/survey";
import noMatch from "../../../../../controllers/noMatch";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await connectDb();
        switch(req.method) {
            case 'GET':
                return surveyCompleted(req, res);
            default:
                return noMatch(req, res);
        }
    } catch (error) {
        handleError(res, error);
    }
}

export default handler;