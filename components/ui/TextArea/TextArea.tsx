import React, { Fragment} from "react";
import cn from "classnames";
import { Transition } from "@headlessui/react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error: false | string | undefined;
  label: string;
}

const TextArea = ({ error, label, className, rows = 3, children, ...props }: TextAreaProps) => {

  return (
    <label className="block group">
      <span className="text-normal text-gray-800 text-sm group-focus-within:text-black mb-1 block">
        {label}
      </span>
        <textarea
          className={cn(
            "block w-full resize-none border mb-0.5 rounded-md bg-white px-2 py-1.5 focus:outline-none focus:ring-1",
            {
              "border-gray-400 focus:ring-gray-400": !error,
              "border-red-800 focus:ring-red-800": error,
            },
            className
          )}
          rows={rows}
          {...props}
          >
            {children}
          </textarea>
      <div className="relative text-red-800 text-[10px] tracking-wide">
        <Transition
          as={Fragment}
          show={Boolean(error)}
          enterFrom="opacity-0"
          enterTo="opacity-100"
          enter="transition-opacity duration-150"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <span className="absolute -top-0.5">{error}</span>
        </Transition>
      </div>
    </label>
  );
};

export default TextArea;
