import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { mockIntegrations } from '@/mock/integrations.mock'
import { useIntegrationStore } from '@/stores/useIntegrationStore'
import type { Integration } from '@/lib/schemas'

async function fetchIntegrations(): Promise<Integration[]> {
  // Simulated network delay
  await new Promise((r) => setTimeout(r, 400))
  return mockIntegrations
}

export function useIntegrations() {
  const { integrationStatuses } = useIntegrationStore()

  const query = useQuery({
    queryKey: queryKeys.integrations.lists(),
    queryFn: fetchIntegrations,
    staleTime: 1000 * 30,
  })

  // Merge real-time status overrides from store into mocked data
  const data = query.data?.map((integration) => ({
    ...integration,
    status: integrationStatuses[integration.id] ?? integration.status,
  }))

  return { ...query, data }
}
