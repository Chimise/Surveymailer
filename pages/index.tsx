import React from "react";
import Head from "next/head";
import { Inter, Roboto } from "@next/font/google";
import Layout from "../components/common/Layout";
import Container from "../components/common/Container";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

const HomePage = () => {
  return (
    <>
      <Head>
        <title>SurveyMailer Homepage</title>
        <meta
          name="description"
          content="Send surveys to your customer, get and analyze feedback and grow your customers"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="bg-primary py-9 text-center">
        <div className="space-y-6 mx-auto w-[70%] max-w-[500px] text-white">
          <div className="text-xl font-medium flex items-center justify-center">
            <span>Send</span>
            <ArrowLongRightIcon className="w-10 h-5 text-secondary" />
            <span>Analyze</span>
            <ArrowLongRightIcon className="w-10 h-5 text-secondary" />
            <span>Grow</span>
          </div>
          <div>
            Send surveys to your customers, automate customer feedback
            collection and analysis. Learn and grow your business.
          </div>
        </div>
      </section>
      <div className="min-h-screen" />
    </>
  );
};

HomePage.getLayout = (children: React.ReactNode) => {
  return <Layout>{children}</Layout>;
};

export default HomePage;
