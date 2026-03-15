import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { useIntegrationDetail } from '@/hooks/queries/useIntegrationDetail'
import { useSyncNow } from '@/hooks/mutations/useSyncNow'
import { useIntegrationStore } from '@/stores/useIntegrationStore'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { IncomingChangesPreview } from '@/components/detail/IncomingChangesPreview'
import { SyncConfig } from '@/components/detail/SyncConfig'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ErrorBanner, FullErrorState } from '@/components/ui/ErrorState'
import { DetailSkeleton } from '@/components/ui/LoadingSkeleton'

export function IntegrationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const [syncError, setSyncError] = useState<unknown>(null)

  const { data: integration, isLoading, error } = useIntegrationDetail(id!)
  const { syncResults, integrationStatuses } = useIntegrationStore()
  const syncResult = syncResults[id!]

  const mutation = useSyncNow(id!, {
    toast,
    onError: (err) => setSyncError(err),
    onSuccess: () => setSyncError(null),
  })

  const currentStatus = integrationStatuses[id!] ?? integration?.status
  const changes = syncResult?.data.data.sync_approval.changes ?? []

  if (isLoading) return <DetailSkeleton />

  if (error) {
    return (
      <div>
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb__link">Integrations</Link>
          <span className="breadcrumb__sep">/</span>
          <span className="breadcrumb__current">Not Found</span>
        </div>
        <FullErrorState error={error} onRetry={() => navigate('/')} />
      </div>
    )
  }

  if (!integration) return null

  const healthColor =
    integration.systemHealth >= 90 ? 'var(--color-synced)' :
    integration.systemHealth >= 70 ? 'var(--color-conflict)' :
    'var(--color-error)'

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb__link">Integrations</Link>
        <span className="breadcrumb__sep"><Icon icon="mdi:chevron-right" width={14} /></span>
        <span className="breadcrumb__current">{integration.name}</span>
      </div>

      {/* Error banners */}
      {Boolean(syncError) && (
        <ErrorBanner
          error={syncError}
          onRetry={() => mutation.mutate()}
        />
      )}

      {/* Main layout */}
      <div className="detail-grid">
        {/* Left: Info + Stats */}
        <div className="detail-left">
          <div className="card info-card">
            <div className="info-card__header">
              <div
                className="info-card__icon"
                style={{ background: `${integration.color}15` }}
              >
                <Icon icon={integration.icon} width={30} color={integration.color} />
              </div>
              <div>
                <div className="info-card__title">{integration.name}</div>
                <div className="info-card__since">Connected since {integration.connectedSince}</div>
              </div>
            </div>

            <div className="info-card__rows">
              <div className="info-card__row">
                <span className="info-card__label">System Health</span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="health-bar">
                    <div
                      className="health-bar__fill"
                      style={{ width: `${integration.systemHealth}%`, background: healthColor }}
                    />
                  </div>
                  <span className="health-value" style={{ color: healthColor }}>
                    {integration.systemHealth}%
                  </span>
                </div>
              </div>
              <div className="info-card__row">
                <span className="info-card__label">Status</span>
                <StatusBadge status={currentStatus ?? integration.status} />
              </div>
              <div className="info-card__row">
                <span className="info-card__label">Last Successful Sync</span>
                <span className="info-card__value">{integration.lastSync}</span>
              </div>
              <div className="info-card__row">
                <span className="info-card__label">Sync Frequency</span>
                <span className="info-card__value">
                  <Icon icon="mdi:clock-outline" width={13} style={{ marginRight: 4 }} />
                  {integration.syncFrequency}
                </span>
              </div>
              <div className="info-card__row">
                <span className="info-card__label">Active Mappings</span>
                <span className="info-card__value">{integration.activeMappings} Fields</span>
              </div>
            </div>

            <div className="info-card__sync-btn" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Button
                id="sync-now-btn"
                variant="primary"
                size="lg"
                fullWidth
                loading={mutation.isPending}
                onClick={() => mutation.mutate()}
              >
                <Icon
                  icon={mutation.isPending ? 'mdi:loading' : 'mdi:sync'}
                  width={18}
                />
                {mutation.isPending ? 'Syncing...' : 'Sync Now'}
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => navigate(`/history?integration=${id}`)}
              >
                <Icon icon="mdi:history" width={18} />
                View Sync History
              </Button>
            </div>
          </div>

          {/* Sync Stats 24h */}
          <div className="card stats-card">
            <div className="stats-card__title">Sync Statistics (24h)</div>
            <div className="stats-grid">
              <div>
                <div className="stat-item__value">1,204</div>
                <div className="stat-item__label">Updates</div>
              </div>
              <div>
                <div className="stat-item__value">82</div>
                <div className="stat-item__label">Creates</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Incoming Changes + Config */}
        <div className="detail-right">
          {/* Progress while syncing */}
          {mutation.isPending && (
            <div className="sync-progress">
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon icon="mdi:sync" width={14} />
                Fetching sync data from {integration.name}...
              </div>
              <div className="sync-progress-bar">
                <div className="sync-progress-fill" />
              </div>
            </div>
          )}

          {changes.length > 0 ? (
            <IncomingChangesPreview
              changes={changes}
              applicationName={syncResult?.data.data.sync_approval.application_name ?? integration.name}
              onApproveAll={() => navigate(`/approvals/${id}`)}
              onDiscardAll={() => useIntegrationStore.getState().clearSyncResult(id!)}
            />
          ) : (
            <div className="card preview-card">
              <div className="preview-card__header">
                <div className="preview-card__title">
                  <Icon icon="mdi:eye-outline" width={18} color="var(--color-primary)" />
                  Incoming Changes Preview
                </div>
              </div>
              <div className="empty-state">
                <div className="empty-state__icon">
                  <Icon icon={mutation.isSuccess ? 'mdi:check-circle-outline' : 'mdi:sync-off'} width={36} />
                </div>
                <div className="empty-state__title">
                  {mutation.isSuccess ? 'Sync complete – no new changes' : 'No preview yet'}
                </div>
                <div className="empty-state__desc">
                  {mutation.isSuccess
                    ? 'Your data is up to date with the external source.'
                    : 'Click "Sync Now" to fetch and preview incoming changes from this integration.'}
                </div>
              </div>
            </div>
          )}

          {/* Conflict CTA */}
          {changes.some(c => c.change_type === 'UPDATE') && (
            <div
              className="card"
              style={{
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--color-conflict-bg)',
                border: '1px solid rgba(245,158,11,.25)',
              }}
            >
              <span style={{ fontSize: 13.5, color: '#fbbf24', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon icon="mdi:alert-outline" width={16} />
                {changes.filter(c => c.change_type === 'UPDATE').length} UPDATE conflicts require resolution
              </span>
              <Button variant="primary" size="sm" onClick={() => navigate(`/conflicts/${id}`)}>
                Resolve Conflicts
              </Button>
            </div>
          )}

          <SyncConfig integration={integration} />
        </div>
      </div>
    </div>
  )
}
