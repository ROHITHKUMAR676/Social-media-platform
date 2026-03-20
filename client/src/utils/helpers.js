import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns'

export const formatRelativeTime = (dateString) => {
  try {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return 'recently'
  }
}

export const formatMessageTime = (dateString) => {
  try {
    const date = new Date(dateString)
    return format(date, 'h:mm a')
  } catch {
    return ''
  }
}

export const formatMessageGroupDate = (dateString) => {
  try {
    const date = new Date(dateString)
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'MMMM d, yyyy')
  } catch {
    return ''
  }
}

export const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return num.toString()
}

export const calculateProfileMatch = (userSkills, forumSkills) => {
  if (!userSkills?.length || !forumSkills?.length) return 0
  const matched = forumSkills.filter(skill =>
    userSkills.some(us => us.toLowerCase() === skill.toLowerCase())
  )
  return Math.round((matched.length / forumSkills.length) * 100)
}

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const clsx = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const truncate = (str, n) => {
  return str?.length > n ? str.substr(0, n - 1) + '…' : str
} 