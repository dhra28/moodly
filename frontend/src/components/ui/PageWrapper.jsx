export default function PageWrapper({ children }) {
  return (
    <div
      className="fade-in"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      {children}
    </div>
  )
}