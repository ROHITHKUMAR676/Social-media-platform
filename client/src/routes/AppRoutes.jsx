import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '../context/AuthContext'

import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import VerifyOtp from '../pages/VerifyOtp'
import CreateProfile from '../pages/CreateProfile'
import Profile from '../pages/Profile'
import Messages from '../pages/Messages'
import Forums from '../pages/Forums'
import ForumDetail from '../pages/ForumDetail'
import Notifications from '../pages/Notifications'
import Followers from '../pages/Followers'
import Following from '../pages/Following'
import NotFound from '../pages/NotFound'
import { FullPageLoader } from '../components/common/Loader'

export default function AppRoutes() {
  const { isLoading, isAuthenticated, otpVerified, profileCompleted } = useAuth()
  if (isLoading) return <FullPageLoader />

  if (isAuthenticated && !otpVerified) {
    return <VerifyOtp />
  }

  if (isAuthenticated && otpVerified && !profileCompleted) {
    return <CreateProfile />
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forums" element={<Forums />} />
      <Route path="/forums/:id" element={<ForumDetail />} />
      <Route path="/profile/:username" element={<Profile />} />

      <Route
        path="/verify-otp"
        element={
          <ProtectedRoute requireAuth={false} requireOtp={false}>
            <VerifyOtp />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-profile"
        element={
          <ProtectedRoute requireOtp={true} requireProfile={false}>
            <CreateProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/followers"
        element={
          <ProtectedRoute>
            <Followers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/following"
        element={
          <ProtectedRoute>
            <Following />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
