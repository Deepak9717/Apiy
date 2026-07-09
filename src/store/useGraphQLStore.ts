import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { generateId } from '@/lib/request'

export interface GraphQLHistoryItem {
  id: string
  url: string
  query: string
  timestamp: number
  status?: number
}

export interface GraphQLResponse {
  data: unknown
  errors?: unknown[]
  status: number
  time: number
  raw: string
}

interface GraphQLStore {
  url: string
  query: string
  variables: string
  headers: string          // raw JSON string for simplicity
  response: GraphQLResponse | null
  schema: string | null
  schemaLoading: boolean
  history: GraphQLHistoryItem[]

  setUrl: (url: string) => void
  setQuery: (query: string) => void
  setVariables: (v: string) => void
  setHeaders: (h: string) => void
  setResponse: (r: GraphQLResponse | null) => void
  setSchema: (s: string | null) => void
  setSchemaLoading: (v: boolean) => void
  addHistory: (item: GraphQLHistoryItem) => void
  clearHistory: () => void
}

export const useGraphQLStore = create<GraphQLStore>()(
  persist(
    immer((set) => ({
      url: '',
      query: `query {\n  \n}`,
      variables: '{}',
      headers: '{}',
      response: null,
      schema: null,
      schemaLoading: false,
      history: [],

      setUrl: (url) => set((s) => { s.url = url }),
      setQuery: (query) => set((s) => { s.query = query }),
      setVariables: (v) => set((s) => { s.variables = v }),
      setHeaders: (h) => set((s) => { s.headers = h }),
      setResponse: (r) => set((s) => { s.response = r }),
      setSchema: (schema) => set((s) => { s.schema = schema }),
      setSchemaLoading: (v) => set((s) => { s.schemaLoading = v }),

      addHistory: (item) =>
        set((s) => {
          s.history = [item, ...s.history.filter(h => h.url !== item.url || h.query !== item.query)].slice(0, 50)
        }),

      clearHistory: () => set((s) => { s.history = [] }),
    })),
    {
      name: 'api-forge-graphql',
      partialize: (s) => ({ url: s.url, query: s.query, variables: s.variables, headers: s.headers, history: s.history }),
    }
  )
)
