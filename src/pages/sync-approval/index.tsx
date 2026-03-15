import { useParams, useNavigate, Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { useIntegrationStore } from '@/stores/useIntegrationStore'
import { useSyncApprovalStore } from '@/stores/useSyncApprovalStore'
import { useIntegrationDetail } from '@/hooks/queries/useIntegrationDetail'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { FullErrorState } from '@/components/ui/ErrorState'
import { ApprovalChangeRow } from '@/components/approval/ApprovalChangeRow'
import { ApprovalConfirmBar } from '@/components/approval/ApprovalConfirmBar'
import { Checkbox } from '@/components/ui/Checkbox'


export function SyncApproval() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const { syncResults, clearSyncResult } = useIntegrationStore()
  const { selectedIds, selectAll, clearSelection } = useSyncApprovalStore()
  const { data: integration } = useIntegrationDetail(id!)

  const syncResult = syncResults[id!]
  const allChanges = syncResult?.data.data.sync_approval.changes ?? []
  const applicationName =
    syncResult?.data.data.sync_approval.application_name ?? integration?.name ?? id

  // All changes from the sync response need approval: ADD, UPDATE, and DELETE
  const approvalChanges = allChanges

  const allIds = approvalChanges.map((c) => c.id)
  const allSelected = selectedIds.size === approvalChanges.length && approvalChanges.length > 0
  const indeterminate = selectedIds.size > 0 && !allSelected
  const approvedCount = selectedIds.size

  const handleSelectAll = (checked: boolean) => {
    if (checked) selectAll(allIds)
    else clearSelection()
  }

  const handleApprove = () => {
    toast.success(
      'Changes approved!',
      `${approvedCount} change${approvedCount !== 1 ? 's' : ''} from ${applicationName} have been applied.`
    )
    clearSelection()
    clearSyncResult(id!)
    navigate(`/integrations/${id}`)
  }

  if (!syncResult) {
    return (
      <FullErrorState
        error={{
          status: 0,
          code: 'no_data',
          message: 'No sync data found. Trigger a sync from the integration page first.',
        }}
        onRetry={() => navigate(`/integrations/${id}`)}
      />
    )
  }

  if (approvalChanges.length === 0) {
    return (
      <div>
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb__link">Integrations</Link>
          <span className="breadcrumb__sep"><Icon icon="mdi:chevron-right" width={14} /></span>
          <Link to={`/integrations/${id}`} className="breadcrumb__link">{applicationName}</Link>
          <span className="breadcrumb__sep"><Icon icon="mdi:chevron-right" width={14} /></span>
          <span className="breadcrumb__current">Sync Approval</span>
        </div>
        <div className="card" style={{ marginTop: 20 }}>
          <div className="empty-state">
            <div className="empty-state__icon">
              <Icon icon="mdi:check-circle-outline" width={40} color="var(--color-synced)" />
            </div>
            <div className="empty-state__title">No changes to approve</div>
            <div className="empty-state__desc">
              All incoming changes from {applicationName} are conflict updates — review them in Conflict Resolution.
            </div>
            <Button variant="primary" style={{ marginTop: 20 }} onClick={() => navigate(`/integrations/${id}`)}>
              Back to Integration
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 88 }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb__link">Integrations</Link>
        <span className="breadcrumb__sep"><Icon icon="mdi:chevron-right" width={14} /></span>
        <Link to={`/integrations/${id}`} className="breadcrumb__link">{applicationName}</Link>
        <span className="breadcrumb__sep"><Icon icon="mdi:chevron-right" width={14} /></span>
        <span className="breadcrumb__current">Sync Approval</span>
      </div>

      {/* Header */}
      <div className="conflict-header">
        <div className="conflict-badge" style={{ background: 'rgba(99,102,241,.12)', color: 'var(--color-primary)' }}>
          <Icon icon="mdi:file-check-outline" width={13} />
          Review Required
        </div>
        <h1>
          Approve {approvalChanges.length} Incoming Change{approvalChanges.length !== 1 ? 's' : ''}
        </h1>
        <p>
          Review and selectively approve changes incoming from{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>{applicationName}</strong>.
          Each change shows exactly what will be written to your database.
        </p>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, fontSize: 13, color: 'var(--color-text-secondary)' }}>
          <Icon icon="mdi:source-branch" width={15} />
          <span>{approvalChanges.length} change{approvalChanges.length !== 1 ? 's' : ''} pending approval</span>
          {approvedCount > 0 && (
            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              · {approvedCount} selected
            </span>
          )}
        </div>
      </div>

      {/* Select-all bar */}
      <div className="conflict-select-bar">
        <div className="conflict-select-bar__left">
          <Checkbox
            id="approval-select-all"
            checked={allSelected}
            indeterminate={indeterminate}
            onCheckedChange={handleSelectAll}
            label={allSelected ? 'Deselect all' : `Select all ${approvalChanges.length}`}
          />
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
          {approvedCount} of {approvalChanges.length} selected
        </div>
      </div>

      {/* Change list */}
      <div className="approval-list">
        {approvalChanges.map((change) => (
          <ApprovalChangeRow key={change.id} change={change} />
        ))}
      </div>

      {/* Sticky confirm bar */}
      <ApprovalConfirmBar
        totalCount={approvalChanges.length}
        onConfirm={handleApprove}
        onClear={clearSelection}
      />
    </div>
  )
}
