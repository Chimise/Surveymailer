import React from "react";
import Link from "next/link";
import cn from "classnames";
import Head from 'next/head';
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/router";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAppDispatch } from "../../store";
import { registerUser } from "../../store/auth";
import AuthLayout from "../../components/common/AuthLayout";
import GoogleIcon from "../../components/icons/GoogleIcon";
import useAlert from "../../hooks/useAlert";

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const {push} = useRouter();
  const {handleShowAlert} = useAlert()
  const { values, touched, errors, handleChange, handleBlur, handleSubmit, isSubmitting } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        password: "",
      },
      onSubmit: async (values) => {
        const data = await dispatch(registerUser(values));
        if(registerUser.fulfilled.match(data)) {
          push('/dashboard');
        }else {
          const message = data.payload || 'An error occured, try again'
          handleShowAlert({type: 'error', message});
        }
      },
      validationSchema: yup.object({
        name: yup.string().required("Please enter your name"),
        email: yup
          .string()
          .email("Please enter a valid email")
          .required("Please enter your password"),
        password: yup.string().required("Please enter your password").min(5, 'Password should be at least five characters'),
      }),
    });
  return (
    <>
    <Head>
      <title>Register</title>
    </Head>
    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
      <div className="w-[86%] max-w-sm space-y-3">
        <div className="space-y-1 text-center">
          <h3 className={cn("text-2xl font-semibold")}>Get Started Now</h3>
          <p className="text-sm text-gray-500">
            and improve your customer&apos;s satisfaction
          </p>
        </div>
        <div className="bg-white shadow-md rounded-sm p-5">
          <div className="space-y-2 flex flex-col items-center">
            <p className="text-sm">
              Already a user?{" "}
              <Link
                href={"/auth/signin"}
                className="text-secondary hover:text-green-800"
              >
                Sign in
              </Link>
            </p>
            <Link href='/api/auth/google/connect' className="text-sm font-semibold w-full items-center space-x-2 justify-center flex p-2 bg-gray-100 rounded-sm hover:bg-gray-200/70 transition-colors duration-150">
              <GoogleIcon className="w-6 h-6" /> <span>Signup with Google</span>
            </Link>
            <div className="relative font-semibold flex space-x-1 items-center">
              <div className="w-1.5 h-1.5 bg-black rotate-45" />
              <div>OR</div>
              <div className="w-1.5 h-1.5 bg-black rotate-45" />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 mt-3">
            <Input
              type="text"
              label="Name"
              value={values.name}
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name}
              placeholder='John Doe'
            />
            <Input
              type="email"
              label="Email address"
              value={values.email}
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
              placeholder='johndoe@example.com'
            />
            <Input
              type="password"
              label="Password"
              value={values.password}
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && errors.password}
              placeholder='johnpassword'
            />
            <div className="py-2">
              <Button type="submit" isLoading={isSubmitting} full>
                Sign up
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

RegisterPage.getLayout = (children: React.ReactNode) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default RegisterPage;
