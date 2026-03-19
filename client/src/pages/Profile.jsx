import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiGrid,
  FiBookmark,
  FiEdit2,
  FiLogOut,
  FiCamera,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import PostCard from "../components/post/PostCard";
import api from "../services/api";

const TABS = ["Posts", "Saved"];

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const { username } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !username || username === user?.name;

  // 🔥 Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error("Failed to load posts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (!user) {
    return (
      <div className="text-center mt-20 text-slate-500">
        Please login
      </div>
    );
  }

  const profileUser = isOwnProfile
    ? user
    : {
        name: username,
        bio: "User bio...",
      };

  const letter = profileUser.name?.charAt(0).toUpperCase();

  // 🔥 HANDLE AVATAR CHANGE
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    const updated = { ...user, avatar: url };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  // 🔥 HANDLE COVER CHANGE
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    const updated = { ...user, cover: url };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/20 to-violet-50/30 pb-24">

      {/* COVER */}
      <div className="h-40 md:h-52 w-full relative group">
        <img
          src={
            profileUser.cover ||
            "https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?w=800"
          }
          className="w-full h-full object-cover"
        />

        {isOwnProfile && (
          <label className="absolute top-3 right-3 bg-white/90 p-2 rounded-xl cursor-pointer shadow hover:scale-105 transition">
            <FiCamera />
            <input type="file" className="hidden" onChange={handleCoverChange} />
          </label>
        )}
      </div>

      {/* PROFILE */}
      <div className="max-w-xl mx-auto px-3 mt-4">

        <div className="bg-white rounded-2xl shadow-md px-5 py-5 mb-4">

          <div className="flex items-center justify-between mb-3">

            {/* AVATAR */}
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500 text-white flex items-center justify-center text-xl font-bold overflow-hidden">
                {profileUser.avatar ? (
                  <img src={profileUser.avatar} className="w-full h-full object-cover" />
                ) : (
                  letter
                )}
              </div>

              {isOwnProfile && (
                <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer shadow opacity-0 group-hover:opacity-100 transition">
                  <FiCamera size={12} />
                  <input type="file" className="hidden" onChange={handleAvatarChange} />
                </label>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={() => navigate("/create-profile")}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500 text-white text-sm flex items-center gap-1"
                  >
                    <FiEdit2 />
                    Edit
                  </button>

                  <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded-xl bg-red-100 text-red-500 text-sm flex items-center gap-1"
                  >
                    <FiLogOut />
                  </button>
                </>
              ) : (
                <button className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm">
                  Follow
                </button>
              )}
            </div>
          </div>

          {/* NAME */}
          <h1 className="text-lg font-black">
            {profileUser.name}
          </h1>
          <p className="text-sm text-slate-500">
            @{profileUser.name}
          </p>

          {/* BIO */}
          <p className="text-sm mt-2">
            {profileUser.bio || "No bio yet"}
          </p>

          {/* STATS */}
          {isOwnProfile && (
            <div className="flex gap-6 mt-4 text-center">
              <div>
                <p className="font-bold">{posts.length}</p>
                <p className="text-xs text-slate-400">Posts</p>
              </div>
              <div>
                <p className="font-bold">{user.followers?.length || 0}</p>
                <p className="text-xs text-slate-400">Followers</p>
              </div>
              <div>
                <p className="font-bold">{user.following?.length || 0}</p>
                <p className="text-xs text-slate-400">Following</p>
              </div>
            </div>
          )}
        </div>

        {/* TABS */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              className="flex-1 py-2 rounded-xl text-sm text-slate-600 flex justify-center"
            >
              {tab === "Posts" ? <FiGrid /> : <FiBookmark />}
            </button>
          ))}
        </div>

        {/* POSTS */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="text-center text-slate-400 py-10">
              Loading posts...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center text-slate-400 py-10">
              No posts yet 🚀
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}