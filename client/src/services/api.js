// Base API service — replace with real API calls
import { sleep } from '../utils/helpers'

export const api = {
  async get(endpoint) {
    await sleep(300 + Math.random() * 200) // Simulate network latency
    console.log(`[API] GET ${endpoint}`)
    return { ok: true }
  },

  async post(endpoint, data) {
    await sleep(400 + Math.random() * 300)
    console.log(`[API] POST ${endpoint}`, data)
    return { ok: true, data }
  },

  async put(endpoint, data) {
    await sleep(300)
    console.log(`[API] PUT ${endpoint}`, data)
    return { ok: true, data }
  },

  async delete(endpoint) {
    await sleep(200)
    console.log(`[API] DELETE ${endpoint}`)
    return { ok: true }
  },
}

export default api