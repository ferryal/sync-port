import { create } from 'zustand'
import type { ConflictResolution } from '@/lib/schemas'

interface ConflictState {
  selectedConflictIds: Set<string>
  resolutions: Record<string, ConflictResolution>
  customValues: Record<string, string>

  toggleSelect: (id: string) => void
  selectAll: (ids: string[]) => void
  clearSelection: () => void
  setResolution: (changeId: string, resolution: ConflictResolution, customValue?: string) => void
  bulkSetLocal: () => void
  bulkSetExternal: () => void
  clearResolutions: () => void
  isAllResolved: (changeIds: string[]) => boolean
}

export const useConflictStore = create<ConflictState>((set, get) => ({
  selectedConflictIds: new Set(),
  resolutions: {},
  customValues: {},

  toggleSelect: (id) =>
    set((state) => {
      const next = new Set(state.selectedConflictIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { selectedConflictIds: next }
    }),

  selectAll: (ids) =>
    set({ selectedConflictIds: new Set(ids) }),

  clearSelection: () =>
    set({ selectedConflictIds: new Set() }),

  setResolution: (changeId, resolution, customValue) =>
    set((state) => ({
      resolutions: { ...state.resolutions, [changeId]: resolution },
      customValues: customValue !== undefined
        ? { ...state.customValues, [changeId]: customValue }
        : state.customValues,
    })),

  bulkSetLocal: () =>
    set((state) => {
      const newRes = { ...state.resolutions }
      state.selectedConflictIds.forEach((id) => { newRes[id] = 'local' })
      return { resolutions: newRes }
    }),

  bulkSetExternal: () =>
    set((state) => {
      const newRes = { ...state.resolutions }
      state.selectedConflictIds.forEach((id) => { newRes[id] = 'external' })
      return { resolutions: newRes }
    }),

  clearResolutions: () =>
    set({ resolutions: {}, customValues: {}, selectedConflictIds: new Set() }),

  isAllResolved: (changeIds) => {
    const { resolutions } = get()
    return changeIds.every((id) => !!resolutions[id])
  },
}))
