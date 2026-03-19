import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import CreateProfile from "../pages/CreateProfile";

// 🧱 Layout Wrapper (UPDATED FOR DESKTOP)
const AppShell = ({ children }) => (
  <div className="min-h-screen bg-slate-50">

    {/* 🔝 Navbar (top for all) */}
    <Navbar />

    {/* 🔥 MAIN LAYOUT */}
    <div className="flex max-w-6xl mx-auto">

      {/* 📌 LEFT SIDEBAR (desktop only for future use) */}
      <div className="hidden md:block w-1/4 p-4">
        {/* Future sidebar */}
      </div>

      {/* 🧠 MAIN CONTENT */}
      <div className="flex-1 p-3 md:p-6">
        {children}
      </div>

      {/* 📌 RIGHT SIDEBAR (desktop only) */}
      <div className="hidden md:block w-1/4 p-4">
        {/* Future suggestions */}
      </div>
    </div>

    {/* 📱 Bottom Nav (mobile only) */}
    <div className="md:hidden">
      <BottomNav />
    </div>
  </div>
);

// 🔐 Protected Route
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? children : <Navigate to="/login" replace />;
};

// 🚫 Public Route
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return !user ? children : <Navigate to="/" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>

      {/* 🚫 AUTH PAGES */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />

      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />

      {/* 🌍 PUBLIC HOME (FIXED 🔥) */}
      <Route path="/" element={
        <AppShell>
          <Home />
        </AppShell>
      } />

      <Route path="/home" element={<Navigate to="/" replace />} />

      {/* 🔐 PROTECTED */}
      <Route path="/profile" element={
        <PrivateRoute>
          <AppShell>
            <Profile />
          </AppShell>
        </PrivateRoute>
      } />

      <Route path="/profile/:username" element={
        <PrivateRoute>
          <AppShell>
            <Profile />
          </AppShell>
        </PrivateRoute>
      } />

      <Route path="/create-profile" element={
        <PrivateRoute>
          <CreateProfile />
        </PrivateRoute>
      } />

      {/* ❌ NOT FOUND */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}