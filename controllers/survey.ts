import { NextApiResponse, NextApiRequest } from "next";
import * as yup from "yup";
import { v4 as uuidV4 } from "uuid";
import {
  formatError,
  handleError,
  uuidValidateV4,
  transporter,
  generateEmailHtml,
} from "../utils";
import { ExtendedApiRequest } from "../middlewares/auth";
import Survey, { Survey as SurveyI } from "../models/Survey";
import Recipient from "../models/Recipient";

const createSurveySchema = yup.object({
  title: yup.string().required("Please enter the title of the survey"),
  shipper: yup.string().required("Your organization name is required"),
  shipper_email: yup
    .string()
    .email("Please enter a your organization email address")
    .default("noreply@surveymailer.com"),
  body: yup.string().required("Please enter the body of your message"),
  choices: yup
    .array(yup.string().required("Please enter a valid choice"))
    .min(2, "Must be a minimum of two choices")
    .max(10, "Must be a maximum of two choices")
    .required("Field is required"),
  subject: yup.string().required("Please enter the subject of your email"),
  recipients: yup
    .array(
      yup
        .string()
        .required("Please enter a valid email")
        .email("Please enter a valid email")
    )
    .min(1, "Please enter at least one recipient")
    .required("You must add a recipient"),
});

export const find = async (req: ExtendedApiRequest, res: NextApiResponse) => {
  const surveys = await Survey.find({ user: req.user.id });
  res.json(surveys);
};

export const findOne = async (
  req: ExtendedApiRequest,
  res: NextApiResponse
) => {
  const id = req.query.id;
  const survey = await Survey.findOne({ user: req.user.id, _id: id });
  if (!survey) {
    return res.status(404).send(formatError("Survey not found"));
  }

  const recipients = await Recipient.find({ survey: survey._id });
  const surveyObject = survey.toObject();

  return res.json({ ...surveyObject, recipients });
};

export const surveyCompleted = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const uuid = req.query.uuid as string;
  const response = parseInt(req.query.response as string);
  if (!uuidValidateV4(uuid) || isNaN(response)) {
    return res.status(400).send(formatError("Invalid identifier"));
  }

  const recipient = await Recipient.findOne({ uuid });
  if (!recipient) {
    return res.status(400).send(formatError("Data not found"));
  }

  if (recipient.responded) {
    return res.redirect("/response");
  }

  const survey = await Survey.findOne({
    _id: recipient.survey,
    "choices.code": response,
  });
  if (!survey) {
    return res.status(400).send(formatError("Data not found"));
  }

  const choiceIndex = survey.choices.findIndex(
    (choice) => choice.code === response
  );
  survey.choices[choiceIndex].responses += 1;
  recipient.responded = true;
  recipient.choice = survey.choices[choiceIndex].action;
  await recipient.save();
  await survey.save();

  res.redirect("/response");
};

export const create = async (req: ExtendedApiRequest, res: NextApiResponse) => {
  try {
    const {
      recipients,
      title,
      shipper,
      shipper_email,
      body,
      choices,
      subject,
    } = await createSurveySchema.validate(req.body);

    const totalCost = recipients.length;

    if (req.user.credits < totalCost) {
      return res
        .status(400)
        .send(
          formatError("You do not have enough credit to perform the operation")
        );
    }

    const updatedChoices = choices.map((action, index) => {
      return {
        action,
        code: index,
      };
    });
    const updatedRecipients = recipients.map((recipient) => {
      const uuid = uuidV4();
      return {
        recipient,
        uuid,
      };
    });

    const userEmailPromises = updatedRecipients.map(({ recipient, uuid }) => {
      const options = {
        from: `"${shipper}" ${shipper_email}`,
        to: recipient,
        subject,
        text: body,
        html: generateEmailHtml(req, uuid, updatedChoices, body),
        replyTo: shipper_email,
      };

      return transporter.sendMail(options);
    });

    await Promise.all(userEmailPromises);

    const survey = new Survey({
      shipper,
      shipper_email,
      choices: updatedChoices,
      title,
      body,
      subject,
      user: req.user._id,
    });
    await survey.save();

    await Recipient.insertMany(
      updatedRecipients.map((recipient) => {
        return {
          uuid: recipient.uuid,
          email: recipient.recipient,
          survey: survey._id,
        };
      })
    );

    req.user.credits -= totalCost;

    const user = await req.user.save();

    return res.status(201).json({ user, survey });
  } catch (error) {
    console.log(error);
    handleError(res, error);
  }
};

