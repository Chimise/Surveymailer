import React from "react";
import Head from "next/head";
import { Inter, Roboto } from "@next/font/google";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import Image from 'next/image'
import cn from 'classnames';
import Layout from "../components/common/Layout";
import Container from "../components/ui/Container";
import Button from '../components/ui/Button';
import CustomList from "../components/ui/CustomList";


const inter = Inter({ subsets: ["latin"] });

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
      <section className={cn('bg-primary py-10 text-center', inter.className)}>
        <div className="space-y-6 mx-auto w-[70%] max-w-[500px] text-white">
          <div className="text-xl font-medium flex items-center justify-center">
            <span>Send</span>
            <ArrowLongRightIcon className="w-10 h-5 text-secondary" />
            <span>Analyze</span>
            <ArrowLongRightIcon className="w-10 h-5 text-secondary" />
            <span>Grow</span>
          </div>
          <div className='text-normal font-light'>
            Send surveys to your customers, automate customer feedback
            collection and analysis. Learn and grow your business.
          </div>
          <div className='flex flex-col sm:flex-row sm:justify-center space-y-3 sm:space-y-0 sm:space-x-3'>
              <Button variant="outlined">Learn More</Button>
              <Button>Sign up for free</Button>
          </div>
          <p className="text-sm">No credit card required</p>
        </div>
      </section>
      <section className="bg-slate-100 min-h-[60vh] py-10 space-y-14">
          <header className="text-center text-primary text-2xl md:text-3xl font-semibold">
              <h2>What can you do with <br /> continous customer feedback?</h2>
          </header>
          <Container className="flex items-center flex-wrap space-y-4">
            <CustomList className="w-full md:w-1/2">
              <li>Build your products around user insights</li>
              <li>Measure and improve customers&apos; satisfaction with your company&apos;s products and services</li>
              <li>Identify areas for improvement to create a great user experience</li>
              <li>Determine your product/market fit to optimize your offering and grow continously</li>
              <li>Design and deliver a winning customer experience that drives continous business growth</li>
            </CustomList>
            <div className="w-full md:w-1/2 flex justify-center">
            <Image src='/email.png' priority alt='Mail Icon Image' width={500} height={500} />
            </div>
          </Container>
      </section>
      
    </>
  );
};

HomePage.getLayout = (children: React.ReactNode) => {
  return <Layout>{children}</Layout>;
};

export default HomePage;
