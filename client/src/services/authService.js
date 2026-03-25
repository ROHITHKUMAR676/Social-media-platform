import api from './api'

export const authService = {

  // 🔐 LOGIN
  async login(email, password) {
    try {
      const res = await api.post('/auth/login', { email, password })

      return {
        token: res.data.token,
        user: res.data.user,
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed')
    }
  },

 async register(data) {
  try {
    const res = await api.post('/auth/register', data)
    return { success: true }
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Registration failed')
  }
},

  // 🔢 VERIFY OTP
  async verifyOtp(email, otp) {
  try {
    const res = await api.post('/auth/verify-otp', { email, otp })

    return {
      token: res.data.token,
      user: res.data.user,
    }
  } catch (err) {
    throw new Error(err.response?.data?.message || 'OTP verification failed')
  }
},

  // 🔁 RESEND OTP
  async resendOtp(email) {
    try {
      const res = await api.post('/auth/resend-otp', { email })
      return res.data
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to resend OTP')
    }
  },

  // 👤 GET CURRENT USER
  async getMe() {
    try {
      const res = await api.get('/users/me') // 🔥 FIXED ROUTE
      return {
        user: res.data.user,
      }
    } catch (err) {
      throw new Error('Failed to fetch user')
    }
  },

  // 👤 UPDATE PROFILE
  async updateProfile(profileData) {
    try {
      const res = await api.put('/users/profile', profileData) // 🔥 FIXED ROUTE

      return {
        user: res.data.user,
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Profile update failed')
    }
  },

  // 🚪 LOGOUT
  async logout() {
    localStorage.removeItem('dc_token')
    localStorage.removeItem('dc_user')
    return { success: true }
  }
}