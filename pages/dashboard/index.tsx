import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Link from 'next/link';
import DashboardLayout from "../../components/common/DashboardLayout";
import Container from "../../components/ui/Container";
import Select from "../../components/ui/Select";
import SurveyCard from "../../components/common/SurveyCard";
import Spinner from "../../components/ui/Spinner";
import { useGetSurveysQuery } from "../../store/queries/survey";
import Error from "../../components/common/Error";
import useUser from "../../hooks/useUser";
import Pagination from "../../components/common/Pagination";
import { Option } from "../../types";

const selectOptions: Array<Option> = [{name: 'default', text: 'Sort'}, {name: 'createdAt', text: 'Created'}, {name: 'title', text: 'Title'}, {name: 'updatedAt', text: 'Modified'}, {name: 'recipients', text: 'Sent'}, {name: 'responses', text: 'Recieved'}]


const DashboardPage = () => {
  const [selected, setSelected] = useState<Option>(selectOptions[0]);
  const [isAsc, setIsAsc] = useState(true);
  const {query, isReady} = useRouter();

  const page = useMemo(() => {
    if(!isReady) {
      return;
    }
    const page = Array.isArray(query.page) ? query.page[0] : query.page;
    if(!page || isNaN(parseInt(page))) {
      return 1;
    }

    return parseInt(page)
  }, [query, isReady]);

  const sort = useMemo(() => {
    if(selected.name === 'default') {
      return ''
    };
    return `${selected.name}:${isAsc ? 'asc' : 'desc'}`;
  }, [selected, isAsc])

  const { data, isLoading, error, refetch, isFetching } = useGetSurveysQuery({page, sort}, {
    refetchOnMountOrArgChange: true
  });
  const user = useUser();

  const handleSort = () => {
    setIsAsc((prevState) => !prevState);
  };

  return (
    <div>
      <div className="h-32 bg-primary"></div>
      <section>
        <Container className="bg-white -mt-10 rounded-md shadow-sm" narrow>
          <div className="flex flex-col items-center p-5 space-y-5 md:flex-row md:justify-between md:space-y-0">
            <div className="flex flex-col items-center space-y-2 md:flex-row md:space-x-3 md:space-y-0">
              <div className="rounded-full w-16 h-16 bg-gray-200" />
              <div className="text-center md:text-left text-gray-500 font-medium text-sm">
                <p className="">Welcome back,</p>
                <p className="text-lg font-bold text-black">{user?.name}</p>
                <p>{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link className="bg-secondary inline-block text-white px-2 py-1 outline-none rounded-md duration-150 transition-colors hover:bg-green-700" href='/dashboard/fund'>Add Credits</Link>
              <Link  className="inline-block text-secondary px-2 py-1 outline-none rounded-md duration-150 transition-colors border border-secondary hover:bg-green-700 hover:text-white hover:border-white" href='/dashboard/surveys/create'>
                Create Survey
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap bg-gray-200 border-t rounded-b-md text-center divide-y divide-gray-300 border-t-gray-300 md:divide-y-0 md:divide-x">
            <div className="w-full md:w-1/2 py-3 font-medium text-gray-700">
              <span className="text-black">{user?.credits}</span> Credits
              remaining
            </div>
            <div className="w-full md:w-1/2 py-3 font-medium text-gray-700">
              <span className="text-black">
                {data?.paginate.total ?? user?.surveys}
              </span>{" "}
              Surveys sent
            </div>
          </div>
        </Container>
      </section>
      <section className="mt-16">
        <Container>
          <header className="flex justify-between">
            <h5 className="font-medium text-lg">Surveys</h5>
            <Select
              onSort={handleSort}
              isAsc={isAsc}
              options={selectOptions}
              onChange={setSelected}
              value={selected}
            />
          </header>
          <div className='mt-5 min-h-[200px] flex flex-col space-y-4'>
            <div className='flex-1 space-y-2' >
              {isLoading && (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              )}
              {error && <Error onRetry={() => refetch()} />}
              {data && data.surveys.length === 0 && !isFetching && <div className="text-center">
                No Data was found
                </div>}
              {data &&
                data.surveys.map((survey) => (
                  <SurveyCard key={survey._id} survey={survey} />
                ))}
            </div>
            {data && <Pagination {...data.paginate} className='self-end' />}
          </div>
        </Container>
      </section>
    </div>
  );
};

DashboardPage.getLayout = (children: React.ReactNode) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

DashboardPage.isAuth = true;

export default DashboardPage;
