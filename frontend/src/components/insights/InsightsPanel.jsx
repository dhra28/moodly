import { Sparkles, RefreshCw, TrendingUp, Lightbulb, AlertCircle } from 'lucide-react'
import { useState } from 'react'

const insightConfig = {
  pattern: {
    icon: TrendingUp,
    label: 'Pattern detected',
    color: '#7c6fe0',
    bg: 'rgba(124,111,224,0.08)',
    border: 'rgba(124,111,224,0.2)'
  },
  tip: {
    icon: Lightbulb,
    label: 'Suggestion',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.2)'
  },
  alert: {
    icon: AlertCircle,
    label: 'Worth noting',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)'
  }
}

export default function InsightsPanel({ insights, message, loading, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await onRefresh()
    setRefreshing(false)
  }

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={15} color='var(--accent-light)' />
          <span style={{
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--text-primary)'
          }}>
            AI Insights
          </span>
          <span style={{
            fontSize: '10px',
            background: 'var(--accent-glow)',
            color: 'var(--accent-light)',
            padding: '2px 8px',
            borderRadius: '10px',
            border: '1px solid rgba(124,111,224,0.2)',
            fontWeight: '500'
          }}>
            Weekly
          </span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading || refreshing}
          style={{
            padding: '5px',
            borderRadius: '6px',
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--bg-hover)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-muted)'
          }}
          title='Refresh insights'
        >
          <RefreshCw
            size={13}
            style={{
              animation: refreshing || loading ? 'spin 1s linear infinite' : 'none'
            }}
          />
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: '70px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
          ))}
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 0.4; }
              50% { opacity: 0.8; }
            }
          `}</style>
        </div>
      )}

      {/* Not enough entries */}
      {!loading && message && insights.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '24px 16px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)'
        }}>
          <p style={{ fontSize: '28px', marginBottom: '10px' }}>🧠</p>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            {message}
          </p>
        </div>
      )}

      {/* Insight cards */}
      {!loading && insights.map((insight, i) => {
        const config = insightConfig[insight.type] || insightConfig.pattern
        const Icon = config.icon
        return (
          <div key={i} style={{
            background: config.bg,
            border: `1px solid ${config.border}`,
            borderRadius: 'var(--radius-sm)',
            padding: '13px 14px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '7px'
            }}>
              <Icon size={12} color={config.color} />
              <span style={{
                fontSize: '10px',
                fontWeight: '600',
                color: config.color,
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}>
                {config.label}
              </span>
            </div>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: '1.6'
            }}>
              {insight.text}
            </p>
          </div>
        )
      })}
    </div>
  )
}