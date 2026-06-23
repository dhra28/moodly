import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

const MORNING_GREETINGS = [
  "Rise and shine",
  "Good morning",
  "A fresh start awaits",
  "Morning, superstar",
  "Today is full of possibilities",
]

const AFTERNOON_GREETINGS = [
  "Good afternoon",
  "Hope your day is going well",
  "Afternoon check-in time",
  "Keep going, you're doing great",
  "Halfway through the day",
]

const EVENING_GREETINGS = [
  "Good evening",
  "Time to reflect",
  "Welcome back",
  "How did today treat you",
  "End the day with gratitude",
]

const SUBTITLES = [
  "How are you feeling today?",
  "What's on your mind?",
  "Take a moment to check in with yourself.",
  "Your feelings matter — log them here.",
  "A little reflection goes a long way.",
  "Ready to journal today?",
]

export default function TopBar({ entryCount }) {
  const { isDark, toggleTheme } = useTheme()
  const { user } = useAuth()

  const hour = new Date().getHours()
  const greetings = hour < 12
    ? MORNING_GREETINGS
    : hour < 17
    ? AFTERNOON_GREETINGS
    : EVENING_GREETINGS

  const [greetingIndex] = useState(() =>
    Math.floor(Math.random() * greetings.length)
  )
  const [subtitleIndex] = useState(() =>
    Math.floor(Math.random() * SUBTITLES.length)
  )

  const greeting = greetings[greetingIndex]
  const subtitle = SUBTITLES[subtitleIndex]
  const username = user?.username
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : 'there'

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '28px 32px 0',
      marginBottom: '24px'
    }}>
      <div>
        <h1 style={{
          fontSize: '22px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          letterSpacing: '-0.4px'
        }}>
          {greeting},{' '}
          <span style={{ color: 'var(--accent)' }}>{username}</span> ✦
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          marginTop: '4px'
        }}>
          {subtitle}
        </p>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--accent-glow)'
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.color = 'var(--accent)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--bg-card)'
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Date */}
        <div style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          background: 'var(--bg-card)',
          padding: '7px 14px',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          📅 {today}
        </div>

        {/* Entry count */}
        <div style={{
          fontSize: '12px',
          color: 'var(--accent)',
          background: 'var(--accent-glow)',
          padding: '7px 14px',
          borderRadius: '20px',
          border: '1px solid var(--border-light)',
        }}>
          {entryCount} entries
        </div>
      </div>
    </div>
  )
}