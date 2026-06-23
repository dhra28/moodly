import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon, Download, Trash2, User, Shield, Palette } from 'lucide-react'
import { exportEntries } from '../utils/api'
import PageWrapper from '../components/ui/PageWrapper'

export default function SettingsPage({ stats, onDeleted }) {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState(false)

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
      setExported(true)
      setTimeout(() => setExported(false), 3000)
    } catch (err) {
      console.error('Export failed', err)
    } finally {
      setExporting(false)
    }
  }

  const Section = ({ icon: Icon, title, children }) => (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-card)'
      }}>
        <Icon size={15} color='var(--accent)' />
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '4px 0' }}>{children}</div>
    </div>
  )

  const Row = ({ label, subtitle, children }) => (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 20px',
      borderBottom: '1px solid var(--border)'
    }}>
      <div>
        <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
          {label}
        </div>
        {subtitle && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {subtitle}
          </div>
        )}
      </div>
      {children}
    </div>
  )

  return (
    <div style={{ padding: '0 32px 32px' }}>
      <PageWrapper>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Settings
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage your account and preferences
          </p>
        </div>

        {/* Account */}
        <Section icon={User} title="Account">
          <Row label="Username" subtitle="Your display name across Moodly">
            <div style={{
              padding: '6px 14px',
              background: 'var(--accent-glow)',
              border: '1px solid var(--border-light)',
              borderRadius: '20px',
              fontSize: '13px',
              color: 'var(--accent)',
              fontWeight: '500'
            }}>
              {user?.username}
            </div>
          </Row>
          <Row label="Total entries" subtitle="Journal entries you have logged">
            <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {stats?.total_entries || 0}
            </span>
          </Row>
          <Row label="Current streak" subtitle="Consecutive days journaled">
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#f59e0b' }}>
              {stats?.streak || 0} 🔥
            </span>
          </Row>
          <Row label="Average mood" subtitle="Your overall mood score">
            <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--accent)' }}>
              {stats?.avg_mood || 0}/5
            </span>
          </Row>
        </Section>

        {/* Appearance */}
        <Section icon={Palette} title="Appearance">
          <Row
            label={isDark ? 'Dark mode' : 'Light mode'}
            subtitle="Toggle between dark and light theme"
          >
            <button
              onClick={toggleTheme}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px',
                background: isDark ? 'var(--bg-card)' : 'var(--accent-glow)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                color: 'var(--text-primary)',
                fontSize: '13px', fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
              {isDark ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </Row>
        </Section>

        {/* Data */}
        <Section icon={Shield} title="Your Data">
          <Row
            label="Export your data"
            subtitle="Download all your journal entries as a CSV file"
          >
            <button
              onClick={handleExport}
              disabled={exporting}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px',
                background: exported ? 'rgba(34,197,94,0.1)' : 'var(--accent-glow)',
                border: `1px solid ${exported ? 'rgba(34,197,94,0.3)' : 'var(--border-light)'}`,
                borderRadius: '20px',
                color: exported ? '#22c55e' : 'var(--accent)',
                fontSize: '13px', fontWeight: '500',
                cursor: exporting ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Download size={14} />
              {exporting ? 'Exporting...' : exported ? 'Downloaded! ✅' : 'Export CSV'}
            </button>
          </Row>
          <Row
            label="Sign out"
            subtitle="Log out of your Moodly account"
          >
            <button
              onClick={logout}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '20px',
                color: '#ef4444',
                fontSize: '13px', fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
            >
              <Trash2 size={14} />
              Sign out
            </button>
          </Row>
        </Section>

        {/* About */}
        <div style={{
          background: 'var(--accent-glow)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <span style={{ fontSize: '32px' }}>🌙</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Moodly v1.0.0
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Built with React + FastAPI + PostgreSQL + AI insights.
              A full-stack mood journaling app for emotional self-awareness.
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}