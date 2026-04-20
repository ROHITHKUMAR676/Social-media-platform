import React, { useEffect, useRef, useState } from 'react'
import { Send, Smile, Paperclip } from 'lucide-react'

const EMOJI_GROUPS = [
  {
    label: 'Smileys',
    emojis: ['😀', '😁', '😂', '🤣', '😊', '😍', '😎', '🤗', '😭', '😡', '😴', '🤔'],
  },
  {
    label: 'Gestures',
    emojis: ['👍', '👋', '🙏', '👏', '🔥', '❤️', '💯', '✨', '🤝', '🙌', '👌', '🤌'],
  },
  {
    label: 'Chat',
    emojis: ['💬', '🎉', '🚀', '🎯', '📌', '✅', '❗', '🤍', '💡', '😅', '🥲', '🤞'],
  },
]

function resizeTextarea(textarea) {
  if (!textarea) return
  textarea.style.height = 'auto'
  textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
}

export default function ChatInput({ onSend, onTyping }) {
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const textareaRef = useRef(null)
  const emojiPopoverRef = useRef(null)
  const selectionRef = useRef({ start: 0, end: 0 })

  useEffect(() => {
    function handleClickOutside(event) {
      if (!emojiPopoverRef.current?.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const syncSelection = () => {
    const textarea = textareaRef.current

    if (!textarea) return

    selectionRef.current = {
      start: textarea.selectionStart ?? message.length,
      end: textarea.selectionEnd ?? message.length,
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e) => {
    setMessage(e.target.value)
    onTyping?.()
    resizeTextarea(textareaRef.current)
    syncSelection()
  }

  const handleSend = () => {
    if (!message.trim()) return

    onSend(message.trim())
    setMessage('')
    setShowEmojiPicker(false)
    selectionRef.current = { start: 0, end: 0 }

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.focus()
    }
  }

  const handleEmojiInsert = (emoji) => {
    const { start, end } = selectionRef.current
    const nextMessage = `${message.slice(0, start)}${emoji}${message.slice(end)}`
    const nextCursor = start + emoji.length

    setMessage(nextMessage)
    setShowEmojiPicker(false)
    onTyping?.()

    requestAnimationFrame(() => {
      if (!textareaRef.current) return

      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(nextCursor, nextCursor)
      selectionRef.current = { start: nextCursor, end: nextCursor }
      resizeTextarea(textareaRef.current)
    })
  }

  return (
    <div
      className="
        flex-shrink-0
        flex items-end gap-3
        px-4 pt-3 pb-3
        mb-16 lg:mb-0
        border-t border-dark-border
        bg-dark-card
      "
    >
      <button
        type="button"
        title="Attachment support coming next"
        className="
          p-2.5 rounded-xl flex-shrink-0
          text-surface-500 hover:text-surface-300 hover:bg-dark-hover
          transition-all
        "
      >
        <Paperclip className="w-5 h-5" />
      </button>

      <div
        className="
          relative
          flex-1 flex items-end gap-2
          bg-dark-bg border border-dark-border rounded-2xl
          px-4 py-2.5
          focus-within:ring-1 focus-within:ring-brand-500/50
          transition-all
        "
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={syncSelection}
          onKeyUp={syncSelection}
          onSelect={syncSelection}
          placeholder="Message..."
          rows={1}
          className="
            flex-1 bg-transparent text-sm text-white
            placeholder-surface-600 focus:outline-none
            resize-none leading-relaxed max-h-28 scrollbar-hide
          "
        />

        <div ref={emojiPopoverRef} className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              syncSelection()
              setShowEmojiPicker((prev) => !prev)
            }}
            className="
              text-surface-500 hover:text-surface-300 hover:bg-dark-hover
              transition-colors flex-shrink-0 pb-0.5 p-1.5 rounded-xl
            "
            aria-label="Open emoji picker"
          >
            <Smile className="w-5 h-5" />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-12 right-0 w-72 bg-dark-card border border-dark-border rounded-2xl shadow-2xl p-3 z-20">
              <div className="space-y-3">
                {EMOJI_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 mb-2">
                      {group.label}
                    </p>
                    <div className="grid grid-cols-6 gap-1">
                      {group.emojis.map((emoji) => (
                        <button
                          key={`${group.label}-${emoji}`}
                          type="button"
                          onClick={() => handleEmojiInsert(emoji)}
                          className="h-10 rounded-xl text-xl hover:bg-dark-hover transition-all"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
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
