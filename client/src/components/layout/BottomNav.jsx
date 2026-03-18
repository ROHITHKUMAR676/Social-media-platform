import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiPlusSquare,
  FiBell,
  FiUser,
  FiUsers,
  FiMessageCircle,
} from "react-icons/fi";

export default function BottomNav() {
  const navigate = useNavigate();

  const tabs = [
    { icon: FiHome, label: "Home", path: "/" },
    { icon: FiUsers, label: "Forums", path: "/forums" }, // ✅ NEW
    { icon: FiPlusSquare, label: "Create", action: "create" },
    { icon: FiMessageCircle, label: "Messages", path: "/messages" }, // ✅ NEW
    { icon: FiUser, label: "Profile", path: "/profile" },
  ];

  const [active, setActive] = useState("Home");

  const handleClick = (tab) => {
    setActive(tab.label);

    if (tab.path) {
      navigate(tab.path);
    } else if (tab.action === "create") {
      alert("Create feature"); // later modal
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
                      ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-300/50 scale-105 hover:scale-110"
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

                {/* Alerts badge removed since Alerts removed */}
              </button>
            );
          })}

        </div>
      </div>
    </nav>
  );
}