export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface KeyValuePair {
  id: string
  key: string
  value: string
  enabled: boolean
}

export interface RequestConfig {
  method: HttpMethod
  url: string
  headers: KeyValuePair[]
  params: KeyValuePair[]
  body: string
}

export interface RequestResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  time: number
  size: number
}

export interface HistoryItem {
  id: string
  method: HttpMethod
  url: string
  timestamp: number
  status?: number
  time?: number
}

export type RequestTab = 'params' | 'headers' | 'body' | 'auth'
export type ResponseTab = 'body' | 'headers'

export type BodyMode = 'none' | 'raw' | 'form-data' | 'x-www-form-urlencoded'
export type RawBodyType = 'json' | 'text' | 'html' | 'xml' | 'javascript'

export const BODY_MODES: { value: BodyMode; label: string }[] = [
  { value: 'none', label: 'none' },
  { value: 'raw', label: 'raw' },
  { value: 'form-data', label: 'form-data' },
  { value: 'x-www-form-urlencoded', label: 'x-www-form-urlencoded' },
]

export const RAW_BODY_TYPES: { value: RawBodyType; label: string; mime: string; placeholder: string }[] = [
  { value: 'json', label: 'JSON', mime: 'application/json', placeholder: '{\n  "key": "value"\n}' },
  { value: 'text', label: 'Text', mime: 'text/plain', placeholder: 'Plain text body…' },
  { value: 'html', label: 'HTML', mime: 'text/html', placeholder: '<!DOCTYPE html>\n<html>\n  ...\n</html>' },
  { value: 'xml', label: 'XML', mime: 'application/xml', placeholder: '<?xml version="1.0"?>\n<root>\n  ...\n</root>' },
  { value: 'javascript', label: 'JavaScript', mime: 'application/javascript', placeholder: '// JS payload…' },
]

export type AuthType = 'none' | 'bearer' | 'basic' | 'apikey'

export interface AuthConfig {
  type: AuthType
  // Bearer
  token: string
  // Basic
  username: string
  password: string
  // API Key
  apiKeyName: string
  apiKeyValue: string
  apiKeyIn: 'header' | 'query'
}

export const DEFAULT_AUTH: AuthConfig = {
  type: 'none',
  token: '',
  username: '',
  password: '',
  apiKeyName: '',
  apiKeyValue: '',
  apiKeyIn: 'header',
}

export const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'text-emerald-400',
  POST: 'text-blue-400',
  PUT: 'text-amber-400',
  PATCH: 'text-purple-400',
  DELETE: 'text-red-400',
}

export const METHOD_BG: Record<HttpMethod, string> = {
  GET: 'bg-emerald-500/10',
  POST: 'bg-blue-500/10',
  PUT: 'bg-amber-500/10',
  PATCH: 'bg-purple-500/10',
  DELETE: 'bg-red-500/10',
}

// Solid chip styling used by the method dropdown trigger — darker text +
// tinted bg + matching border so the active method reads at a glance.
export const METHOD_CHIP: Record<HttpMethod, string> = {
  GET: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30',
  POST: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
  PUT: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30',
  PATCH: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30',
  DELETE: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30',
}

// Common header names for autocomplete in the Headers tab.
export const COMMON_HEADER_NAMES = [
  'Content-Type',
  'Authorization',
  'Accept',
  'Accept-Language',
  'Accept-Encoding',
  'Cache-Control',
  'User-Agent',
  'X-Requested-With',
  'X-API-Key',
  'Origin',
  'Referer',
  'Cookie',
  'Content-Length',
]

// Common Content-Type values for autocomplete once a header key is set to Content-Type.
export const COMMON_CONTENT_TYPES = [
  'application/json',
  'application/xml',
  'application/x-www-form-urlencoded',
  'multipart/form-data',
  'text/plain',
  'text/html',
  'application/octet-stream',
]
