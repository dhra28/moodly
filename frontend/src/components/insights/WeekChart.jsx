const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const moodColor = {
  1: '#ef4444',
  2: '#f59e0b',
  3: '#3b82f6',
  4: '#8b5cf6',
  5: '#22c55e'
}

export default function WeekChart({ entries }) {
  const today = new Date()

  const weekData = DAYS.map((day, i) => {
    const date = new Date(today)
    const dayOfWeek = today.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    date.setDate(today.getDate() + mondayOffset + i)

    const dateKey = date.toISOString().split('T')[0]
    const dayEntries = entries.filter(e =>
      new Date(e.created_at).toISOString().split('T')[0] === dateKey
    )

    const avgScore = dayEntries.length
      ? Math.round(dayEntries.reduce((sum, e) => sum + e.mood_score, 0) / dayEntries.length)
      : null

    const isToday = dateKey === today.toISOString().split('T')[0]

    return { day, avgScore, isToday, date }
  })

  const maxScore = 5

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px'
    }}>
      <p style={{
        fontSize: '11px',
        fontWeight: '500',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        marginBottom: '16px'
      }}>
        This week
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        height: '80px'
      }}>
        {weekData.map(({ day, avgScore, isToday }) => {
          const height = avgScore ? (avgScore / maxScore) * 72 : 4
          const color = avgScore ? moodColor[avgScore] : 'var(--border)'

          return (
            <div
              key={day}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                height: '100%',
                justifyContent: 'flex-end'
              }}
            >
              <div
                title={avgScore ? `${day}: ${avgScore}/5` : `${day}: no entry`}
                style={{
                  width: '100%',
                  height: `${height}px`,
                  borderRadius: '4px 4px 0 0',
                  background: avgScore ? `${color}80` : 'var(--bg-card)',
                  border: `1px solid ${avgScore ? color : 'var(--border)'}`,
                  borderBottom: 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = avgScore ? color : 'var(--bg-hover)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = avgScore ? `${color}80` : 'var(--bg-card)'
                }}
              />
              <span style={{
                fontSize: '9px',
                color: isToday ? 'var(--accent-light)' : 'var(--text-muted)',
                fontWeight: isToday ? '600' : '400'
              }}>
                {day}
              </span>
            </div>
          )
        })}
      </div>

      {/* Baseline */}
      <div style={{
        height: '1px',
        background: 'var(--border)',
        marginTop: '0px'
      }} />
    </div>
  )
}