import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useAppDispatch, RootState } from "../../../store";
import { loginOnMount } from "../../../store/auth";
import Loading from "../Loading";

interface AuthProps {
  children: React.ReactNode;
}
const Auth = ({ children }: AuthProps) => {
  const dispatch = useAppDispatch();
  const { push, isReady } = useRouter();
  const { error, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token) {
      dispatch(loginOnMount());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (error && !token && isReady) {
      push("/auth/signin");
    }
  }, [error, token, push, isReady]);

  if (!error && !token) {
    return <Loading size="lg" />;
  }

  if (error) {
    return <Loading size="lg" />;
  }

  return <>{children}</>;
};

export default Auth;
