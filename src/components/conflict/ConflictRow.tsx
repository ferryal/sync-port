import { Icon } from '@iconify/react'
import { Checkbox } from '@/components/ui/Checkbox'
import { useConflictStore } from '@/stores/useConflictStore'
import type { SyncChange, ConflictResolution } from '@/lib/schemas'
import { getFieldLabel, shortValue } from '@/lib/utils'

export function ConflictRow({
  change,
  index,
  applicationName,
}: {
  change: SyncChange
  index: number
  applicationName: string
}) {
  const { selectedConflictIds, resolutions, toggleSelect, setResolution } = useConflictStore()
  const isSelected = selectedConflictIds.has(change.id)
  const resolution = resolutions[change.id] as ConflictResolution | undefined
  const isResolved = !!resolution

  const recordPrefix = change.field_name.startsWith('user') ? 'USR' :
    change.field_name.startsWith('door') ? 'DEV' : 'KEY'
  const recordId = `${recordPrefix}-${String(index + 1000).padStart(4, '0')}`

  return (
    <tr
      className={[
        isResolved ? 'conflict-row--resolved' : '',
        isSelected ? 'conflict-row--selected' : '',
      ].filter(Boolean).join(' ')}
    >
      {/* Checkbox */}
      <td style={{ width: 40 }}>
        <Checkbox checked={isSelected} onCheckedChange={() => toggleSelect(change.id)} />
      </td>

      {/* Record / field */}
      <td>
        <div className="field-pill">
          <Icon icon="mdi:table-key" width={14} color="var(--color-text-tertiary)" />
          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 12 }}>{recordId}</span>
          <code>· {change.field_name}</code>
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 4, paddingLeft: 2 }}>
          {getFieldLabel(change.field_name)}
        </div>
      </td>

      {/* Current (yours) */}
      <td>
        <div className="val-cell">
          <div className="val-label">Current</div>
          <div className="val-old">{shortValue(change.current_value)}</div>
        </div>
      </td>

      {/* Incoming */}
      <td>
        <div className="val-cell">
          <div className="val-label">From {applicationName}</div>
          <div className="val-incoming">{shortValue(change.new_value)}</div>
        </div>
      </td>

      {/* Resolution actions */}
      <td>
        {isResolved ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="resolved-chip">
              <Icon icon="mdi:check-circle" width={13} />
              {resolution === 'local' ? 'Kept local' : 'Accepted external'}
            </span>
            <button
              style={{ background: 'none', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontSize: 11, textDecoration: 'underline' }}
              onClick={() => setResolution(change.id, undefined as unknown as ConflictResolution)}
            >
              undo
            </button>
          </div>
        ) : (
          <div className="resolution-actions">
            <button
              className={`resolve-btn resolve-btn--keep`}
              onClick={() => setResolution(change.id, 'local')}
            >
              Keep mine
            </button>
            <button
              className={`resolve-btn resolve-btn--accept`}
              onClick={() => setResolution(change.id, 'external')}
            >
              Accept incoming
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}
