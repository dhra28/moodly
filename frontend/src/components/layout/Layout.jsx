import Sidebar from './Sidebar'

export default function Layout({ children, activePage, setActivePage, stats }) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-primary)'
    }}>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        stats={stats}
      />
      <main style={{
        marginLeft: '220px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {children}
      </main>
    </div>
  )
}