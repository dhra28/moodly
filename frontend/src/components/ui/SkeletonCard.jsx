export default function SkeletonCard({ height = 80 }) {
  return (
    <div className="skeleton" style={{ height: `${height}px`, width: '100%' }} />
  )
}