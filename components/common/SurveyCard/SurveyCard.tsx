import React from "react";
import {
  ChevronRightIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
} from "@heroicons/react/20/solid";
import type { Survey } from "../../../types";
interface SurveyCardProps {
  survey: Survey;
}

const SurveyCard = ({
  survey: { _id, updatedAt, choices, recipients, title },
}: SurveyCardProps) => {
  const isTotalSentPlural = recipients > 1;
  const totalResponse = choices.reduce(
    (acc, { responses }) => acc + responses,
    0
  );
  const isTotalResponsePlural = totalResponse > 1;
  const date = new Date(updatedAt);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-GB", {
    month: "long",
  });
  const year = date.getFullYear();
  return (
    <div className="flex items-center py-4 px-6 bg-white">
      <div className="flex-1 space-y-2">
        <div className="flex items-center text-black">
          <div className="flex-1 flex items-center space-x-4 pl-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 ring-1 ring-green-500/40 ring-offset-[3px] ring-offset-green-200/50"></span>
            <span className="font-semibold">{title}</span>
          </div>
          <p className="hidden md:block md:flex-1 font-medium text-sm">
            Last response on {month} {day}, {year}
          </p>
        </div>
        <div className="flex flex-col space-y-2 items-start md:flex-row md:items-center md:space-y-0">
          <div className="flex-1 flex items-center space-x-2">
            <EnvelopeIcon className="w-5 h-5 text-gray-700" />
            <span>
              {recipients} {isTotalSentPlural ? "surveys" : "survey"} sent
            </span>
          </div>
          <div className="flex-1 flex items-center space-x-2">
            <EnvelopeOpenIcon className="w-5 h-5 text-gray-700" />
            <span>
              {totalResponse} {isTotalResponsePlural ? "responses" : "response"}{" "}
              recieved
            </span>
          </div>
        </div>
      </div>
      <div className="shrink-0">
        <ChevronRightIcon className="w-5 h-5 text-gray-700" />
      </div>
    </div>
  );
};

export default SurveyCard;
