import React from "react";
import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/20/solid";
import cn from 'classnames';
import Link from "next/link";
import Container from "../../ui/Container";

interface HeaderProps {
  onOpen: () => void;
  open: boolean;
}

const Header = ({ onOpen, open}: HeaderProps) => {
  return (
    <header className={cn("h-14 z-[1000] fixed top-0 w-full transition-colors duration-150 bg-primary")}>
      <Container className="flex justify-between h-full items-center">
        <div className="flex items-center space-x-3">
          <Link href="/dashboard">
            <span className={cn('font-display font-bold tracking-wide transition-colors duration-150 text-xl text-white')}>
              Survey<span className='text-secondary'>Mailer</span>
            </span>
          </Link>
        </div>
        <button
            onClick={onOpen}
            className={cn("sm:hidden p-1 focus:outline-none transition-colors duration-150 w-7 h-7 rounded-md bg-white")}
          >
            <div className={cn("w-5 h-0.5 relative before:transition-transform before:duration-150 after:transition-transform after:duration-150 before:absolute after:absolute before:w-full before:h-full after:w-full after:h-full after:bg-black before:bg-black before:left-0 after:left-0 before:-top-1.5 after:-bottom-1.5", {'before:rotate-0 bg-black after:rotate-0': !open, 'bg-white before:rotate-45 before:top-0 after:bottom-0 after:-rotate-45': open})} />
          </button>
        <nav className={cn("hidden sm:flex sm:space-x-6 sm:justify-end transition-colors duration-150 flex-1 text-white")}>
          <Link href="/dashboard/fund" className="text-inherit hover:text-secondary" >Add Credits</Link>
          <Link href="/auth/signin" className="text-inherit hover:text-secondary">Logout</Link>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
