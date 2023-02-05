import React, { useState } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import * as yup from "yup";
import Script from "next/script";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import useUser from "../../hooks/useUser";
import { useVerifyPaymentMutation } from "../../store/mutations/payment";
import type { Paystack } from "../../types";

declare global {
  var PaystackPop: Paystack;
}

const FundPage = () => {
  const [showPayment, setShowPayment] = useState(true);
  const {push} = useRouter();
  const user = useUser();
  const [sendPaymentRequest, {data}] = useVerifyPaymentMutation()
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } =
    useFormik({
      initialValues: {
        amount: "",
      },
      onSubmit({ amount,  }, {setSubmitting}) {
        setShowPayment(false);
        const handler = PaystackPop.setup({
          key: process.env.NEXT_PUBLIC_PAYSTACK!,
          email: user!.email,
          amount: parseInt(amount, 10) * 100,
          callback: ({ reference }) => {
            setShowPayment(true);
            sendPaymentRequest(reference).unwrap().then(response => {
              setSubmitting(false);
              push('/dashboard');
            }).catch(() => {
              setSubmitting(false);
            })
          },
          onClose: () => {
            setSubmitting(false);
            setShowPayment(true);
            
          },
        });
        handler.openIframe();
      },
      validationSchema: yup.object({
        amount: yup.number().required("Please enter an amount"),
      }),
    });

  return (
    <div className="h-full w-full flex items-center justify-center">
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="afterInteractive"
      />
      {showPayment && (
        <div className="w-[86%] bg-white rounded-sm shadow-sm max-w-xs p-4">
          <form noValidate onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Enter Amount (₦)"
              name="amount"
              type="number"
              error={touched.amount && errors.amount}
              value={values.amount}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <div className="flex justify-end">
              <Button type="submit" isLoading={isSubmitting}>Submit</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

FundPage.isAuth = true;

FundPage.getLayout = (children: React.ReactNode) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default FundPage;
