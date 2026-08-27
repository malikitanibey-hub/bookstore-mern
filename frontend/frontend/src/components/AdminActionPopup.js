import React from "react";
import { ShieldAlert, X } from "lucide-react";

function AdminActionPopup({ onClose, action = "this action" }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-[#e95d63]"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1f1]">
          <ShieldAlert size={26} className="text-[#F86D72]" />
        </div>

        {/* Content */}
        <div className="mt-4 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Action Unavailable
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Administrators cannot use {action}. This feature is only
            available for customer accounts.
          </p>
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-[#F86D72] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#e95d63]"
        >
          Okay
        </button>
      </div>
    </div>
  );
}

export default AdminActionPopup;