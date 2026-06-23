import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const moodColors = {
  1: { bg: '#ef444425', border: '#ef4444', text: '#ef4444' },
  2: { bg: '#f59e0b25', border: '#f59e0b', text: '#f59e0b' },
  3: { bg: '#3b82f625', border: '#3b82f6', text: '#3b82f6' },
  4: { bg: '#8b5cf625', border: '#8b5cf6', text: '#8b5cf6' },
  5: { bg: '#22c55e25', border: '#22c55e', text: '#22c55e' },
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const getMoodEmoji = (score) => {
  const emojis = { 1: '😔', 2: '😐', 3: '🙂', 4: '😊', 5: '🤩' }
  return emojis[score] || ''
}

export default function HeatMap({ entries }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth()

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  const goToPrev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  const goToNext = () => {
    if (isCurrentMonth) return
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const entryMap = {}
  entries.forEach(entry => {
    const date = new Date(entry.created_at)
    if (date.getMonth() === viewMonth && date.getFullYear() === viewYear) {
      const day = date.getDate()
      if (!entryMap[day] || entry.mood_score > entryMap[day].score) {
        entryMap[day] = { score: entry.mood_score, label: entry.mood_label }
      }
    }
  })

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1

  const loggedDays = Object.keys(entryMap).length
  const pastDays = isCurrentMonth ? today.getDate() : daysInMonth
  const consistency = pastDays > 0 ? Math.round((loggedDays / pastDays) * 100) : 0

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '16px 18px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={goToPrev}
            style={{
              width: '24px', height: '24px',
              borderRadius: '6px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={13} />
          </button>
          <p style={{
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            minWidth: '120px',
            textAlign: 'center'
          }}>
            {monthName} — Mood Heatmap
          </p>
          <button
            onClick={goToNext}
            disabled={isCurrentMonth}
            style={{
              width: '24px', height: '24px',
              borderRadius: '6px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: isCurrentMonth ? 'var(--text-muted)' : 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: isCurrentMonth ? 'not-allowed' : 'pointer',
              opacity: isCurrentMonth ? 0.4 : 1
            }}
          >
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {[1, 2, 3, 4, 5].map(score => (
            <div key={score} style={{
              display: 'flex', alignItems: 'center', gap: '3px'
            }}>
              <div style={{
                width: '10px', height: '10px',
                borderRadius: '2px',
                background: moodColors[score].bg,
                border: `1.5px solid ${moodColors[score].border}`
              }} />
              <span style={{ fontSize: '10px' }}>{getMoodEmoji(score)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekday headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '3px',
        marginBottom: '3px'
      }}>
        {weekDays.map(d => (
          <div key={d} style={{
            textAlign: 'center',
            fontSize: '9px',
            color: 'var(--text-muted)',
            fontWeight: '500',
            padding: '2px 0'
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '3px'
      }}>
        {/* Empty offset cells */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`e-${i}`} style={{ aspectRatio: '1' }} />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const entry = entryMap[day]
          const isToday = isCurrentMonth && day === today.getDate()
          const isFuture = isCurrentMonth && day > today.getDate()
          const colors = entry ? moodColors[entry.score] : null

          return (
            <div
              key={day}
              title={
                entry
                  ? `${day} ${monthName} — ${entry.label} ${getMoodEmoji(entry.score)} (${entry.score}/5)`
                  : isFuture
                  ? `${day} — upcoming`
                  : `${day} — no entry`
              }
              style={{
                aspectRatio: '1',
                borderRadius: '4px',
                background: isFuture
                  ? 'transparent'
                  : entry
                  ? colors.bg
                  : 'var(--bg-card)',
                border: isToday
                  ? '2px solid var(--accent)'
                  : entry
                  ? `1.5px solid ${colors.border}60`
                  : isFuture
                  ? '1px dashed var(--border)'
                  : '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: isToday ? '700' : '400',
                color: entry
                  ? colors.text
                  : isToday
                  ? 'var(--accent)'
                  : 'var(--text-muted)',
                cursor: entry ? 'pointer' : 'default',
                opacity: isFuture ? 0.25 : 1,
                transition: 'transform 0.1s ease'
              }}
              onMouseEnter={e => {
                if (!isFuture) e.currentTarget.style.transform = 'scale(1.15)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              {day}
            </div>
          )
        })}
      </div>

      {/* Footer stats */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginTop: '12px',
        paddingTop: '10px',
        borderTop: '1px solid var(--border)'
      }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
            {loggedDays}
          </span> days logged
        </div>
        {isCurrentMonth && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
              {daysInMonth - today.getDate()}
            </span> days remaining
          </div>
        )}
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          <span style={{
            color: consistency >= 70 ? '#22c55e' : consistency >= 40 ? '#f59e0b' : '#ef4444',
            fontWeight: '600'
          }}>
            {consistency}%
          </span> consistency
        </div>
      </div>
    </div>
  )
}