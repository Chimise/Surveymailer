import React from 'react';
import type { AppProps } from 'next/app'
import { NextPage } from 'next';
import '../styles/globals.css'

type Component = {
  getLayout?: (children: React.ReactNode) => JSX.Element;
} & NextPage;

type App = {
  Component: Component
} & AppProps;

export default function App({ Component, pageProps }: App) {
  const defaultLayout = (children: React.ReactNode) => children;
  const getLayout = Component.getLayout || defaultLayout;
  return getLayout(<Component {...pageProps} />);
}
