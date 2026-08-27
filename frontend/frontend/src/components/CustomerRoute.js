import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function CustomerRoute({ children, page = "this page" }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until authentication is checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#F86D72] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Guest
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-32">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-3">Login Required</h2>

          <p className="text-gray-500 mb-6">
            Please login or create an account to access this page.
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={() =>
                (window.location.href = `/login?redirect=${encodeURIComponent(
                  location.pathname,
                )}`)
              }
              className="px-5 py-2 bg-[#F86D72] text-white rounded-lg hover:opacity-90"
            >
              Login
            </button>

            <button
              onClick={() => (window.location.href = "/signup")}
              className="px-5 py-2 border border-[#F86D72] text-white rounded-lg hover:bg-[#e95d63] "
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin
  if (user.role === "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-32">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-3">
            {page === "cart" ? "Cart Unavailable" : "Favorites Unavailable"}
          </h2>

          <p className="text-gray-500">
            Administrators cannot access the customer shopping features.
          </p>
        </div>
      </div>
    );
  }

  // Normal customer
  return children;
}

export default CustomerRoute;
