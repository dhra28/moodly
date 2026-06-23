import { TrendingUp, BookOpen, Flame } from 'lucide-react'

export default function StatCards({ stats }) {
  if (!stats) return null

  const cards = [
    {
      icon: BookOpen,
      value: stats.total_entries,
      label: 'Entries this month',
      delta: 'Keep journaling!',
      color: '#7c6fe0'
    },
    {
      icon: TrendingUp,
      value: `${stats.avg_mood}/5`,
      label: 'Avg mood score',
      delta: `This week: ${stats.weekly_avg}/5`,
      color: '#22c55e'
    },
    {
      icon: Flame,
      value: stats.streak,
      label: 'Day streak',
      delta: stats.streak >= 7 ? '🔥 On fire!' : 'Keep it up!',
      color: '#f59e0b'
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px'
    }}>
      {cards.map((card, i) => {
        const Icon = card.icon
        return (
          <div key={i} style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <div style={{
                  fontSize: '26px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.5px'
                }}>
                  {card.value}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  marginTop: '3px'
                }}>
                  {card.label}
                </div>
              </div>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: `${card.color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={16} color={card.color} />
              </div>
            </div>
            <div style={{
              fontSize: '11px',
              color: card.color,
              fontWeight: '500'
            }}>
              {card.delta}
            </div>
          </div>
        )
      })}
    </div>
  )
}