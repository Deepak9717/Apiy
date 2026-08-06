import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { HistoryItem } from '@/types/rest'

interface HistoryStore {
  items: HistoryItem[]
  add: (item: HistoryItem) => void
  clear: () => void
  remove: (id: string) => void
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    immer((set) => ({
      items: [],

      add: (item) =>
        set((state) => {
          // deduplicate: remove older entry with same method+url if exists
          state.items = state.items.filter(
            (h) => !(h.method === item.method && h.url === item.url)
          )
          state.items.unshift(item)
          if (state.items.length > 100) state.items = state.items.slice(0, 100)
        }),

      clear: () =>
        set((state) => {
          state.items = []
        }),

      remove: (id) =>
        set((state) => {
          state.items = state.items.filter((h) => h.id !== id)
        }),
    })),
    {
      name: 'api-forge-history',
    }
  )
)
