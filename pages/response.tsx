import React from "react";
import Head from 'next/head';
import CheckIcon from "../components/icons/CheckIcon";

const SurveyResponsePage = () => {
  return (
    <>
    <Head>
      <title>Response Page</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <div className="w-screen h-screen flex overflow-hidden items-center justify-center">
      <div className="w-full max-w-2xl flex items-center justify-center flex-wrap">
        <div className="max-w-md md:w-1/2 p-2">
          <CheckIcon className="w-full" />
        </div>
        <div className="w-full text-center md:w-1/2 text-gray-500 font-bold text-4xl leading-[50px] tracking-wider py-3 px-5 md:px-3 md:text-left">
          <p>Thank you for filling this survey</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default SurveyResponsePage;
