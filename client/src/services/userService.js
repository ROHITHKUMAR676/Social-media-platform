import api from './api'

export const userService = {

  // 👤 Get my profile
  async getMe() {
    try {
      const res = await api.get('/users/me')
      return res.data
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to fetch user')
    }
  },

  // 🌍 Get user by username
  async getUserByUsername(username) {
    try {
      const res = await api.get(`/users/${username}`)
      return res.data
    } catch (err) {
      throw new Error(err.response?.data?.message || 'User not found')
    }
  },

  // 🔥 Follow / Unfollow
  async toggleFollow(userId) {
    try {
      const res = await api.put(`/users/follow/${userId}`)
      return res.data
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Follow failed')
    }
  }
}