import { Icon } from '@iconify/react'
import type { SyncChange } from '@/lib/schemas'
import { getEntityAndField, getEntityIcon, getFieldLabel } from '@/lib/utils'
import { useSyncApprovalStore } from '@/stores/useSyncApprovalStore'
import { Checkbox } from '@/components/ui/Checkbox'

interface ApprovalChangeRowProps {
  change: SyncChange
}

function DiffBlock({ change }: { change: SyncChange }) {
  const old = change.current_value
  const next = change.new_value

  if (change.change_type === 'ADD') {
    return (
      <pre className="approval-diff">
        <span className="diff-line diff-line--added">
          <span className="diff-line__sign">+</span>
          {next ?? ''}
        </span>
      </pre>
    )
  }

  if (change.change_type === 'DELETE') {
    return (
      <pre className="approval-diff">
        <span className="diff-line diff-line--removed">
          <span className="diff-line__sign">-</span>
          {old ?? ''}
        </span>
      </pre>
    )
  }

  // UPDATE
  return (
    <pre className="approval-diff">
      {old !== undefined && (
        <span className="diff-line diff-line--removed">
          <span className="diff-line__sign">-</span>
          {old}
        </span>
      )}
      {next !== undefined && (
        <span className="diff-line diff-line--added">
          <span className="diff-line__sign">+</span>
          {next}
        </span>
      )}
    </pre>
  )
}

export function ApprovalChangeRow({ change }: ApprovalChangeRowProps) {
  const { selectedIds, toggleSelect } = useSyncApprovalStore()
  const isSelected = selectedIds.has(change.id)
  const { entity, field } = getEntityAndField(change.field_name)

  return (
    <div
      className={`approval-row${isSelected ? ' approval-row--selected' : ''}`}
      onClick={() => toggleSelect(change.id)}
    >
      <div className="approval-row__check" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          id={`approval-check-${change.id}`}
          checked={isSelected}
          onCheckedChange={() => toggleSelect(change.id)}
        />
      </div>

      <div className="approval-row__body">
        <div className="approval-row__header">
          <div className="approval-row__entity">
            <Icon icon={getEntityIcon(entity)} width={15} color="var(--color-text-secondary)" />
            <span className="approval-row__entity-name">{entity}</span>
            <span className="approval-row__field-name">{field}</span>
          </div>
          <span className={`change-badge change-badge--${change.change_type}`}>
            {change.change_type}
          </span>
        </div>

        <div className="approval-row__label">{getFieldLabel(change.field_name)}</div>

        <DiffBlock change={change} />
      </div>
    </div>
  )
}
