import { useNavigate } from "react-router-dom";
import {
  FiZap,
  FiHome,
  FiPlusSquare,
  FiUser,
  FiBell,
  FiMessageCircle,
  FiUsers,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isLoggedIn = !!user;

  const navLinks = [
    { icon: FiHome, label: "Home", path: "/" },
    { icon: FiUsers, label: "Forums", path: "/forums", protected: true },
    { icon: FiMessageCircle, label: "Messages", path: "/messages", protected: true },
    { icon: FiPlusSquare, label: "Create", action: "create", protected: true },
    { icon: FiBell, label: "Alerts", path: "#", protected: true },
    { icon: FiUser, label: "Profile", path: "/profile", protected: true },
  ];

  const handleProtected = () => {
    navigate("/login");
  };

  const handleNavClick = (item) => {
    if (item.protected && !isLoggedIn) {
      return handleProtected();
    }

    if (item.path && item.path !== "#") {
      navigate(item.path);
    } else if (item.action === "create") {
      alert("Create feature");
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-3 mt-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg shadow-indigo-100/40">
          <div className="flex items-center justify-between px-4 py-3">

            {/* Brand */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
                <FiZap className="text-white text-sm" />
              </span>
              <span className="text-[15px] font-bold text-slate-800">
                Skill<span className="text-indigo-600">Sphere</span>
              </span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 text-sm"
                  >
                    <Icon className="text-[16px]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Avatar (ALL DEVICES) */}
            <div className="flex items-center">

              {isLoggedIn ? (
                <div
                  onClick={() => navigate("/profile")}
                  className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold cursor-pointer"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    user?.username?.charAt(0).toUpperCase()
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500 text-white text-sm"
                >
                  Login
                </button>
              )}

            </div>
          </div>
        </div>
      </header>

      <div className="h-20" />
    </>
  );
}