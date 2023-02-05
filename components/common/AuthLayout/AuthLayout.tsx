import React from "react";
import Link from "next/link";
import Alert from "../../ui/Alert";
import useAlert from "../../../hooks/useAlert";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { handleDismissAlert, show, type, message, timeout } = useAlert();
  return (
    <>
      <Alert
        onDismiss={handleDismissAlert}
        show={show}
        type={type}
        message={message!}
        timeout={timeout}
      />
      <div className="flex flex-col w-screen h-screen">
        <header className="h-14 w-full p-2 bg-primary flex justify-center items-center">
          <Link href="/">
            <span className="font-display font-bold tracking-wide text-white transition-colors duration-150 text-xl">
              Survey<span className="text-secondary">Mailer</span>
            </span>
          </Link>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
};

export default AuthLayout;
