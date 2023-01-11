import { NextApiResponse } from "next";
import noMatch from "../../controllers/noMatch";
import { validatePayment } from "../../controllers/payment";
import authMiddleware, {ExtendedApiRequest} from "../../middlewares/auth";
import { handleError} from "../../utils";
import dbConnect from "../../utils/connectDb";

async function handler(req: ExtendedApiRequest, res: NextApiResponse) {
    try {
        await dbConnect()
        switch(req.method) {
            case 'POST':
                return validatePayment(req, res);
            default:
                return noMatch(req, res);
        }
    } catch (error) {
        handleError(res, 'An error occured, please try again later');
    }
}

export default authMiddleware(handler);