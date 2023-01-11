import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import Container from "../Container";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer = ({ open, onClose }: MobileDrawerProps) => {
  return (
    <Transition show={open} as={Fragment}>
    <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
    <div className="absolute inset-0 overflow-hidden">
      <div className="pointer-events-none fixed inset-y-0 left-0 flex w-full">
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-500 sm:duration-700"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-500 sm:duration-700"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="pointer-events-auto flex flex-col bg-white h-[30vh] max-h-[200px] relative w-full">
            <div className="flex h-14" />
            <div className="flex-1 flex flex-col">
              <Container className="flex-1 flex flex-col text-md font-medium justify-evenly items-start">
                <Link onClick={onClose} href="/auth/signin" className='text-slate-900 hover:text-secondary'>Login</Link>
                <Link onClick={onClose} href="/auth/signup" className='text-slate-900 hover:text-secondary'>Register</Link>
              </Container>
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