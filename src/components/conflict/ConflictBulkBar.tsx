import { useState } from 'react'
import { Icon } from '@iconify/react'
import { useConflictStore } from '@/stores/useConflictStore'

interface ConflictBulkBarProps {
  totalConflicts: number
  conflictIds: string[]
  onMerge: () => void
}

export function ConflictBulkBar({ totalConflicts, conflictIds, onMerge }: ConflictBulkBarProps) {
  const { selectedConflictIds, bulkSetLocal, bulkSetExternal, selectAll, clearSelection } = useConflictStore()
  const [merged, setMerged] = useState(false)

  const count = selectedConflictIds.size

  if (count === 0) return null

  const handleMerge = () => {
    setMerged(true)
    setTimeout(() => {
      onMerge()
      setMerged(false)
    }, 1500)
  }

  return (
    <div className="bulk-bar">
      <div className="bulk-bar__count">
        <span className="bulk-bar__dot" />
        {count} Conflict{count !== 1 ? 's' : ''} Selected
        {count < totalConflicts && (
          <button
            className="bulk-bar__btn"
            onClick={() => selectAll(conflictIds)}
            style={{ fontSize: 12, marginLeft: 8 }}
          >
            Select All
          </button>
        )}
        <button
          className="bulk-bar__btn"
          onClick={clearSelection}
          style={{ fontSize: 12 }}
        >
          Clear
        </button>
      </div>

      <div className="bulk-bar__actions">
        <button className="bulk-bar__btn" onClick={bulkSetLocal}>
          Bulk Local
        </button>
        <button className="bulk-bar__btn" onClick={bulkSetExternal}>
          Bulk External
        </button>
      </div>

      <div className="bulk-bar__merge">
        {merged ? (
          <div className="bulk-bar__merged">
            <Icon icon="mdi:check-circle" width={18} />
            Changes Applied!
          </div>
        ) : (
          <button className="btn btn--primary btn--lg" onClick={handleMerge}>
            Merge &amp; Apply Changes
            <Icon icon="mdi:arrow-right" width={18} />
          </button>
        )}
      </div>
    </div>
  )
}
