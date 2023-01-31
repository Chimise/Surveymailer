import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon
} from "@heroicons/react/20/solid";
import { Option } from "../../../types";


interface SelectProps {
  options: Array<Option>;
  onChange: React.Dispatch<React.SetStateAction<Option>>;
  value: Option;
  onSort: () => void;
  isAsc: boolean;
}

const Select = ({ options, onChange, value, isAsc, onSort }: SelectProps) => {

  return (
    <div className="relative">
      <Listbox value={value} onChange={onChange}>
        <div className="relative -mt-1">
          <div className="flex items-center w-32 bg-white space-x-2 pl-2 border border-gray-400 rounded-md">
            <span className="h-5 w-5 text-gray-400" onClick={onSort}>
              {isAsc ? <BarsArrowUpIcon className="w-5 h-5" />: <BarsArrowDownIcon className="w-5 h-5" />}
            </span>
            <Listbox.Button className="relative truncate cursor-default h-full flex-1 py-2 pr-8 rounded-lg text-left focus:outline-none sm:text-sm">
              <span className="block truncate">{value.text}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option) => {
                if(option.name === 'default') {
                  return null;
                }
                return (<Listbox.Option
                  key={option.name}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-2 ${
                      active ? "bg-sky-100" : ""
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                      <span
                        className={`block truncate ${
                          selected ? "font-medium text-gray-900" : "font-normal text-gray-700"
                        }`}
                      >
                        {option.text}
                      </span>
                  )}
                </Listbox.Option>)
})}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Select;
