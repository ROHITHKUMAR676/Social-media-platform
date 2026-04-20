import api from './api'

const normalizeConversation = (conversation) => ({
  id: conversation.id || conversation.participant?._id || conversation.participant?.id,
  participant: conversation.participant,
  lastMessage: conversation.lastMessage || '',
  lastMessageTime: conversation.lastMessageTime || null,
  unread: conversation.unread || 0,
  messages: conversation.messages || [],
})

export const chatService = {
  async getConversations() {
    try {
      const res = await api.get('/messages/conversations')
      const conversations = res.data?.conversations || []
      return conversations.map(normalizeConversation)
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to fetch conversations')
    }
  },

  async getMessages(userId) {
    try {
      const res = await api.get(`/messages/${userId}`)
      return {
        participant: res.data?.participant,
        messages: res.data?.messages || [],
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to fetch messages')
    }
  },

  async sendMessage(userId, content) {
    try {
      const res = await api.post(`/messages/${userId}`, { content })
      return {
        message: res.data?.message,
        participant: res.data?.participant,
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to send message')
    }
  },
}
