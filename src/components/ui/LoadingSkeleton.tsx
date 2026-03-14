import type { CSSProperties } from 'react'

interface SkeletonProps {
  width?: string
  height?: string
  className?: string
  style?: CSSProperties
}

export function Skeleton({ width = '100%', height = '14px', className = '', style }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, ...style }}
    />
  )
}

export function IntegrationCardSkeleton() {
  return (
    <div className="card" style={{ padding: 0 }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="integration-item">
          <Skeleton width="48px" height="48px" className="skeleton" style={{ borderRadius: 8, flexShrink: 0 } as React.CSSProperties} />
          <div style={{ flex: 1 }}>
            <Skeleton width="160px" height="16px" className="skeleton-line" />
            <Skeleton width="240px" height="12px" className="skeleton-line skeleton-line--sm" />
          </div>
          <Skeleton width="80px" height="24px" className="skeleton" />
        </div>
      ))}
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="detail-grid">
      <div className="card info-card">
        <Skeleton width="56px" height="56px" className="skeleton" style={{ borderRadius: 8, marginBottom: 16 } as React.CSSProperties} />
        <Skeleton width="70%" height="20px" className="skeleton-line skeleton-line--lg" />
        <Skeleton width="50%" height="12px" className="skeleton-line skeleton-line--sm" />
        {[1,2,3,4].map(i => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <Skeleton width="40%" height="12px" />
            <Skeleton width="30%" height="12px" />
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 24, minHeight: 300 }}>
        <Skeleton width="50%" height="20px" className="skeleton-line skeleton-line--lg" />
        {[1,2,3].map(i => (
          <div key={i} style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <Skeleton width="25%" height="36px" />
            <Skeleton width="25%" height="36px" />
            <Skeleton width="25%" height="36px" />
            <Skeleton width="25%" height="36px" />
          </div>
        ))}
      </div>
    </div>
  )
}
