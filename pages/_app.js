import React from "react";
import Head from "next/head";
import { CartProvider } from "@nacelle/react-hooks";

import "~/styles.css";
import { Layout } from "~/components";

export default function App({ Component, pageProps }) {
  return (
    <CartProvider useLocalStorage>
      <Head>
        <title>Proof of Concept</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartProvider>
  );
}
