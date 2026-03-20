import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Video, MoreHorizontal, ArrowLeft } from 'lucide-react'
import { useChat } from '../../context/ChatContext'
import { useAuth } from '../../context/AuthContext'
import MessageBubble, { TypingIndicator, DateDivider } from './MessageBubble'
import ChatInput from './ChatInput'
import { OnlineDot } from '../common/Badge'
import { formatMessageGroupDate } from '../../utils/helpers'
import UserAvatar from '../common/UserAvatar'
function groupMessagesByDate(messages) {
  const groups = []
  let currentDate = null
  messages.forEach(msg => {
    const date = formatMessageGroupDate(msg.createdAt)
    if (date !== currentDate) {
      groups.push({ type: 'divider', label: date, id: 'div-' + msg.id })
      currentDate = date
    }
    groups.push({ type: 'message', ...msg })
  })
  return groups
}

export default function ChatWindow({ onBack }) {
  const { activeConversation, sendMessage } = useChat()
  const { user } = useAuth()
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([])
  const bottomRef = useRef(null)
  const typingTimer = useRef(null)

  useEffect(() => {
    if (activeConversation) {
      setMessages(activeConversation.messages || [])
    }
  }, [activeConversation])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async (content) => {
    const msg = await sendMessage(activeConversation.id, content)
    setMessages(prev => [...prev, msg])

    // Simulate reply
    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const reply = {
          id: 'reply-' + Date.now(),
          senderId: activeConversation.participant.id,
          content: getAutoReply(content),
          createdAt: new Date().toISOString(),
          seen: false,
        }
        setMessages(prev => [...prev, reply])
      }, 2000)
    }, 800)
  }

  const handleTyping = () => {
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {}, 1500)
  }

  // Empty state — no conversation selected (desktop only; mobile shows list instead)
  if (!activeConversation) {
    return (
      <div className="flex-1 hidden lg:flex flex-col items-center justify-center bg-dark-bg">
        <div className="w-20 h-20 rounded-3xl bg-dark-card border border-dark-border flex items-center justify-center mb-4">
          <span className="text-4xl">💬</span>
        </div>
        <h3 className="font-display font-bold text-white text-xl mb-2">Your Messages</h3>
        <p className="text-surface-500 text-sm text-center max-w-xs">
          Select a conversation from the left to start chatting.
        </p>
      </div>
    )
  }

  const grouped = groupMessagesByDate(messages)
  const { participant } = activeConversation

  return (
    <div className="flex-1 flex flex-col bg-dark-bg min-w-0 overflow-hidden">

      {/* ── Chat header ─────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border bg-dark-card flex-shrink-0">
        <div className="flex items-center gap-3">

          {/* Back button — visible on ALL screen sizes when onBack is provided */}
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
              {participant.isOnline
                ? <span className="text-emerald-400">Online</span>
                : <span className="text-surface-500">Offline</span>
              }
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

      {/* ── Messages area ───────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
        {grouped.map(item =>
          item.type === 'divider' ? (
            <DateDivider key={item.id} label={item.label} />
          ) : (
            <MessageBubble
              key={item.id}
              message={item}
              isMine={item.senderId === user?.id || item.senderId === 'cu1'}
            />
          )
        )}
        {isTyping && <TypingIndicator name={participant.name.split(' ')[0]} />}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ───────────────────────────────────── */}
      <ChatInput onSend={handleSend} onTyping={handleTyping} />
    </div>
  )
}

function getAutoReply(msg) {
  const replies = [
    "That's really interesting! Tell me more.",
    "Totally agree with that approach.",
    "Have you tried using a different pattern for that?",
    "Yeah, I've run into that same issue before.",
    "Nice! What's your tech stack for this?",
    "Sounds like a solid plan 🔥",
    "I'd love to collaborate on that sometime.",
    "Thanks for sharing! Super helpful.",
  ]
  return replies[Math.floor(Math.random() * replies.length)]
}