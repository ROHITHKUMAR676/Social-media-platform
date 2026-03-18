import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiZap,
  FiHome,
  FiPlusSquare,
  FiUser,
  FiBell,
  FiSearch,
  FiX,
  FiMenu,
  FiMessageCircle,
  FiUsers,
} from "react-icons/fi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { icon: FiHome, label: "Home", path: "/" },
    { icon: FiUsers, label: "Forums", path: "/forums" }, // ✅ NEW
    { icon: FiMessageCircle, label: "Messages", path: "/messages" }, // ✅ NEW
    { icon: FiPlusSquare, label: "Create", action: "create" },
    { icon: FiBell, label: "Alerts", path: "#" },
    { icon: FiUser, label: "Profile", path: "/profile" },
  ];

  const handleNavClick = (item) => {
    if (item.path && item.path !== "#") {
      navigate(item.path);
    } else if (item.action === "create") {
      // later: open modal
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
              className="flex items-center gap-2 group cursor-pointer"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-300/50">
                <FiZap className="text-white text-sm" />
              </span>
              <span className="text-[15px] font-bold tracking-tight text-slate-800">
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
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 text-sm font-medium transition-all duration-150"
                  >
                    <Icon className="text-[16px]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Avatar + menu */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <div
                  onClick={() => navigate("/profile")}
                  className="w-8 h-8 rounded-xl overflow-hidden ring-2 ring-indigo-200 hover:ring-indigo-400 cursor-pointer"
                >
                  <img
                    src="https://api.dicebear.com/7.x/notionists/svg?seed=SkillUser"
                    alt="Avatar"
                    className="w-full h-full object-cover bg-indigo-100"
                  />
                </div>
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
              >
                {menuOpen ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-3 pb-3 flex flex-col gap-0.5">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      handleNavClick(item);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 text-sm font-medium"
                  >
                    <Icon className="text-[16px]" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <div className="h-20" />
    </>
  );
}