import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { ResponseTab } from '@/lib/types'

interface UIStore {
  splitPos: number
  sidebarOpen: boolean
  responseTab: ResponseTab

  setSplitPos: (pos: number) => void
  toggleSidebar: () => void
  setResponseTab: (tab: ResponseTab) => void
}

export const useUIStore = create<UIStore>()(
  immer((set) => ({
    splitPos: 50,
    sidebarOpen: true,
    responseTab: 'body',

    setSplitPos: (pos) =>
      set((state) => {
        state.splitPos = pos
      }),

    toggleSidebar: () =>
      set((state) => {
        state.sidebarOpen = !state.sidebarOpen
      }),

    setResponseTab: (tab) =>
      set((state) => {
        state.responseTab = tab
      }),
  }))
)
