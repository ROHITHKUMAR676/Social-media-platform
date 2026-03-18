import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiMessageCircle,
  FiBookmark,
  FiShare2,
  FiMoreHorizontal,
  FiZap,
} from "react-icons/fi";

export default function PostCard({ post, onDelete }) {
  const navigate = useNavigate();

  const {
    avatar,
    username,
    handle,
    time,
    content,
    image,
    likes: initialLikes = 0,
    comments = 0,
    tag,
  } = post;

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const [commentList, setCommentList] = useState([
    { id: 1, user: "john_doe", text: "🔥 This is awesome!" },
    { id: 2, user: "dev_girl", text: "Really helpful post 🙌" },
  ]);

  const [newComment, setNewComment] = useState("");

  // ✅ Only allow delete if current user
  const isOwner = handle === "you";

  // Like logic
  const handleLike = () => {
    setLiked((prev) => {
      const newLiked = !prev;
      setLikes((l) => (newLiked ? l + 1 : l - 1));
      return newLiked;
    });
  };

  // Delete logic
  const handleDelete = () => {
    if (window.confirm("Delete this post?")) {
      onDelete(post.id);
    }
  };

  return (
    <article className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:shadow-indigo-100/50 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">

      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(`/profile/${handle}`)}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-offset-1 ring-indigo-200">
              <img src={avatar} alt={username} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-800">
                {username}
              </span>
              {tag && (
                <span className="inline-flex items-center gap-0.5 text-[9px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-md">
                  <FiZap className="text-[8px]" />
                  {tag}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              @{handle} · {time}
            </p>
          </div>
        </div>

        {/* 3-dot menu (ONLY for owner) */}
        {isOwner && (
          <div className="relative group">
            <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
              <FiMoreHorizontal />
            </button>

            <div className="absolute right-0 mt-2 hidden group-hover:block bg-white shadow-md rounded-lg p-2 z-10">
              <button
                onClick={handleDelete}
                className="text-sm text-red-500 hover:bg-red-50 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-slate-700">{content}</p>
      </div>

      {/* Image */}
      {image && (
        <div className="mx-4 mb-3 rounded-xl overflow-hidden">
          <img
            src={image}
            alt="Post"
            className="w-full max-h-72 object-cover"
          />
        </div>
      )}

      <div className="mx-4 border-t border-slate-100" />

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1">

          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm ${
              liked
                ? "text-rose-500 bg-rose-50"
                : "text-slate-500 hover:text-rose-500 hover:bg-rose-50"
            }`}
          >
            <FiHeart className={liked ? "fill-rose-500" : ""} />
            <span>{likes}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
          >
            <FiMessageCircle />
            <span>{commentList.length}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied!");
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm text-slate-500 hover:text-sky-500 hover:bg-sky-50"
          >
            <FiShare2 />
          </button>
        </div>

        {/* Save */}
        <button
          onClick={() => setSaved((prev) => !prev)}
          className={`p-2 rounded-xl ${
            saved
              ? "text-violet-600 bg-violet-50"
              : "text-slate-400 hover:text-violet-600 hover:bg-violet-50"
          }`}
        >
          <FiBookmark className={saved ? "fill-violet-500" : ""} />
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-4 flex flex-col gap-3">

          {commentList.map((c) => (
            <div key={c.id} className="text-sm">
              <span className="font-semibold text-slate-700">@{c.user} </span>
              <span className="text-slate-600">{c.text}</span>
            </div>
          ))}

          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />

            <button
              onClick={() => {
                if (!newComment.trim()) return;

                setCommentList((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    user: "you",
                    text: newComment,
                  },
                ]);

                setNewComment("");
              }}
              className="px-3 py-2 text-sm bg-indigo-500 text-white rounded-xl hover:bg-indigo-600"
            >
              Post
            </button>
          </div>

        </div>
      )}
    </article>
  );
}