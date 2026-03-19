import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiMessageCircle,
  FiBookmark,
  FiShare2,
  FiMoreHorizontal,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function PostCard({ post, onDelete }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 🔥 BACKEND DATA FIX
  const {
    _id,
    content,
    image,
    createdAt,
    user: postUser,
    likes = [],
    comments = [],
  } = post;

  const isLikedInitially = likes.includes(user?.id);

  const [liked, setLiked] = useState(isLikedInitially);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // 🔥 OWNER CHECK
  const isOwner = postUser?._id === user?.id;

  // ❤️ REAL LIKE SYSTEM
  const handleLike = async () => {
    try {
      // optimistic UI
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

      await api.put(`/posts/${_id}/like`);
    } catch (err) {
      console.error("Like failed", err);

      // rollback
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  // 🗑 DELETE
  const handleDelete = () => {
    if (window.confirm("Delete this post?")) {
      onDelete?.(_id);
    }
  };

  return (
    <article className="bg-white/80 backdrop-blur-sm rounded-2xl border shadow-sm hover:shadow-md transition overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">

        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(`/profile/${postUser?.name}`)}
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden">
            <img
              src={postUser?.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <span className="text-sm font-bold">
              {postUser?.name}
            </span>
            <p className="text-xs text-slate-400">
              @{postUser?.name}
            </p>
          </div>
        </div>

        {/* OWNER MENU */}
        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-red-500 text-sm"
          >
            Delete
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div className="px-4 pb-3">
        <p className="text-sm text-slate-700">{content}</p>
      </div>

      {/* IMAGE */}
      {image && (
        <div className="mx-4 mb-3 rounded-xl overflow-hidden">
          <img src={image} className="w-full max-h-72 object-cover" />
        </div>
      )}

      <div className="mx-4 border-t" />

      {/* ACTIONS */}
      <div className="flex items-center justify-between px-4 py-3">

        <div className="flex items-center gap-2">

          {/* LIKE */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm ${
              liked
                ? "text-rose-500 bg-rose-50"
                : "text-slate-500 hover:bg-rose-50"
            }`}
          >
            <FiHeart className={liked ? "fill-rose-500" : ""} />
            {likeCount}
          </button>

          {/* COMMENTS */}
          <button
            onClick={() => setShowComments((p) => !p)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm text-slate-500 hover:bg-indigo-50"
          >
            <FiMessageCircle />
            {comments.length}
          </button>

          {/* SHARE */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
            className="px-3 py-1.5 text-slate-500 hover:bg-sky-50 rounded-xl"
          >
            <FiShare2 />
          </button>
        </div>

        {/* SAVE */}
        <button
          onClick={() => setSaved((p) => !p)}
          className={`p-2 rounded-xl ${
            saved ? "text-violet-600 bg-violet-50" : "text-slate-400"
          }`}
        >
          <FiBookmark className={saved ? "fill-violet-500" : ""} />
        </button>
      </div>

      {/* COMMENTS UI (keep simple) */}
      {showComments && (
        <div className="px-4 pb-4 text-sm text-slate-500">
          Comments coming soon 💬
        </div>
      )}
    </article>
  );
}