import React from 'react'

import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { ChatProvider } from './context/ChatContext'
import { ForumProvider } from './context/ForumContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    
      <AuthProvider>
        <NotificationProvider>
          <ChatProvider>
            <ForumProvider>
              <AppRoutes />
            </ForumProvider>
          </ChatProvider>
        </NotificationProvider>
      </AuthProvider>
    
  )
}