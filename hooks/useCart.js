import { useContext, useCallback } from "react";
import fetch from "isomorphic-unfetch";

import { CartContext } from "~/context";

export default function useCart() {
  const { cart, setCart: setCartContext } = useContext(CartContext);

  const setCart = useCallback((newCartData) => {
    setCartContext(newCartData);
  }, []);

  const fetchCart = useCallback(() => {
    // initialize or refresh the Shopify cart
    return fetch("/api/cart", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setCart(data))
      .catch((err) => err);
  }, []);

  const addToCart = useCallback((lineItem) => {
    const { quantity, variants } = lineItem;

    return fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "add",
        payload: {
          items: [
            {
              id: atob(variants[0].id).split("/").pop(),
              quantity,
            },
          ],
        },
      }),
    })
      .then((res) => res.json())
      .then(() => fetchCart());
  }, []);

  const removeFromCart = useCallback((lineItem) => {
    const updates = {};
    updates[lineItem.id] = 0;

    return fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update",
        payload: { updates },
      }),
    })
      .then((res) => res.json())
      .then((data) => setCart(data));
  }, []);

  return {
    cart,
    setCart,
    fetchCart,
    addToCart,
    removeFromCart,
  };
}
