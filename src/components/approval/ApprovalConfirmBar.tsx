import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/Button'
import { useSyncApprovalStore } from '@/stores/useSyncApprovalStore'

interface ApprovalConfirmBarProps {
  totalCount: number
  onConfirm: () => void
  onClear: () => void
  isLoading?: boolean
}

export function ApprovalConfirmBar({
  totalCount,
  onConfirm,
  onClear,
  isLoading,
}: ApprovalConfirmBarProps) {
  const { selectedIds } = useSyncApprovalStore()
  const count = selectedIds.size

  if (count === 0) return null

  return (
    <div className="merge-bar">
      <div className="merge-bar__count">
        <Icon icon="mdi:checkbox-multiple-marked-outline" width={18} color="var(--color-primary)" />
        <span>
          {count} of {totalCount} change{totalCount !== 1 ? 's' : ''} selected
        </span>
      </div>

      <div className="merge-bar__actions">
        <Button variant="ghost" size="sm" onClick={onClear}>
          Deselect All
        </Button>
      </div>

      <div className="merge-bar__push">
        <Button
          variant="primary"
          size="lg"
          onClick={onConfirm}
          loading={isLoading}
        >
          <Icon icon="mdi:check-all" width={18} />
          Approve Selected ({count})
        </Button>
      </div>
    </div>
  )
}
