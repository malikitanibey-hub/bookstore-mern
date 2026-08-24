import React from "react";
import { useCart } from "../auth/CartContext";
import { getBookImage } from "../utils/imageHelper";

function CartPage() {
  const { cart, updateCart, removeFromCart, message } = useCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-32">
        <p className="text-gray-500 text-lg text-center">
          🛒 Your Cart Is Empty
        </p>
      </div>
    );
  }

  return (
    <div className="mt-32 sm:mt-36 md:mt-44 min-h-screen px-4 sm:px-6 md:px-10 pb-10">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-semibold my-5">
          My Cart
        </h3>

        {message && (
          <div className="mb-5 rounded-lg bg-red-100 border border-red-300 text-red-700 px-4 py-3 text-center text-sm sm:text-base">
            {message}
          </div>
        )}

        <div className="space-y-4">
          {cart?.items?.map((item) => (
            <div
              key={item?.book?._id}
              className="border rounded-lg p-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                
                {/* Book Image */}
                <img
                  src={getBookImage(item?.book?.coverImage)}
                  alt={item?.book?.title}
                  className="rounded w-24 h-32 sm:w-24 sm:h-32 object-cover mx-auto sm:mx-0"
                />

                {/* Book Information */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h2 className="font-semibold text-lg truncate">
                    {item?.book?.title}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {item?.book?.author}
                  </p>

                  <p className="text-[#F86D72] font-bold mt-1">
                    ${Number(item?.book?.price).toFixed(2)}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                    <button
                      className="w-8 h-8 border rounded disabled:opacity-50"
                      disabled={item?.quantity <= 1}
                      onClick={() =>
                        updateCart(
                          item?.book?._id,
                          item?.quantity - 1
                        )
                      }
                    >
                      -
                    </button>

                    <span className="min-w-6 text-center">
                      {item?.quantity}
                    </span>

                    <button
                      className="w-8 h-8 border rounded disabled:opacity-50"
                      onClick={() =>
                        updateCart(
                          item?.book?._id,
                          item?.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total + Delete */}
                <div className="flex sm:block items-center justify-between sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0">
                  <p className="text-[#F86D72] font-semibold">
                    Total: $
                    {(item?.price * item?.quantity).toFixed(2)}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.book._id)}
                    className="text-sm text-red-500 hover:text-red-700 mt-0 sm:mt-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CartPage;