import { NextApiResponse, NextApiRequest } from "next";
import nodemailer from "nodemailer";
import { ValidationError } from "yup";
import { validate as uuidValidate, version as uuidVersion } from "uuid";
export const googleAuthUri = "https://accounts.google.com/o/oauth2/v2/auth";
export const redirectURI = "/api/auth/google/callback";
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
    scope: "openid email profile",
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
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(query),
  });
  if (!response.ok) {
    const error = await response.json();
    console.log(error);
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

export const paginate = (total: number, currentPage: number, limit: number) => {
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage,
    skip: (currentPage - 1) * limit,
    hasNext: totalPages > 1 && totalPages > currentPage,
    hasPrevious: totalPages > 1 && currentPage > 1,
    nextPage: totalPages > currentPage ? currentPage + 1 : currentPage,
    previousPage: currentPage > 1 ? currentPage - 1 : currentPage,
    totalPages,
    total,
  };
};

export const getGoogleUser = async (accessToken: string, idToken: string) => {
  const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error("Request not succesful");
  }
  const data = (await response.json()) as {
    id: string;
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
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
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
  <!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>Email Survey</title>
      <style>
  @media only screen and (max-width: 620px) {
    table.body h1 {
      font-size: 28px !important;
      margin-bottom: 10px !important;
    }
  
    table.body p,
  table.body ul,
  table.body ol,
  table.body td,
  table.body span,
  table.body a {
      font-size: 16px !important;
    }
  
    table.body .wrapper,
  table.body .article {
      padding: 10px !important;
    }
  
    table.body .content {
      padding: 0 !important;
    }
  
    table.body .container {
      padding: 0 !important;
      width: 100% !important;
    }
  
    table.body .main {
      border-left-width: 0 !important;
      border-radius: 0 !important;
      border-right-width: 0 !important;
    }
  
    table.body .btn table {
      width: 100% !important;
    }
  
    table.body .btn a {
      width: 100% !important;
    }
  
    table.body .img-responsive {
      height: auto !important;
      max-width: 100% !important;
      width: auto !important;
    }
  }
  @media all {
    .ExternalClass {
      width: 100%;
    }
  
    .ExternalClass,
  .ExternalClass p,
  .ExternalClass span,
  .ExternalClass font,
  .ExternalClass td,
  .ExternalClass div {
      line-height: 100%;
    }
  
    .apple-link a {
      color: inherit !important;
      font-family: inherit !important;
      font-size: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
      text-decoration: none !important;
    }
  
    #MessageViewBody a {
      color: inherit;
      text-decoration: none;
      font-size: inherit;
      font-family: inherit;
      font-weight: inherit;
      line-height: inherit;
    }
  
    .btn-primary table td:hover {
      background-color: #34495e !important;
    }
  
    .btn-primary a:hover {
      background-color: #34495e !important;
      border-color: #34495e !important;
    }
  }
  </style>
    </head>
    <body style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
      <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Please help fill this survey.</span>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; width: 100%;" width="100%" bgcolor="#f6f6f6">
        <tr>
          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
          <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;" width="580" valign="top">
            <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">
  
              <!-- START CENTERED WHITE CONTAINER -->
              <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">
  
                <!-- START MAIN CONTENT AREA -->
                <tr>
                  <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                      <tr>
                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                          <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Hi there,</p>
                          <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">${body}</p>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%;" width="100%">
                            <tbody>
                              <tr>
                                <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                                    <tbody>
                                    ${choices
                                      .map(
                                        (
                                          choice
                                        ) => `<tr style="padding: 5px 0px; display: block;">
                                    <td style="font-family: sans-serif; font-size: 14px; display: block; border-radius: 5px; text-align: center; background-color: #3498db; width: 100%;" width="100%" valign="top" align="center" bgcolor="#3498db">
                                      <a target="_blank" style="border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; background-color: #3498db; border-color: #3498db; color: #ffffff;" href="${getServerUrl(
                                        req
                                      )}/api/surveys/callback/${uuid}/${
                                          choice.code
                                        }">${choice.action}</a>
                                    </td>
                                  </tr>`
                                      )
                                      .join("\n")}
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
  
              <!-- END MAIN CONTENT AREA -->
              </table>
              <!-- END CENTERED WHITE CONTAINER -->
  
              <!-- START FOOTER -->
              <div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                  <tr>
                    <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #999999; font-size: 12px; text-align: center;" valign="top" align="center">
                      Powered by <a href="${getServerUrl(
                        req
                      )}" style="color: #999999; font-size: 12px; text-align: center; text-decoration: none;">SurveyMailer</a>.
                    </td>
                  </tr>
                </table>
              </div>
              <!-- END FOOTER -->
  
            </div>
          </td>
          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
