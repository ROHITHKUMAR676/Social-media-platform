import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { chatService } from '../services/chatService'
import { useAuth } from './AuthContext'

const ChatContext = createContext(null)

const getUserId = (user) => user?._id?.toString() || user?.id?.toString() || null

export function ChatProvider({ children }) {
  const { isAuthenticated, user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversationState] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const refreshConversations = useCallback(async () => {
    if (!isAuthenticated) {
      setConversations([])
      setActiveConversationState(null)
      return
    }

    setIsLoading(true)
    try {
      const data = await chatService.getConversations()
      setConversations(data)

      setActiveConversationState((prev) => {
        if (!prev) return null

        const nextConversation = data.find(
          (conversation) => conversation.id?.toString() === prev.id?.toString()
        )

        return nextConversation
          ? { ...nextConversation, messages: prev.messages || nextConversation.messages || [] }
          : null
      })
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refreshConversations()
  }, [refreshConversations, user])

  const selectConversation = useCallback(async (conversation) => {
    if (!conversation) {
      setActiveConversationState(null)
      return
    }

    const targetUserId = getUserId(conversation.participant) || conversation.id

    setActiveConversationState((prev) => ({
      ...(prev || conversation),
      ...conversation,
      messages: prev?.id === conversation.id ? prev.messages || [] : conversation.messages || [],
    }))

    setConversations((prev) =>
      prev.map((item) =>
        item.id === conversation.id
          ? { ...item, unread: 0 }
          : item
      )
    )

    setIsLoading(true)
    try {
      const data = await chatService.getMessages(targetUserId)
      const updatedConversation = {
        ...conversation,
        participant: data.participant || conversation.participant,
        unread: 0,
        messages: data.messages,
        lastMessage: data.messages.at(-1)?.content || conversation.lastMessage || '',
        lastMessageTime: data.messages.at(-1)?.createdAt || conversation.lastMessageTime,
      }

      setActiveConversationState(updatedConversation)
      setConversations((prev) =>
        prev.map((item) => (item.id === conversation.id ? updatedConversation : item))
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  const startConversation = useCallback(async (targetUser) => {
    const targetUserId = getUserId(targetUser)

    if (!targetUserId) {
      throw new Error('Invalid user')
    }

    const existingConversation = conversations.find((conversation) => conversation.id === targetUserId)

    if (existingConversation) {
      await selectConversation(existingConversation)
      return existingConversation
    }

    const newConversation = {
      id: targetUserId,
      participant: targetUser,
      lastMessage: '',
      lastMessageTime: null,
      unread: 0,
      messages: [],
    }

    setConversations((prev) => [newConversation, ...prev])
    await selectConversation(newConversation)
    return newConversation
  }, [conversations, selectConversation])

  const sendMessage = useCallback(async (conversationId, content) => {
    const currentConversation =
      conversations.find((conversation) => conversation.id === conversationId) || activeConversation

    if (!currentConversation) {
      throw new Error('Conversation not found')
    }

    const targetUserId = getUserId(currentConversation.participant) || conversationId
    const res = await chatService.sendMessage(targetUserId, content)
    const message = res.message

    const updatedConversation = {
      ...currentConversation,
      participant: res.participant || currentConversation.participant,
      messages: [...(currentConversation.messages || []), message],
      lastMessage: message.content,
      lastMessageTime: message.createdAt,
      unread: 0,
    }

    setActiveConversationState(updatedConversation)
    setConversations((prev) => {
      const withoutCurrent = prev.filter((conversation) => conversation.id !== updatedConversation.id)
      return [updatedConversation, ...withoutCurrent]
    })

    return message
  }, [activeConversation, conversations])

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        setActiveConversation: selectConversation,
        startConversation,
        sendMessage,
        isLoading,
        refreshConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}
