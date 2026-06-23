import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { loginUser, registerUser } from '../utils/api'

const GREETINGS = [
  "Welcome back ✦",
  "Good to see you again 🌙",
  "Ready to reflect? ✨",
  "Your journal awaits 📓",
  "Let's check in 💜"
]

const FLOATING_ITEMS = [
  { emoji: '😊', x: 8, y: 15, size: 32, delay: 0, duration: 6 },
  { emoji: '🌙', x: 85, y: 10, size: 28, delay: 1, duration: 7 },
  { emoji: '✨', x: 20, y: 75, size: 24, delay: 2, duration: 5 },
  { emoji: '💜', x: 75, y: 70, size: 30, delay: 0.5, duration: 8 },
  { emoji: '😔', x: 90, y: 40, size: 22, delay: 1.5, duration: 6 },
  { emoji: '🤩', x: 5, y: 50, size: 26, delay: 3, duration: 7 },
  { emoji: '🧠', x: 50, y: 85, size: 28, delay: 2.5, duration: 5 },
  { emoji: '💭', x: 60, y: 8, size: 24, delay: 1, duration: 9 },
  { emoji: '🌱', x: 35, y: 90, size: 22, delay: 0, duration: 6 },
  { emoji: '⭐', x: 45, y: 20, size: 20, delay: 4, duration: 7 },
  { emoji: '🎯', x: 15, y: 35, size: 24, delay: 2, duration: 8 },
  { emoji: '💡', x: 78, y: 85, size: 26, delay: 3.5, duration: 6 },
]

export default function LoginPage() {
  const { login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [greeting] = useState(() =>
    GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
  )

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      setError('Please fill in all required fields')
      return
    }
    if (!isLogin && !form.email) {
      setError('Email is required for registration')
      return
    }
    try {
      setLoading(true)
      setError('')
      if (isLogin) {
        const res = await loginUser({ username: form.username, password: form.password })
        login(res.data.access_token, { username: res.data.username, user_id: res.data.user_id })
      } else {
        await registerUser({ username: form.username, email: form.email, password: form.password })
        const res = await loginUser({ username: form.username, password: form.password })
        login(res.data.access_token, { username: res.data.username, user_id: res.data.user_id })
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(10deg); opacity: 1; }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(20px) rotate(-10deg); opacity: 0.8; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Floating background emojis */}
      {FLOATING_ITEMS.map((item, i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}px`,
            animation: `${i % 2 === 0 ? 'float' : 'floatReverse'} ${item.duration}s ease-in-out ${item.delay}s infinite`,
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
            filter: 'blur(0.5px)'
          }}
        >
          {item.emoji}
        </div>
      ))}

      {/* Purple glow */}
      <div style={{
        position: 'fixed',
        top: '30%', left: '50%',
        transform: 'translateX(-50%)',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(124,111,224,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 1,
        animation: 'scaleIn 0.3s ease forwards'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #7c6fe0, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(124,111,224,0.35)'
          }}>
            🌙
          </div>
          <h1 style={{
            fontSize: '26px', fontWeight: '600',
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px', marginBottom: '6px'
          }}>
            Moodly
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {greeting}
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Toggle */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px',
            marginBottom: '24px',
            border: '1px solid var(--border)'
          }}>
            {['Login', 'Register'].map(tab => (
              <button
                key={tab}
                onClick={() => { setIsLogin(tab === 'Login'); setError('') }}
                style={{
                  flex: 1, padding: '8px',
                  borderRadius: '6px', fontSize: '13px', fontWeight: '500',
                  background: (isLogin ? tab === 'Login' : tab === 'Register')
                    ? 'var(--accent)' : 'transparent',
                  color: (isLogin ? tab === 'Login' : tab === 'Register')
                    ? '#fff' : 'var(--text-secondary)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { name: 'username', label: 'Username', type: 'text', placeholder: 'e.g. john_doe' },
              ...(!isLogin ? [{ name: 'email', label: 'Email', type: 'email', placeholder: 'e.g. john@example.com' }] : []),
              { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' }
            ].map(field => (
              <div key={field.name}>
                <label style={{
                  fontSize: '12px', color: 'var(--text-muted)',
                  fontWeight: '500', display: 'block', marginBottom: '6px'
                }}>
                  {field.label}
                </label>
                <input
                  name={field.name}
                  type={field.type}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{
                    width: '100%', padding: '11px 14px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    transition: 'border-color 0.15s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            ))}

            {error && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px', color: '#ef4444'
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%', padding: '12px',
                background: loading ? 'var(--bg-card)' : 'var(--accent)',
                color: loading ? 'var(--text-muted)' : '#fff',
                border: 'none', borderRadius: 'var(--radius-sm)',
                fontSize: '14px', fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease', marginTop: '4px'
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.9' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              {loading ? 'Please wait...' : isLogin ? 'Login to Moodly' : 'Create account'}
            </button>
          </div>
        </div>

        <p style={{
          textAlign: 'center', fontSize: '12px',
          color: 'var(--text-muted)', marginTop: '20px'
        }}>
          Your emotions, your data. Always private. 🔒
        </p>
      </div>
    </div>
  )
}