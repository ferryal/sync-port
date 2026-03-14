import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { mockIntegrations } from '@/mock/integrations.mock'
import type { Integration } from '@/lib/schemas'

async function fetchIntegrationDetail(id: string): Promise<Integration> {
  await new Promise((r) => setTimeout(r, 300))
  const found = mockIntegrations.find((i) => i.id === id)
  if (!found) throw { status: 404, code: 'not_found', message: `Integration "${id}" not found` }
  return found
}

export function useIntegrationDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.integrations.detail(id),
    queryFn: () => fetchIntegrationDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60,
  })
}
