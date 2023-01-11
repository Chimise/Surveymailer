import React, { useState, useRef } from "react";
import MobileDrawer from "../MobileDrawer";
import Header from "../Header";
import Container from "../Container";
import usePresence from "../../../hooks/usePresence";


interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isElementVisible = usePresence(ref);

  const toggleOpenHandler = () => {
    console.log("It is working");
    setIsVisible(!isVisible);
  };

  const closeHandler = () => {
    setIsVisible(false);
  };

  const year = new Date().getFullYear();

  return (
    <>
      <MobileDrawer onClose={closeHandler} open={isVisible} />
      <Header hasScrolled={!isElementVisible} open={isVisible} onOpen={toggleOpenHandler} />
      <div className="min-h-screen flex flex-col overflow-x-hidden overflow-y-auto">
        <div className="h-14 w-full" ref={ref} />
        <main className="flex-1">{children}</main>
        <footer className="my-8">
          <Container className="space-y-2 text-center">
            <hr className="bg-slate-800/60" />
            <div className="text-slate-800">
              &copy; {year} Chisom Promise. All rights reserved{" "}
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
};

export default Layout;