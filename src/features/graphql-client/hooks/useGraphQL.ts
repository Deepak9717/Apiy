import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'
import { useGraphQLStore, GraphQLResponse } from '@/features/graphql-client/store/useGraphQLStore'
import { generateId } from '@/features/rest-client/lib/request'

const INTROSPECTION_QUERY = `
  query IntrospectionQuery {
    __schema {
      queryType { name }
      mutationType { name }
      types {
        name kind description
        fields(includeDeprecated: true) {
          name description
          type { ...TypeRef }
        }
        inputFields { name description type { ...TypeRef } }
        enumValues(includeDeprecated: true) { name description }
        possibleTypes { ...TypeRef }
      }
    }
  }
  fragment TypeRef on __Type {
    kind name
    ofType { kind name ofType { kind name ofType { kind name } } }
  }
`

async function runGraphQL(
  url: string, query: string, variables: string, headers: string, signal: AbortSignal
): Promise<GraphQLResponse> {
  let parsedVars = {}
  let parsedHeaders = {}
  try { parsedVars = variables.trim() ? JSON.parse(variables) : {} } catch { /* ignore */ }
  try { parsedHeaders = headers.trim() ? JSON.parse(headers) : {} } catch { /* ignore */ }

  const res = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, query, variables: parsedVars, headers: parsedHeaders }),
    signal,
  })

  const data = await res.json()
  if (data.error) throw new Error(data.error)

  return {
    data: data.parsed?.data ?? null,
    errors: data.parsed?.errors,
    status: data.status,
    time: data.time,
    raw: data.body,
  }
}

export function useGraphQL() {
  const {
    url, query, variables, headers,
    setResponse, setSchema, setSchemaLoading, addHistory,
  } = useGraphQLStore()
  const abortRef = useRef<AbortController | null>(null)

  const mutation = useMutation<GraphQLResponse, Error>({
    mutationFn: async () => {
      abortRef.current?.abort()
      abortRef.current = new AbortController()
      return runGraphQL(url, query, variables, headers, abortRef.current.signal)
    },
    onSuccess: (data) => {
      // Write into store so ALL components reading from store get the update
      setResponse(data)
      addHistory({ id: generateId(), url, query, timestamp: Date.now(), status: data.status })
    },
    retry: false,
  })

  const fetchSchema = async () => {
    if (!url) return
    setSchemaLoading(true)
    try {
      let parsedHeaders = {}
      try { parsedHeaders = JSON.parse(headers) } catch { /* ignore */ }
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, query: INTROSPECTION_QUERY, variables: {}, headers: parsedHeaders }),
      })
      const data = await res.json()
      const schema = data.parsed?.data?.__schema ?? data.parsed?.__schema
      if (schema) setSchema(JSON.stringify(schema, null, 2))
    } catch { /* silently fail */ }
    finally { setSchemaLoading(false) }
  }

  const cancel = () => {
    abortRef.current?.abort()
    mutation.reset()
  }

  return {
    run: mutation.mutate,
    cancel,
    fetchSchema,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
