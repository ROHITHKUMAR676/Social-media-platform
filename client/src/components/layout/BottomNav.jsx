import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiPlusSquare,
  FiUser,
  FiUsers,
  FiMessageCircle,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext"; // ✅ ADD

export default function BottomNav() {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ REAL AUTH
  const isLoggedIn = !!user;

  const tabs = [
    { icon: FiHome, label: "Home", path: "/" },
    { icon: FiUsers, label: "Forums", path: "/forums", protected: true },
    { icon: FiPlusSquare, label: "Create", action: "create", protected: true },
    { icon: FiMessageCircle, label: "Messages", path: "/messages", protected: true },
    { icon: FiUser, label: "Profile", path: "/profile", protected: true },
  ];

  const [active, setActive] = useState("Home");

  const handleProtected = () => {
    alert("Please login to access this feature");
    navigate("/login");
  };

  const handleClick = (tab) => {
    // 🔒 block if not logged in
    if (tab.protected && !isLoggedIn) {
      return handleProtected();
    }

    setActive(tab.label);

    if (tab.path) {
      navigate(tab.path);
    } else if (tab.action === "create") {
      alert("Create feature");
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-3 mb-3 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/70 shadow-xl shadow-indigo-100/50">
        <div className="flex items-center justify-around px-2 py-2">

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.label;
            const isCreate = tab.label === "Create";

            return (
              <button
                key={tab.label}
                onClick={() => handleClick(tab)}
                className={`relative flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200
                  ${
                    isCreate
                      ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md scale-105"
                      : isActive
                      ? "text-indigo-600"
                      : "text-slate-400 hover:text-indigo-400"
                  }`}
              >
                <Icon
                  className={`text-xl ${
                    isActive && !isCreate ? "scale-110" : ""
                  }`}
                />

                <span
                  className={`text-[9px] font-semibold uppercase ${
                    isCreate ? "text-white/90" : ""
                  }`}
                >
                  {tab.label}
                </span>

                {/* Active dot */}
                {isActive && !isCreate && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500" />
                )}
              </button>
            );
          })}

        </div>
      </div>
    </nav>
  );
}