const TAG_GROUPS = [
  { group: 'Work', tags: ['Work', 'Coding', 'Meeting', 'Productive', 'Creative'] },
  { group: 'Health', tags: ['Exercise', 'Sleep', 'Health', 'Meditation', 'Diet'] },
  { group: 'Social', tags: ['Friends', 'Family', 'Social', 'Alone time', 'Dating'] },
  { group: 'Emotions', tags: ['Grateful', 'Anxious', 'Excited', 'Stressed', 'Calm'] },
  { group: 'Life', tags: ['Travel', 'Nature', 'Music', 'Reading', 'Food'] },
]

export default function TagSelector({ selected, onToggle }) {
  return (
    <div>
      <p style={{
        fontSize: '11px',
        fontWeight: '500',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        marginBottom: '10px'
      }}>
        Tags
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {TAG_GROUPS.map(({ group, tags }) => (
          <div key={group}>
            <p style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              {group}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {tags.map(tag => {
                const isActive = selected.includes(tag.toLowerCase())
                return (
                  <button
                    key={tag}
                    onClick={() => onToggle(tag.toLowerCase())}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '500',
                      border: isActive
                        ? '1px solid var(--accent)'
                        : '1px solid var(--border)',
                      background: isActive
                        ? 'var(--accent-glow)'
                        : 'var(--bg-card)',
                      color: isActive
                        ? 'var(--accent)'
                        : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'var(--accent)'
                        e.currentTarget.style.color = 'var(--accent)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'var(--border)'
                        e.currentTarget.style.color = 'var(--text-secondary)'
                      }
                    }}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}