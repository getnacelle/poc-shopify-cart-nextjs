import React from "react";

import { useCart } from "~/hooks";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const lineItem = { ...product, variant: product.variants[0], quantity: 1 };
  const { addToCart } = useCart();

  return (
    <div className={`product-card ${styles.card}`}>
      <h2>{product.title}</h2>
      <img
        src={
          product.featuredMedia
            ? product.featuredMedia.src
            : product.featured_image.url
        }
        className={styles.image}
      />
      <button className={styles.button} onClick={() => addToCart(lineItem)}>
        Add to Cart
      </button>
    </div>
  );
}
