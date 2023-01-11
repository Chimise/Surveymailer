import { NextApiRequest, NextApiResponse } from "next";
import { handleError} from "../../../../utils";
import dbConnect from "../../../../utils/connectDb";
import { login } from "../../../../controllers/auth";
import noMatch from "../../../../controllers/noMatch";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect();
    switch (req.method) {
      case "POST":
        return login(req, res);
      default:
        return noMatch(req, res);
    }
  } catch (error) {
    handleError(res,  'An error occurred, please try again later')
  }
};

export default handler;
