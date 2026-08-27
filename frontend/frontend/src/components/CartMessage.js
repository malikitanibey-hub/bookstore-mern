import React from "react";
import { CheckCircle } from "lucide-react";
import { useCart } from "../auth/CartContext";

function CartMessage() {
  const { message } = useCart();

  if (!message) return null;

  return (
    <div className="fixed right-5 top-36 z-[9999] animate-[slideIn_0.3s_ease-out]">
      <div className="flex w-[320px] items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-xl">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
          <CheckCircle size={22} className="text-green-600" />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-800">
            Success
          </p>

          <p className="mt-0.5 text-sm text-gray-500">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartMessage;