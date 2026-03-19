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

// ✅ IMPORT SERVICE
import { register, verifyOtp } from "../services/authService";

const passwordRules = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One number", test: (v) => /[0-9]/.test(v) },
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

  const strengthColors = ["bg-rose-400", "bg-amber-400", "bg-emerald-400"];

  // 🔥 REGISTER (FIXED)
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

  // 🔥 OTP INPUT (ENHANCED)
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // 🔥 VERIFY OTP (FIXED)
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

      // ✅ context login
      login(data.user, data.token);

      navigate("/create-profile");
    } catch (err) {
      setError(err.message || err.msg || "OTP failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="relative w-full max-w-md sm:max-w-lg">
        <div className="bg-white rounded-3xl shadow-xl px-6 py-8">
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

          {error && (
            <div className="mb-3 text-red-500 text-center">{error}</div>
          )}

          {step === 1 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input name="name" label="Full Name" icon={FiUser} value={form.name} onChange={handleChange} />
              <Input name="email" label="Email" icon={FiMail} value={form.email} onChange={handleChange} />
              <Input name="password" type={showPass ? "text" : "password"} label="Password" icon={FiLock} value={form.password} onChange={handleChange} />
              <Input name="confirm" type="password" label="Confirm Password" icon={FiLock} value={form.confirm} onChange={handleChange} />

              <Button type="submit" loading={loading}>
                Send OTP
              </Button>
            </form>
          )}

          <p className="text-center text-sm mt-5">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-600 cursor-pointer hover:underline"
            >
              Login →
            </span>
          </p>

          {step === 2 && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`} // ✅ FIXED (important)
                    value={d}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    maxLength={1}
                    className="w-10 h-10 border text-center"
                  />
                ))}
              </div>

              <Button onClick={handleVerifyOtp} loading={loading}>
                Verify OTP
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}