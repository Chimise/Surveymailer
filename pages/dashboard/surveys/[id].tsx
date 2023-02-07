import React, { useMemo } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useRouter } from "next/router";
import moment from "moment";
import Link from 'next/link';
import Head from 'next/head';
import {ArrowLongLeftIcon} from '@heroicons/react/24/solid'
import { useGetSurveyQuery, useGetRecipientsQuery } from "../../../store/queries/survey";
import Loading from "../../../components/common/Loading";
import Error from "../../../components/common/Error";
import DashboardLayout from "../../../components/common/DashboardLayout";
import Container from "../../../components/ui/Container";
import Card from "../../../components/ui/Card";
import ListItem from "../../../components/common/ListItem";
import SurveyChoiceItem from "../../../components/common/SurveyChoiceItem";
import CustomPieChart from "../../../components/common/CustomPieChart";
import RecipientCard from "../../../components/common/RecipientCard";
import Pagination from "../../../components/common/Pagination";
import Spinner from '../../../components/ui/Spinner';

const SurveyPage = () => {
  const { isReady, query } = useRouter();
  const page = useMemo(() => {
    if(!isReady) {
      return;
    }
    const pageQuery = Array.isArray(query.page) ? parseInt(query.page[0]) :  parseInt(query.page || '');
    return pageQuery || 1;
  }, 

  [isReady, query])
  const id = useMemo(() => {
    if (!isReady) {
      return;
    }
    return query.id as string;
  }, [isReady, query]);

  const {
    data: survey,
    isLoading,
    error,
    refetch,
  } = useGetSurveyQuery(id ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });

  const {data, isLoading: recipientsIsLoading, error: recipientsError, refetch: refetchRecipients} = useGetRecipientsQuery(id ? {id, page}: skipToken, {
    refetchOnMountOrArgChange: true,
  })

  const respondents = useMemo(() => {
    if(!survey) {
      return;
    }
    return survey.choices.reduce((acc, choice) => acc + choice.responses, 0);
  }, [survey])

  if (isLoading) {
    return <Loading size="md" />;
  }

  if (error) {
    return (
      <div className="w-full h-full">
        <Error
          message="An error occured, try again"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Head>
          <title>Not Found</title>
        </Head>
        <span className="text-gray-700 font-medium">Survey not found</span>
      </div>
    );
  }

  return (
    <div className="w-full pt-14">
      <Head>
        <title>{survey.title}</title>
      </Head>
      <div className="bg-white py-2 shadow-sm">
        <Container fluid className="w-full h-full">
        <Link href='/dashboard' className="flex items-center space-x-2"><ArrowLongLeftIcon className="w-5 h-7"  /> <span className="text-sm">Back to Surveys</span></Link>
        </Container>
      </div>
      <div className="py-8">
        <Container fluid className="space-y-0.5">
          <h1 className="font-bold text-2xl">{survey.title}</h1>
          <p className="text-sm text-gray-700">
            Created survey on{" "}
            <span className="text-gray-800 font-medium">
              {moment(survey.createdAt, moment.ISO_8601).format("MMMM D, YYYY")}
            </span>
          </p>
        </Container>
        <section className="mt-6">
          <Container fluid narrow className="flex flex-wrap-reverse lg:flex-row lg:flex-wrap">
            <div className="w-full lg:flex-[2] py-2 pr-0 lg:pr-5">
              <Card className="w-full divide-y divide-gray-200">
                <header className="h-14 text-gray-800 px-6 md:px-4 text-lg font-medium flex items-center">
                    <h5>Survey Information & Metrics</h5>
                </header>
                <div className="px-6 pt-3 pb-6 grid grid-cols-1 md:px-4 md:grid-cols-2 gap-x-2 gap-y-6 justify-between">
                    <ListItem title='Organization Name'>
                      {survey.shipper}
                    </ListItem>
                    <ListItem title='Email Subject'>
                      {survey.subject}
                    </ListItem>
                    <ListItem title='Total Recipients'>
                      {survey.recipients}
                    </ListItem>
                    <ListItem title='Total Respondents'>
                      {respondents}
                    </ListItem>
                    <ListItem className="md:col-span-2" title='Email Body'>
                      {survey.body}
                    </ListItem>
                    <ListItem className="md:col-span-2" title='Survey Choices'>
                      <div className="border border-gray-300 divide-y mt-1 divide-gray-300 rounded-md">
                          {survey.choices.map(choice => (<SurveyChoiceItem respondent={choice.responses} choice={choice.action} key={choice._id} />))}
                      </div>
                    </ListItem>
                </div>
              </Card>
            </div>
            <div className="w-full py-2 lg:flex-[1]">
              <Card className="w-full px-4 flex flex-col">
                <div className="shrink-0 h-14 flex items-center text-gray-800 px-6 md:px-4 font-medium">
                  Survey Response Data
                </div>
                <div className="flex-1 flex items-center justify-center">
                <CustomPieChart survey={survey} />
                </div>
              </Card>
            </div>
          </Container>
        </section>
        <section className='mt-7'>
          <Container fluid narrow>
            <Card className="divide-y divide-gray-200">
                <header className="h-14 text-gray-800 px-6 md:px-4 text-lg font-medium flex items-center">
                  Recipients
                </header>
                <div>
                  <div className="py-4 space-y-1">
                  {recipientsIsLoading && <div className="flex justify-center">
                    <Spinner size='md' />
                    </div>}
                  {error && <Error message={'An error occured, try again'} onRetry={() => refetchRecipients()} />}
                  {data && data.recipients.length === 0 && <div className="text-sm text-gray-600 text-center">
                    Data was not found
                    </div>}
                  {data && data.recipients.map(recipient => (<RecipientCard key={recipient._id} recipient={recipient} />))}
                  </div>
                  <div className="pt-3 pb-5 px-5 md:px-7 flex justify-end">
                    {data && <Pagination {...data.paginate}  />}
                  </div>
                </div>
            </Card>
          </Container>
        </section>
      </div>
    </div>
  );
};

SurveyPage.isAuth = true;

SurveyPage.getLayout = (children: React.ReactNode) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default SurveyPage;
