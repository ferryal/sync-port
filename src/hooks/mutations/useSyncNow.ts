import { useMutation } from '@tanstack/react-query'
import { syncNow } from '@/api/sync.api'
import { useIntegrationStore } from '@/stores/useIntegrationStore'
import { queryClient } from '@/lib/queryClient'
import { queryKeys } from '@/lib/queryKeys'
import type { SyncResponse } from '@/lib/schemas'

export interface ApiError {
  status: number
  code: string
  message: string
}

interface UseSyncNowOptions {
  onSuccess?: (data: SyncResponse) => void
  onError?: (error: ApiError) => void
  toast?: {
    success: (title: string, message?: string) => void
    warning: (title: string, message?: string) => void
    error: (title: string, message?: string) => void
  }
}

export function useSyncNow(integrationId: string, options?: UseSyncNowOptions) {
  const { setIntegrationStatus, setSyncResult } = useIntegrationStore()

  return useMutation({
    mutationFn: () => syncNow(integrationId),

    onMutate: () => {
      setIntegrationStatus(integrationId, 'syncing')
    },

    onSuccess: (data) => {
      setSyncResult(integrationId, data)

      const changes = data.data.sync_approval.changes
      const hasConflicts = changes.some(
        (c) => c.change_type === 'UPDATE' && c.current_value && c.new_value
      )
      const addCount = changes.filter(c => c.change_type === 'ADD').length
      const updateCount = changes.filter(c => c.change_type === 'UPDATE').length

      setIntegrationStatus(integrationId, hasConflicts ? 'conflict' : 'synced')
      queryClient.invalidateQueries({ queryKey: queryKeys.integrations.lists() })

      if (hasConflicts) {
        options?.toast?.warning(
          'Sync completed with conflicts',
          `${updateCount} field conflict${updateCount !== 1 ? 's' : ''} require manual resolution.`
        )
      } else {
        options?.toast?.success(
          'Sync successful',
          `${changes.length} change${changes.length !== 1 ? 's' : ''} applied (${addCount} added, ${updateCount} updated).`
        )
      }

      options?.onSuccess?.(data)
    },

    onError: (error: ApiError) => {
      setIntegrationStatus(integrationId, 'error')

      const status = error?.status
      const msg = error?.message ?? 'An unexpected error occurred.'
      if (status === 502) {
        options?.toast?.error('Integration Unavailable', '502: The integration API is unreachable.')
      } else if (status === 500) {
        options?.toast?.error('Server Error', `500: ${msg}`)
      } else if (status && status >= 400 && status < 500) {
        options?.toast?.error(`Request Error (${status})`, msg)
      } else {
        options?.toast?.error('Sync Failed', msg)
      }

      options?.onError?.(error)
    },
  })
}
