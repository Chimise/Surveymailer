import React, { Fragment } from "react";
import cn from "classnames";
import { Transition } from "@headlessui/react";
import Spinner from "../../ui/Spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "outlined";
  full?: boolean;
  slim?: boolean;
  isLoading?: boolean;
}

const Button = ({
  className,
  variant = "filled",
  children,
  full = false,
  slim = false,
  isLoading,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={Boolean(disabled || isLoading)}
      className={cn(
        "text-center items-center justify-center rounded-md focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:hover:bg-gray-200 disabled:text-slate-800",
        {
          "border border-secondary text-secondary hover:bg-secondary hover:text-white":
            variant === "outlined",
          "bg-secondary text-white hover:bg-green-700": variant === "filled",
        },
        { "inline-flex": !full, "flex w-full": full },
        { "px-4 py-2": !slim, "px-2 py-1": slim }
      )}
    >
      <span className={cn({'mr-3': isLoading})}>{children}</span>
      <Transition
        as={Fragment}
        enter="duration-150 transition-opacity"
        enterFrom="opacity-0"
        enterTo="opacity-1"
        leave="duration-150 transition-opacity"
        leaveFrom="opacity-1"
        leaveTo="opacity-0"
        show={Boolean(isLoading)}
      >
        <span>
          <Spinner
            backgroundColor="before:border-gray-200"
            foregroundColor="after:border-b-gray-400 after:border-x-gray-400"
            size="sm"
          />
        </span>
      </Transition>
    </button>
  );
};

export default Button;
