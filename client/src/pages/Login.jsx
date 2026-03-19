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

// ✅ IMPORT SERVICE
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

      // ✅ context login
      login(data.user, data.token);

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || err.msg || "Login failed");
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
      <div className="relative w-full max-w-md sm:max-w-lg">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-xl px-6 sm:px-8 py-8 sm:py-10">

          <div className="flex flex-col items-center gap-2 mb-7">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <FiZap className="text-white text-xl" />
            </div>

            <div className="text-center">
              <h1 className="text-xl font-black text-slate-800">
                Skill<span className="text-indigo-600">Sphere</span>
              </h1>
              <p className="text-sm text-slate-500">
                Welcome back 👋
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

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
                className="absolute right-3 top-[38px]"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <Button type="submit" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm mt-6">
            No account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-indigo-600"
            >
              Create one →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}