import { useNavigate, useLocation } from "react-router-dom";
import {
  FiZap,
  FiHome,
  FiPlusSquare,
  FiUser,
  FiBell,
  FiMessageCircle,
  FiUsers,
  FiSearch,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleNavClick = (item) => {
    if (item.protected && !isLoggedIn) {
      return navigate("/login");
    }

    if (item.path && item.path !== "#") {
      navigate(item.path);
    }
  };

  return (
    <>
      {/* 🔥 NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-3 mt-3 rounded-2xl bg-white/80 backdrop-blur-xl border shadow-lg">

          <div className="flex items-center justify-between px-4 py-3 gap-3">

            {/* BRAND */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer shrink-0"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <FiZap className="text-white" />
              </div>
              <span className="font-bold text-slate-800">
                Dev<span className="text-indigo-600">Connect</span>
              </span>
            </div>

            {/* 🔥 DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path && location.pathname === item.path;

                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm
                      ${
                        isActive
                          ? "bg-indigo-100 text-indigo-600"
                          : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* 🔥 RIGHT SIDE */}
            <div className="flex items-center gap-2 shrink-0">

              {/* DESKTOP SEARCH */}
              <div className="hidden lg:flex items-center bg-slate-100 px-3 py-1.5 rounded-xl">
                <FiSearch className="text-slate-400 mr-2" />
                <input
                  placeholder="Search"
                  className="bg-transparent outline-none text-sm w-32 xl:w-40"
                />
              </div>

              {/* USER */}
              {isLoggedIn ? (
                <div
                  onClick={() => navigate("/profile")}
                  className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white cursor-pointer overflow-hidden"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
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

          {/* 🔥 MOBILE SEARCH (NEW) */}
          <div className="lg:hidden px-4 pb-3">
            <div className="flex items-center bg-slate-100 px-3 py-2 rounded-xl">
              <FiSearch className="text-slate-400 mr-2" />
              <input
                placeholder="Search..."
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>

        </div>
      </header>

      {/* SPACER */}
      <div className="h-24" />
    </>
  );
}