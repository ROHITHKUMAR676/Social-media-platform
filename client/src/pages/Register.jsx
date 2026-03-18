import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiZap,
  FiCheck,
  FiX,
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

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1); // 🔥 STEP CONTROL (1=form, 2=OTP)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [otp, setOtp] = useState("");

  const [touched, setTouched] = useState({});

  // 🔒 Disable scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleBlur = (e) =>
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));

  const errors = {
    name: touched.name && !form.name.trim() ? "Name is required" : "",
    email:
      touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        ? "Enter a valid email"
        : "",
    confirm:
      touched.confirm && form.password !== form.confirm
        ? "Passwords don't match"
        : "",
  };

  const passStrength = passwordRules.filter((r) =>
    r.test(form.password)
  ).length;

  const strengthColors = ["bg-rose-400", "bg-amber-400", "bg-emerald-400"];

  // 🔥 STEP 1 SUBMIT → SEND OTP
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep(2); // 👉 move to OTP step
    }, 1200);
  };

  // 🔥 OTP VERIFY
  const handleVerifyOtp = () => {
    if (otp.length !== 6) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      console.log("Registered:", form);

      // 👉 NEXT STEP (later)
      // navigate("/create-profile")
      navigate("/create-profile");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-12">

      {/* Blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-violet-200/40 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative w-full max-w-sm sm:max-w-md">

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-xl shadow-violet-100/40 px-5 sm:px-7 py-7 sm:py-8">

          {/* Logo */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-300/50">
              <FiZap className="text-white text-xl" />
            </div>

            <div className="text-center">
              <h1 className="text-xl font-black text-slate-800 tracking-tight">
                Join <span className="text-indigo-600">SkillSphere</span>
              </h1>
              <p className="text-sm text-slate-500">
                {step === 1
                  ? "Start your skill journey today"
                  : "Enter OTP sent to your email"}
              </p>
            </div>
          </div>

          {/* 🔥 STEP 1: FORM */}
          {step === 1 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <Input
                id="name"
                name="name"
                label="Full Name"
                icon={FiUser}
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
              />

              <Input
                id="email"
                name="email"
                label="Email"
                icon={FiMail}
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
              />

              {/* Password */}
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  label="Password"
                  icon={FiLock}
                  value={form.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-[38px] text-slate-400"
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

              <Input
                id="confirm"
                name="confirm"
                type="password"
                label="Confirm Password"
                icon={FiLock}
                value={form.confirm}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirm}
              />

              <Button type="submit" loading={loading}>
                Send OTP
              </Button>
            </form>
          )}

          {/* 🔥 STEP 2: OTP */}
          {step === 2 && (
            <div className="flex flex-col gap-4">

              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="text-center tracking-[8px] text-lg px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />

              <Button onClick={handleVerifyOtp} loading={loading}>
                Verify & Continue
              </Button>

              <button
                onClick={() => setStep(1)}
                className="text-xs text-slate-400"
              >
                ← Edit details
              </button>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-indigo-600"
            >
              Sign in →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}