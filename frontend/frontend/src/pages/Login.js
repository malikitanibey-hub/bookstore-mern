import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const result = await login(form);
      if (!result.success) throw new Error(result.error || "Login failed");

      const data = result.data;
      const role = data?.role || data?.user?.role || "user";
      const redirect = data?.redirect || (role === "admin" ? "/admin" : "/");

      navigate(redirect, { replace: true });
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 pt-32 sm:pt-36 md:pt-40">
      <div className="w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <form
          onSubmit={onSubmit}
          className="space-y-4 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>

            <input
              className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#F86D72]"
              placeholder="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((s) => ({ ...s, email: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>

            <div className="relative">
              <input
                className="w-full border border-slate-300 p-3 pr-11 rounded-lg outline-none focus:ring-2 focus:ring-[#F86D72]"
                placeholder="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm((s) => ({ ...s, password: e.target.value }))
                }
              />

              <a
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </a>
            </div>
          </div>

          {err && <p className="text-red-500 text-sm">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F86D72] text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
