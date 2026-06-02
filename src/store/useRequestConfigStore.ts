import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { HttpMethod, KeyValuePair, RequestTab } from '@/lib/types'
import { emptyPair, generateId } from '@/lib/request'

interface RequestConfigStore {
  method: HttpMethod
  url: string
  headers: KeyValuePair[]
  params: KeyValuePair[]
  body: string
  activeTab: RequestTab

  setMethod: (method: HttpMethod) => void
  setUrl: (url: string) => void
  setHeaders: (headers: KeyValuePair[]) => void
  setParams: (params: KeyValuePair[]) => void
  setBody: (body: string) => void
  setActiveTab: (tab: RequestTab) => void
  loadRequest: (partial: Partial<{ method: HttpMethod; url: string }>) => void
  reset: () => void
}

const defaultHeaders: KeyValuePair[] = [
  { id: generateId(), key: 'Content-Type', value: 'application/json', enabled: true },
]

export const useRequestConfigStore = create<RequestConfigStore>()(
  immer((set) => ({
    method: 'GET',
    url: '',
    headers: defaultHeaders,
    params: [emptyPair()],
    body: '',
    activeTab: 'params',

    setMethod: (method) =>
      set((state) => {
        state.method = method
      }),

    setUrl: (url) =>
      set((state) => {
        state.url = url
      }),

    setHeaders: (headers) =>
      set((state) => {
        state.headers = headers
      }),

    setParams: (params) =>
      set((state) => {
        state.params = params
      }),

    setBody: (body) =>
      set((state) => {
        state.body = body
      }),

    setActiveTab: (tab) =>
      set((state) => {
        state.activeTab = tab
      }),

    loadRequest: (partial) =>
      set((state) => {
        if (partial.method) state.method = partial.method
        if (partial.url !== undefined) state.url = partial.url
      }),

    reset: () =>
      set((state) => {
        state.method = 'GET'
        state.url = ''
        state.headers = defaultHeaders
        state.params = [emptyPair()]
        state.body = ''
        state.activeTab = 'params'
      }),
  }))
)
