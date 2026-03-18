import { useState } from "react";
import { FiSend, FiHeart } from "react-icons/fi";

const sampleComments = [
  {
    id: 1,
    username: "alex_dev",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=alex",
    text: "This is really insightful, thanks for sharing! 🔥",
    time: "2m",
    likes: 4,
  },
  {
    id: 2,
    username: "priya_ui",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=priya",
    text: "Agreed! Would love to see a follow-up on advanced techniques.",
    time: "5m",
    likes: 2,
  },
];

export default function CommentSection() {
  const [comments, setComments] = useState(sampleComments);
  const [input, setInput] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        username: "you",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=SkillUser",
        text: input.trim(),
        time: "now",
        likes: 0,
      },
    ]);
    setInput("");
  };

  return (
    <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-4 pt-4 pb-3">
        Comments
      </h2>

      {/* Comment list */}
      <ul className="flex flex-col gap-0 divide-y divide-slate-50">
        {comments.map((c) => (
          <li key={c.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50/60 transition-colors duration-150">
            <div className="w-8 h-8 rounded-xl overflow-hidden ring-2 ring-indigo-100 shrink-0">
              <img
                src={c.avatar}
                alt={c.username}
                className="w-full h-full object-cover bg-indigo-50"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">@{c.username}</span>
                <span className="text-[10px] text-slate-400">{c.time}</span>
              </div>
              <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{c.text}</p>
            </div>
            <button
              aria-label="Like comment"
              className="flex items-center gap-1 text-slate-400 hover:text-rose-500 transition-colors duration-150 mt-1"
            >
              <FiHeart className="text-xs" />
              {c.likes > 0 && (
                <span className="text-[10px] font-medium">{c.likes}</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Input row */}
      <form
        onSubmit={handleAdd}
        className="flex items-center gap-2 px-4 py-3 border-t border-slate-100"
      >
        <div className="w-7 h-7 rounded-lg overflow-hidden ring-2 ring-indigo-200 shrink-0">
          <img
            src="https://api.dicebear.com/7.x/notionists/svg?seed=SkillUser"
            alt="Your avatar"
            className="w-full h-full object-cover bg-indigo-100"
          />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a comment…"
          aria-label="Write a comment"
          className="flex-1 bg-slate-100/70 text-sm text-slate-700 placeholder-slate-400 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-150"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Post comment"
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-700 disabled:cursor-not-allowed transition-all duration-150"
        >
          <FiSend className="text-sm" />
        </button>
      </form>
    </section>
  );
}