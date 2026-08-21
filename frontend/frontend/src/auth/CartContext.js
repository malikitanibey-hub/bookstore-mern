import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/carts`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCart(data.cart));
  }, []);

  const addToCart = async (bookId) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/carts/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ bookId }),
    });

    const data = await res.json();
    setCart(data.cart);
  };

  const updateCart = async (bookId, quantity) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/carts/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ bookId, quantity }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || "Error updating cart");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      return;
    }
    setCart(data.cart);
  };

  const removeFromCart = async (bookId) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/carts/remove/${bookId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || "Error removing item");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      return;
    }

    setCart(data.cart);

    setMessage("Book removed from your cart");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateCart, removeFromCart, message }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
