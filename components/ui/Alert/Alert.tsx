import React, {Fragment, useEffect} from "react";
import { Transition } from "@headlessui/react";
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import cn from 'classnames';

interface AlertProps {
  type: "success" | "error";
  message: string;
  show: boolean;
  onDismiss: () => void;
  timeout: number;
}

const Alert = ({ type, message, show, onDismiss, timeout }: AlertProps) => {

useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if(show) {
        timeoutId = setTimeout(onDismiss, timeout)
    }
    return () => {
        if(timeoutId) {
            clearTimeout(timeoutId)
        }
    }
}, [onDismiss, timeout, show]);

  return (
    <Transition as={Fragment} unmount enter='transition-opacity duration-150' enterFrom="opacity-0" enterTo="opacity-1" leave='transition-opacity duration-150' leaveFrom="opacity-1" leaveTo="opacity-0" show={show}>
      <div className={cn("max-w-md w-[90%] absolute rounded-md left-1/2 top-20 -translate-x-1/2 z-50 p-4 flex items-center", {'bg-green-200 text-green-700': type === 'success', 'bg-red-200 text-red-800': type === 'error'})}>
        <div className="flex-1 flex items-center space-x-4">
          <div className="w-5 h-5">
            {type === "success" ? (
              <CheckCircleIcon className="w-full h-full" />
            ) : (
              <ExclamationCircleIcon className="w-full h-full" />
            )}
          </div>
          <div className={cn("truncate font-medium", {'text-green-900': type === 'success', 'text-red-900': type === 'error'})}>{message}</div>
        </div>
        <div className="w-5 h-5" onClick={onDismiss}>
        <XMarkIcon className="w-full h-full stroke-2" />
        </div>
      </div>
    </Transition>
  );
};

export default Alert;
