import { useMutation } from '@tanstack/react-query'
import { sendRequest, generateId } from '@/lib/request'
import { useRequestConfigStore } from '@/store/useRequestConfigStore'
import { useHistoryStore } from '@/store/useHistoryStore'
import { RequestResponse } from '@/lib/types'
import { useRef } from 'react'

export function useSendRequest() {
  const { method, url, headers, params, body } = useRequestConfigStore()
  const addHistory = useHistoryStore((s) => s.add)
  const abortRef = useRef<AbortController | null>(null)

  const mutation = useMutation<RequestResponse, Error>({
    mutationFn: async () => {
      // Cancel any in-flight request
      abortRef.current?.abort()
      abortRef.current = new AbortController()

      return sendRequest(method, url, headers, params, body, abortRef.current.signal)
    },

    onSuccess: (data) => {
      addHistory({
        id: generateId(),
        method,
        url,
        timestamp: Date.now(),
        status: data.status,
        time: data.time,
      })
    },

    retry: false, // No auto-retry — user should decide
  })

  const cancel = () => {
    abortRef.current?.abort()
    mutation.reset()
  }

  return {
    send: mutation.mutate,
    cancel,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    response: mutation.data ?? null,
    error: mutation.error,
    reset: mutation.reset,
  }
}
