import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { useMoodData } from './hooks/useMoodData'
import Layout from './components/layout/Layout'
import TopBar from './components/layout/TopBar'
import LoginPage from './pages/LoginPage'
import TodayPage from './pages/TodayPage'
import HistoryPage from './pages/HistoryPage'
import AnalyticsPage from './pages/AnalyticsPage'
import InsightsPage from './pages/InsightsPage'
import PatternsPage from './pages/PatternsPage'
import SettingsPage from './pages/SettingsPage'

const Spinner = () => (
  <div style={{
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', height: '100vh',
    flexDirection: 'column', gap: '16px'
  }}>
    <div style={{
      width: '40px', height: '40px',
      border: '3px solid var(--border)',
      borderTop: '3px solid var(--accent)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
      Loading Moodly...
    </p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
  </div>
)

function MainApp() {
  const [activePage, setActivePage] = useState('today')
  const data = useMoodData()

  if (data.loading) return <Spinner />

  const renderPage = () => {
    switch (activePage) {
      case 'today':
        return <TodayPage data={data} />
      case 'history':
        return <HistoryPage entries={data.entries} onDeleted={data.refetch} />
      case 'analytics':
        return <AnalyticsPage entries={data.entries} />
      case 'insights':
        return (
          <InsightsPage
            insights={data.insights}
            message={data.insightMessage}
            loading={data.insightsLoading}
            onRefresh={data.refetchInsights}
            entries={data.entries}
          />
        )
      case 'patterns':
        return <PatternsPage entries={data.entries} />
      case 'settings':
        return <SettingsPage stats={data.stats} onDeleted={data.refetch} />
      default:
        return <TodayPage data={data} />
    }
  }

  return (
    <Layout activePage={activePage} setActivePage={setActivePage} stats={data.stats}>
      <TopBar entryCount={data.entries.length} />
      <div key={activePage} className="fade-in">
        {renderPage()}
      </div>
    </Layout>
  )
}

function App() {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  return user ? <MainApp /> : <LoginPage />
}

export default App