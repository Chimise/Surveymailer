import { NextApiRequest, NextApiResponse } from "next";
import { formatError, handleError} from "../../../../utils";
import { googleAuth } from "../../../../controllers/auth";
import noMatch from "../../../../controllers/noMatch";
import dbConnect from "../../../../utils/connectDb";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await dbConnect();
        switch (req.method) {
            case 'POST':
                return googleAuth(req, res);
            default:
                return noMatch(req, res);
        }
    } catch (error) {
        handleError(res, 'An error occured, please try again')
    }
}

export default handler;