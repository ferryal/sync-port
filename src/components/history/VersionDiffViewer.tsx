import { useState } from 'react'
import { Icon } from '@iconify/react'
import type { SyncHistoryEvent } from '@/lib/schemas'
import { getDiffLines } from '@/lib/utils'

interface VersionDiffViewerProps {
  event: SyncHistoryEvent
}



export function VersionDiffViewer({ event }: VersionDiffViewerProps) {
  const [viewMode, setViewMode] = useState<'side' | 'unified'>('side')

  if (!event.payload) {
    return (
      <div className="diff-section">
        <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 14 }}>
          <Icon icon="mdi:file-document-outline" width={32} style={{ margin: '0 auto 12px' }} />
          <p>No snapshot payload available for this event.</p>
        </div>
      </div>
    )
  }

  const prevVer = event.version.replace('v', 'v')
  // Derive previous version label
  const verParts = event.version.replace('v', '').split('.')
  const prevMinor = parseInt(verParts[2] || '0') - 1
  const prevVerLabel = `v${verParts[0]}.${verParts[1]}.${Math.max(0, prevMinor)}`

  const { prevLines, currLines, addedLines, removedLines } = getDiffLines(
    event.payload.previous,
    event.payload.current
  )

  const insertCount = addedLines.size
  const deleteCount = removedLines.size
  const unchangedCount = prevLines.length - deleteCount

  return (
    <div className="diff-section">
      <div className="diff-section__header">
        <div className="diff-section__title">
          Compare Snapshot:{' '}
          <span>{prevVerLabel}</span>
          {' '}vs{' '}
          <span>{prevVer}</span>
        </div>
        <div className="diff-view-toggle">
          <button
            className={`diff-toggle-btn${viewMode === 'side' ? ' diff-toggle-btn--active' : ''}`}
            onClick={() => setViewMode('side')}
          >
            Side-by-side
          </button>
          <button
            className={`diff-toggle-btn${viewMode === 'unified' ? ' diff-toggle-btn--active' : ''}`}
            onClick={() => setViewMode('unified')}
          >
            Unified
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="diff-panes">
          {/* Previous */}
          <div className="diff-pane diff-pane--prev">
            <div className="diff-pane__header">
              PREVIOUS ({prevVerLabel})
              <span className="diff-pane__file">payload.json</span>
            </div>
            <div className="diff-pane__body">
              <pre>
                {prevLines.map((line, i) => (
                  <span
                    key={i}
                    className={`diff-line${removedLines.has(i) ? ' diff-line--removed' : ''}`}
                  >
                    <span style={{ opacity: 0.4, marginRight: 12, display: 'inline-block', width: 20, textAlign: 'right', userSelect: 'none' }}>
                      {i + 1}
                    </span>
                    {line}
                  </span>
                ))}
              </pre>
            </div>
          </div>

          {/* Current */}
          <div className="diff-pane diff-pane--curr">
            <div className="diff-pane__header">
              CURRENT ({prevVer})
              <span className="diff-pane__file">payload.json</span>
            </div>
            <div className="diff-pane__body">
              <pre>
                {currLines.map((line, i) => (
                  <span
                    key={i}
                    className={`diff-line${addedLines.has(i) ? ' diff-line--added' : ''}`}
                  >
                    <span style={{ opacity: 0.4, marginRight: 12, display: 'inline-block', width: 20, textAlign: 'right', userSelect: 'none' }}>
                      {i + 1}
                    </span>
                    {line}
                  </span>
                ))}
              </pre>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 16px 12px' }}>
          <div className="diff-footer">
            <span className="diff-stat diff-stat--insert">
              <Icon icon="mdi:circle-medium" width={14} /> {insertCount} insertions
            </span>
            <span className="diff-stat diff-stat--delete">
              <Icon icon="mdi:circle-medium" width={14} /> {deleteCount} deletions
            </span>
            <span className="diff-stat diff-stat--unchanged">
              <Icon icon="mdi:circle-medium" width={14} /> {unchangedCount} unchanged lines
            </span>
            <span className="diff-download">
              Download Full Diff ({prevVerLabel}...{prevVer})
            </span>
          </div>
        </div>
      </div>

      {/* Audit metadata */}
      <div className="audit-grid">
        <div className="audit-card">
          <div className="audit-card__label">
            <Icon icon="mdi:shield-check-outline" width={14} />
            SHA-256 Hash
          </div>
          <div className="hash-value" style={{ fontSize: 12 }}>
            {event.sha256.slice(0, 40)}...
          </div>
        </div>
        <div className="audit-card">
          <div className="audit-card__label">
            <Icon icon="mdi:lock-outline" width={14} />
            Signed By
          </div>
          <div className="signed-check">
            <Icon icon="mdi:check-circle" width={16} color="var(--color-synced)" />
            <span className="audit-card__value" style={{ fontSize: 14 }}>{event.signedBy}</span>
          </div>
        </div>
        <div className="audit-card">
          <div className="audit-card__label">
            <Icon icon="mdi:timer-outline" width={14} />
            Sync Duration
          </div>
          <div className="audit-card__value">{event.syncDuration.toLocaleString()}ms</div>
          <div className="audit-card__sub">Avg. {event.avgSyncDuration.toLocaleString()}ms</div>
        </div>
      </div>
    </div>
  )
}
