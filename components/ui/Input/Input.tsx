import React, { Fragment, useState } from "react";
import cn from "classnames";
import { Transition } from "@headlessui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error: false | string | undefined;
  label: string;
}

const Input = ({ error, label, className, type, ...props }: InputProps) => {
  const isPassword = type === "password";
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    setIsVisible((prevState) => !prevState);
  };

  return (
    <label className="block group">
      <span className="text-normal text-gray-800 text-sm group-focus-within:text-black mb-1 block">
        {label}
      </span>
      {isPassword ? (
        <div className="relative w-full">
          <input
            className={cn(
              "block w-full border mb-0.5 rounded-md bg-white pl-2 pr-12 py-1.5 focus:outline-none focus:ring-1",
              {
                "border-gray-400 focus:ring-gray-400": !error,
                "border-red-800 focus:ring-red-800": error,
              },
              className
            )}
            type={isVisible ? "text" : type}
            {...props}
          />
          <span
            onClick={handleToggle}
            className="absolute inline-flex items-center justify-center inset-y-0 right-0 w-12 text-gray-600"
          >
            {!isVisible ? (
              <EyeIcon className="w-5 h-5" />
            ) : (
              <EyeSlashIcon className="w-5 h-5" />
            )}
          </span>
        </div>
      ) : (
        <input
          className={cn(
            "block w-full border mb-0.5 rounded-md bg-white px-2 py-1.5 focus:outline-none focus:ring-1",
            {
              "border-gray-400 focus:ring-gray-400": !error,
              "border-red-800 focus:ring-red-800": error,
            },
            className
          )}
          type={type}
          {...props}
        />
      )}
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

export default Input;
