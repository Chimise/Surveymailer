import React from "react";
import Modal from "../../ui/Modal";
import {
  ChevronLeftIcon,
  EnvelopeIcon,
  TrashIcon,
  EllipsisHorizontalIcon,
  InboxArrowDownIcon,
} from "@heroicons/react/20/solid";
import { StarIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import type { SurveyPreviewData } from "../../../types";



interface SurveyPreviewProps {
  show: boolean;
  onClose: () => void;
  data: SurveyPreviewData;
}

const SurveyPreview = ({ show, onClose, data }: SurveyPreviewProps) => {
  
  return (
    <Modal show={show && Boolean(data)} onClose={onClose}>
      {data && <div className="flex flex-wrap w-full">
        <div className="w-full md:w-2/3">
          <div className="border border-gray-300 rounded-sm">
            <div className="bg-red-700 flex pt-4 pb-2 px-1 justify-between text-white">
              <ChevronLeftIcon className="w-5 h-5" />
              <div className="flex items-center space-x-4">
                <InboxArrowDownIcon className="w-5 h-5" />
                <TrashIcon className="w-5 h-5" />
                <EnvelopeIcon className="w-5 h-5" />
                <EllipsisHorizontalIcon className="w-5 h-5" />
              </div>
            </div>
            <div className="h-14 border-b border-b-gray-300 px-2 flex items-center">
              <div className="flex-1 truncate">{data.subject}</div>
              <StarIcon className="stroke-gray-200 w-5 h-5" />
            </div>
            <div className="flex space-x-2 p-2">
              <div className="bg-red-700 flex items-center justify-center text-white/50 font-medium w-8 h-8 rounded-full">
                N
              </div>
              <div className="flex-1 flex items-center">
                <div className="flex-1 truncate">
                  <h6 className="font-medium text-sm md:text-base text-black ">
                    {data.shipper}{" "}
                    <span className="hidden md:inline-block align-middle text-xs font-light text-slate-700">
                      {`<`}no-reply@{data.shipper.toLowerCase()}.com{`>`}
                    </span>
                  </h6>
                  <p className="text-xs text-gray-600">to me</p>
                </div>
                <div className="hidden md:inline-flex text-gray-600 items-center space-x-1">
                  <span className="text-xs light">
                    {moment().format("H:mm A")}
                  </span>
                  <EllipsisHorizontalIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div className="overflow-x-hidden overflow-y-auto max-h-60 p-6">
              <div className="text-slate-600 text-sm">
                {data.body}
              </div>
              <div className="mt-6 flex flex-col space-y-3">
                {data.choices.map((choice, index) => (<button key={index} className="bg-slate-800 transition-colors duration-150 text-white p-2 focus:outline-none hover:bg-slate-900">
                  {choice}
                </button>))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex space-y-4 flex-col px-3 py-4 md:w-1/3">
          <div>
            <h6 className="text-gray-800 font-medium text-lg">
              Survey Details
            </h6>
            <div className="py-3 md:py-6 space-y-4">
              <div className="flex items-center justify-between border-b py-2 border-b-gray-200">
                <p className="text-sm text-gray-400">Total Recipients</p>
                <p>{data.recipients.split(',').length}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-800 font-medium">Total Credits</p>
                <p>{data.recipients.split(',').length}</p>
              </div>
            </div>
          </div>
          <div>
            <button onClick={onClose} className="bg-primary w-full rounded-md transition-colors duration-150 text-sky-100 p-2 focus:outline-none hover:bg-slate-700 hover:text-white">
              Cancel
            </button>
          </div>
        </div>
      </div>}
    </Modal>
  );
};

export default SurveyPreview;
