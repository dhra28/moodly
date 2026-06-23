import { useState } from 'react'
import JournalForm from '../components/journal/JournalForm'
import StatCards from '../components/journal/StatCards'
import HeatMap from '../components/journal/HeatMap'
import RecentEntries from '../components/journal/RecentEntries'
import InsightsPanel from '../components/insights/InsightsPanel'
import WeekChart from '../components/insights/WeekChart'
import PageWrapper from '../components/ui/PageWrapper'
import EmptyState from '../components/ui/EmptyState'
import { RefreshCw } from 'lucide-react'

const QUOTES = [
  { text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared or anxious.", author: "Lori Deschene" },
  { text: "There is no timestamp on trauma. There isn't a formula that you can insert yourself into to get from horror to healed.", author: "Amber Tamblyn" },
  { text: "Self-care is not self-indulgence, it is self-preservation.", author: "Audre Lorde" },
  { text: "You are allowed to be both a masterpiece and a work in progress simultaneously.", author: "Sophia Bush" },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  { text: "Feelings are just visitors, let them come and go.", author: "Mooji" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "You've survived 100% of your worst days so far.", author: "Unknown" },
]

function QuoteCard() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUOTES.length))
  const quote = QUOTES[idx]
  const next = () => setIdx(i => (i + 1) % QUOTES.length)

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--accent-glow), transparent)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-md)',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    }}>
      <span style={{ fontSize: '20px', flexShrink: 0 }}>✨</span>
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          fontStyle: 'italic'
        }}>
          "{quote.text}"
        </p>
        <p style={{
          fontSize: '11px',
          color: 'var(--accent)',
          fontWeight: '500',
          marginTop: '6px'
        }}>
          — {quote.author}
        </p>
      </div>
      <button
        onClick={next}
        title="Next quote"
        style={{
          padding: '4px',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'color 0.15s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <RefreshCw size={13} />
      </button>
    </div>
  )
}

export default function TodayPage({ data }) {
  const hasEntries = data.entries.length > 0

  return (
    <div 
        className="today-grid"
        style={{
        padding: '0 32px 32px',
        display: 'grid',
        gridTemplateColumns: '1fr 280px',
        gap: '20px',
        alignItems: 'start'
        }}>
      <PageWrapper>
        <StatCards stats={data.stats} />
        <QuoteCard />
        <JournalForm onSaved={data.refetch} />
        <HeatMap entries={data.last30} />
        {hasEntries
          ? <RecentEntries entries={data.entries} onDeleted={data.refetch} />
          : (
            <EmptyState
              icon="📝"
              title="No entries yet"
              subtitle="Start by logging your mood above. Your journal entries will appear here."
            />
          )
        }
      </PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <InsightsPanel
          insights={data.insights}
          message={data.insightMessage}
          loading={data.insightsLoading}
          onRefresh={data.refetchInsights}
        />
        <WeekChart entries={data.entries} />
      </div>
    </div>
  )
}