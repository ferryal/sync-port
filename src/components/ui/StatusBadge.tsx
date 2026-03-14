import type { IntegrationStatus } from '@/lib/schemas'

const STATUS_LABELS: Record<IntegrationStatus, string> = {
  synced: 'Synced',
  syncing: 'Syncing...',
  conflict: 'Conflict',
  error: 'Error',
}

interface StatusBadgeProps {
  status: IntegrationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge__dot" />
      {STATUS_LABELS[status]}
    </span>
  )
}

interface SyncResultBadgeProps {
  result: 'success' | 'conflict' | 'failed'
}

const RESULT_STATUS_MAP: Record<string, IntegrationStatus> = {
  success: 'synced',
  conflict: 'conflict',
  failed: 'error',
}

export function SyncResultBadge({ result }: SyncResultBadgeProps) {
  return <StatusBadge status={RESULT_STATUS_MAP[result] as IntegrationStatus} />
}
