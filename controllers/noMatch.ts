import { NextApiRequest, NextApiResponse } from "next";
const noMatch = (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(405).send({
    error: {
      message: "Method not allowed",
    },
  });
};

export default noMatch;
