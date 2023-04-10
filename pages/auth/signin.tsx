import React from "react";
import Link from "next/link";
import cn from "classnames";
import Head from "next/head";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/router";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthLayout from "../../components/common/AuthLayout";
import GoogleIcon from "../../components/icons/GoogleIcon";
import { loginUser } from "../../store/auth";
import { useAppDispatch } from "../../store";
import useAlert from "../../hooks/useAlert";
import testUser from "../../testUser";

const SignInPage = () => {
  const dispatch = useAppDispatch();
  const { push } = useRouter();
  const { handleShowAlert } = useAlert();

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {
      email: testUser.email,
      password: testUser.password,
    },
    async onSubmit(values) {
      const data = await dispatch(loginUser(values));
      if (loginUser.fulfilled.match(data)) {
        push("/dashboard");
      } else {
        const message = data.payload || "An error occured, try again";
        handleShowAlert({ message, type: "error" });
      }
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Enter a valid email")
        .required("Please enter your email"),
      password: yup.string().required("Please enter your password"),
    }),
  });
  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
        <div className="w-[86%] max-w-sm space-y-3">
          <div className="space-y-1 text-center">
            <h3 className={cn("text-2xl font-semibold")}>Welcome Back</h3>
          </div>
          <div className="bg-white shadow-md rounded-sm p-5">
            <div className="space-y-2 flex flex-col items-center">
              <p className="text-sm">
                Do not have an account?{" "}
                <Link
                  href={"/auth/register"}
                  className="text-secondary hover:text-green-800"
                >
                  Sign up
                </Link>
              </p>
              <Link
                href="/api/auth/google/connect"
                className="text-sm font-semibold w-full items-center space-x-2 justify-center flex p-2 bg-gray-100 rounded-sm hover:bg-gray-200/70 transition-colors duration-150"
              >
                <GoogleIcon className="w-6 h-6" />{" "}
                <span>Signup with Google</span>
              </Link>
              <div className="relative font-semibold flex space-x-1 items-center">
                <div className="w-1.5 h-1.5 bg-black rotate-45" />
                <div>OR</div>
                <div className="w-1.5 h-1.5 bg-black rotate-45" />
              </div>
            </div>
            <form className="space-y-3 mt-3" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="johndoe@example.com"
                label="Email address"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                error={touched.email && errors.email}
              />
              <Input
                type="password"
                placeholder="johnpassword"
                label="Password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                error={touched.password && errors.password}
              />
              <div className="py-2">
                <Button type="submit" isLoading={isSubmitting} full>
                  Sign in
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

SignInPage.getLayout = (children: React.ReactNode) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default SignInPage;
