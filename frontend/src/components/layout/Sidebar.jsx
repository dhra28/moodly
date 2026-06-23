import { Home, Calendar, BarChart2, Sparkles, Brain, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { section: 'Main', items: [
    { icon: Home, label: 'Today', id: 'today' },
    { icon: Calendar, label: 'History', id: 'history' },
    { icon: BarChart2, label: 'Analytics', id: 'analytics' },
  ]},
  { section: 'AI', items: [
    { icon: Sparkles, label: 'Weekly Insight', id: 'insights' },
    { icon: Brain, label: 'Patterns', id: 'patterns' },
  ]},
  { section: 'Account', items: [
    { icon: Settings, label: 'Settings', id: 'settings' },
  ]}
]

export default function Sidebar({ activePage, setActivePage, stats }) {
  const { user, logout } = useAuth()

  const streakEmoji = stats?.streak >= 100 ? '🥇'
    : stats?.streak >= 30 ? '🥈'
    : stats?.streak >= 7 ? '🥉'
    : '🔥'

  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 12px',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 100
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        marginBottom: '24px'
      }}>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #7c6fe0, #a78bfa)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          flexShrink: 0
        }}>
          🌙
        </div>
        <div>
          <div style={{
            fontSize: '15px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            letterSpacing: '-0.3px'
          }}>
            Moodly
          </div>
          <div style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            marginTop: '1px'
          }}>
            Your emotion journal
          </div>
        </div>
      </div>

      {/* Nav */}
      {navItems.map((group) => (
        <div key={group.section} style={{ marginBottom: '8px' }}>
          <div style={{
            fontSize: '10px',
            fontWeight: '500',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '12px 12px 6px'
          }}>
            {group.section}
          </div>
          {group.items.map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                width: '100%',
                background: activePage === id ? 'var(--accent-glow)' : 'transparent',
                color: activePage === id ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: activePage === id ? '500' : '400',
                border: activePage === id
                  ? '1px solid rgba(124,111,224,0.2)'
                  : '1px solid transparent',
                transition: 'all 0.15s ease',
                cursor: 'pointer',
                marginBottom: '2px'
              }}
              onMouseEnter={e => {
                if (activePage !== id) {
                  e.currentTarget.style.background = 'var(--bg-hover)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }
              }}
              onMouseLeave={e => {
                if (activePage !== id) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      ))}

      {/* Bottom */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Streak banner */}
        <div style={{
          background: 'var(--accent-glow)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '20px' }}>{streakEmoji}</span>
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--accent)'
            }}>
              {user?.username || 'Moodly User'}
            </div>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginTop: '2px'
            }}>
              {stats?.streak > 0
                ? `${stats.streak} day streak ${streakEmoji}`
                : 'Start your streak today!'}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: 'var(--radius-sm)',
            width: '100%',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: '13px',
            border: '1px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
            e.currentTarget.style.color = '#ef4444'
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-muted)'
            e.currentTarget.style.borderColor = 'transparent'
          }}
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  )
}