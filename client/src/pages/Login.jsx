import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiZap,
} from "react-icons/fi";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { login as loginUser } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(form);
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-xl px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12 transition-all">

          {/* 🔥 BRAND */}
          <div className="flex flex-col items-center gap-2 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
              <FiZap className="text-white text-xl sm:text-2xl" />
            </div>

            <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-800">
              Dev<span className="text-indigo-600">Connect</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-500">
              Welcome back 👋
            </p>
          </div>

          {/* 🔥 ERROR */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg text-center border border-red-100">
              {error}
            </div>
          )}

          {/* 🔥 FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">

            <Input
              name="email"
              type="email"
              label="Email"
              icon={FiMail}
              value={form.email}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                icon={FiLock}
                value={form.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-slate-500 hover:text-indigo-600 transition"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <Button type="submit" loading={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* 🔥 FOOTER */}
          <p className="text-center text-xs sm:text-sm mt-6 text-slate-600">
            No account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-indigo-600 font-medium hover:underline"
            >
              Create one →
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}