import { KeyValuePair, HttpMethod, RequestResponse, AuthConfig } from '@/types/rest'

export function resolveAuthHeaders(
  auth: AuthConfig,
  headers: KeyValuePair[],
  params: KeyValuePair[]
): { headers: KeyValuePair[]; params: KeyValuePair[] } {
  const h = headers.filter((x) => x.key.toLowerCase() !== 'authorization' || auth.type === 'none')
  const p = params.filter((x) => x.key !== auth.apiKeyName || auth.type !== 'apikey')

  if (auth.type === 'bearer' && auth.token) {
    return {
      headers: [...h, { id: 'auth-bearer', key: 'Authorization', value: `Bearer ${auth.token}`, enabled: true }],
      params: p,
    }
  }
  if (auth.type === 'basic' && auth.username) {
    const encoded = btoa(`${auth.username}:${auth.password}`)
    return {
      headers: [...h, { id: 'auth-basic', key: 'Authorization', value: `Basic ${encoded}`, enabled: true }],
      params: p,
    }
  }
  if (auth.type === 'apikey' && auth.apiKeyName && auth.apiKeyValue) {
    if (auth.apiKeyIn === 'header') {
      return {
        headers: [...h, { id: 'auth-apikey', key: auth.apiKeyName, value: auth.apiKeyValue, enabled: true }],
        params: p,
      }
    } else {
      return {
        headers: h,
        params: [...p, { id: 'auth-apikey', key: auth.apiKeyName, value: auth.apiKeyValue, enabled: true }],
      }
    }
  }
  return { headers: h, params: p }
}

export function buildUrlWithParams(url: string, params: KeyValuePair[]): string {
  const active = params.filter((p) => p.enabled && p.key.trim())
  if (!active.length) return url
  const qs = active.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&')
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}${qs}`
}

export function headersToObject(headers: KeyValuePair[]): Record<string, string> {
  return headers
    .filter((h) => h.enabled && h.key.trim())
    .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {})
}

export function parseUrlParams(url: string): KeyValuePair[] {
  try {
    const u = new URL(url)
    const pairs: KeyValuePair[] = []
    u.searchParams.forEach((value, key) => {
      pairs.push({ id: generateId(), key, value, enabled: true })
    })
    return pairs.length ? pairs : [emptyPair()]
  } catch {
    return [emptyPair()]
  }
}

export function emptyPair(): KeyValuePair {
  return { id: generateId(), key: '', value: '', enabled: true }
}

export function generateId(): string {
  return crypto.randomUUID()
}

export async function sendRequest(
  method: HttpMethod,
  url: string,
  headers: KeyValuePair[],
  params: KeyValuePair[],
  body: string,
  signal?: AbortSignal
): Promise<RequestResponse> {
  const finalUrl = buildUrlWithParams(url, params)
  const headerObj = headersToObject(headers)

  let parsedBody: unknown = undefined
  if (body && method !== 'GET' && method !== 'DELETE') {
    try {
      parsedBody = JSON.parse(body)
    } catch {
      parsedBody = body
    }
  }

  const start = Date.now()

  const res = await fetch('/api/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: finalUrl, method, headers: headerObj, body: parsedBody }),
    signal,
  })

  const time = Date.now() - start
  const data = await res.json()

  if (!res.ok && data.error) throw new Error(data.error)

  const bodyStr = typeof data.body === 'string' ? data.body : JSON.stringify(data.body)

  return {
    status: data.status,
    statusText: data.statusText,
    headers: data.headers,
    body: bodyStr,
    time,
    size: new Blob([bodyStr]).size,
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function tryPrettyPrint(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2)
  } catch {
    return str
  }
}

export function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return 'text-emerald-400'
  if (status >= 300 && status < 400) return 'text-blue-400'
  if (status >= 400 && status < 500) return 'text-amber-400'
  return 'text-red-400'
}

export function getStatusDot(status?: number): string {
  if (!status) return 'bg-zinc-600'
  if (status >= 200 && status < 300) return 'bg-emerald-500'
  if (status >= 400) return 'bg-red-500'
  return 'bg-amber-500'
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
