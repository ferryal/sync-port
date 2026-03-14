import { useState } from 'react'
import { Icon } from '@iconify/react'
import type { SyncChange } from '@/lib/schemas'

interface IncomingChangesPreviewProps {
  changes: SyncChange[]
  applicationName: string
  onApproveAll?: () => void
  onDiscardAll?: () => void
}

function getEntityAndField(fieldName: string) {
  const parts = fieldName.split('.')
  return {
    entity: parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : fieldName,
    field: parts[1] || fieldName,
  }
}

function getEntityIcon(entity: string) {
  const map: Record<string, string> = {
    User: 'mdi:account-outline',
    Door: 'mdi:door-open',
    Key: 'mdi:key-outline',
  }
  return map[entity] || 'mdi:database-outline'
}

const PAGE_SIZE = 5

export function IncomingChangesPreview({
  changes,
  applicationName,
  onApproveAll,
  onDiscardAll,
}: IncomingChangesPreviewProps) {
  const [page, setPage] = useState(0)
  const visible = changes.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(changes.length / PAGE_SIZE)

  return (
    <div className="card preview-card">
      <div className="preview-card__header">
        <div className="preview-card__title">
          <Icon icon="mdi:eye-outline" width={18} color="var(--color-primary)" />
          Incoming Changes Preview
        </div>
        <div className="preview-card__actions">
          {onApproveAll && (
            <button className="btn btn--secondary btn--sm" onClick={onApproveAll}>
              Approve All
            </button>
          )}
          {onDiscardAll && (
            <button className="btn btn--ghost btn--sm" onClick={onDiscardAll}>
              Discard All
            </button>
          )}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="preview-table">
          <thead>
            <tr>
              <th>Entity &amp; Action</th>
              <th>Current Value</th>
              <th>New Value</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((change) => {
              const { entity, field } = getEntityAndField(change.field_name)
              return (
                <tr key={change.id}>
                  <td>
                    <div className="field-cell">
                      <div className="field-entity">
                        <Icon icon={getEntityIcon(entity)} width={15} />
                        {entity} ({field})
                        <span className={`change-badge change-badge--${change.change_type}`}>
                          {change.change_type}
                        </span>
                      </div>
                      <div className="field-name">{change.field_name}</div>
                    </div>
                  </td>
                  <td>
                    {change.current_value ? (
                      <span className="val-current">{change.current_value}</span>
                    ) : (
                      <span className="val-dash">—</span>
                    )}
                  </td>
                  <td>
                    {change.new_value ? (
                      <span className="val-new">{change.new_value}</span>
                    ) : (
                      <span className={`val-new--delete`}>Deleted</span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Icon icon="mdi:api" width={14} />
                      {applicationName} API
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="view-all-row">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' }}>
            <button
              className="btn btn--ghost btn--sm"
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
            >
              <Icon icon="mdi:chevron-left" width={16} />
            </button>
            <span className="pagination-info">
              Page {page + 1} of {totalPages} · {changes.length} total changes
            </span>
            <button
              className="btn btn--ghost btn--sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
            >
              <Icon icon="mdi:chevron-right" width={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
