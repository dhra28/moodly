import { Trash2 } from 'lucide-react'
import { deleteEntry } from '../../utils/api'
import { useState } from 'react'

const moodEmoji = { sad: '😔', meh: '😐', okay: '🙂', good: '😊', great: '🤩' }
const moodColor = {
  sad: '#ef4444', meh: '#f59e0b',
  okay: '#3b82f6', good: '#8b5cf6', great: '#22c55e'
}

export default function RecentEntries({ entries, onDeleted }) {
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (id) => {
    try {
      setDeletingId(id)
      await deleteEntry(id)
      onDeleted()
    } catch (err) {
      console.error('Delete failed', err)
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  if (entries.length === 0) {
    return (
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '32px',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '32px', marginBottom: '10px' }}>📝</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          No entries yet — start journaling above!
        </p>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '18px 20px'
    }}>
      <p style={{
        fontSize: '11px',
        fontWeight: '500',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        marginBottom: '14px'
      }}>
        Recent entries
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {entries.slice(0, 5).map(entry => (
          <div
            key={entry.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              transition: 'border-color 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <span style={{ fontSize: '22px', lineHeight: 1, marginTop: '2px' }}>
              {moodEmoji[entry.mood_label] || '😐'}
            </span>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px'
              }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '500',
                  color: moodColor[entry.mood_label] || 'var(--text-secondary)',
                  textTransform: 'capitalize'
                }}>
                  {entry.mood_label}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  {formatDate(entry.created_at)}
                </span>
                {entry.tags && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {entry.tags.split(',').filter(Boolean).map(tag => (
                      <span key={tag} style={{
                        fontSize: '10px',
                        padding: '1px 7px',
                        borderRadius: '10px',
                        background: 'var(--accent-glow)',
                        color: 'var(--accent-light)',
                        border: '1px solid rgba(124,111,224,0.2)'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {entry.note && (
                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {entry.note}
                </p>
              )}
            </div>

            <button
              onClick={() => handleDelete(entry.id)}
              disabled={deletingId === entry.id}
              style={{
                padding: '6px',
                borderRadius: '6px',
                background: 'transparent',
                border: '1px solid transparent',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'
                e.currentTarget.style.color = '#ef4444'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}