import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated, loading } = useAuth();

  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/carts`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setCart(data.cart);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        setCart(null);
      });
  }, [isAuthenticated, loading]);

  const addToCart = async (bookId) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/carts/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ bookId }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Error adding book to cart");

        setTimeout(() => {
          setMessage("");
        }, 3000);

        return false;
      }

      setCart(data.cart);

      setMessage("Book added to your cart");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);

      setMessage("Error adding book to cart");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      return false;
    }
  };

  const updateCart = async (bookId, quantity) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/carts/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ bookId, quantity }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Error updating cart");

        setTimeout(() => {
          setMessage("");
        }, 3000);

        return false;
      }

      setCart(data.cart);

      return true;
    } catch (error) {
      console.error("Error updating cart:", error);

      setMessage("Error updating cart");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      return false;
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/carts/remove/${bookId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Error removing item");

        setTimeout(() => {
          setMessage("");
        }, 3000);

        return false;
      }

      setCart(data.cart);

      setMessage("Book removed from your cart");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      return true;
    } catch (error) {
      console.error("Error removing from cart:", error);

      setMessage("Error removing item");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCart,
        removeFromCart,
        message,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);