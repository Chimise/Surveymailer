import { NextApiRequest, NextApiResponse } from "next";
import {
  handleError,
  formatError,
  getServerUrl,
  getToken,
  getGoogleUser,
} from "../utils";
import User from "../models/User";
import * as yup from "yup";

const registerSchema = yup.object({
  name: yup.string().required("Please enter your name"),
  password: yup
    .string()
    .min(5, "Your password should be at least five characters")
    .required("Please enter your password"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Please enter your email"),
});

const loginSchema = yup.object({
  password: yup
    .string()
    .min(5, "Your password should be at least five characters")
    .required("Please enter your password"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Please enter your email"),
});

const authSchema = yup.object({
  code: yup.string().required("Code property must be included"),
});

export const register = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await registerSchema.validate(req.body);
    const user = await User.findOne({ email: body.email, provider: "local" });
    if (user) {
      return res
        .status(400)
        .json(formatError("A user with the email already exists"));
    }

    const newUser = new User({ ...req.body });
    await newUser.save();
    const token = newUser.generateToken();
    return res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.log(error);
    return handleError(res, error);
  }
};

export const login = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, password } = await loginSchema.validate(req.body);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json(formatError("Invalid credentials"));
    }
    if (user.provider === "google") {
      return res.status(400).json(formatError("Please login using Google"));
    }
    const isMatch = await user.verifyPassword(password);
    if (!isMatch) {
      return res.status(400).json(formatError("Invalid credentials"));
    }

    const token = user.generateToken();
    return res.json({ user, token });
  } catch (error) {
    return handleError(res, error);
  }
};

export const googleAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const serverUri = getServerUrl(req);
    const { code } = await authSchema.validate(req.body);
    const { access_token, id_token } = await getToken(code, serverUri);
    const { name, email, sub } = await getGoogleUser(access_token, id_token);
    const user = new User({ name, email, googleId: sub, provider: "google" });
    await user.save();
    const token = user.generateToken();
    res.status(201).json({ user, token });
  } catch (error) {
    return handleError(res, error);
  }
};
