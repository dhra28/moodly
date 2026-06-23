const moods = [
  { score: 1, label: 'sad', emoji: '😔', color: '#ef4444' },
  { score: 2, label: 'meh', emoji: '😐', color: '#f59e0b' },
  { score: 3, label: 'okay', emoji: '🙂', color: '#3b82f6' },
  { score: 4, label: 'good', emoji: '😊', color: '#8b5cf6' },
  { score: 5, label: 'great', emoji: '🤩', color: '#22c55e' },
]

export default function MoodPicker({ selected, onSelect }) {
  return (
    <div>
      <p style={{
        fontSize: '11px',
        fontWeight: '500',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        marginBottom: '12px'
      }}>
        Today's mood
      </p>
      <div style={{
        display: 'flex',
        gap: '10px'
      }}>
        {moods.map((mood) => {
          const isSelected = selected?.score === mood.score
          return (
            <button
              key={mood.score}
              onClick={() => onSelect(mood)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 10px',
                borderRadius: 'var(--radius-md)',
                border: isSelected
                  ? `1.5px solid ${mood.color}`
                  : '1.5px solid var(--border)',
                background: isSelected
                  ? `${mood.color}18`
                  : 'var(--bg-card)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                transform: isSelected ? 'translateY(-2px)' : 'none',
                boxShadow: isSelected
                  ? `0 4px 12px ${mood.color}30`
                  : 'none'
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = mood.color
                  e.currentTarget.style.background = `${mood.color}10`
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'var(--bg-card)'
                  e.currentTarget.style.transform = 'none'
                }
              }}
            >
              <span style={{ fontSize: '26px', lineHeight: 1 }}>{mood.emoji}</span>
              <span style={{
                fontSize: '11px',
                fontWeight: '500',
                color: isSelected ? mood.color : 'var(--text-muted)',
                textTransform: 'capitalize'
              }}>
                {mood.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}