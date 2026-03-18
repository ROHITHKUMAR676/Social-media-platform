import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiZap,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Login() {
  const navigate = useNavigate();

  // ✅ SAFE API URL (VERY IMPORTANT)
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server not responding properly");
      }

      if (!res.ok) {
        throw new Error(data.msg || "Login failed");
      }

      // ✅ Store JWT + user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Redirect
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleGithubLogin = () => {
    console.log("GitHub login clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-200/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative w-full max-w-md sm:max-w-lg">

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-xl shadow-indigo-100/40 px-6 sm:px-8 py-8 sm:py-10">

          {/* Logo */}
          <div className="flex flex-col items-center gap-2 mb-7">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-300/50">
              <FiZap className="text-white text-xl" />
            </div>

            <div className="text-center">
              <h1 className="text-xl font-black text-slate-800 tracking-tight">
                Skill<span className="text-indigo-600">Sphere</span>
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Welcome back 👋
              </p>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              icon={FiMail}
              value={form.email}
              onChange={handleChange}
              required
            />

            {/* Password */}
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="••••••••"
                icon={FiLock}
                value={form.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" size="lg" loading={loading} className="w-full mt-1">
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-3 my-5">
            <div className="flex-1 border-t border-slate-200" />
            <span className="text-xs text-slate-400 font-medium">
              or continue with
            </span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-2">

            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <FcGoogle className="text-lg" />
              Google
            </button>

            <button
              onClick={handleGithubLogin}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <FaGithub className="text-lg" />
              GitHub
            </button>

          </div>

          {/* Register */}
          <p className="text-center text-sm text-slate-500 mt-6">
            No account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Create one →
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}