import { NextApiRequest, NextApiResponse } from "next";
import { googleCallback } from "../../../../controllers/auth";
import noMatch from "../../../../controllers/noMatch";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            return googleCallback(req, res);
        default:
            return noMatch(req, res);
    }
}

export default handler;