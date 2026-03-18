import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiUser, FiZap } from "react-icons/fi";
import Button from "../components/common/Button";

export default function CreateProfile() {
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(null);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState(null);

  // 🔒 Disable scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleSubmit = () => {
    console.log({ avatar, bio, skills, resume });

    // 👉 later send to backend

    navigate("/"); // go to home
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-12">

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-200/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative w-full max-w-sm sm:max-w-md">

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-xl shadow-indigo-100/40 px-5 sm:px-7 py-7 sm:py-8">

          {/* Logo */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-300/50">
              <FiZap className="text-white text-xl" />
            </div>

            <h1 className="text-xl font-black text-slate-800">
              Complete Your Profile
            </h1>
            <p className="text-sm text-slate-500 text-center">
              Let others know who you are 🚀
            </p>
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img src={avatar} className="w-full h-full object-cover" />
              ) : (
                <FiUser className="text-slate-400 text-2xl" />
              )}
            </div>

            <label className="text-sm text-indigo-600 cursor-pointer flex items-center gap-1">
              <FiUpload />
              Upload Avatar
              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  setAvatar(URL.createObjectURL(e.target.files[0]))
                }
              />
            </label>
          </div>

          {/* Bio */}
          <textarea
            placeholder="Write a short bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 mb-3"
          />

          {/* Skills */}
          <input
            type="text"
            placeholder="Skills (e.g. React, Node, AI)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 mb-3"
          />

          {/* Resume Upload */}
          <label className="flex items-center justify-between px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-pointer mb-4">
            <span>{resume ? resume.name : "Upload Resume"}</span>
            <FiUpload />
            <input
              type="file"
              className="hidden"
              onChange={(e) => setResume(e.target.files[0])}
            />
          </label>

          {/* Submit */}
          <Button onClick={handleSubmit} className="w-full">
            Continue →
          </Button>

        </div>
      </div>
    </div>
  );
}