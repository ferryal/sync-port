import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/Button'
import { useConflictStore } from '@/stores/useConflictStore'
import type { SyncChange } from '@/lib/schemas'

export function MergeBar({
  conflicts,
  onMerge,
}: {
  conflicts: SyncChange[]
  onMerge: () => void
}) {
  const {
    selectedConflictIds,
    resolutions,
    bulkSetLocal,
    bulkSetExternal,
    clearSelection,
  } = useConflictStore()

  const count = selectedConflictIds.size
  const resolvedCount = conflicts.filter(c => !!resolutions[c.id]).length
  const allResolved = resolvedCount === conflicts.length && conflicts.length > 0

  // Only show bar if at least 1 selected OR all resolved
  if (count === 0 && !allResolved) return null

  return (
    <div className="merge-bar">
      {count > 0 && (
        <>
          <div className="merge-bar__count">
            <Icon icon="mdi:checkbox-multiple-marked-outline" width={18} color="var(--color-primary)" />
            {count} selected
          </div>
          <div className="merge-bar__actions">
            <Button variant="ghost" size="sm" onClick={bulkSetLocal}>
              Keep mine
            </Button>
            <Button variant="ghost" size="sm" onClick={bulkSetExternal}>
              Accept incoming
            </Button>
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              Clear
            </Button>
          </div>
        </>
      )}

      {count === 0 && (
        <div className="merge-bar__count">
          <Icon icon="mdi:check-circle" width={18} color="var(--color-synced)" />
          <span>All {resolvedCount} conflicts resolved</span>
        </div>
      )}

      <div className="merge-bar__push">
        {allResolved && (
          <Button variant="primary" size="lg" onClick={onMerge}>
            <Icon icon="mdi:check-all" width={18} />
            Merge &amp; Apply Changes
          </Button>
        )}
      </div>
    </div>
  )
}
