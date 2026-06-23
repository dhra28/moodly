import InsightsPanel from '../components/insights/InsightsPanel'
import WeekChart from '../components/insights/WeekChart'

export default function InsightsPage({ insights, message, loading, onRefresh, entries }) {
  return (
    <div style={{ padding: '0 32px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
          Weekly Insights
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          AI-powered analysis of your mood patterns
        </p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        <InsightsPanel
          insights={insights}
          message={message}
          loading={loading}
          onRefresh={onRefresh}
        />
        <WeekChart entries={entries} />
      </div>
    </div>
  )
}