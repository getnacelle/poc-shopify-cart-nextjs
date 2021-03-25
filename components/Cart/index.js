import React, { useEffect } from "react";
import Image from "next/image";
import { useCheckout, useCart } from "@nacelle/react-hooks";
import { formatCurrency } from "@nacelle/react-dev-utils";

import useDetectDevice from "hooks/useDetectDevice";
import styles from "./Cart.module.css";

const checkoutCredentials = {
  nacelleSpaceId: process.env.NACELLE_SPACE_ID,
  nacelleGraphqlToken: process.env.NACELLE_GRAPHQL_TOKEN,
};

const Cart = () => {
  const [{ cart }, cartActions] = useCart();
  const { isMobile } = useDetectDevice();
  const [checkoutData, checkout, isCheckingOut] = useCheckout(
    checkoutCredentials,
    cart
  );

  useEffect(() => {
    if (checkoutData) {
      const { processCheckout } = checkoutData.data;
      window.location = processCheckout.url;
    }
  }, [checkoutData]);

  return (
    <div className={styles.cart}>
      <header>
        <h4>SubTotal:</h4>
        <div>{calculateSubTotal(cart)}</div>
        <div className={styles.checkout}>
          <button onClick={checkout} disabled={!cart.length || isCheckingOut}>
            {isCheckingOut ? "Processing Cart..." : "Checkout"}
          </button>
        </div>

        <h3>Your Cart</h3>
      </header>
      <section>
        {cart.map((item) => (
          <CartItem
            item={item}
            key={item.id}
            cartActions={cartActions}
            isMobile={isMobile}
          />
        ))}
      </section>
    </div>
  );
};

const CartItem = ({ item, cartActions, isMobile }) => {
  const formatPrice = formatCurrency(item.locale, item.priceCurrency);

  const removeItemFromCart = () => cartActions.removeFromCart(item);

  return (
    <div className={styles.item}>
      <Image src={item.image.thumbnailSrc} width="100" height="70" />

      <div>
        {/* <div>
          <h4>{item.title}</h4>
          <span className={styles.price}>{formatPrice(item.price)}</span>
        </div> */}

        <div>
          <div className={styles.price}>{formatPrice(item.price)}</div>
          <button onClick={removeItemFromCart}>Remove</button>
        </div>
      </div>
    </div>
  );
};

function calculateSubTotal(cart) {
  const cartLocale = cart.length ? cart[0].locale : "en-us";
  const cartCurrency = cart.length ? cart[0].priceCurrency : "USD";
  const formatPrice = formatCurrency(cartLocale, cartCurrency);

  const total = cart.reduce((subTotal, item) => {
    const itemTotal = item.quantity * parseInt(item.price, 10);
    return subTotal + itemTotal;
  }, 0);

  return formatPrice(total);
}

export default Cart;
