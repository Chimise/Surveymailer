import { NextApiRequest, NextApiResponse } from "next";
import { getServerUrl, generateGoogleAuthURL} from "../../../../utils";
import noMatch from "../../../../controllers/noMatch";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const serverUri = getServerUrl(req);
    switch (req.method) {
        case 'GET':
            const url = generateGoogleAuthURL(serverUri);
            return res.status(307).redirect(url);
        default:
            return noMatch(req, res);
    }
}

export default handler;