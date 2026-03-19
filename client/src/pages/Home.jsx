import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import PostCard from "../components/post/PostCard";
import CreatePost from "../components/post/CreatePost";
import { FiTrendingUp, FiUsers, FiZap } from "react-icons/fi";

const STORIES = [
  { id: 1, username: "alex_dev", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=alex" },
  { id: 2, username: "priya_ui", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=priya" },
];

const FALLBACK_POSTS = [
  {
    _id: "fallback-1",
    user: {
      name: "DevConnect",
      username: "devconnect",
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=dev",
    },
    content: "Welcome to DevConnect 🚀 Start connecting with developers!",
    createdAt: new Date(),
  },
];

const TRENDING = ["#ReactJS", "#OpenSource", "#UIDesign"];
const SUGGESTIONS = ["kai_backend", "lena_devrel", "omar_ios"];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isLoggedIn = !!user;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const requireLogin = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return false;
    }
    return true;
  };

  // 🔥 FETCH POSTS
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        const data = res.data.posts;

        if (!data || data.length === 0) {
          setPosts(FALLBACK_POSTS); // ✅ fallback
        } else {
          setPosts(data);
        }
      } catch (err) {
        console.error("Feed error", err);
        setPosts(FALLBACK_POSTS); // ✅ fallback on error
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/30 to-violet-50/40">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-10">

        <div className="flex gap-6">

          {/* LEFT */}
          <aside className="hidden md:flex flex-col w-64 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-semibold mb-2">DevConnect</h2>
              <p className="text-sm text-slate-500">
                Connect with developers worldwide 🚀
              </p>
            </div>
          </aside>

          {/* MAIN */}
          <main className="flex-1 max-w-2xl mx-auto flex flex-col gap-4">

            {/* STORIES */}
            <section className="bg-white/80 rounded-2xl p-4">
              <div className="flex gap-3 overflow-x-auto">
                <button
                  onClick={() => requireLogin()}
                  className="flex flex-col items-center"
                >
                  <div className="w-14 h-14 bg-indigo-500 text-white rounded-2xl flex items-center justify-center">
                    +
                  </div>
                  <span className="text-xs">Your story</span>
                </button>

                {STORIES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => navigate(`/profile/${s.username}`)}
                  >
                    <img src={s.avatar} className="w-14 h-14 rounded-xl" />
                  </button>
                ))}
              </div>
            </section>

            {/* CREATE POST */}
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
                Login to share 🚀
              </div>
            )}

            {/* FEED */}
            <div className="flex flex-col gap-3">

              {loading ? (
                <div className="text-center text-slate-400 py-10">
                  Loading feed...
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post._id} // ✅ FIXED
                    post={post}
                  />
                ))
              )}

            </div>

          </main>

          {/* RIGHT */}
          <aside className="hidden lg:flex flex-col gap-4 w-72">

            <div className="bg-white p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <FiTrendingUp />
                <h2>Trending</h2>
              </div>
              {TRENDING.map((t) => (
                <div key={t}>{t}</div>
              ))}
            </div>

            <div className="bg-white p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <FiUsers />
                <h2>Suggested</h2>
              </div>
              {SUGGESTIONS.map((s) => (
                <div key={s}>@{s}</div>
              ))}
            </div>

            <div className="bg-indigo-500 text-white p-4 rounded-2xl">
              <FiZap />
              <p>DevConnect Pro</p>
            </div>

          </aside>

        </div>
      </div>

      {/* LOGIN POPUP */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl text-center">
            <p>Please login</p>
            <button onClick={() => navigate("/login")}>Login</button>
          </div>
        </div>
      )}
    </div>
  );
}