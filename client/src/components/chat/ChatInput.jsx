import React, { useState, useRef } from 'react'
import { Send, Smile, Paperclip } from 'lucide-react'

export default function ChatInput({ onSend, onTyping }) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e) => {
    setMessage(e.target.value)
    onTyping?.()
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }

  const handleSend = () => {
    if (!message.trim()) return
    onSend(message.trim())
    setMessage('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  return (
    /*
     * KEY FIX — mobile:
     *   • pb-safe  → respects iOS home-bar
     *   • mb-16 lg:mb-0 → clears the 64px bottom-nav on mobile (lg: no nav)
     *   • bg-dark-card  → solid bg so it doesn't bleed through the nav
     *   • flex-shrink-0 → never shrinks inside the flex-col ChatWindow
     */
    <div className="
      flex-shrink-0
      flex items-end gap-3
      px-4 pt-3 pb-3
      mb-16 lg:mb-0
      border-t border-dark-border
      bg-dark-card
    ">
      {/* Attachment */}
      <button className="
        p-2.5 rounded-xl flex-shrink-0
        text-surface-500 hover:text-surface-300 hover:bg-dark-hover
        transition-all
      ">
        <Paperclip className="w-5 h-5" />
      </button>

      {/* Text field */}
      <div className="
        flex-1 flex items-end gap-2
        bg-dark-bg border border-dark-border rounded-2xl
        px-4 py-2.5
        focus-within:ring-1 focus-within:ring-brand-500/50
        transition-all
      ">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          rows={1}
          className="
            flex-1 bg-transparent text-sm text-white
            placeholder-surface-600 focus:outline-none
            resize-none leading-relaxed max-h-28 scrollbar-hide
          "
        />
        <button className="
          text-surface-500 hover:text-surface-300
          transition-colors flex-shrink-0 pb-0.5
        ">
          <Smile className="w-5 h-5" />
        </button>
      </div>

      {/* Send */}
      <button
        onClick={handleSend}
        disabled={!message.trim()}
        className="
          p-2.5 rounded-xl flex-shrink-0
          bg-brand-600 text-white shadow-brand
          hover:bg-brand-500 transition-all
          disabled:opacity-30 disabled:shadow-none
        "
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  )
}