import { NextApiResponse } from "next";
import authMiddleware, {ExtendedApiRequest} from "../../../middlewares/auth";


const handler = (req: ExtendedApiRequest, res: NextApiResponse) => {
    return res.json(req.user);
}

export default authMiddleware(handler);