import React from "react";
import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/20/solid";
import cn from 'classnames';
import Link from "next/link";
import { useRouter } from "next/router";
import { useAppDispatch } from "../../../store";
import { logout } from "../../../store/auth";
import Container from "../../ui/Container";

interface HeaderProps {
  onOpen: () => void;
  open: boolean;
}

const Header = ({ onOpen, open}: HeaderProps) => {
  const router = useRouter()
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    await router.push('/auth/signin');
    dispatch(logout());
  }
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
          <Link href="/dashboard/surveys/create" className="text-inherit hover:text-secondary" >Create Survey</Link>
          <button onClick={handleLogout} className="text-inherit focus:outline-none hover:text-secondary">Logout</button>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
