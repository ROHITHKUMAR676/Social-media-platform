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

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const isOwnProfile = !username || username === user?.name;

  // 🔥 FETCH PROFILE USER
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isOwnProfile) {
          setProfileUser(user);
          setFollowersCount(user.followers?.length || 0);
          return;
        }

        const res = await api.get(`/users/profile/${username}`);
        const data = res.data.user;

        setProfileUser(data);
        setFollowersCount(data.followers?.length || 0);

        // 🔥 check following
        setIsFollowing(
          data.followers?.includes(user.id)
        );
      } catch (err) {
        console.error("Profile fetch failed", err);
      }
    };

    fetchProfile();
  }, [username, user]);

  // 🔥 FETCH POSTS
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        const allPosts = res.data.posts || [];

        const filtered = allPosts.filter(
          (p) => p.user?._id === profileUser?._id
        );

        setPosts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (profileUser?._id) {
      fetchPosts();
    }
  }, [profileUser]);

  if (!user || !profileUser) {
    return (
      <div className="text-center mt-20 text-slate-500">
        Loading profile...
      </div>
    );
  }

  const letter = profileUser.name?.charAt(0).toUpperCase();

  // 🔥 FOLLOW
  const handleFollow = async () => {
    try {
      const res = await api.put(`/users/follow/${profileUser._id}`);

      setIsFollowing(res.data.isFollowing);

      setFollowersCount((prev) =>
        res.data.isFollowing ? prev + 1 : prev - 1
      );
    } catch (err) {
      console.error("Follow failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/20 to-violet-50/30 pb-24">

      {/* COVER */}
      <div className="relative h-40 md:h-56 w-full">
        <img
          src={
            profileUser.cover ||
            "https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?w=800"
          }
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-3xl mx-auto px-4">

        <div className="bg-white rounded-2xl shadow-md px-5 py-6 -mt-12 relative z-10">

          <div className="flex justify-between items-start">

            {/* AVATAR */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white">
              {profileUser.avatar ? (
                <img src={profileUser.avatar} className="w-full h-full object-cover" />
              ) : (
                letter
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={() => navigate("/create-profile")}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500 text-white text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded-xl bg-red-100 text-red-500 text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`px-4 py-2 rounded-xl text-sm ${
                    isFollowing
                      ? "bg-slate-200"
                      : "bg-indigo-500 text-white"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>

          {/* INFO */}
          <div className="mt-3">
            <h1 className="text-xl font-bold">{profileUser.name}</h1>
            <p className="text-sm text-slate-500">@{profileUser.name}</p>
            <p className="text-sm mt-2">{profileUser.bio}</p>
          </div>

          {/* STATS */}
          <div className="flex gap-6 mt-4 text-center">
            <div>
              <p className="font-bold">{posts.length}</p>
              <p className="text-xs text-slate-400">Posts</p>
            </div>
            <div>
              <p className="font-bold">{followersCount}</p>
              <p className="text-xs text-slate-400">Followers</p>
            </div>
            <div>
              <p className="font-bold">{profileUser.following?.length || 0}</p>
              <p className="text-xs text-slate-400">Following</p>
            </div>
          </div>
        </div>

        {/* POSTS */}
        <div className="flex flex-col gap-3 mt-4">
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