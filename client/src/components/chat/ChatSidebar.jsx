import React, { useState } from 'react'
import { Search, Edit } from 'lucide-react'
import { useChat } from '../../context/ChatContext'
import { OnlineDot } from '../common/Badge'
import { formatRelativeTime, truncate } from '../../utils/helpers'
import UserAvatar from '../common/UserAvatar'
export default function ChatSidebar({ onSelectConversation }) {
  const { conversations, activeConversation, setActiveConversation } = useChat()
  const [search, setSearch] = useState('')

  const filtered = conversations.filter(c =>
    c.participant.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleClick = (conv) => {
    setActiveConversation(conv)
    // Notify parent page so mobile can switch to chat view
    onSelectConversation?.(conv)
  }

  return (
    <div className="w-full flex flex-col bg-dark-card h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-dark-border flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-white text-lg">Messages</h2>
          <button className="p-2 rounded-lg text-surface-500 hover:text-white hover:bg-dark-hover transition-all">
            <Edit className="w-4 h-4" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full bg-dark-bg border border-dark-border rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-surface-600 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
          />
        </div>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center p-4">
            <p className="text-surface-500 text-sm">No conversations found</p>
          </div>
        ) : (
          filtered.map(conv => (
            <button
              key={conv.id}
              onClick={() => handleClick(conv)}
              className={[
                'w-full flex items-center gap-3 px-4 py-3',
                'hover:bg-dark-hover transition-all text-left',
                'border-b border-dark-border/50',
                activeConversation?.id === conv.id
                  ? 'bg-brand-600/10 border-l-2 border-l-brand-500'
                  : ''
              ].join(' ')}
            >
              <div className="relative flex-shrink-0">
                <UserAvatar user={conv.participant} size="md" />
                <OnlineDot
                  isOnline={conv.participant.isOnline}
                  className="absolute -bottom-0.5 -right-0.5"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold truncate ${
                    activeConversation?.id === conv.id ? 'text-brand-300' : 'text-white'
                  }`}>
                    {conv.participant.name}
                  </p>
                  <span className="text-xs text-surface-600 flex-shrink-0 ml-2">
                    {formatRelativeTime(conv.lastMessageTime).replace(' ago', '')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-xs truncate ${
                    conv.unread > 0 ? 'text-surface-300 font-medium' : 'text-surface-500'
                  }`}>
                    {truncate(conv.lastMessage, 40)}
                  </p>
                  {conv.unread > 0 && (
                    <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}