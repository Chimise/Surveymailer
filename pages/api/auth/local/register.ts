import { NextApiRequest, NextApiResponse } from "next";
import {register} from '../../../../controllers/auth';
import noMatch from "../../../../controllers/noMatch";
import dbConnect from "../../../../utils/connectDb";
import { handleError } from "../../../../utils";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await dbConnect();
        switch(req.method) {
            case 'POST':
                return register(req, res);
            default:
                return noMatch(req, res);
        }
    } catch (error) {
        console.log(error);
        handleError(res, 'An error occured, please try again')
    }
    
}

export default handler