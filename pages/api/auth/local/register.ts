import { NextApiRequest, NextApiResponse } from "next";
import { handleError, formatError } from "../../../../utils";
import User from "../../../../models/User";
import * as yup from 'yup';
import dbConnect from "../../../../utils/connectDb";

const registerSchema = yup.object({
    name: yup.string().required('Please enter your name'),
    password: yup.string().min(5, 'Your password should be at least five characters').required('Please enter your password'),
    email: yup.string().email('Please enter a valid email').required('Please enter your email')
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect()
    switch(req.method) {
        case 'POST': {
            try {
                const body = await registerSchema.validate(req.body);
                const user = await User.findOne({email: body.email, provider: 'local'});
                if(user) {
                    return res.status(400).json(formatError('A user with the email already exists'))
                }

                const newUser = new User({...req.body});
                await newUser.save();
                const token = newUser.generateToken();
                return res.status(201).json({user: newUser, token});
                
            } catch (error) {
                return handleError(res, error);
            }
        }
        default:
            res.status(405).send({error: {
                message: 'Method not allowed'
            }})
        
    }
}

export default handler