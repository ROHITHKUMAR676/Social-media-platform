import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiZap,
} from "react-icons/fi";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

import { register, verifyOtp } from "../services/authService";

const passwordRules = [
  { label: "8+ characters", test: (v) => v.length >= 8 },
  { label: "Uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "Number", test: (v) => /[0-9]/.test(v) },
];

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

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

  const passStrength = passwordRules.filter((r) =>
    r.test(form.password)
  ).length;

  // 🔥 REGISTER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setStep(2);
    } catch (err) {
      setError(err.message || err.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 OTP INPUT
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  // 🔥 VERIFY OTP
  const handleVerifyOtp = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return setError("Enter valid OTP");

    setLoading(true);
    setError("");

    try {
      const data = await verifyOtp({
        email: form.email,
        otp: finalOtp,
      });

      login(data.user, data.token);
      navigate("/create-profile");
    } catch (err) {
      setError(err.message || err.msg || "OTP failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-xl px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12 transition-all">

          {/* 🔥 BRAND */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
              <FiZap className="text-white text-xl sm:text-2xl" />
            </div>

            <h1 className="mt-2 text-lg sm:text-xl lg:text-2xl font-black text-slate-800">
              Join <span className="text-indigo-600">DevConnect</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-500">
              {step === 1 ? "Create your account" : "Verify your email"}
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg text-center border border-red-100">
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">

              <Input name="name" label="Full Name" icon={FiUser} value={form.name} onChange={handleChange} />
              <Input name="email" label="Email" icon={FiMail} value={form.email} onChange={handleChange} />
              <Input name="password" type={showPass ? "text" : "password"} label="Password" icon={FiLock} value={form.password} onChange={handleChange} />
              <Input name="confirm" type="password" label="Confirm Password" icon={FiLock} value={form.confirm} onChange={handleChange} />

              {/* 🔥 PASSWORD STRENGTH */}
              <div className="flex gap-1 mt-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${
                      passStrength > i
                        ? ["bg-red-400", "bg-yellow-400", "bg-green-500"][i]
                        : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              <Button type="submit" loading={loading}>
                Send OTP
              </Button>
            </form>
          )}

          {/* LOGIN LINK */}
          <p className="text-center text-xs sm:text-sm mt-5 text-slate-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-600 cursor-pointer hover:underline font-medium"
            >
              Login →
            </span>
          </p>

          {/* STEP 2 OTP */}
          {step === 2 && (
            <div className="flex flex-col items-center gap-5 mt-4">

              <div className="flex gap-2 sm:gap-3">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    value={d}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    maxLength={1}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border text-center text-lg font-semibold focus:ring-2 focus:ring-indigo-300 outline-none"
                  />
                ))}
              </div>

              <Button onClick={handleVerifyOtp} loading={loading}>
                Verify OTP
              </Button>

              <p className="text-xs text-slate-400">
                Didn’t receive OTP? Try again
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}