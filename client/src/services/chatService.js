import { sleep } from '../utils/helpers'
import { MOCK_CONVERSATIONS } from '@/data/mockData'

export const chatService = {
  async getConversations() {
    await sleep(400)
    return MOCK_CONVERSATIONS
  },

  async getMessages(conversationId) {
    await sleep(300)
    const conv = MOCK_CONVERSATIONS.find(c => c.id === conversationId)
    return conv?.messages || []
  },

  async sendMessage(conversationId, content) {
    await sleep(200)
    return {
      id: 'm' + Date.now(),
      senderId: 'cu1',
      content,
      createdAt: new Date().toISOString(),
      seen: false,
    }
  },
}