import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'
import { sleep } from '../utils/helpers'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]                     = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading]           = useState(true)
  const [profileCompleted, setProfileCompleted] = useState(false)
  // NEW: tracks whether the user has verified their email OTP
  const [otpVerified, setOtpVerified]       = useState(false)

  // ── Rehydrate from localStorage ─────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('dc_user')
    const token  = localStorage.getItem('dc_token')
    if (stored && token) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed)
        setIsAuthenticated(true)
        setProfileCompleted(parsed.profileCompleted || false)
        // If they already verified in a previous session, honour it
        setOtpVerified(parsed.otpVerified || false)
      } catch {}
    }
    setIsLoading(false)
  }, [])

  // ── Login ────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    try {
      const result = await authService.login(email, password)
      const userData = {
        id: 'cu1',
        name: 'Dev User',
        username: 'devuser',
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}&backgroundColor=b6e3f4`,
        bio: '', skills: [], role: '', company: '',
        location: '', website: '',
        followers: 0, following: 0, posts: 0,
        profileCompleted: false,
        otpVerified: true, // existing users are already verified
        joined: new Date().toISOString(),
      }
      setUser(userData)
      setIsAuthenticated(true)
      setProfileCompleted(false)
      setOtpVerified(true)
      localStorage.setItem('dc_user', JSON.stringify(userData))
      localStorage.setItem('dc_token', result.token)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ── Register ─────────────────────────────────────────────────
  // After register the user is NOT yet otp-verified.
  // We store them in state + localStorage so VerifyOtp can read
  // their email, but we set otpVerified: false.
  const register = useCallback(async (data) => {
    setIsLoading(true)
    try {
      const result = await authService.register(data)
      const userData = {
        id: 'cu1',
        name: data.name,
        username: data.username || data.name.toLowerCase().replace(/\s/g, ''),
        email: data.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}&backgroundColor=b6e3f4`,
        bio: '', skills: [], role: '', company: '',
        location: '', website: '',
        followers: 0, following: 0, posts: 0,
        profileCompleted: false,
        otpVerified: false,       // ← must verify before profile setup
        joined: new Date().toISOString(),
      }
      setUser(userData)
      setIsAuthenticated(true)
      setProfileCompleted(false)
      setOtpVerified(false)
      localStorage.setItem('dc_user', JSON.stringify(userData))
      localStorage.setItem('dc_token', result.token)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ── Verify OTP ───────────────────────────────────────────────
  // In production replace this with a real API call.
  // For demo: any 6-digit code is accepted.
  const verifyOtp = useCallback(async (code) => {
    await sleep(800) // simulate network
    if (code.length !== 6) {
      return { success: false, error: 'Enter the full 6-digit code.' }
    }
    // Demo: accept any code. In prod: POST /auth/verify-otp { code }
    const updatedUser = { ...user, otpVerified: true }
    setOtpVerified(true)
    setUser(updatedUser)
    localStorage.setItem('dc_user', JSON.stringify(updatedUser))
    return { success: true }
  }, [user])

  // ── Resend OTP ───────────────────────────────────────────────
  const resendOtp = useCallback(async () => {
    await sleep(500) // simulate POST /auth/resend-otp
    return { success: true }
  }, [])

  // ── Logout ───────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
    setIsAuthenticated(false)
    setProfileCompleted(false)
    setOtpVerified(false)
    localStorage.removeItem('dc_user')
    localStorage.removeItem('dc_token')
  }, [])

  // ── Complete Profile ─────────────────────────────────────────
  const completeProfile = useCallback(async (profileData) => {
    setIsLoading(true)
    try {
      const updatedUser = { ...user, ...profileData, profileCompleted: true }
      await authService.updateProfile(updatedUser)
      setUser(updatedUser)
      setProfileCompleted(true)
      localStorage.setItem('dc_user', JSON.stringify(updatedUser))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [user])

  return (
    <AuthContext.Provider value={{
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
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}