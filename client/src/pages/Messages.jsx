import React, { useState } from 'react'
import { useChat } from '../context/ChatContext'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import BottomNav from '../components/layout/BottomNav'
import ChatSidebar from '../components/chat/ChatSidebar'
import ChatWindow from '../components/chat/ChatWindow'

export default function Messages() {
  const { setActiveConversation } = useChat()
  // 'sidebar' shows conversation list on mobile, 'chat' shows the chat window
  const [mobileView, setMobileView] = useState('sidebar')

  const handleSelectConversation = (conv) => {
    setActiveConversation(conv)
    setMobileView('chat')
  }

  const handleBack = () => {
    setMobileView('sidebar')
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Top Navbar — always visible */}
      <Navbar />

      <div className="flex flex-1 pt-14">
        {/* Left global sidebar — only desktop */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main chat area — sits to the right of the global sidebar */}
        <div className="flex flex-1 lg:ml-60 min-h-[calc(100vh-3.5rem)]">

          {/* ── CONVERSATION LIST ─────────────────────────────────────
              Desktop: always visible as a left panel
              Mobile:  full-screen when mobileView === 'sidebar'       */}
          <div className={`
            ${mobileView === 'sidebar' ? 'flex' : 'hidden'}
            lg:flex
            w-full lg:w-72 flex-shrink-0
            border-r border-dark-border
            h-[calc(100vh-3.5rem)]
          `}>
            <ChatSidebar onSelectConversation={handleSelectConversation} />
          </div>

          {/* ── CHAT WINDOW ───────────────────────────────────────────
              Desktop: always visible, fills remaining space
              Mobile:  full-screen when mobileView === 'chat'          */}
          <div className={`
            ${mobileView === 'chat' ? 'flex' : 'hidden'}
            lg:flex
            flex-1
            h-[calc(100vh-3.5rem)]
          `}>
            <ChatWindow onBack={handleBack} />
          </div>

        </div>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}