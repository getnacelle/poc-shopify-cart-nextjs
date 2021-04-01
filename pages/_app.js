import React, { useState } from "react";
import Head from "next/head";

import "~/styles.css";
import { Layout } from "~/components";
import { CartContext } from "~/context";

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState(null);
  return (
    <CartContext.Provider value={{ cart, setCart }}>
      <Head>
        <title>Proof of Concept</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartContext.Provider>
  );
}
