import { NextApiResponse, NextApiRequest } from "next";
import * as yup from "yup";
import { v4 as uuidV4 } from "uuid";
import { Types } from "mongoose";
import {
  formatError,
  handleError,
  uuidValidateV4,
  transporter,
  generateEmailHtml,
  paginate,
} from "../utils";
import { ExtendedApiRequest } from "../middlewares/auth";
import Survey, { Survey as SurveyI } from "../models/Survey";
import Recipient from "../models/Recipient";
import channels from "../pusher/server";

const MAX_ITEMS = 5;

const uniqueEmails = (emails: string[]) => {
  const emailSet = new Set(emails);
  return Array.from(emailSet.values());
};

const createSurveySchema = yup.object({
  title: yup.string().required("Please enter the title of the survey"),
  shipper: yup.string().required("Your organization name is required"),
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

const findSurveySchema = yup.object({
  _limit: yup.number().default(MAX_ITEMS),
  _page: yup.number().default(1),
  _sort: yup
    .string()
    .default("createdAt:desc")
    .test({
      name: "Test _Sort Query",
      test(value) {
        const fields = value.split(":");
        if (fields.length > 2) {
          throw new yup.ValidationError("_sort field not valid");
        }

        if (fields[1] && !["asc", "desc"].includes(fields[1].toLowerCase())) {
          throw new yup.ValidationError("_sort field not valid");
        }
        return true;
      },
    }),
});

type SortOrder = -1 | 1;

const getSortField = (value: string): [string, SortOrder] => {
  let [field, order = "asc"] = value.split(":");
  order = order.toLowerCase();
  let sort: SortOrder = 1;
  if (order === "desc") {
    sort = -1;
  }
  return [field, sort];
};

export const find = async (req: ExtendedApiRequest, res: NextApiResponse) => {
  try {
    const { _limit, _page, _sort } = await findSurveySchema.validate(req.query);
    const [field, order] = getSortField(_sort);
    const surveyCounts = await Survey.countDocuments({ user: req.user.id });
    const { skip, ...data } = paginate(surveyCounts, _page, _limit);

    // Sort field by surveys with the highest responses
    if (field === "responses") {
      const aggregatedData: Array<SurveyI> = await Survey.aggregate([
        { $match: { user: new Types.ObjectId(req.user._id) } },
        {
          $addFields: {
            totalResponses: {
              $sum: "$choices.responses",
            },
          },
        },
        {
          $sort: {
            totalResponses: order,
            _id: 1,
          },
        },
        {
          $project: {
            totalResponses: 0,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: _limit,
        },
      ]);
      return res.json({ surveys: aggregatedData, paginate: data });
    }
    const surveys = await Survey.find({ user: req.user.id })
      .limit(_limit)
      .skip(skip)
      .sort({ [field]: order, _id: 1 });
    res.json({ surveys, paginate: data });
  } catch (error) {
    return handleError(res, error);
  }
};

export const findOne = async (
  req: ExtendedApiRequest,
  res: NextApiResponse
) => {
  const id = req.query.id as string;
  const survey = await Survey.findOne({ user: req.user.id, _id: id });
  if (!survey) {
    return res.status(404).send(formatError("Survey not found"));
  }

  return res.json(survey);
};

export const findRecipients = async (
  req: ExtendedApiRequest,
  res: NextApiResponse
) => {
  try {
    const id = req.query.id as string;
    const { _limit, _page } = await findSurveySchema
      .omit(["_sort"])
      .validate(req.query);
    const survey = await Survey.findOne({ user: req.user._id, _id: id });
    if (!survey) {
      return res.status(404).json(formatError("Survey not found"));
    }
    const recipientCount = await Recipient.countDocuments({
      survey: survey._id,
    });
    const { skip, ...data } = paginate(recipientCount, _page, _limit);
    const recipients = await Recipient.find({ survey: survey.id })
      .limit(_limit)
      .skip(skip);
    return res.json({ recipients, paginate: data });
  } catch (error) {
    handleError(res, error);
  }
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
    return res.status(404).send(formatError("Data not found"));
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

  await channels.trigger('survey', 'response', {user: survey.user._id, recipient});
  res.redirect("/response");
};




export const create = async (req: ExtendedApiRequest, res: NextApiResponse) => {
  try {
    let { recipients, title, shipper, body, choices, subject } =
      await createSurveySchema.validate(req.body);

    // Remove duplicate emails
    recipients = uniqueEmails(recipients);

    const shipper_email = `noreply@${shipper.toLowerCase()}.com`;

    const totalCost = recipients.length;

    if (req.user.credits < totalCost) {
      return res
        .status(402)
        .send(
          formatError("You do not have enough credit to perform the operation")
        );
    }

    // Represent choices with number codes
    const updatedChoices = choices.map((action, index) => {
      return {
        action,
        code: index,
      };
    });
    //Generate a uuid for each recipient to be able to track each recipient
    const updatedRecipients = recipients.map((recipient) => {
      const uuid = uuidV4();
      return {
        recipient,
        uuid,
        sent: false,
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

    const allResponses = await Promise.allSettled(userEmailPromises);
    let sentEmailCount = 0;

    allResponses.forEach((response, index) => {
      if (response.status === "rejected") {
        updatedRecipients[index].sent = false;
        return;
      }
      if (response.value.rejected[1]) {
        updatedRecipients[index].sent = false;
        return;
      }
      // Set the email status to true if email is accepted or is pending
      sentEmailCount += 1;
      updatedRecipients[index].sent = true;
    });

    // Send an error response if no email could be sent
    if (sentEmailCount === 0) {
      return res.status(500).send("Email could not be sent, please try again");
    }

    const survey = new Survey({
      shipper,
      shipper_email,
      choices: updatedChoices,
      recipients: updatedRecipients.length,
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
          sent: recipient.sent,
        };
      })
    );

    req.user.credits -= sentEmailCount;

    const user = await req.user.save();

    return res.status(201).json({ user, survey });
  } catch (error) {
    console.log(error);
    handleError(res, error);
  }
};
