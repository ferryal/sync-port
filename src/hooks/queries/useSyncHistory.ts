import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { mockSyncHistory } from '@/mock/syncHistory.mock'
import type { SyncHistoryEvent } from '@/lib/schemas'

async function fetchSyncHistory(integrationId?: string): Promise<SyncHistoryEvent[]> {
  await new Promise((r) => setTimeout(r, 400))
  if (!integrationId) return mockSyncHistory
  return mockSyncHistory.filter((e) => e.integrationId === integrationId)
}

export function useSyncHistory(integrationId?: string) {
  return useQuery({
    queryKey: integrationId
      ? queryKeys.syncHistory.byIntegration(integrationId)
      : queryKeys.syncHistory.all,
    queryFn: () => fetchSyncHistory(integrationId),
    staleTime: 1000 * 60,
  })
}
