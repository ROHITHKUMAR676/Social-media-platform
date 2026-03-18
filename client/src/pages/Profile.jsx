import { useState } from "react";
import { FiEdit2, FiMapPin, FiLink, FiCalendar, FiGrid, FiBookmark, FiZap } from "react-icons/fi";
import PostCard from "../components/post/PostCard";

const PROFILE = {
  username: "Alex Kumar",
  handle: "alex_dev",
  avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=alex",
  cover: "https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?w=800&auto=format&fit=crop",
  bio: "Full-stack engineer & OSS contributor. Building fast, accessible interfaces. TypeScript ❤️ React. Open to collab.",
  location: "San Francisco, CA",
  website: "alexkumar.dev",
  joined: "March 2023",
  stats: { posts: 142, followers: "4.2k", following: 381 },
  skills: ["React", "TypeScript", "Node.js", "GraphQL", "Tailwind CSS"],
};

const USER_POSTS = [
  {
    id: 10,
    avatar: PROFILE.avatar,
    username: PROFILE.username,
    handle: PROFILE.handle,
    time: "2d ago",
    tag: "Pro",
    content: "Shipped a new OSS CLI tool for generating typed API clients from OpenAPI specs. Zero dependencies. Check it out 🔧",
    likes: 204,
    comments: 31,
  },
  {
    id: 11,
    avatar: PROFILE.avatar,
    username: PROFILE.username,
    handle: PROFILE.handle,
    time: "1w ago",
    content: "Hot take: writing readable code is more important than writing clever code. Your future self will thank you.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&auto=format&fit=crop",
    likes: 389,
    comments: 44,
  },
];

const TABS = ["Posts", "Saved"];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Posts");
  const [following, setFollowing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/20 to-violet-50/30 pb-24 md:pb-8">
      {/* Cover */}
      <div className="relative h-40 md:h-52 overflow-hidden">
        <img
          src={PROFILE.cover}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
      </div>

      <div className="max-w-xl mx-auto px-3">
        {/* Profile header card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-md shadow-indigo-100/30 -mt-10 px-5 pt-5 pb-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg shrink-0">
              <img src={PROFILE.avatar} alt={PROFILE.username} className="w-full h-full object-cover bg-indigo-100" />
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-1">
              <button
                aria-label="Edit profile"
                className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all duration-150"
              >
                <FiEdit2 className="text-sm" />
              </button>
              <button
                onClick={() => setFollowing(!following)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  ${following
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200 hover:scale-[1.03]"
                  }`}
              >
                {following ? "Following" : "Follow"}
              </button>
            </div>
          </div>

          {/* Name & handle */}
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-black text-slate-800">{PROFILE.username}</h1>
            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-md">
              <FiZap className="text-[8px]" /> Pro
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-2">@{PROFILE.handle}</p>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">{PROFILE.bio}</p>

          {/* Meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
            {[
              { icon: FiMapPin, text: PROFILE.location },
              { icon: FiLink, text: PROFILE.website },
              { icon: FiCalendar, text: `Joined ${PROFILE.joined}` },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1 text-xs text-slate-500">
                <Icon className="text-[11px] text-slate-400" />
                {text}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-5 pt-3 border-t border-slate-100">
            {Object.entries(PROFILE.stats).map(([key, value]) => (
              <div key={key} className="flex flex-col items-center gap-0.5">
                <span className="text-base font-black text-slate-800">{value}</span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide capitalize">{key}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm px-5 py-4 mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {PROFILE.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl hover:bg-indigo-100 transition-colors duration-150 cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/70 rounded-2xl border border-slate-100 p-1 shadow-sm mb-4">
          {TABS.map((tab) => {
            const Icon = tab === "Posts" ? FiGrid : FiBookmark;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  ${activeTab === tab
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                <Icon className="text-base" />
                {tab}
              </button>
            );
          })}
        </div>

        {/* Posts */}
        <div className="flex flex-col gap-3">
          {USER_POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}