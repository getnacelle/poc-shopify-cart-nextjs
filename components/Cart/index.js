import React, { useEffect } from "react";
import Image from "next/image";
import { formatCurrency } from "@nacelle/react-dev-utils";

import { useCart, useDetectDevice } from "hooks";
import styles from "./Cart.module.css";

const Cart = () => {
  const { cart, fetchCart } = useCart();
  const { isMobile } = useDetectDevice();
  const cartLocale = window.navigator.language;
  const cartCurrency = (cart && cart.currency) || "USD";
  const formatPrice = formatCurrency(cartLocale, cartCurrency);
  const subtotal =
    cart && cart.total_price && formatPrice(cart.total_price / 100);

  useEffect(() => {
    if (!cart || !Object.keys(cart).length) {
      fetchCart();
    }
  }, [cart]);

  return (
    <div className={styles.cart}>
      <header>
        <h4>SubTotal:</h4>
        <div>{subtotal}</div>
        <div className={styles.checkout}></div>

        <h3>Your Cart</h3>
      </header>
      <section>
        {cart &&
          cart.items &&
          cart.items.map((item) => (
            <CartItem
              item={item}
              key={item.id}
              isMobile={isMobile}
              formatPrice={formatPrice}
            />
          ))}
      </section>
    </div>
  );
};

const CartItem = ({ item, formatPrice }) => {
  const { removeFromCart } = useCart();

  return (
    <div className={styles.item}>
      <Image src={item.image} width="100" height="70" />
      <div>
        <div className={styles.price}>{formatPrice(item.price / 100)}</div>
        <button onClick={() => removeFromCart(item)}>Remove</button>
      </div>
    </div>
  );
};

export default Cart;
