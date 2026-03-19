import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiUpload, FiUser, FiZap, FiArrowLeft } from "react-icons/fi";
import Button from "../components/common/Button";
import api from "../services/api";

export default function CreateProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const isEdit = location.state?.edit || false;

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [avatar, setAvatar] = useState(storedUser.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [form, setForm] = useState({
    username: storedUser.username || "",
    bio: storedUser.bio || "",
    skills: storedUser.skills || "",
    location: storedUser.location || "",
    github: storedUser.github || "",
    linkedin: storedUser.linkedin || "",
    college: storedUser.college || "",
    school: storedUser.school || "",
    year: storedUser.year || "",
  });

  const [loading, setLoading] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.username || !form.college || !form.year) {
      return alert("Please fill required fields");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.username);

      Object.entries(form).forEach(([k, v]) => {
        if (k !== "username") formData.append(k, v);
      });

      if (avatarFile) formData.append("avatar", avatarFile);

      await api.put("/users/profile", formData);

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-4 py-8">

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

        {/* 🔥 LEFT PANEL (DESKTOP ONLY FEEL) */}
        <div className="bg-white/90 rounded-3xl shadow-xl p-6 flex flex-col items-center justify-center text-center">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4">
            <FiZap className="text-white text-xl" />
          </div>

          <h1 className="text-xl font-black">
            {isEdit ? "Edit Profile" : "Welcome to DevConnect"}
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Build your developer identity 🚀
          </p>

          {/* AVATAR */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img src={avatar} className="w-full h-full object-cover" />
              ) : (
                <FiUser className="text-slate-400 text-3xl" />
              )}
            </div>

            <label className="text-sm text-indigo-600 cursor-pointer flex gap-1">
              <FiUpload /> Upload Avatar
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setAvatarFile(file);
                  setAvatar(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
        </div>

        {/* 🔥 FORM PANEL */}
        <div className="bg-white/90 rounded-3xl shadow-xl p-6">

          {isEdit && (
            <button
              onClick={() => setShowDiscard(true)}
              className="flex items-center gap-1 text-sm mb-4 text-slate-600"
            >
              <FiArrowLeft />
              Back
            </button>
          )}

          <div className="flex flex-col gap-4">

            <input name="username" placeholder="Username *" value={form.username} onChange={handleChange} className="input" />
            <input name="college" placeholder="College *" value={form.college} onChange={handleChange} className="input" />
            <input name="year" placeholder="Year *" value={form.year} onChange={handleChange} className="input" />

            <input name="school" placeholder="School" value={form.school} onChange={handleChange} className="input" />
            <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="input" />
            <input name="github" placeholder="GitHub URL" value={form.github} onChange={handleChange} className="input" />
            <input name="linkedin" placeholder="LinkedIn URL" value={form.linkedin} onChange={handleChange} className="input" />

            <textarea name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} className="input" />
            <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} className="input" />

            <Button onClick={handleSubmit} loading={loading}>
              {isEdit ? "Save Changes" : "Continue →"}
            </Button>

          </div>
        </div>

      </div>

      {/* DISCARD */}
      {showDiscard && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-80 text-center">
            <h2 className="font-bold mb-2">Discard changes?</h2>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowDiscard(false)}
                className="flex-1 py-2 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-2 bg-red-500 text-white rounded-xl"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}