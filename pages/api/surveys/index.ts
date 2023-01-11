import { NextApiRequest, NextApiResponse } from "next";
import connectDb from '../../../utils/connectDb'
import { handleError } from "../../../utils";
import { create, find } from "../../../controllers/survey";
import noMatch from "../../../controllers/noMatch";
import authMiddleware, {ExtendedApiRequest} from "../../../middlewares/auth";


const handler = async (req: ExtendedApiRequest, res: NextApiResponse) => {
    try {
        await connectDb();
        switch(req.method) {
            case 'POST':
                return create(req, res);
            case 'GET':
                return find(req, res);
            default:
                return noMatch(req, res);
        }
    } catch (error) {
        handleError(res, error);
    }
}

export default authMiddleware(handler);