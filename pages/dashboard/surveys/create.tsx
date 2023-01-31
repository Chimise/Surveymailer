import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import DashboardLayout from "../../../components/common/DashboardLayout";
import DraggableField from "../../../components/common/DraggableField";
import Input from "../../../components/ui/Input";
import TextArea from "../../../components/ui/TextArea";
import useSurveyActions from "../../../hooks/useSurveyActions";
import Button from "../../../components/ui/Button";
import { useSendSurveyMutation } from "../../../store/mutations/survey";
import useAlert from "../../../hooks/useAlert";
import { ErrorObj } from "../../../types";

const emailSchema = yup
  .array(yup.string().trim().email("Please enter a valid email").required())
  .required("Field is required");

const surveyValidationSchema = yup.object({
  title: yup.string().required("Please enter a title for your survey"),
  shipper: yup
    .string()
    .required("Please enter your business or organization name"),
  body: yup
    .string()
    .required("Please enter your email body")
    .min(10, "Your email body should be at least 10 characters"),
  subject: yup.string().required("Please enter your email subject"),
  recipients: yup
    .string()
    .required()
    .test("test-email", "Some emails are invalid", async function (value) {
      if (!value || value.length === 0) {
        return true;
      }
      return emailSchema.isValid(value.split(","));
    }),
});

const CreateSurveyPage = () => {
  const { isValid, values: choices } = useSurveyActions();
  const { handleShowAlert } = useAlert();
  const [sendSurvey] = useSendSurveyMutation();
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        title: "",
        shipper: "",
        body: "",
        subject: "",
        recipients: "",
      },
      onSubmit: async (values, { resetForm }) => {
        if (!isValid) {
          return;
        }
        try {
          const recipients = await emailSchema.validate(
            values.recipients.split(",")
          );
          const data = await sendSurvey({
            ...values,
            recipients,
            choices,
          }).unwrap();
          handleShowAlert({ message: "Survey sent succesfully" });
          resetForm();
        } catch (error) {
          console.log(error);
          const message =
            (error as { data: ErrorObj })?.data?.error?.message ||
            "An error occured, please try again";
          handleShowAlert({ message, type: "error" });
        }
      },
      validationSchema: surveyValidationSchema,
    });

  return (
    <div className="w-full h-full pt-32 pb-10">
      <div className="flex items-center justify-center md:h-full">
        <div className="h-auto w-[85%] bg-white shadow-sm md:min-h-[85%] md:w-[90%]">
          <form onSubmit={handleSubmit} className="flex flex-wrap p-4">
            <div className="w-full md:w-1/2 px-4 py-2">
              <Input
                label="Survey Title"
                name="title"
                error={touched.title && errors.title}
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 py-2">
              <Input
                label="Organization Name"
                name="shipper"
                error={touched.shipper && errors.shipper}
                value={values.shipper}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="w-full px-4 py-2">
              <Input
                label="Email Subject"
                name="subject"
                error={touched.subject && errors.subject}
                value={values.subject}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="w-full px-4 py-2">
              <TextArea
                label="Email Body"
                name="body"
                error={touched.body && errors.body}
                value={values.body}
                onChange={handleChange}
                onBlur={handleBlur}
              ></TextArea>
            </div>
            <div className="w-full px-4 py-2">
              <TextArea
                label="Recipients"
                name="recipients"
                error={touched.recipients && errors.recipients}
                value={values.recipients}
                onChange={handleChange}
                onBlur={handleBlur}
              ></TextArea>
            </div>
            <div className="w-full px-4 py-2">
              <DraggableField />
            </div>
            <div className="w-full p-4 flex md:justify-end">
              <div className="w-full md:w-auto">
                <Button type="submit" full>
                  Send Survey
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

CreateSurveyPage.isAuth = true;

CreateSurveyPage.getLayout = (children: React.ReactNode) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default CreateSurveyPage;
