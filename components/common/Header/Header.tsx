import React from "react";
import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/20/solid";
import cn from 'classnames';
import Link from "next/link";
import Container from "../Container";

interface HeaderProps {
  onOpen: () => void;
  open: boolean;
  hasScrolled: boolean;
}

const Header = ({ onOpen, open, hasScrolled }: HeaderProps) => {
  return (
    <header className={cn("h-14 z-[1000] fixed top-0 w-full transition-colors duration-150", {'bg-primary': !hasScrolled, 'bg-white': hasScrolled})}>
      <Container className="flex justify-between h-full items-center">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <span className={cn('font-display font-bold tracking-wide transition-colors duration-150 text-xl', {'text-white': !hasScrolled, 'text-primary': hasScrolled})}>
              Survey<span className='text-secondary'>Mailer</span>
            </span>
          </Link>
        </div>
        <button
            onClick={onOpen}
            className={cn("sm:hidden p-1 focus:outline-none transition-colors duration-150 rounded-md", {'bg-white': !hasScrolled, 'bg-primary': hasScrolled})}
          >
            {open ? (
              <XMarkIcon className={cn("w-5 h-5 transition-colors duration-150", {'text-black': !hasScrolled, 'text-white': hasScrolled})} />
            ) : (
              <Bars3BottomLeftIcon className={cn("w-5 h-5 transition-colors duration-150", {'text-black': !hasScrolled, 'text-white': hasScrolled})} />
            )}
          </button>
        <nav className={cn("hidden sm:flex sm:space-x-6 sm:justify-end transition-colors duration-150 flex-1", {'text-white': !hasScrolled, 'text-primary': hasScrolled})}>
          <Link href="/auth/register" className="text-inherit hover:text-secondary" >Register</Link>
          <Link href="/auth/signin" className="text-inherit hover:text-secondary">Login</Link>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
