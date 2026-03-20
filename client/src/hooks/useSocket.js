import { useEffect, useRef, useCallback } from 'react'

// Simulated socket for UI demo — replace with real socket.io in production
export function useSocket(eventHandlers = {}) {
  const handlersRef = useRef(eventHandlers)
  handlersRef.current = eventHandlers

  const emit = useCallback((event, data) => {
    console.log('[Socket] Emit:', event, data)
    // In real app: socket.emit(event, data)
  }, [])

  useEffect(() => {
    // Simulate typing indicator clearing
    const timer = setTimeout(() => {
      handlersRef.current?.onStopTyping?.()
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return { emit, connected: true }
}