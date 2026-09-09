import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("md_cart") || "[]");
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("md_cart", JSON.stringify(cart));
    } catch {
      /* storage unavailable */
    }
  }, [cart]);

  const addItem = (item) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (i) => i.product_id === item.product_id && i.weight === item.weight
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
        return next;
      }
      return [...prev, item];
    });
    setIsOpen(true);
  };

  const updateQty = (product_id, weight, delta) => {
    setCart((prev) =>
      prev.map((i) =>
        i.product_id === product_id && i.weight === weight
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i
      )
    );
  };

  const removeItem = (product_id, weight) => {
    setCart((prev) =>
      prev.filter((i) => !(i.product_id === product_id && i.weight === weight))
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const count = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addItem, updateQty, removeItem, clearCart, total, count, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);