import React from "react";
import moment from "moment";
import type { Recipient } from "../../../types";
import {
  ChatBubbleLeftIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

interface RecipientCardProps {
  recipient: Recipient;
}

const RecipientCard = ({
  recipient: { email, updatedAt, responded, choice, sent },
}: RecipientCardProps) => {
  return (
    <div className="flex space-x-2 items-start px-5 md:px-7 py-2">
      <ChatBubbleLeftIcon className="w-6 h-6 mt-0.5 text-gray-400" />
      <div className="flex-1 space-y-0.5">
        <h6 className="font-medium">{email}</h6>
        {sent && (
          <>
            <div className="text-gray-500 text-sm">
              {responded
                ? `Responded on ${moment(
                    updatedAt || new Date(Date.now() - 10000).toISOString(),
                    moment.ISO_8601
                  ).format("Do MMMM, YYYY")}`
                : "No response yet"}
            </div>
            {responded && (
              <div className="flex items-center w-full md:w-32 space-x-2 py-1 px-2 border border-gray-400 rounded-md">
                <span className="w-2 h-2 bg-secondary rounded-full" />
                <div className="flex-1">{choice}</div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="shrink-0 w-6 h-6">
        {sent ? (
          <CheckCircleIcon className="w-full h-full text-secondary" />
        ) : (
          <XCircleIcon className="w-full h-full text-red-800" />
        )}
      </div>
    </div>
  );
};

export default RecipientCard;
