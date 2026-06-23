const moodEmoji = { sad: '😔', meh: '😐', okay: '🙂', good: '😊', great: '🤩' }
const moodColor = {
  sad: '#ef4444', meh: '#f59e0b',
  okay: '#3b82f6', good: '#8b5cf6', great: '#22c55e'
}

export default function PatternsPage({ entries }) {
  const today = new Date()
  const dates = new Set(entries.map(e =>
    new Date(e.created_at).toISOString().split('T')[0]
  ))

  let currentStreak = 0
  let checkDate = new Date(today)
  while (dates.has(checkDate.toISOString().split('T')[0])) {
    currentStreak++
    checkDate.setDate(checkDate.getDate() - 1)
  }

  let longestStreak = 0
  let tempStreak = 0
  const sortedDates = [...dates].sort()
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1
    } else {
      const prev = new Date(sortedDates[i - 1])
      const curr = new Date(sortedDates[i])
      const diff = (curr - prev) / (1000 * 60 * 60 * 24)
      if (diff === 1) tempStreak++
      else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak)
  }

  const totalDays = dates.size
  const streakBadge = currentStreak >= 100
    ? { label: '🥇 Legend', color: '#f59e0b' }
    : currentStreak >= 30
    ? { label: '🥈 Dedicated', color: '#9ca3af' }
    : currentStreak >= 7
    ? { label: '🥉 Consistent', color: '#cd7c2f' }
    : { label: '🔥 Building', color: '#7c6fe0' }

  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - 6)
  const weekEntries = entries.filter(e => new Date(e.created_at) >= weekStart)
  const lastWeekStart = new Date(weekStart)
  lastWeekStart.setDate(weekStart.getDate() - 7)
  const lastWeekEntries = entries.filter(e => {
    const d = new Date(e.created_at)
    return d >= lastWeekStart && d < weekStart
  })

  const weekAvg = weekEntries.length
    ? Math.round((weekEntries.reduce((s, e) => s + e.mood_score, 0) / weekEntries.length) * 10) / 10
    : null
  const lastWeekAvg = lastWeekEntries.length
    ? Math.round((lastWeekEntries.reduce((s, e) => s + e.mood_score, 0) / lastWeekEntries.length) * 10) / 10
    : null
  const weekBest = weekEntries.length ? weekEntries.reduce((a, b) => a.mood_score > b.mood_score ? a : b) : null
  const weekWorst = weekEntries.length ? weekEntries.reduce((a, b) => a.mood_score < b.mood_score ? a : b) : null
  const moodDelta = weekAvg && lastWeekAvg ? Math.round((weekAvg - lastWeekAvg) * 10) / 10 : null

  const tagCounts = {}
  entries.forEach(e => {
    e.tags.split(',').filter(Boolean).forEach(tag => {
      const t = tag.trim()
      tagCounts[t] = (tagCounts[t] || 0) + 1
    })
  })
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 12)
  const maxTagCount = topTags[0]?.[1] || 1

  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on',
    'at', 'to', 'for', 'of', 'with', 'is', 'was', 'it', 'i', 'my', 'me',
    'had', 'have', 'be', 'so', 'this', 'that', 'very', 'just', 'felt',
    'day', 'today', 'really', 'got', 'did', 'not', 'all', 'been', 'feel'])
  const wordCounts = {}
  entries.forEach(e => {
    e.note.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/)
      .filter(w => w.length > 3 && !stopWords.has(w))
      .forEach(w => { wordCounts[w] = (wordCounts[w] || 0) + 1 })
  })
  const topWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]).slice(0, 20)
  const maxWordCount = topWords[0]?.[1] || 1

  const sortedByMood = [...entries].sort((a, b) => b.mood_score - a.mood_score)
  const best3 = sortedByMood.slice(0, 3)
  const worst3 = sortedByMood.slice(-3).reverse()

  const wordColors = ['var(--accent)', '#22c55e', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6']

  return (
    <div style={{ padding: '0 32px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>Patterns</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Deep insights into your emotional journey
        </p>
      </div>

      {/* Row 1 — Streak + Weekly */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '16px' }}>🔥 Streak stats</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {[
              { label: 'Current streak', value: `${currentStreak}d`, color: '#f59e0b' },
              { label: 'Longest streak', value: `${longestStreak}d`, color: '#7c6fe0' },
              { label: 'Total days', value: `${totalDays}d`, color: '#22c55e' },
            ].map(item => (
              <div key={item.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: '700', color: item.color, letterSpacing: '-0.5px' }}>{item.value}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'var(--accent-glow)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '20px' }}>{streakBadge.label.split(' ')[0]}</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: streakBadge.color }}>{streakBadge.label.split(' ').slice(1).join(' ')}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {currentStreak >= 7 ? "You're on a roll — keep it up!" : 'Journal daily to earn streak badges'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '16px' }}>📅 This week vs last week</p>
          {weekEntries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>No entries this week yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Avg mood</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {lastWeekAvg && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lastWeekAvg} last week</span>}
                  <span style={{ fontSize: '16px', fontWeight: '700', color: weekAvg >= 4 ? '#22c55e' : weekAvg >= 3 ? '#7c6fe0' : '#ef4444' }}>{weekAvg}/5</span>
                  {moodDelta !== null && (
                    <span style={{ fontSize: '11px', color: moodDelta > 0 ? '#22c55e' : moodDelta < 0 ? '#ef4444' : 'var(--text-muted)', fontWeight: '600' }}>
                      {moodDelta > 0 ? `↑ +${moodDelta}` : moodDelta < 0 ? `↓ ${moodDelta}` : '→ same'}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ padding: '10px 12px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '10px', color: '#22c55e', marginBottom: '4px' }}>Best day</div>
                  <div style={{ fontSize: '14px' }}>{weekBest ? moodEmoji[weekBest.mood_label] : '—'}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {weekBest ? new Date(weekBest.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '—'}
                  </div>
                </div>
                <div style={{ padding: '10px 12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '10px', color: '#ef4444', marginBottom: '4px' }}>Tough day</div>
                  <div style={{ fontSize: '14px' }}>{weekWorst ? moodEmoji[weekWorst.mood_label] : '—'}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {weekWorst ? new Date(weekWorst.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '—'}
                  </div>
                </div>
              </div>
              <div style={{ padding: '8px 14px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{weekEntries.length}</span> entries this week
                {lastWeekEntries.length > 0 && <span> vs <span style={{ color: 'var(--text-muted)' }}>{lastWeekEntries.length}</span> last week</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row 2 — Tags + Word cloud */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '16px' }}>🏷️ Most journaled tags</p>
          {topTags.length === 0 ? (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Add tags to your entries to see patterns</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {topTags.map(([tag, count]) => {
                const pct = Math.round((count / maxTagCount) * 100)
                return (
                  <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', width: '80px', textTransform: 'capitalize', flexShrink: 0 }}>{tag}</span>
                    <div style={{ flex: 1, height: '6px', background: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: '3px', transition: 'width 0.5s ease' }} />
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '600', width: '24px', textAlign: 'right' }}>{count}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '16px' }}>💬 Your journal vocabulary</p>
          {topWords.length === 0 ? (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Write journal notes to see your most used words</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              {topWords.map(([word, count], i) => {
                const size = 10 + Math.round((count / maxWordCount) * 14)
                const opacity = 0.4 + (count / maxWordCount) * 0.6
                const color = wordColors[i % wordColors.length]
                return (
                  <span key={word} title={`"${word}" — used ${count} times`} style={{ fontSize: `${size}px`, fontWeight: count === maxWordCount ? '700' : '500', color, opacity, cursor: 'default', transition: 'opacity 0.15s ease' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = String(opacity)}
                  >
                    {word}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Row 3 — Best + Worst */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>🌟 Best days</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {best3.length === 0 ? <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No entries yet</p> : best3.map(e => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-sm)' }}>
                <span>{moodEmoji[e.mood_label]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.note || 'No note'}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#22c55e' }}>{e.mood_score}/5</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>💭 Challenging days</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {worst3.length === 0 ? <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No entries yet</p> : worst3.map(e => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)' }}>
                <span>{moodEmoji[e.mood_label]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.note || 'No note'}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#ef4444' }}>{e.mood_score}/5</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}