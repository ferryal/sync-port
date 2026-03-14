import { create } from 'zustand'
import type { SyncResponse, IntegrationStatus } from '@/lib/schemas'

interface SyncResult {
  integrationId: string
  data: SyncResponse
  timestamp: string
}

interface IntegrationState {
  selectedIntegrationId: string | null
  integrationStatuses: Record<string, IntegrationStatus>
  syncResults: Record<string, SyncResult>
  activeFilter: string

  setSelectedIntegration: (id: string | null) => void
  setIntegrationStatus: (id: string, status: IntegrationStatus) => void
  setSyncResult: (integrationId: string, data: SyncResponse) => void
  clearSyncResult: (integrationId: string) => void
  setActiveFilter: (filter: string) => void
}

export const useIntegrationStore = create<IntegrationState>((set) => ({
  selectedIntegrationId: null,
  integrationStatuses: {},
  syncResults: {},
  activeFilter: 'all',

  setSelectedIntegration: (id) => set({ selectedIntegrationId: id }),

  setIntegrationStatus: (id, status) =>
    set((state) => ({
      integrationStatuses: { ...state.integrationStatuses, [id]: status },
    })),

  setSyncResult: (integrationId, data) =>
    set((state) => ({
      syncResults: {
        ...state.syncResults,
        [integrationId]: { integrationId, data, timestamp: new Date().toISOString() },
      },
    })),

  clearSyncResult: (integrationId) =>
    set((state) => {
      const { [integrationId]: _, ...rest } = state.syncResults
      return { syncResults: rest }
    }),

  setActiveFilter: (filter) => set({ activeFilter: filter }),
}))
