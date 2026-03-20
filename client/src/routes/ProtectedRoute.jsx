import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FullPageLoader } from '../components/common/Loader'

export default function ProtectedRoute({ children, requireOtp = true, requireProfile = true }) {
  const { isAuthenticated, isLoading, otpVerified, profileCompleted } = useAuth()
  const location = useLocation()

  if (isLoading) return <FullPageLoader />

  // 1. Must be logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 2. Must have verified OTP (skip for /verify-otp itself)
  if (requireOtp && !otpVerified && location.pathname !== '/verify-otp') {
    return <Navigate to="/verify-otp" replace />
  }

  // 3. Must have completed profile (skip for /create-profile itself)
  if (requireProfile && otpVerified && !profileCompleted && location.pathname !== '/create-profile') {
    return <Navigate to="/create-profile" replace />
  }

  return children
}