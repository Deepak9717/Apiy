"use client";

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { ResponseTab } from '@/types/rest'
import { persist } from 'zustand/middleware'

interface UIStore {
  splitPos: number
  sidebarOpen: boolean
  responseTab: ResponseTab
  theme: 'dark' | 'light'

  setSplitPos: (pos: number) => void
  toggleSidebar: () => void
  setResponseTab: (tab: ResponseTab) => void
  toggleTheme: () => void
}

export const useUIStore = create<UIStore>()(
  persist(
    immer((set) => ({
      splitPos: 50,
      sidebarOpen: true,
      responseTab: 'body',
      theme: 'dark',

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

      toggleTheme: () =>
        set((state) => {
          state.theme = state.theme === 'dark' ? 'light' : 'dark'
        }),
    })),
    {
      name: 'ui-store',
      partialize: (state) => ({
        splitPos: state.splitPos,
        sidebarOpen: state.sidebarOpen,
        responseTab: state.responseTab,
        theme: state.theme,
      }),
    }
  )
)
