import React, { createContext, useContext, useState, useEffect } from 'react'
import { chatService } from '../services/chatService'
import { useAuth } from './AuthContext'

const ChatContext = createContext(null)

export function ChatProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    chatService.getConversations().then(setConversations)
  }, [isAuthenticated])

  const sendMessage = async (conversationId, content) => {
    const msg = await chatService.sendMessage(conversationId, content)
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, msg],
              lastMessage: content,
              lastMessageTime: msg.createdAt,
            }
          : conv
      )
    )
    return msg
  }

  const selectConversation = (conv) => {
    setActiveConversation(conv)
    // Mark as read
    setConversations(prev =>
      prev.map(c => c.id === conv.id ? { ...c, unread: 0 } : c)
    )
  }

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversation,
      setActiveConversation: selectConversation,
      sendMessage,
      isLoading,
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}