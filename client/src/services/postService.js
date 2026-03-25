import api from './api'

export const postService = {
  async getFeed() {
    try {
      const res = await api.get('/posts')

      // 🔥 normalize response safely
      const data = res.data

      if (Array.isArray(data)) return data
      if (Array.isArray(data.posts)) return data.posts
      if (Array.isArray(data.data)) return data.data

      return [] // fallback safety
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to fetch posts')
    }
  },

  async createPost(postData) {
    try {
      const res = await api.post('/posts', postData)
      return res.data
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create post')
    }
  },

  async toggleLike(postId) {
    try {
      const res = await api.post(`/posts/${postId}/like`)
      return res.data
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to like post')
    }
  },
  async getUserPosts(username) {
  try {
    const res = await api.get(`/posts/user/${username}`)

    const data = res.data

    if (Array.isArray(data)) return { posts: data }
    if (Array.isArray(data.posts)) return data
    if (Array.isArray(data.data)) return { posts: data.data }

    return { posts: [] } // fallback
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch user posts')
  }
}
}