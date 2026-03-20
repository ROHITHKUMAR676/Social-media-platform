import React from 'react'
import { CheckCheck, Check } from 'lucide-react'
import { formatMessageTime } from '../../utils/helpers'

export default function MessageBubble({ message, isMine }) {
  return (
    <div className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`
        max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
        ${isMine
          ? 'bg-brand-600 text-white rounded-br-md'
          : 'bg-dark-hover text-surface-200 rounded-bl-md border border-dark-border'
        }
      `}>
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-[10px] ${isMine ? 'text-brand-300/70' : 'text-surface-600'}`}>
            {formatMessageTime(message.createdAt)}
          </span>
          {isMine && (
            message.seen
              ? <CheckCheck className="w-3 h-3 text-brand-300/70" />
              : <Check className="w-3 h-3 text-brand-300/50" />
          )}
        </div>
      </div>
    </div>
  )
}

export function TypingIndicator({ name }) {
  return (
    <div className="flex items-end gap-2">
      <div className="bg-dark-hover border border-dark-border rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-surface-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: '1s' }}
            />
          ))}
        </div>
      </div>
      <span className="text-xs text-surface-600">{name} is typing...</span>
    </div>
  )
}

export function DateDivider({ label }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-dark-border" />
      <span className="text-xs text-surface-600 font-medium px-2">{label}</span>
      <div className="flex-1 h-px bg-dark-border" />
    </div>
  )
}