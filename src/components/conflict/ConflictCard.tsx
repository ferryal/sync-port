import { Icon } from '@iconify/react'
import type { SyncChange } from '@/lib/schemas'
import type { ConflictResolution } from '@/lib/schemas'
import { useConflictStore } from '@/stores/useConflictStore'
import { getFieldLabel, formatValue, getRecordId } from '@/lib/utils'

interface ConflictCardProps {
  change: SyncChange
  index: number
  applicationName: string
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
