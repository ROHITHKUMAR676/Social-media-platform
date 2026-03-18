import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import CreateProfile from "../pages/CreateProfile";

const AppShell = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex-1">{children}</div>
    <BottomNav />
  </div>
);

const AuthPage = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center">
    {children}
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage><Login /></AuthPage>} />
      <Route path="/register" element={<AuthPage><Register /></AuthPage>} />

      <Route path="/" element={<AppShell><Home /></AppShell>} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/profile" element={<AppShell><Profile /></AppShell>} />
      <Route path="/profile/:username" element={<AppShell><Profile /></AppShell>} />
    <Route path="/create-profile" element={<CreateProfile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}