import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiUpload, FiUser, FiZap, FiArrowLeft } from "react-icons/fi";
import Button from "../components/common/Button";
import api from "../services/api"; // ✅ USE API

export default function CreateProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const isEdit = location.state?.edit || false;

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [avatar, setAvatar] = useState(storedUser.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [form, setForm] = useState({
    username: storedUser.name || "", // ✅ FIXED
    bio: storedUser.bio || "",
    skills: storedUser.skills || "",
    location: storedUser.location || "",
    github: storedUser.github || "",
    linkedin: storedUser.linkedin || "",
    college: storedUser.college || "",
    school: storedUser.school || "",
    year: storedUser.year || "",
  });

  const [resume, setResume] = useState(null);
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

      // 🔥 MAP username → name
      formData.append("name", form.username);

      Object.entries(form).forEach(([k, v]) => {
        if (k !== "username") formData.append(k, v);
      });

      if (avatarFile) formData.append("avatar", avatarFile);
      if (resume) formData.append("resume", resume);

      // ✅ FIXED API CALL
      const res = await api.post("/users/profile", formData);

      // 🔥 Update local user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-start justify-center px-3 py-6">

      <div className="relative w-full max-w-md">

        <div className="bg-white/90 rounded-3xl shadow-xl px-6 py-8">

          {isEdit && (
            <button
              onClick={() => setShowDiscard(true)}
              className="flex items-center gap-1 text-sm mb-4 text-slate-600"
            >
              <FiArrowLeft />
              Back
            </button>
          )}

          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <FiZap className="text-white" />
            </div>

            <h1 className="text-xl font-black">
              {isEdit ? "Edit Profile" : "Complete Your Profile"}
            </h1>

            <p className="text-sm text-slate-500 text-center">
              {isEdit
                ? "Update your details"
                : "Let others know who you are 🚀"}
            </p>
          </div>

          {/* AVATAR */}
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img src={avatar} className="w-full h-full object-cover" />
              ) : (
                <FiUser className="text-slate-400 text-2xl" />
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

          {/* FORM */}
          {[
            { name: "username", placeholder: "Username *" },
            { name: "college", placeholder: "College *" },
            { name: "year", placeholder: "Year *" },
            { name: "school", placeholder: "School (optional)" },
            { name: "location", placeholder: "Location" },
            { name: "github", placeholder: "GitHub URL" },
            { name: "linkedin", placeholder: "LinkedIn URL" },
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border mb-3"
            />
          ))}

          <textarea
            name="bio"
            placeholder="Bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border mb-3"
          />

          <input
            name="skills"
            placeholder="Skills"
            value={form.skills}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border mb-3"
          />

          <Button onClick={handleSubmit} loading={loading} className="w-full">
            {isEdit ? "Save Changes" : "Continue →"}
          </Button>
        </div>
      </div>

      {/* DISCARD */}
      {showDiscard && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-80 text-center">
            <h2 className="font-bold mb-2">Discard changes?</h2>
            <p className="text-sm text-slate-500 mb-4">
              Your changes will be lost
            </p>

            <div className="flex gap-2">
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