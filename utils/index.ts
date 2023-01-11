import { NextApiResponse, NextApiRequest } from "next";
import nodemailer from "nodemailer";
import { ValidationError } from "yup";
import { validate as uuidValidate, version as uuidVersion } from "uuid";
export const googleAuthUri = "https://accounts.google.com/o/oauth2/v2/auth";
export const redirectURI = "/auth/google/callback";
const googleClientId = process.env.GOOGLE_CLIENT_ID!;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET!;

export const handleError = (res: NextApiResponse, error: any) => {
  if (error instanceof ValidationError) {
    return res.status(400).json(formatError(error.errors[0], error.errors));
  } else if (error instanceof Error) {
    return res.status(500).json(formatError(error.message));
  } else {
    return res.status(500).json(formatError(error));
  }
};

export const formatError = (
  message: string = "An error occurred",
  payload?: any
) => {
  return { error: { message, payload } };
};

export const getServerUrl = (req: NextApiRequest) => {
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  return `${protocol}://${req.headers["host"]}`;
};

export const generateGoogleAuthURL = (serverUri: string) => {
  const options = {
    redirect_uri: `${serverUri}${redirectURI}`,
    client_id: googleClientId,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(","),
  };

  return `${googleAuthUri}?${new URLSearchParams(options).toString()}`;
};

export const getToken = async (code: string, serverUri: string) => {
  const url = "https://oauth2.googleapis.com/token";
  const query = {
    code,
    client_id: googleClientId,
    client_secret: googleSecret,
    redirect_uri: `${serverUri}${redirectURI}`,
    grant_type: "authorization_code",
  };
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(query),
  });
  if (!response.ok) {
    throw new Error("Request not succesfull");
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: string;
    refresh_token: string;
    scope: string;
    id_token: string;
  };
  return data;
};

export const getGoogleUser = async (accessToken: string, idToken: string) => {
  const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Request not succesful");
  }
  const data = (await response.json()) as {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
  };
  return data;
};

const PAYSTACK_URI = "https://api.paystack.co";

export const verifyPayment = async (reference: string) => {
  const response = await fetch(
    `${PAYSTACK_URI}/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Could not get external data");
  }
  const data = (await response.json()) as {
    data: { amount: number; status: "success" | "pending"; paidAt: string };
  };
  return data;
};

export function uuidValidateV4(uuid: string) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

export const transporter = nodemailer.createTransport(
  {
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    }
  },
  {
    from: "noreply@surveymailer.com",
  }
);

export const generateEmailHtml = (
  req: NextApiRequest,
  uuid: string,
  choices: Array<{ action: string; code: number }>,
  body: string
) => {
  return `
<html>
    <body>
    <div style="text-align: center;">
        <h3>I' d like your input!</h3>
        <p>Please answer the following questions: </p>
        <p>${body}</p>
        <div>
            ${choices.map((choice) => {
              return `<a href=${getServerUrl(req)}/api/surveys/callback/${uuid}/${
                choice.code
              }>${choice.action}</a>`;
            }).join('\n')}
        </div>
    </div>
    </body>
</html>
    `;
};
