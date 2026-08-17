import { useMutation } from '@tanstack/react-query'
import { sendRequest, generateId, resolveAuthHeaders } from '@/features/rest-client/lib/request'
import { useRequestConfigStore } from '@/features/rest-client/store/useRequestConfigStore'
import { useHistoryStore } from '@/features/rest-client/store/useHistoryStore'
import { RequestResponse } from '@/types/rest'
import { useRef } from 'react'
import { useResponseStore } from '@/features/rest-client/store/useResponseStore'

export function useSendRequest() {
  const { method, url, headers, params, body, bodyMode, bodyRawType, bodyForm, auth } = useRequestConfigStore()
  const addHistory = useHistoryStore((s) => s.add)
  const abortRef = useRef<AbortController | null>(null)

  const { setResponse, setPending, setError } = useResponseStore()

  const mutation = useMutation<RequestResponse, Error>({
    mutationFn: async () => {
      abortRef.current?.abort()
      abortRef.current = new AbortController()
      const resolved = resolveAuthHeaders(auth, headers, params)
      return sendRequest(
        method,
        url,
        resolved.headers,
        resolved.params,
        bodyMode,
        body,
        bodyRawType,
        bodyForm,
        abortRef.current.signal
      )
    },
    onMutate: () => {
      setPending(true)
      setError(null)
    },
    onSuccess: (data) => {
      setResponse(data)
      setPending(false)
      setError(null)
      addHistory({
        id: generateId(),
        method,
        url,
        timestamp: Date.now(),
        status: data.status,
        time: data.time,
      })
    },
    onError: (err) => {
      setError(err)
      setPending(false)
    },
    retry: false,
  })

  const cancel = () => {
    abortRef.current?.abort()
    mutation.reset()
    setPending(false)
  }

  return {
    send: mutation.mutate,
    cancel,
    isPending: mutation.isPending,
    isError: mutation.isError,
    response: mutation.data ?? null,
    error: mutation.error,
    reset: mutation.reset,
  }
}
