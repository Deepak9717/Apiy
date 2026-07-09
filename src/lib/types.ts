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
