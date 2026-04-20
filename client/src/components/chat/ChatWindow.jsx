import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Video, MoreHorizontal, ArrowLeft } from 'lucide-react'
import { useChat } from '../../context/ChatContext'
import { useAuth } from '../../context/AuthContext'
import MessageBubble, { DateDivider } from './MessageBubble'
import ChatInput from './ChatInput'
import { OnlineDot } from '../common/Badge'
import { formatMessageGroupDate } from '../../utils/helpers'
import UserAvatar from '../common/UserAvatar'

const getUserId = (user) => user?._id?.toString() || user?.id?.toString() || null

function groupMessagesByDate(messages) {
  const groups = []
  let currentDate = null

  messages.forEach((msg) => {
    const date = formatMessageGroupDate(msg.createdAt)
    if (date !== currentDate) {
      groups.push({ type: 'divider', label: date, id: `div-${msg.id}` })
      currentDate = date
    }
    groups.push({ type: 'message', ...msg })
  })

  return groups
}

export default function ChatWindow({ onBack }) {
  const { activeConversation, sendMessage, isLoading } = useChat()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    if (activeConversation) {
      setMessages(activeConversation.messages || [])
    }
  }, [activeConversation])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (content) => {
    try {
      const msg = await sendMessage(activeConversation.id, content)
      setMessages((prev) => [...prev, msg])
    } catch (err) {
      console.error(err)
    }
  }

  if (!activeConversation) {
    return (
      <div className="flex-1 hidden lg:flex flex-col items-center justify-center bg-dark-bg">
        <div className="w-20 h-20 rounded-3xl bg-dark-card border border-dark-border flex items-center justify-center mb-4">
          <span className="text-4xl">💬</span>
        </div>
        <h3 className="font-display font-bold text-white text-xl mb-2">Your Messages</h3>
        <p className="text-surface-500 text-sm text-center max-w-xs">
          Select a conversation from the left or follow a developer to start chatting.
        </p>
      </div>
    )
  }

  const grouped = groupMessagesByDate(messages)
  const { participant } = activeConversation

  return (
    <div className="flex-1 flex flex-col bg-dark-bg min-w-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border bg-dark-card flex-shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center justify-center w-8 h-8 rounded-xl text-surface-400 hover:text-white hover:bg-dark-hover transition-all lg:hidden"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="relative">
            <UserAvatar user={participant} size="md" />
            <OnlineDot
              isOnline={participant.isOnline}
              className="absolute -bottom-0.5 -right-0.5"
            />
          </div>

          <div>
            <Link to={`/profile/${participant.username}`}>
              <p className="font-semibold text-white text-sm hover:text-brand-400 transition-colors leading-tight">
                {participant.name}
              </p>
            </Link>
            <p className="text-xs leading-tight mt-0.5">
              {participant.isOnline ? (
                <span className="text-emerald-400">Online</span>
              ) : (
                <span className="text-surface-500">Offline</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 rounded-xl text-surface-500 hover:text-white hover:bg-dark-hover transition-all">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl text-surface-500 hover:text-white hover:bg-dark-hover transition-all">
            <Video className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl text-surface-500 hover:text-white hover:bg-dark-hover transition-all">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-surface-500">Loading messages...</p>
          </div>
        ) : grouped.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-surface-500 text-center max-w-xs">
              No messages yet. Start the conversation with {participant.name.split(' ')[0]}.
            </p>
          </div>
        ) : (
          grouped.map((item) =>
            item.type === 'divider' ? (
              <DateDivider key={item.id} label={item.label} />
            ) : (
              <MessageBubble
                key={item.id}
                message={item}
                isMine={item.senderId === getUserId(user) || item.senderId === 'cu1'}
              />
            )
          )
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  )
}
