import { create } from 'zustand'

interface SyncApprovalState {
  selectedIds: Set<string>
  toggleSelect: (id: string) => void
  selectAll: (ids: string[]) => void
  clearSelection: () => void
}

export const useSyncApprovalStore = create<SyncApprovalState>((set) => ({
  selectedIds: new Set(),

  toggleSelect: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { selectedIds: next }
    }),

  selectAll: (ids) => set({ selectedIds: new Set(ids) }),

  clearSelection: () => set({ selectedIds: new Set() }),
}))
