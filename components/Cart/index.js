import React, { useEffect } from "react";
import Image from "next/image";
import { formatCurrency } from "@nacelle/react-dev-utils";

import { useCart, useDetectDevice } from "hooks";
import styles from "./Cart.module.css";

const Cart = () => {
  const { cart, fetchCart } = useCart();
  const { isMobile } = useDetectDevice();

  useEffect(() => {
    if (!cart || !Object.keys(cart).length) {
      fetchCart();
    }
  }, [cart]);

  return (
    <div className={styles.cart}>
      <header>
        <h4>SubTotal:</h4>
        <div>{calculateSubTotal(cart)}</div>
        <div className={styles.checkout}></div>

        <h3>Your Cart</h3>
      </header>
      <section>
        {cart &&
          cart.items &&
          cart.items.map((item) => (
            <CartItem item={item} key={item.id} isMobile={isMobile} />
          ))}
      </section>
    </div>
  );
};

const CartItem = ({ item }) => {
  const { removeFromCart } = useCart();
  const cartLocale = window.navigator.language;
  const cartCurrency = "USD";
  const formatPrice = formatCurrency(cartLocale, cartCurrency);

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

function calculateSubTotal(cart) {
  const cartLocale = window.navigator.language;
  const cartCurrency = cart && cart.currency ? cart.currency : "USD";
  const formatPrice = formatCurrency(cartLocale, cartCurrency);

  const total =
    cart && cart.items
      ? cart.items.reduce((subTotal, item) => {
          const itemTotal = (item.quantity * parseInt(item.price, 10)) / 100;
          return subTotal + itemTotal;
        }, 0)
      : 0;

  return formatPrice(total);
}

export default Cart;
