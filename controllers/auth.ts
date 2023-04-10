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

const googleCallbackSchema = yup.object({
  code: yup.string().required("Code property must be included"),
});

const googleAuthSchema = yup.object({
  access_token: yup.string().required("Access token parameter is required"),
  id_token: yup.string().required("Id Token parameter is required"),
});

export const register = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await registerSchema.validate(req.body);

    if (User.isTestUser({ email: body.email, password: body.password })) {
      const user = await User.createTestUser();
      const token = user.generateToken();
      return res.json({ user, token });
    }

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
    // Check if the user is a test user and skip all the other checks
    if (User.isTestUser({ email, password })) {
      const user = await User.createTestUser();
      const token = user.generateToken();
      return res.json({ user, token });
    }
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
    const { access_token, id_token } = await googleAuthSchema.validate(
      req.body
    );
    const { name, email, id, picture, ...data } = await getGoogleUser(
      access_token,
      id_token
    );
    let user = await User.findOne({ email, provider: "google" });
    if (!user) {
      user = new User({
        name,
        email,
        googleId: id,
        provider: "google",
        imageUrl: picture,
      });
      await user.save();
    }

    const token = user.generateToken();
    res.status(201).json({ user, token });
  } catch (error) {
    return handleError(res, error);
  }
};

export const googleCallback = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const serverUri = getServerUrl(req);
    const { code } = await googleCallbackSchema.validate(req.query);
    const { access_token, id_token } = await getToken(code, serverUri);
    const query = new URLSearchParams({ access_token, id_token }).toString();
    res.status(307).redirect(`/auth/google/callback?${query}`);
  } catch (error) {
    return handleError(res, error);
  }
};
