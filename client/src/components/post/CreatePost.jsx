import { useState, useRef } from "react";
import { FiImage, FiSend, FiX, FiSmile } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function CreatePost({ onCreatePost }) {
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !preview) return;

    try {
      setLoading(true);

      // 🔥 Optimistic UI (instant post)
      const tempPost = {
        _id: Date.now(),
        user: {
          name: user?.name,
          username: user?.username,
          avatar: user?.avatar,
        },
        content,
        image: preview,
        createdAt: new Date(),
      };

      onCreatePost(tempPost);

      // 🔥 Send to backend
      const res = await api.post("/posts", {
        content,
        image: preview, // (later replace with upload logic)
      });

      // Optional: replace temp post with real one (advanced)
      // for now, optimistic UI is enough

      setContent("");
      setPreview(null);
    } catch (err) {
      console.error("Post failed", err);
    } finally {
      setLoading(false);
    }
  };

  const charLimit = 280;
  const remaining = charLimit - content.length;
  const nearLimit = remaining <= 30;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border shadow-sm p-4">

      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">

          {/* 🔥 USER AVATAR */}
          <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-indigo-200 shrink-0 mt-0.5">
            <img
              src={user?.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=user"}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={charLimit}
              placeholder="Share something with DevConnect…"
              rows={3}
              className="w-full resize-none bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
            />

            {/* 🔥 IMAGE PREVIEW */}
            {preview && (
              <div className="relative mt-2 rounded-xl overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white flex items-center justify-center rounded-full"
                >
                  <FiX />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="border-t mt-3 mb-3" />

        <div className="flex items-center justify-between">

          {/* LEFT ACTIONS */}
          <div className="flex items-center gap-1">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="w-8 h-8 text-slate-400 hover:text-indigo-600"
            >
              <FiImage />
            </button>

            <button
              type="button"
              className="w-8 h-8 text-slate-400 hover:text-amber-500"
            >
              <FiSmile />
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {content.length > 0 && (
              <span
                className={`text-xs ${
                  nearLimit ? "text-rose-500" : "text-slate-400"
                }`}
              >
                {remaining}
              </span>
            )}

            <button
              type="submit"
              disabled={loading || (!content.trim() && !preview)}
              className="px-4 py-2 text-sm bg-indigo-500 text-white rounded-xl disabled:opacity-40 flex items-center gap-1"
            >
              <FiSend />
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}