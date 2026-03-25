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
  // allow access to verify-otp without login
  if (location.pathname === '/verify-otp') {
    return children
  }

  return <Navigate to="/login" state={{ from: location }} replace />
}

  

  return children
}