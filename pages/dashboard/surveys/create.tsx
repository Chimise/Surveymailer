import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/router";
import Head from 'next/head';
import DashboardLayout from "../../../components/common/DashboardLayout";
import DraggableField from "../../../components/common/DraggableField";
import Input from "../../../components/ui/Input";
import TextArea from "../../../components/ui/TextArea";
import useSurveyActions from "../../../hooks/useSurveyActions";
import Button from "../../../components/ui/Button";
import { useSendSurveyMutation } from "../../../store/mutations/survey";
import useAlert from "../../../hooks/useAlert";
import { ErrorObj } from "../../../types";
import useModal from "../../../hooks/useModal";
import type {User, Survey} from '../../../types';

const emailSchema = yup
  .array(yup.string().trim().email("Please enter a valid email").required())
  .required("Field is required");

const surveyValidationSchema = yup.object({
  title: yup.string().required("Please enter a title for your survey").max(100, 'This field should not be more than 100 characters'),
  shipper: yup
    .string()
    .required("Please enter your business or organization name"),
  body: yup
    .string()
    .required("Please enter your survey email body")
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
  const {push} = useRouter();
  const { isValid, values: choices, reset} = useSurveyActions();
  const {open} = useModal()
  const { handleShowAlert } = useAlert();
  const [sendSurvey] = useSendSurveyMutation();
  const { values, errors, touched, handleBlur, handleChange, handleSubmit, validateForm, isSubmitting } =
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
          const data  = await sendSurvey({
            ...values,
            recipients,
            choices,
          }).unwrap()
          resetForm();
          reset();
          push(`/dashboard/surveys/${data.survey._id}`);

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

    const surveyPreviewHandler = async () => {
     try {
      const errors = await validateForm();
      if(Object.keys(errors).length === 0 && isValid) {
        open({...values, choices});
      }
     } catch (error) {
        console.log(error);
     }
    }


  return (
    <div className="w-full h-full pt-32 pb-10">
      <Head>
        <title>Create Survey</title>
      </Head>
      <div className="flex items-center justify-center md:h-full">
        <div className="h-auto w-[85%] bg-white shadow-sm md:min-h-[85%] md:w-[90%]">
          <form onSubmit={handleSubmit} className="flex flex-wrap p-4">
            <div className="w-full md:w-1/2 px-4 py-2">
              <Input
                label="Survey Title"
                name="title"
                placeholder="Campaign #1"
                error={touched.title && errors.title}
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 py-2">
              <Input
                label="Organization Name"
                placeholder="SurveyMailer"
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
                placeholder="How can we make our delivery service work for you"
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
                placeholder="How satisfied are you with our delivery services"
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
                placeholder="Johndoe@surveymailer.com, example@surveymailer.com"
                error={touched.recipients && errors.recipients}
                value={values.recipients}
                onChange={handleChange}
                onBlur={handleBlur}
              ></TextArea>
            </div>
            <div className="w-full px-4 py-2">
              <DraggableField />
            </div>
            <div className="w-full p-4 flex items-center justify-between md:justify-end md:space-x-5">
              <Button variant="outlined" type='button' onClick={surveyPreviewHandler}>
                Preview
              </Button>
                <Button isLoading={isSubmitting} type="submit">
                  Send Survey
                </Button>
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
