import { useState } from 'react'
import { Search, Download, Trash2 } from 'lucide-react'
import { deleteEntry, exportEntries } from '../utils/api'

const moodEmoji = { sad: '😔', meh: '😐', okay: '🙂', good: '😊', great: '🤩' }
const moodColor = {
  sad: '#ef4444', meh: '#f59e0b',
  okay: '#3b82f6', good: '#8b5cf6', great: '#22c55e'
}

export default function HistoryPage({ entries, onDeleted }) {
  const [search, setSearch] = useState('')
  const [filterMood, setFilterMood] = useState('all')
  const [deletingId, setDeletingId] = useState(null)
  const [exporting, setExporting] = useState(false)

  const filtered = entries.filter(e => {
    const matchSearch = search === '' ||
      e.note.toLowerCase().includes(search.toLowerCase()) ||
      e.tags.toLowerCase().includes(search.toLowerCase()) ||
      e.mood_label.toLowerCase().includes(search.toLowerCase())
    const matchMood = filterMood === 'all' || e.mood_label === filterMood
    return matchSearch && matchMood
  })

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

  const handleExport = async () => {
    try {
      setExporting(true)
      const res = await exportEntries()
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'moodly_entries.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed', err)
    } finally {
      setExporting(false)
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  return (
    <div style={{ padding: '0 32px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Journal History
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {entries.length} total entries
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || entries.length === 0}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px',
            background: 'var(--accent-glow)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--accent)',
            fontSize: '13px', fontWeight: '500',
            cursor: exporting || entries.length === 0 ? 'not-allowed' : 'pointer',
            opacity: entries.length === 0 ? 0.5 : 1,
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => {
            if (entries.length > 0) {
              e.currentTarget.style.background = 'var(--accent)'
              e.currentTarget.style.color = '#fff'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--accent-glow)'
            e.currentTarget.style.color = 'var(--accent)'
          }}
        >
          <Download size={14} />
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: '8px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '0 12px'
        }}>
          <Search size={14} color='var(--text-muted)' />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by note, tag or mood..."
            style={{
              flex: 1, padding: '10px 0',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '13px'
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                background: 'none', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer',
                fontSize: '16px', lineHeight: 1
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Mood filter */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'sad', 'meh', 'okay', 'good', 'great'].map(mood => (
            <button
              key={mood}
              onClick={() => setFilterMood(mood)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: '500',
                border: filterMood === mood
                  ? '1px solid var(--accent)'
                  : '1px solid var(--border)',
                background: filterMood === mood
                  ? 'var(--accent-glow)'
                  : 'var(--bg-secondary)',
                color: filterMood === mood
                  ? 'var(--accent)'
                  : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {mood === 'all' ? 'All' : moodEmoji[mood]}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {(search || filterMood !== 'all') && (
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Showing <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{filtered.length}</span> of {entries.length} entries
        </p>
      )}

      {/* Entries list */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <p style={{ fontSize: '32px', marginBottom: '10px' }}>
              {search || filterMood !== 'all' ? '🔍' : '📝'}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {search || filterMood !== 'all'
                ? 'No entries match your search'
                : 'No entries yet — start journaling!'}
            </p>
            {(search || filterMood !== 'all') && (
              <button
                onClick={() => { setSearch(''); setFilterMood('all') }}
                style={{
                  marginTop: '12px', padding: '8px 16px',
                  background: 'var(--accent-glow)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--accent)', fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div>
            {filtered.map((entry, i) => (
              <div
                key={entry.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  padding: '16px 20px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '24px', lineHeight: 1, marginTop: '2px', flexShrink: 0 }}>
                  {moodEmoji[entry.mood_label] || '😐'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: '8px', marginBottom: '5px', flexWrap: 'wrap'
                  }}>
                    <span style={{
                      fontSize: '12px', fontWeight: '600',
                      color: moodColor[entry.mood_label],
                      textTransform: 'capitalize'
                    }}>
                      {entry.mood_label}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      background: 'var(--bg-card)',
                      padding: '1px 8px',
                      borderRadius: '10px',
                      border: '1px solid var(--border)'
                    }}>
                      {formatDate(entry.created_at)}
                    </span>
                    {entry.tags && entry.tags.split(',').filter(Boolean).map(tag => (
                      <span key={tag} style={{
                        fontSize: '10px', padding: '1px 7px',
                        borderRadius: '10px',
                        background: 'var(--accent-glow)',
                        color: 'var(--accent)',
                        border: '1px solid var(--border-light)'
                      }}>
                        {tag.trim()}
                      </span>
                    ))}
                    <span style={{
                      fontSize: '11px', color: 'var(--text-muted)',
                      marginLeft: 'auto'
                    }}>
                      {entry.mood_score}/5
                    </span>
                  </div>
                  {entry.note ? (
                    <p style={{
                      fontSize: '13px', color: 'var(--text-secondary)',
                      lineHeight: '1.6'
                    }}>
                      {entry.note}
                    </p>
                  ) : (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No note written
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                  style={{
                    padding: '6px', borderRadius: '6px',
                    background: 'transparent',
                    border: '1px solid transparent',
                    color: 'var(--text-muted)',
                    cursor: 'pointer', flexShrink: 0,
                    transition: 'all 0.15s ease'
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
        )}
      </div>
    </div>
  )
}