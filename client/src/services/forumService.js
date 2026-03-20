import { sleep } from '../utils/helpers'
import { MOCK_FORUMS } from '@/data/mockData'

export const forumService = {
  async getForums() {
    await sleep(400)
    return MOCK_FORUMS
  },

  async getForum(slug) {
    await sleep(300)
    return MOCK_FORUMS.find(f => f.slug === slug) || null
  },

  async applyToForum(forumId) {
    await sleep(600)
    return { success: true, status: 'applied' }
  },

  async getMembers(forumId) {
    await sleep(400)
    return []
  },
}