import { create } from 'zustand'
import { RequestResponse } from '@/lib/types'

export interface ResponseState {
  response: RequestResponse | null
  pending: boolean
  error: Error | null
  setResponse: (response: RequestResponse) => void
  setPending: (pending: boolean) => void
  setError: (error: Error | null) => void
  reset: () => void
}

export const useResponseStore = create<ResponseState>((set) => ({
  response: null,
  pending: false,
  error: null,
  setResponse: (response) => set({ response }),
  setPending: (pending) => set({ pending }),
  setError: (error) => set({ error }),
  reset: () => set({ response: null, pending: false, error: null }),
}))
