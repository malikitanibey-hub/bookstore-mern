import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, X } from "lucide-react";

function LoginRequiredPopup({ onClose }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleSignup = () => {
    onClose();
    navigate("/signup");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-[#e95d63] hover:text-slate-100"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1f1]">
          <Lock size={26} className="text-[#F86D72]" />
        </div>

        {/* Content */}
        <div className="mt-4 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Login Required
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Please login or create an account to continue.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleLogin}
            className="w-full rounded-lg bg-[#F86D72] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#e95d63]"
          >
            Login
          </button>

          <button
            type="button"
            onClick={handleSignup}
            className="w-full rounded-lg border border-[#F86D72] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#e95d63]"
          >
            Create Account
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-sm text-white transition hover:text-slate-100"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}

export default LoginRequiredPopup;