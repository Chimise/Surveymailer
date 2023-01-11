import { NextApiRequest, NextApiResponse } from "next";
import connectDb from '../../../../utils/connectDb'
import { handleError } from "../../../../utils";
import { findOne } from "../../../../controllers/survey";
import noMatch from "../../../../controllers/noMatch";
import authMiddleware, {ExtendedApiRequest} from "../../../../middlewares/auth";


const handler = async (req: ExtendedApiRequest, res: NextApiResponse) => {
    try {
        await connectDb();
        switch(req.method) {
            case 'GET':
                return findOne(req, res);
            default:
                return noMatch(req, res);
        }
    } catch (error) {
        handleError(res, error);
    }
}

export default authMiddleware(handler);