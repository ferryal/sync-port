import { z } from 'zod'

// ─── Change Types ────────────────────────────────────────────────────────────
export const ChangeTypeSchema = z.enum(['ADD', 'UPDATE', 'DELETE'])
export type ChangeType = z.infer<typeof ChangeTypeSchema>

// ─── Sync Change ─────────────────────────────────────────────────────────────
export const SyncChangeSchema = z.object({
  id: z.string(),
  field_name: z.string(),
  change_type: ChangeTypeSchema,
  current_value: z.string().optional(),
  new_value: z.string().optional(),
})
export type SyncChange = z.infer<typeof SyncChangeSchema>

// ─── Sync Approval ───────────────────────────────────────────────────────────
export const SyncApprovalSchema = z.object({
  application_name: z.string(),
  changes: z.array(SyncChangeSchema),
})
export type SyncApproval = z.infer<typeof SyncApprovalSchema>

// ─── Sync API Response ────────────────────────────────────────────────────────
export const SyncResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: z.object({
    sync_approval: SyncApprovalSchema,
    metadata: z.record(z.unknown()),
  }),
})
export type SyncResponse = z.infer<typeof SyncResponseSchema>

// ─── API Error ────────────────────────────────────────────────────────────────
export const ApiErrorSchema = z.object({
  status: z.number(),
  code: z.string(),
  message: z.string(),
  data: z.unknown().optional(),
})
export type ApiError = z.infer<typeof ApiErrorSchema>

// ─── Integration Status ───────────────────────────────────────────────────────
export const IntegrationStatusSchema = z.enum(['synced', 'syncing', 'conflict', 'error'])
export type IntegrationStatus = z.infer<typeof IntegrationStatusSchema>

// ─── Integration ──────────────────────────────────────────────────────────────
export const IntegrationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  status: IntegrationStatusSchema,
  lastSync: z.string(),
  systemHealth: z.number(),
  syncFrequency: z.string(),
  activeMappings: z.number(),
  instanceUrl: z.string(),
  environment: z.enum(['Production', 'Staging', 'Development']),
  lastPayloadSize: z.string(),
  oauthScope: z.string(),
  connectedSince: z.string(),
  icon: z.string(),
  color: z.string(),
})
export type Integration = z.infer<typeof IntegrationSchema>

// ─── Sync History Event ───────────────────────────────────────────────────────
export const SyncEventResultSchema = z.enum(['success', 'conflict', 'failed'])

export const SyncHistoryEventSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  integrationId: z.string(),
  timestamp: z.string(),
  result: SyncEventResultSchema,
  changesCount: z.number(),
  initiator: z.string(),
  version: z.string(),
  sha256: z.string(),
  signedBy: z.string(),
  syncDuration: z.number(),
  avgSyncDuration: z.number(),
  payload: z.object({
    previous: z.string(),
    current: z.string(),
  }).optional(),
})
export type SyncHistoryEvent = z.infer<typeof SyncHistoryEventSchema>

// ─── Conflict Resolution ──────────────────────────────────────────────────────
export const ConflictResolutionSchema = z.enum(['local', 'external', 'custom'])
export type ConflictResolution = z.infer<typeof ConflictResolutionSchema>
