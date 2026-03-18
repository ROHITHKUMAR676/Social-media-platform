import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiZap,
} from "react-icons/fi";

import Input from "../components/common/Input";
import Button from "../components/common/Button";

const passwordRules = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One number", test: (v) => /[0-9]/.test(v) },
];

export default function Register() {
  const navigate = useNavigate();

  // ✅ SAFE API URL (prevents crash)
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // 🔐 Password strength
  const passStrength = passwordRules.filter((r) =>
    r.test(form.password)
  ).length;

  const strengthColors = ["bg-rose-400", "bg-amber-400", "bg-emerald-400"];

  // 🔥 REGISTER → SEND OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server not responding properly");
      }

      if (!res.ok) throw new Error(data.msg || "Registration failed");

      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 OTP input handler
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // 🔥 VERIFY OTP → LOGIN USER
  const handleVerifyOtp = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return setError("Enter valid OTP");

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          otp: finalOtp,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server not responding properly");
      }

      if (!res.ok) throw new Error(data.msg || "OTP failed");

      // ✅ Store token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/create-profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">

      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-violet-200/40 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

      <div className="relative w-full max-w-md sm:max-w-lg">

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-xl px-6 sm:px-8 py-8 sm:py-10">

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <FiZap className="text-white" />
            </div>

            <h1 className="mt-2 text-xl font-bold">
              Join <span className="text-indigo-600">SkillSphere</span>
            </h1>

            <p className="text-sm text-slate-500">
              {step === 1 ? "Create your account" : "Enter OTP"}
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <Input
                name="name"
                label="Full Name"
                icon={FiUser}
                value={form.name}
                onChange={handleChange}
                required
              />

              <Input
                name="email"
                label="Email"
                icon={FiMail}
                value={form.email}
                onChange={handleChange}
                required
              />

              {/* Password */}
              <div className="relative">
                <Input
                  name="password"
                  type={showPass ? "text" : "password"}
                  label="Password"
                  icon={FiLock}
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-[38px]"
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* Strength */}
              {form.password && (
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1.5 rounded-full ${
                        i < passStrength
                          ? strengthColors[passStrength - 1]
                          : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Confirm */}
              <Input
                name="confirm"
                type="password"
                label="Confirm Password"
                icon={FiLock}
                value={form.confirm}
                onChange={handleChange}
                required
              />

              <Button type="submit" loading={loading}>
                Send OTP
              </Button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="flex flex-col gap-5 items-center">

              <div className="flex gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    maxLength={1}
                    className="w-11 h-12 text-center text-lg border rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none"
                  />
                ))}
              </div>

              <Button onClick={handleVerifyOtp} loading={loading}>
                Verify OTP
              </Button>

              <button
                onClick={() => setStep(1)}
                className="text-xs text-gray-400"
              >
                ← Go back
              </button>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-sm mt-5">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-600 cursor-pointer"
            >
              Login →
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}