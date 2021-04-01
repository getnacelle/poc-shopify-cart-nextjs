import { useContext, useCallback } from "react";
import { CartContext } from "~/context";

export default function useCart() {
  const { cart, setCart: setCartContext } = useContext(CartContext);

  const setCart = useCallback((newCartData) => {
    setCartContext(newCartData);
  }, []);

  const fetchCart = useCallback(() => {
    // initialize or refreshe the Shopify cart
    fetch("/api/cart", {
      mode: "cors",
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
    fetch("/api/cart", {
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

  const removeFromCart = useCallback(async (lineItem) => {
    const updates = {};
    updates[lineItem.id] = 0;

    await fetch("/api/cart", {
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
