import React, { useState } from "react";
import { useCart } from "../auth/CartContext";

function CartPage() {
  const { cart, updateCart, removeFromCart, message } = useCart();

  if (!cart || cart.items.length === 0) {
    <div className="min-h-screen flex items-center justify-center mt-48">
      <p className="text-gray-500 text-lg">🛒 Your Cart Is Empty</p>
    </div>;
  }

  return (
    <div className="mt-44 min-h-screen p-10 ">
      <h3 className="my-5">My Cart</h3>

      {message && (
        <div className="mb-5 rounded-lg bg-red-100 border border-red-300 text-red-700 px-4 py-3 text-center">
          {message}
        </div>
      )}

      <div className="space-y-4">
        {cart?.items?.map((item) => (
          <div className="flex items-center gap-4 border rounded-lg p-4 shadow-sm">
            <img
              src={`${process.env.REACT_APP_API_URL}/images/${item?.book?.coverImage}`}
              className="rounded w-24 h-32 object-cover"
            />

            <div className="flex-1">
              <h2 className="font-semibold">{item?.book?.title}</h2>
              <p className="text-gray-500">{item?.book?.author}</p>
              <p className="text-[#F86D72] font-bold">{item?.book?.price}</p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  className="disabled:opacity-50"
                  disabled={item?.quantity <= 1}
                  onClick={() =>
                    updateCart(item?.book?._id, item?.quantity - 1)
                  }
                >
                  -
                </button>

                <span>{item?.quantity}</span>

                <button
                  className="disabled:opacity-50"
                  onClick={() =>
                    updateCart(item?.book?._id, item?.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-[#F86D72] text-right">
              <p>Total; ${(item?.price * item?.quantity).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item.book._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CartPage;
