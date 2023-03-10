import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAppDispatch } from "../../../store";
import { logout } from "../../../store/auth";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer = ({ open, onClose }: MobileDrawerProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    onClose()
    await router.push('/auth/signin');
    dispatch(logout());
  }
  return (
    <Transition show={open} as={Fragment}>
      <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="absolute inset-0 bg-transparent transition-opacity"
              onClick={onClose}
            />
          </Transition.Child>
          <div className="pointer-events-none fixed inset-y-0 left-0 w-full">
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-in-out duration-500 sm:duration-700"
              enterFrom="opacity-0"
              enterTo="opacity-1"
              leave="transition-opacity ease-in-out duration-500 sm:duration-700"
              leaveFrom="opacity-1"
              leaveTo="opacity-0"
            >
              <div className="pointer-events-auto bg-gray-200 relative top-[100px] left-[50%] -translate-x-[50%] h-auto w-[85%] max-w-sm rounded-lg shadow-sm py-8 px-7">
                <div className="flex flex-col items-start space-y-5">
                  <Link
                    onClick={onClose}
                    href="/dashboard/fund"
                    className="text-slate-900 hover:text-secondary"
                  >
                    Add Credits
                  </Link>
                  <Link
                    onClick={onClose}
                    href="/dashboard/surveys/create"
                    className="text-slate-900 hover:text-secondary"
                  >
                    Create Survey
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-slate-900 focus:outline-none hover:text-secondary"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default MobileDrawer;
