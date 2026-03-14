import { Icon } from '@iconify/react'
import type { SyncChange } from '@/lib/schemas'
import type { ConflictResolution } from '@/lib/schemas'
import { useConflictStore } from '@/stores/useConflictStore'

interface ConflictCardProps {
  change: SyncChange
  index: number
  applicationName: string
}

function formatValue(value: string | undefined, fieldName: string): string {
  if (!value) return '—'
  // Format timestamps nicely
  if (fieldName.includes('access_end') || fieldName.includes('access_start')) {
    try {
      return new Date(value).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      })
    } catch { return value }
  }
  return value
}

function getRecordId(change: SyncChange, index: number) {
  const prefix = change.field_name.startsWith('user') ? 'USR' :
    change.field_name.startsWith('door') ? 'DEV' : 'KEY'
  return `${prefix}-${String(index + 1000).padStart(4, '0')}`
}

function getFieldLabel(fieldName: string) {
  const map: Record<string, string> = {
    'user.email': 'User Email',
    'user.role': 'User Role',
    'user.name': 'User Name',
    'user.status': 'User Status',
    'user.phone': 'User Phone',
    'door.status': 'Device Status',
    'door.battery_level': 'Battery Level',
    'key.key_type': 'Key Type',
    'key.status': 'Key Status',
    'key.access_end': 'Access End Date',
    'key.access_start': 'Access Start Date',
  }
  return map[fieldName] || fieldName
}

export function ConflictCard({ change, index, applicationName }: ConflictCardProps) {
  const { selectedConflictIds, resolutions, toggleSelect, setResolution } = useConflictStore()

  const isSelected = selectedConflictIds.has(change.id)
  const resolution = resolutions[change.id] as ConflictResolution | undefined
  const recordId = getRecordId(change, index)

  return (
    <div className={`conflict-card${isSelected ? ' conflict-card--selected' : ''}`}>
      {/* Header */}
      <div className="conflict-card__header">
        <div className="conflict-card__id-block">
          <input
            type="checkbox"
            className="conflict-checkbox"
            checked={isSelected}
            onChange={() => toggleSelect(change.id)}
          />
          <div className="conflict-card__id-icon">ID</div>
          <div>
            <div className="conflict-card__id-label">Record ID</div>
            <div className="conflict-card__id-value">{recordId}</div>
          </div>
        </div>
        <div className="conflict-card__meta">
          <div className="conflict-card__meta-time">Modified 2m ago</div>
          <div className="conflict-card__meta-field">Field: {getFieldLabel(change.field_name)}</div>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="conflict-sides">
        {/* Local */}
        <div className={`conflict-side conflict-side--local${resolution === 'local' ? ' conflict-side--resolved-local' : ''}`}>
          <div className="conflict-side__label">Local Version</div>
          <div className="conflict-side__value">
            {formatValue(change.current_value, change.field_name)}
          </div>
          <div className="conflict-side__source conflict-side__source--local">
            <Icon icon="mdi:account-outline" width={13} />
            Last edited by you
          </div>
          {resolution === 'local' && (
            <div style={{ position: 'absolute', top: 8, right: 8 }}>
              <Icon icon="mdi:check-circle" width={18} color="var(--color-synced)" />
            </div>
          )}
        </div>

        {/* Swap icon */}
        <div className="conflict-swap">
          <button
            className="conflict-swap-btn"
            title="Swap comparison"
            onClick={() => {/* visual only */}}
          >
            <Icon icon="mdi:swap-horizontal" width={18} />
          </button>
        </div>

        {/* External */}
        <div className={`conflict-side conflict-side--external${resolution === 'external' ? ' conflict-side--resolved-external' : ''}`}>
          <div className="conflict-side__label">External Version</div>
          <div className="conflict-side__value conflict-side__value--external">
            {formatValue(change.new_value, change.field_name)}
          </div>
          <div className="conflict-side__source">
            <Icon icon="mdi:cloud-outline" width={13} />
            {applicationName} Source
          </div>
          {resolution === 'external' && (
            <div style={{ position: 'absolute', top: 8, right: 8 }}>
              <Icon icon="mdi:check-circle" width={18} color="var(--color-primary)" />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="conflict-card__actions">
        {resolution ? (
          <div className="conflict-resolved-badge">
            <Icon icon="mdi:check-circle" width={16} />
            Resolved: Keep {resolution === 'local' ? 'Local' : 'External'}
            <button
              className="btn btn--ghost btn--sm"
              style={{ marginLeft: 8, color: 'var(--color-text-tertiary)' }}
              onClick={() => setResolution(change.id, undefined as unknown as ConflictResolution)}
            >
              Undo
            </button>
          </div>
        ) : (
          <>
            <button
              className="btn btn--secondary"
              onClick={() => setResolution(change.id, 'local')}
            >
              Keep Local
            </button>
            <button
              className="btn btn--primary"
              onClick={() => setResolution(change.id, 'external')}
            >
              Accept External
            </button>
            <button className="btn btn--ghost btn--icon" title="Custom edit">
              <Icon icon="mdi:pencil-outline" width={16} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
