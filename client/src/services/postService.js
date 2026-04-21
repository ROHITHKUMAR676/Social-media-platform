import api from './api'

export const postService = {
  async getFeed() {
    try {
      const res = await api.get('/posts')
      const data = res.data

      if (Array.isArray(data)) return data
      if (Array.isArray(data.posts)) return data.posts
      if (Array.isArray(data.data)) return data.data

      return []
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

  async toggleLike(postId) {
    try {
      const res = await api.put(`/posts/${postId}/like`)
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

      return { posts: [] }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to fetch user posts')
    }
  },

  async getComments(postId) {
    try {
      const res = await api.get(`/posts/${postId}/comments`)

      return {
        comments: res.data.comments || [],
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to fetch comments')
    }
  },

  async addComment(postId, text) {
    try {
      const res = await api.post(`/posts/${postId}/comment`, { text })

      return {
        comments: res.data.comments || [],
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add comment')
    }
  },

  async addReply(postId, commentId, text) {
    try {
      const res = await api.post(`/posts/${postId}/comment/${commentId}/reply`, { text })
      return {
        comments: res.data.comments || [],
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add reply')
    }
  },
}
