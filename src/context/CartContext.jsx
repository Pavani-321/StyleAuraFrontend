import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "./AuthContextContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { token } = useContext(AuthContext);

  // Memoized fetchCartFromBackend to avoid useEffect dependency warning
  const fetchCartFromBackend = useCallback(async () => {
    try {
      const res = await fetch('https://localhost:7216/api/Cart/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setCart(Array.isArray(data) ? data : []);
      } else if (res.status === 401) {
        setCart([]);
      }
    } catch (err) {
      console.error('Failed to fetch cart from backend', err);
    }
  }, [token]);

  // Fetch cart from backend on mount and when token changes
  useEffect(() => {
    if (token) fetchCartFromBackend();
    else setCart([]);
  }, [token, fetchCartFromBackend]);

  // Add to cart (now uses /api/Cart/add)
  const addToCart = async (product, quantity = 1) => {
    if (!token) return;
    try {
      await fetch('https://localhost:7216/api/Cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.productID, quantity }),
        credentials: 'include',
      });
      await fetchCartFromBackend();
    } catch (err) {
      console.error('Failed to sync cart with backend', err);
    }
  };

  // Remove from cart
  const removeFromCart = async (id) => {
    if (!token) return;
    try {
      await fetch(`https://localhost:7216/api/Cart/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });
      await fetchCartFromBackend();
    } catch (err) {
      console.error('Failed to remove item from backend cart', err);
    }
  };

  // Change quantity using PUT /api/Cart/{productId}
  const changeQuantity = async (id, delta) => {
    if (!token) return;
    const item = cart.find((item) => item.productID === id);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + delta);
    try {
      await fetch(`https://localhost:7216/api/Cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity }),
        credentials: 'include',
      });
      await fetchCartFromBackend();
    } catch (err) {
      console.error('Failed to update item quantity in backend cart', err);
    }
  };

  // Clear cart (local only)
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, changeQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};