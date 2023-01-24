import React, { useState } from "react";
import MobileDrawer from "../DashboardMobileDrawer";
import Header from "../DashboardHeader";
import Container from "../../ui/Container";



interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isVisible, setIsVisible] = useState(false);

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
      <Header open={isVisible} onOpen={toggleOpenHandler} />
      <div className="h-px min-h-screen flex flex-col overflow-x-hidden bg-slate-100 overflow-y-auto">
        <div className="h-14 w-full"/>
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