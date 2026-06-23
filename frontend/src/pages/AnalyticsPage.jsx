import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import PageWrapper from '../components/ui/PageWrapper'
import EmptyState from '../components/ui/EmptyState'

const moodColor = {
  sad: '#ef4444', meh: '#f59e0b',
  okay: '#3b82f6', good: '#8b5cf6', great: '#22c55e'
}
const moodEmoji = { sad: '😔', meh: '😐', okay: '🙂', good: '😊', great: '🤩' }

export default function AnalyticsPage({ entries }) {
  if (entries.length < 3) {
    return (
      <div style={{ padding: '0 32px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>Analytics</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Your mood patterns over time</p>
        </div>
        <EmptyState
          icon="📊"
          title="Not enough data yet"
          subtitle="Log at least 3 mood entries to unlock your analytics dashboard with charts and breakdowns."
        />
      </div>
    )
  }

  const sorted = [...entries].sort((a, b) =>
    new Date(a.created_at) - new Date(b.created_at)
  )

  const chartData = sorted.slice(-30).map(e => ({
    date: new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: e.mood_score,
    label: e.mood_label
  }))

  const moodCounts = { sad: 0, meh: 0, okay: 0, good: 0, great: 0 }
  entries.forEach(e => {
    if (moodCounts[e.mood_label] !== undefined) moodCounts[e.mood_label]++
  })

  const tagCounts = {}
  entries.forEach(e => {
    e.tags.split(',').filter(Boolean).forEach(tag => {
      tagCounts[tag.trim()] = (tagCounts[tag.trim()] || 0) + 1
    })
  })
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const d = payload[0].payload
      return (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 12px',
          fontSize: '12px',
          color: 'var(--text-primary)'
        }}>
          <div>{d.date}</div>
          <div style={{ color: moodColor[d.label] }}>
            {moodEmoji[d.label]} {d.label} ({d.mood}/5)
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ padding: '0 32px 32px' }}>
      <PageWrapper>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>Analytics</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Your mood patterns over time</p>
        </div>

        {/* Mood trend chart */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '20px'
        }}>
          <p style={{
            fontSize: '11px', fontWeight: '600',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            marginBottom: '16px'
          }}>
            Mood trend — last 30 entries
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                tickLine={false}
                axisLine={false}
                width={20}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ fill: 'var(--accent)', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mood breakdown */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '20px'
        }}>
          <p style={{
            fontSize: '11px', fontWeight: '600',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            marginBottom: '16px'
          }}>
            Mood breakdown
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(moodCounts).map(([mood, count]) => {
              const total = entries.length || 1
              const pct = Math.round((count / total) * 100)
              return (
                <div key={mood} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px', width: '24px' }}>{moodEmoji[mood]}</span>
                  <span style={{
                    fontSize: '12px', color: 'var(--text-secondary)',
                    textTransform: 'capitalize', width: '50px'
                  }}>
                    {mood}
                  </span>
                  <div style={{
                    flex: 1, height: '6px',
                    background: 'var(--bg-card)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: moodColor[mood],
                      borderRadius: '3px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: moodColor[mood],
                    fontWeight: '600',
                    width: '60px',
                    textAlign: 'right'
                  }}>
                    {count} ({pct}%)
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top tags */}
        {topTags.length > 0 && (
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '20px'
          }}>
            <p style={{
              fontSize: '11px', fontWeight: '600',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              marginBottom: '16px'
            }}>
              Most used tags
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {topTags.map(([tag, count]) => (
                <div key={tag} style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  background: 'var(--accent-glow)',
                  border: '1px solid var(--border-light)',
                  fontSize: '12px',
                  color: 'var(--accent)',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {tag}
                  <span style={{
                    fontSize: '10px',
                    background: 'var(--accent)',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '0px 6px'
                  }}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </PageWrapper>
    </div>
  )
}