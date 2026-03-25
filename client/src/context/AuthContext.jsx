import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [profileCompleted, setProfileCompleted] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)

  // 🔁 Restore session
  useEffect(() => {
    const stored = localStorage.getItem('dc_user')
    const token = localStorage.getItem('dc_token')

    if (stored && token) {
      const parsed = JSON.parse(stored)
      setUser(parsed)
      setIsAuthenticated(true)
      setProfileCompleted(parsed.profileCompleted || false)
      setOtpVerified(true)
    }

    setIsLoading(false)
  }, [])

  // 🔐 LOGIN (FIXED)
  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    try {
      const res = await authService.login(email, password)

      setUser(res.user)
      setIsAuthenticated(true)
      setOtpVerified(true)
      setProfileCompleted(res.user.profileCompleted || false)

      localStorage.setItem('dc_user', JSON.stringify(res.user))
      localStorage.setItem('dc_token', res.token)

      return { success: true, user: res.user }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 📝 REGISTER
  const register = useCallback(async (data) => {
    setIsLoading(true)
    try {
      await authService.register(data)

      const tempUser = {
        email: data.email,
        name: data.name,
        username: data.username,
      }

      setUser(tempUser)
      setIsAuthenticated(false)
      setOtpVerified(false)

      localStorage.setItem('dc_user', JSON.stringify(tempUser))

      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 🔢 VERIFY OTP (FIXED 🔥)
  const verifyOtp = useCallback(async (otp) => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('dc_user'))
    const email = user?.email || storedUser?.email

    if (!email) {
      return { success: false, error: "Session expired. Please register again." }
    }

    const res = await authService.verifyOtp(email, otp)

    setUser(res.user)
    setIsAuthenticated(true)
    setOtpVerified(true)
    setProfileCompleted(res.user.profileCompleted || false)

    localStorage.setItem('dc_user', JSON.stringify(res.user))
    localStorage.setItem('dc_token', res.token)

    return { success: true, user: res.user }

  } catch (err) {
    return { success: false, error: err.message }
  }
}, [])
  // 🔁 RESEND OTP
  const resendOtp = useCallback(async () => {
    try {
      await authService.resendOtp(user.email)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [user])

  // 🚪 LOGOUT
  const logout = useCallback(async () => {
    await authService.logout()

    setUser(null)
    setIsAuthenticated(false)
    setProfileCompleted(false)
    setOtpVerified(false)

    localStorage.removeItem('dc_user')
    localStorage.removeItem('dc_token')
  }, [])

  // 👤 COMPLETE PROFILE
 const completeProfile = useCallback(async (profileData) => {
  setIsLoading(true)

  try {
    const res = await authService.updateProfile(profileData)

    // 🔥 FORCE CONSISTENCY
    const updatedUser = {
      ...res.user,
      profileCompleted: true,
    }

    setUser(updatedUser)
    setProfileCompleted(true)

    localStorage.setItem('dc_user', JSON.stringify(updatedUser))

    return { success: true, user: updatedUser }

  } catch (err) {
    return { success: false, error: err.message }
  } finally {
    setIsLoading(false)
  }
}, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        profileCompleted,
        otpVerified,
        login,
        register,
        verifyOtp,
        resendOtp,
        logout,
        completeProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}