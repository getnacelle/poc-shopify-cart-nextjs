import React from "react";
import { useCart } from "@nacelle/react-hooks";

import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const [, cartActions] = useCart();
  const lineItem = { ...product, variant: product.variants[0], quantity: 1 };

  return (
    <div className={`product-card ${styles.card}`}>
      <h2>{product.title}</h2>
      <img src={product.featuredMedia.src} className={styles.image} />
      <button
        className={styles.button}
        onClick={() => cartActions.addToCart(lineItem)}
      >
        Add to Cart
      </button>
    </div>
  );
}
