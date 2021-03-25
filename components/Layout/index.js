import React from "react";

const Cart = dynamic(() => import("~/components/Cart"), { ssr: false });
import dynamic from "next/dynamic";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  return (
    <>
      <div className={styles.header}>
        <h1 className="app">Proof of Concept: Some Cool Feature</h1>
      </div>
      <Cart className={styles.cart} css={{ position: "fixed" }} />
      <main>{children}</main>
    </>
  );
}
