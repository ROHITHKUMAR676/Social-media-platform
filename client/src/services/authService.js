import api from './api'
import { sleep } from '../utils/helpers'

export const authService = {
  async login(email, password) {
    await sleep(600)
    // Mock auth — in real app this hits backend
    if (email && password) {
      return {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: { email, id: 'cu1' },
      }
    }
    throw new Error('Invalid credentials')
  },

  async register(data) {
    await sleep(800)
    if (data.email && data.password && data.name) {
      return {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: { ...data, id: 'cu1' },
      }
    }
    throw new Error('Registration failed')
  },

  async logout() {
    await sleep(200)
    return { success: true }
  },

  async updateProfile(profileData) {
    await sleep(700)
    return { success: true, user: profileData }
  },

  async getMe() {
    await sleep(300)
    return null // returns stored user
  },
}