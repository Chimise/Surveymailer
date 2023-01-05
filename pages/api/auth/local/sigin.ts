import { NextApiRequest, NextApiResponse } from "next";
import { handleError, formatError } from "../../../../utils";
import User from "../../../../models/User";
import * as yup from 'yup';
import dbConnect from "../../../../utils/connectDb";

const loginSchema = yup.object({
    password: yup.string().min(5, 'Your password should be at least five characters').required('Please enter your password'),
    email: yup.string().email('Please enter a valid email').required('Please enter your email')
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    switch(req.method) {
        case 'POST':
            try {
                const {email, password} = await loginSchema.validate(req.body);
                const user = await User.findOne({email});
                if(!user) {
                    return res.status(400).json(formatError('Invalid credentials'));
                }
                if(user.provider === 'google') {
                    return res.status(400).json(formatError('Please login using Google'));
                }
                const isMatch = await user.verifyPassword(password);
                if(!isMatch) {
                    return res.status(400).json(formatError('Invalid credentials'));
                }
        
                const token = user.generateToken();
                return res.json({user, token});
        
            } catch (error) {
                return handleError(res, error);
            }
        default:
            res.status(405).json({error: {message: ''}})
    }
}

export default handler;
