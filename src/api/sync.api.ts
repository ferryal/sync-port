import { apiClient } from '@/api/axios'
import { SyncResponseSchema, type SyncResponse } from '@/lib/schemas'

export async function syncNow(applicationId: string): Promise<SyncResponse> {
  const { data } = await apiClient.get('/data/sync', {
    params: { application_id: applicationId },
  })
  return SyncResponseSchema.parse(data)
}
