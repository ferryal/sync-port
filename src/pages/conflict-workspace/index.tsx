import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useIntegrationStore } from "@/stores/useIntegrationStore";
import { useConflictStore } from "@/stores/useConflictStore";
import { useIntegrationDetail } from "@/hooks/queries/useIntegrationDetail";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FullErrorState } from "@/components/ui/ErrorState";
import type { SyncChange } from "@/lib/schemas";
import { ConflictRow } from "@/components/conflict/ConflictRow";
import { MergeBar } from "@/components/conflict/MergeBar";
import { queryClient } from "@/lib/queryClient"
import { queryKeys } from "@/lib/queryKeys"

export function ConflictWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [merging, setMerging] = useState(false);

  const { syncResults } = useIntegrationStore();
  const {
    clearResolutions,
    resolutions,
    selectedConflictIds,
    selectAll,
    clearSelection,
  } = useConflictStore();
  const syncResult = syncResults[id!];
  const { data: integration } = useIntegrationDetail(id!);

  const allChanges = syncResult?.data.data.sync_approval.changes ?? [];
  const conflicts: SyncChange[] = allChanges.filter(
    (c) => c.change_type === "UPDATE" && c.current_value && c.new_value,
  );
  const applicationName =
    syncResult?.data.data.sync_approval.application_name ??
    integration?.name ??
    id;

  const resolvedCount = conflicts.filter((c) => !!resolutions[c.id]).length;
  const allResolved =
    resolvedCount === conflicts.length && conflicts.length > 0;
  const allIds = conflicts.map((c) => c.id);
  const allSelected =
    selectedConflictIds.size === conflicts.length && conflicts.length > 0;
  const indeterminate = selectedConflictIds.size > 0 && !allSelected;

  const handleSelectAll = (checked: boolean) => {
    if (checked) selectAll(allIds);
    else clearSelection();
  };

  const handleMerge = () => {
    setMerging(true);
    setTimeout(() => {
      const prevPayload: Record<string, string> = {}
      const currPayload: Record<string, string> = {}
      let appliedCount = 0

      conflicts.forEach(c => {
        const res = resolutions[c.id]
        if (res) {
          prevPayload[c.field_name] = c.current_value || ''
          if (res === 'external') {
            currPayload[c.field_name] = c.new_value || ''
            appliedCount++
          } else {
            currPayload[c.field_name] = c.current_value || ''
          }
        }
      })

      useIntegrationStore.getState().addHistoryEvent({
        id: `evt-${Date.now()}`,
        eventId: `#SYNC-${Math.floor(Math.random() * 10000) + 90000}`,
        integrationId: id!,
        timestamp: new Date().toISOString(),
        result: 'conflict',
        changesCount: appliedCount,
        initiator: 'Admin User',
        version: `v5.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        sha256: Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''),
        signedBy: 'Admin User',
        syncDuration: Math.floor(Math.random() * 1000) + 500,
        avgSyncDuration: 850,
        payload: {
          previous: JSON.stringify(prevPayload, null, 2),
          current: JSON.stringify(currPayload, null, 2)
        }
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.syncHistory.all })

      toast.success(
        "Changes applied successfully!",
        `${resolvedCount} conflict${resolvedCount !== 1 ? "s" : ""} merged into ${applicationName}.`,
      );
      clearResolutions();
      navigate(`/integrations/${id}`);
    }, 800);
  };

  if (!syncResult) {
    return (
      <FullErrorState
        error={{
          status: 0,
          code: "no_data",
          message:
            "No sync data found. Trigger a sync from the integration page first.",
        }}
        onRetry={() => navigate(`/integrations/${id}`)}
      />
    );
  }

  return (
    <div style={{ paddingBottom: 88 }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb__link">
          Integrations
        </Link>
        <span className="breadcrumb__sep">
          <Icon icon="mdi:chevron-right" width={14} />
        </span>
        <Link to={`/integrations/${id}`} className="breadcrumb__link">
          {applicationName}
        </Link>
        <span className="breadcrumb__sep">
          <Icon icon="mdi:chevron-right" width={14} />
        </span>
        <span className="breadcrumb__current">Conflict Resolution</span>
      </div>

      {/* Header */}
      <div className="conflict-header">
        <div className="conflict-badge">
          <Icon icon="mdi:alert" width={13} />
          Action Required
        </div>
        <h1>
          Resolve {conflicts.length} Conflict{conflicts.length !== 1 ? "s" : ""}
        </h1>
        <p>
          Review field mismatches between your database and{" "}
          <strong style={{ color: "var(--color-text-primary)" }}>
            {applicationName}
          </strong>
          .
        </p>

        {/* Progress row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 14,
            fontSize: 13,
            color: "var(--color-text-secondary)",
          }}
        >
          <div
            style={{
              width: 200,
              height: 4,
              background: "var(--color-border)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 2,
                background: allResolved
                  ? "var(--color-synced)"
                  : "var(--color-primary)",
                width: `${conflicts.length ? (resolvedCount / conflicts.length) * 100 : 0}%`,
                transition: "width .35s ease",
              }}
            />
          </div>
          <span>
            {resolvedCount}/{conflicts.length} resolved
          </span>
          {allResolved && (
            <span
              style={{
                color: "var(--color-synced)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Icon icon="mdi:check-circle" width={15} /> All done!
            </span>
          )}
        </div>
      </div>

      {/* No conflicts */}
      {conflicts.length === 0 ? (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="empty-state">
            <div className="empty-state__icon">
              <Icon
                icon="mdi:check-circle-outline"
                width={40}
                color="var(--color-synced)"
              />
            </div>
            <div className="empty-state__title">No conflicts to resolve</div>
            <div className="empty-state__desc">
              All changes from {applicationName} are additions or deletions — no
              fields conflict.
            </div>
            <Button
              variant="primary"
              style={{ marginTop: 20 }}
              onClick={() => navigate(`/integrations/${id}`)}
            >
              Back to Integration
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Select-all bar */}
          <div className="conflict-select-bar">
            <div className="conflict-select-bar__left">
              <Checkbox
                id="select-all"
                checked={allSelected}
                indeterminate={indeterminate}
                onCheckedChange={handleSelectAll}
                label={
                  allSelected
                    ? "Deselect all"
                    : `Select all ${conflicts.length}`
                }
              />
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
              {resolvedCount} of {conflicts.length} resolved
            </div>
          </div>

          {/* Conflict table */}
          <div className="conflict-table-wrap">
            <table className="conflict-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>Field</th>
                  <th>Current (yours)</th>
                  <th>Incoming</th>
                  <th>Resolution</th>
                </tr>
              </thead>
              <tbody>
                {conflicts.map((change, index) => (
                  <ConflictRow
                    key={change.id}
                    change={change}
                    index={index}
                    applicationName={applicationName ?? ""}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Sticky merge bar */}
      <MergeBar conflicts={conflicts} onMerge={handleMerge} />
    </div>
  );
}
