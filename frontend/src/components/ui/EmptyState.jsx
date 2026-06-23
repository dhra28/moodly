export default function EmptyState({ icon, title, subtitle, action, onAction }) {
  return (
    <div
      className="scale-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        gap: '12px'
      }}
    >
      <div style={{ fontSize: '40px', lineHeight: 1 }}>{icon}</div>
      <div>
        <h3 style={{
          fontSize: '15px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '6px'
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          maxWidth: '280px'
        }}>
          {subtitle}
        </p>
      </div>
      {action && onAction && (
        <button
          onClick={onAction}
          style={{
            marginTop: '4px',
            padding: '10px 20px',
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {action}
        </button>
      )}
    </div>
  )
}