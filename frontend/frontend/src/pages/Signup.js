import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Signup() {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Register failed");

      const role = data?.role || "user";

      const redirect = data?.redirect || (role === "admin" ? "/admin" : "/");

      navigate("/");
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
        Sign Up
      </h1>

      <form
        onSubmit={onSubmit}
        className="space-y-4 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Name
          </label>

          <input
            className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#F86D72]"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm((s) => ({ ...s, name: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email
          </label>

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
          <label className="block text-sm font-medium mb-1">
            Password
          </label>

          <input
            className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#F86D72]"
            placeholder="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((s) => ({ ...s, password: e.target.value }))
            }
          />
        </div>

        {err && (
          <p className="text-red-500 text-sm">
            {err}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#F86D72] text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "..." : "Create account"}
        </button>
      </form>
    </div>
  </div>
);
}

export default Signup;
