import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { useSyncHistory } from '@/hooks/queries/useSyncHistory'
import { SyncHistoryTable } from '@/components/history/SyncHistoryTable'
import { VersionDiffViewer } from '@/components/history/VersionDiffViewer'
import { IntegrationCardSkeleton } from '@/components/ui/LoadingSkeleton'
import { FullErrorState } from '@/components/ui/ErrorState'
import type { SyncHistoryEvent } from '@/lib/schemas'

export function SyncHistory() {
  const [searchParams] = useSearchParams()
  const integrationId = searchParams.get('integration') || undefined
  const { data: events, isLoading, error, refetch } = useSyncHistory(integrationId)
  const [selectedEvent, setSelectedEvent] = useState<SyncHistoryEvent | undefined>()

  const handleRowSelect = (event: SyncHistoryEvent) => {
    setSelectedEvent((prev) => (prev?.id === event.id ? undefined : event))
  }

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Page header */}
      <div className="page-header">
        <div className="page-header__left">
          <h1>{integrationId ? 'Integration Sync History' : 'Global Sync History'}</h1>
          <p>
            {integrationId
              ? 'Forensic review of sync events for this integration.'
              : 'Forensic review and version control snapshots across all integrations.'}
          </p>
        </div>
        <div className="page-header__right">
          <button className="btn btn--secondary">
            <Icon icon="mdi:download-outline" width={16} />
            Export CSV
          </button>
          <button className="btn btn--primary">
            <Icon icon="mdi:sync" width={16} />
            Trigger Sync
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <IntegrationCardSkeleton />
      ) : error ? (
        <FullErrorState error={error} onRetry={() => refetch()} />
      ) : !events || events.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state__icon">
              <Icon icon="mdi:history" width={40} />
            </div>
            <div className="empty-state__title">No sync history yet</div>
            <div className="empty-state__desc">Trigger a sync from an integration to see events here.</div>
          </div>
        </div>
      ) : (
        <>
          <SyncHistoryTable
            events={events}
            selectedId={selectedEvent?.id}
            onSelect={handleRowSelect}
          />

          {/* Diff viewer */}
          {selectedEvent && (
            <VersionDiffViewer event={selectedEvent} />
          )}

          {!selectedEvent && (
            <div
              className="card"
              style={{ padding: '20px 24px', textAlign: 'center', marginTop: 20, color: 'var(--color-text-tertiary)', fontSize: 13 }}
            >
              <Icon icon="mdi:cursor-default-click-outline" width={22} style={{ margin: '0 auto 8px' }} />
              <p>Click a row to compare snapshots</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
