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

// 🧱 Layout Wrapper
const AppShell = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex-1">{children}</div>
    <BottomNav />
  </div>
);

// 🔐 Protected Route
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // or loader

  return user ? children : <Navigate to="/login" replace />;
};

// 🚫 Public Route (prevent logged-in users from going to login/register)
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

      {/* 🔐 MAIN APP */}
      <Route path="/" element={
        <PrivateRoute>
          <AppShell>
            <Home />
          </AppShell>
        </PrivateRoute>
      } />

      <Route path="/home" element={<Navigate to="/" replace />} />

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