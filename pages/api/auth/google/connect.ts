import { NextApiRequest, NextApiResponse } from "next";
import { formatError, getServerUrl, generateGoogleAuthURL } from "../../../../utils";
import noMatch from "../../../../controllers/noMatch";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const serverUri = getServerUrl(req);
    switch (req.method) {
        case 'GET':
            return res.status(307).redirect(generateGoogleAuthURL(serverUri));
        default:
            return noMatch(req, res);
    }
}

export default handler;