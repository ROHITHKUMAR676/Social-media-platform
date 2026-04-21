import api from './api'

export const forumService = {
  async getForums() {
    try {
      const res = await api.get('/forums')
      return res.data.forums || []
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to fetch forums')
    }
  },

  async joinForum(forumId) {
    try {
      const res = await api.post(`/forums/${forumId}/join`)
      return res.data.forum
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to join forum')
    }
  },

  async getForumPosts(forumId) {
    try {
      const res = await api.get(`/forums/${forumId}/posts`)
      return {
        forum: res.data.forum,
        posts: res.data.posts || [],
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to fetch forum posts')
    }
  },
}
