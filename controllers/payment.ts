import { NextApiResponse } from "next";
import { formatError, handleError, verifyPayment } from "../utils";
import * as yup from "yup";
import { ExtendedApiRequest } from "../middlewares/auth";

const validatePaymentSchema = yup.object({
  reference: yup.string().required("Please enter your payment reference"),
});

export const validatePayment = async (
  req: ExtendedApiRequest,
  res: NextApiResponse
) => {
  try {
    const { reference } = await validatePaymentSchema.validate(req.body);
    const {
      data: { amount, status, paidAt },
    } = await verifyPayment(reference);
    if (status !== "success") {
      return res.status(400).json(formatError("Payment not successfull"));
    }

    if (Date.now() - new Date(paidAt).getTime() > 5 * 60 * 1000) {
      return res.status(400).json(formatError("Payment reference expired"));
    }
    const amountInNaira = Math.trunc(amount / 100);
    req.user.credits += amountInNaira;
    await req.user.save();
    return res.status(200).json(req.user);
  } catch (error) {
    handleError(res, error);
  }
};
