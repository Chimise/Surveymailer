import React from "react";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import { Provider } from "react-redux";
import store from "../store";
import Auth from "../components/common/Auth";
import "../styles/globals.css";

type Component = {
  getLayout?: (children: React.ReactNode) => JSX.Element;
  isAuth?: boolean;
} & NextPage;

type App = {
  Component: Component;
} & AppProps;

const defaultLayout = (children: React.ReactNode) => children;

export default function App({ Component, pageProps }: App) {
  const getLayout = Component.getLayout || defaultLayout;
  const isAuth = Component.isAuth;
  return (
    <Provider store={store}>
      {isAuth ? <Auth>
      {getLayout(<Component {...pageProps} />)}
      </Auth> : getLayout(<Component {...pageProps} />)}
    </Provider>
  );
}
