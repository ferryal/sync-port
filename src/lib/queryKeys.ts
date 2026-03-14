export const queryKeys = {
  integrations: {
    all: ['integrations'] as const,
    lists: () => [...queryKeys.integrations.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.integrations.all, 'detail', id] as const,
  },
  syncHistory: {
    all: ['syncHistory'] as const,
    byIntegration: (integrationId: string) =>
      [...queryKeys.syncHistory.all, integrationId] as const,
  },
  sync: {
    all: ['sync'] as const,
    now: (appId: string) => [...queryKeys.sync.all, 'now', appId] as const,
  },
} as const
