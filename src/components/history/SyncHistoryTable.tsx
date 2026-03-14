import { Icon } from '@iconify/react'
import type { SyncHistoryEvent } from '@/lib/schemas'
import { SyncResultBadge } from '@/components/ui/StatusBadge'

interface SyncHistoryTableProps {
  events: SyncHistoryEvent[]
  selectedId?: string
  onSelect: (event: SyncHistoryEvent) => void
}

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

export function SyncHistoryTable({ events, selectedId, onSelect }: SyncHistoryTableProps) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="history-table-wrap">
        <table className="history-table">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Timestamp</th>
              <th>Result</th>
              <th>Changes</th>
              <th>Initiator</th>
              <th>Version</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                className={selectedId === event.id ? 'selected' : ''}
                onClick={() => onSelect(event)}
              >
                <td>
                  <span className={event.result === 'success' ? 'event-id' : 'event-id event-id--plain'}>
                    {event.eventId}
                  </span>
                </td>
                <td style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
                  {formatTimestamp(event.timestamp)}
                </td>
                <td>
                  <SyncResultBadge result={event.result} />
                </td>
                <td style={{ color: 'var(--color-text-secondary)' }}>
                  {event.changesCount > 0 ? `${event.changesCount} changes` : '0 changes'}
                </td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <Icon
                      icon={event.initiator === 'System' ? 'mdi:robot-outline' : 'mdi:account-outline'}
                      width={15}
                      color="var(--color-text-tertiary)"
                    />
                    {event.initiator}
                  </span>
                </td>
                <td>
                  <span className="version-tag">{event.version}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
