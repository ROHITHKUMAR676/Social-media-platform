import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ ADD THIS

import PostCard from "../components/post/PostCard";
import CreatePost from "../components/post/CreatePost";
import { FiTrendingUp, FiUsers, FiZap } from "react-icons/fi";

const STORIES = [
  { id: 1, username: "alex_dev", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=alex", active: true },
  { id: 2, username: "priya_ui", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=priya", active: false },
  { id: 3, username: "sam_ml", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=sam", active: true },
  { id: 4, username: "nina_ux", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=nina", active: false },
  { id: 5, username: "raj_db", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=raj", active: true },
];

const INITIAL_POSTS = [
  {
    id: 1,
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=alex",
    username: "Alex Kumar",
    handle: "alex_dev",
    time: "2m ago",
    tag: "Pro",
    content:
      "Just shipped a full-stack auth system using Next.js + Prisma + JWT in under 3 hours 🚀",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop",
    likes: 142,
    comments: 18,
  },
  {
    id: 2,
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=priya",
    username: "Priya Sharma",
    handle: "priya_ui",
    time: "15m ago",
    tag: "Design",
    content:
      "Redesigned onboarding — reduced drop-off by 34%. Less is more ✨",
    likes: 89,
    comments: 7,
  },
];

const TRENDING = [
  { tag: "#ReactJS" },
  { tag: "#OpenSource" },
  { tag: "#UIDesign" },
];

const SUGGESTIONS = [
  { username: "kai_backend" },
  { username: "lena_devrel" },
  { username: "omar_ios" },
];

export default function Home() {
  const navigate = useNavigate();

  const { user } = useAuth(); // ✅ REAL AUTH STATE
  const isLoggedIn = !!user;  // ✅ true if user exists

  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const requireLogin = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/40 to-violet-50/50">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-8">
        <div className="flex gap-6 items-start">

          {/* MAIN */}
          <main className="flex-1 flex flex-col gap-4">

            {/* Stories */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex gap-3 overflow-x-auto">

                <button
                  onClick={() => requireLogin()}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center">
                    +
                  </div>
                  <span className="text-xs">Your story</span>
                </button>

                {STORIES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => navigate(`/profile/${s.username}`)}
                    className="flex flex-col items-center"
                  >
                    <img src={s.avatar} className="w-14 h-14 rounded-xl" />
                    <span className="text-xs">{s.username}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Create Post */}
            {isLoggedIn ? (
              <CreatePost
                onCreatePost={(newPost) =>
                  setPosts((prev) => [newPost, ...prev])
                }
              />
            ) : (
              <div
                onClick={() => requireLogin()}
                className="bg-white p-4 rounded-xl text-center cursor-pointer"
              >
                Login to create a post
              </div>
            )}

            {/* Feed */}
            <div className="flex flex-col gap-3">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={(id) =>
                    setPosts((prev) => prev.filter((p) => p.id !== id))
                  }
                />
              ))}
            </div>
          </main>

          {/* SIDEBAR */}
          <aside className="hidden lg:flex flex-col gap-4 w-72">

            {/* Trending */}
            <div className="bg-white p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <FiTrendingUp />
                <h2>Trending</h2>
              </div>

              {TRENDING.map((t) => (
                <button
                  key={t.tag}
                  onClick={() => requireLogin()}
                  className="block w-full text-left py-1"
                >
                  {t.tag}
                </button>
              ))}
            </div>

            {/* Suggestions */}
            <div className="bg-white p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <FiUsers />
                <h2>Suggested</h2>
              </div>

              {SUGGESTIONS.map((s) => (
                <button
                  key={s.username}
                  onClick={() => {
                    if (!requireLogin()) return;
                    navigate(`/profile/${s.username}`);
                  }}
                  className="block w-full text-left py-1"
                >
                  @{s.username}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-indigo-500 text-white p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <FiZap />
                <span>SkillSphere Pro</span>
              </div>

              <button onClick={() => requireLogin()}>
                Upgrade →
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* LOGIN POPUP */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 text-center shadow-lg">
            <h2 className="text-lg font-bold mb-2">Login Required</h2>
            <p className="text-sm text-slate-500 mb-4">
              Please login to continue
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={() => navigate("/login")}
                className="flex-1 py-2 rounded-xl bg-indigo-500 text-white"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}