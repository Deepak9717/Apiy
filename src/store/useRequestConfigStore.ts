import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { HttpMethod, KeyValuePair, RequestTab, AuthConfig, DEFAULT_AUTH } from '@/lib/types'
import { emptyPair, generateId } from '@/lib/request'

interface RequestConfigStore {
  method: HttpMethod
  url: string
  headers: KeyValuePair[]
  params: KeyValuePair[]
  body: string
  auth: AuthConfig
  activeTab: RequestTab

  setMethod: (method: HttpMethod) => void
  setUrl: (url: string) => void
  setHeaders: (headers: KeyValuePair[]) => void
  setParams: (params: KeyValuePair[]) => void
  setBody: (body: string) => void
  setAuth: (auth: Partial<AuthConfig>) => void
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
    auth: DEFAULT_AUTH,
    activeTab: 'params',

    setMethod: (method) => set((s) => { s.method = method }),
    setUrl: (url) => set((s) => { s.url = url }),
    setHeaders: (headers) => set((s) => { s.headers = headers }),
    setParams: (params) => set((s) => { s.params = params }),
    setBody: (body) => set((s) => { s.body = body }),
    setAuth: (auth) => set((s) => { Object.assign(s.auth, auth) }),
    setActiveTab: (tab) => set((s) => { s.activeTab = tab }),

    loadRequest: (partial) =>
      set((s) => {
        if (partial.method) s.method = partial.method
        if (partial.url !== undefined) s.url = partial.url
      }),

    reset: () =>
      set((s) => {
        s.method = 'GET'
        s.url = ''
        s.headers = defaultHeaders
        s.params = [emptyPair()]
        s.body = ''
        s.auth = { ...DEFAULT_AUTH }
        s.activeTab = 'params'
      }),
  }))
)
