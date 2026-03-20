import { sleep } from '../utils/helpers'
import { MOCK_NOTIFICATIONS } from '@/data/mockData'

export const notificationService = {
  async getNotifications() {
    await sleep(300)
    return MOCK_NOTIFICATIONS
  },

  async markAsRead(id) {
    await sleep(100)
    return { success: true }
  },

  async markAllAsRead() {
    await sleep(200)
    return { success: true }
  },
}