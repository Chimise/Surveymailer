import { NextApiRequest, NextApiResponse, NextApiHandler } from "next"
import jwt from 'jsonwebtoken';
import User, {User as UserI} from "../models/User";
import {HydratedDocument} from 'mongoose';
import {formatError} from '../utils';
import dbConnect from "../utils/connectDb";

export interface ExtendedApiRequest extends NextApiRequest {
    user: HydratedDocument<UserI>
}

type Handler<T = any> = (req: ExtendedApiRequest, res: NextApiResponse<T>) => unknown | Promise<unknown>

const authMiddleware = (handler: Handler) => async (req: ExtendedApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const token = req.headers['authorization'];
    if(!token) {
        return res.status(401).json(formatError('You are unauthorized to make this request'))
    }
    
    const {_id} = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET!) as {_id: string, googleId?: string};
    const user = await User.findById(_id);
    if(!user) {
        return res.status(401).json(formatError('You are unauthorized to make this request'));
    }
    req.user = user;
    return handler(req, res);
}

export default authMiddleware;