import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { HttpMethod, KeyValuePair, RequestTab, AuthConfig, DEFAULT_AUTH, BodyMode, RawBodyType } from '@/types/rest'
import { emptyPair, generateId } from '@/features/rest-client/lib/request'

interface RequestConfigStore {
  method: HttpMethod
  url: string
  headers: KeyValuePair[]
  params: KeyValuePair[]
  body: string
  bodyMode: BodyMode
  bodyRawType: RawBodyType
  bodyForm: KeyValuePair[]
  auth: AuthConfig
  activeTab: RequestTab

  setMethod: (method: HttpMethod) => void
  setUrl: (url: string) => void
  setHeaders: (headers: KeyValuePair[]) => void
  setParams: (params: KeyValuePair[]) => void
  setBody: (body: string) => void
  setBodyMode: (mode: BodyMode) => void
  setBodyRawType: (type: RawBodyType) => void
  setBodyForm: (pairs: KeyValuePair[]) => void
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
    bodyMode: 'raw',
    bodyRawType: 'json',
    bodyForm: [emptyPair()],
    auth: DEFAULT_AUTH,
    activeTab: 'params',

    setMethod: (method) => set((s) => { s.method = method }),
    setUrl: (url) => set((s) => { s.url = url }),
    setHeaders: (headers) => set((s) => { s.headers = headers }),
    setParams: (params) => set((s) => { s.params = params }),
    setBody: (body) => set((s) => { s.body = body }),
    setBodyMode: (mode) => set((s) => { s.bodyMode = mode }),
    setBodyRawType: (type) => set((s) => { s.bodyRawType = type }),
    setBodyForm: (pairs) => set((s) => { s.bodyForm = pairs }),
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
        s.bodyMode = 'raw'
        s.bodyRawType = 'json'
        s.bodyForm = [emptyPair()]
        s.auth = { ...DEFAULT_AUTH }
        s.activeTab = 'params'
      }),
  }))
)
