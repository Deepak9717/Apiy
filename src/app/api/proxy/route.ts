import { NextRequest, NextResponse } from 'next/server'

// SSRF protection: block private/internal IP ranges
const BLOCKED_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,     // AWS metadata
  /^::1$/,           // IPv6 loopback
  /^fc00:/i,         // IPv6 private
  /^fe80:/i,         // IPv6 link-local
]

function isBlockedHost(hostname: string): boolean {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(hostname))
}

export async function POST(req: NextRequest) {
  try {
    const { url, method, headers, body } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: `Invalid URL: "${url}"` }, { status: 400 })
    }

    // Block non-http(s) schemes
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: `Protocol "${parsedUrl.protocol}" is not allowed` },
        { status: 400 }
      )
    }

    // SSRF protection
    if (isBlockedHost(parsedUrl.hostname)) {
      return NextResponse.json(
        { error: `Requests to "${parsedUrl.hostname}" are not allowed` },
        { status: 403 }
      )
    }

    // Strip headers that could cause issues with APIs:
    // - 'host' must match the target, not our server
    // - 'origin' / 'referer' can trigger CORS rejections on some APIs
    // - 'content-type' on GET/HEAD requests can look suspicious
    const STRIP_HEADERS = new Set([
      'host', 'origin', 'referer', 'x-forwarded-for',
      'x-forwarded-host', 'x-forwarded-proto', 'x-real-ip',
    ])

    const cleanMethod = (method || 'GET').toUpperCase()
    const userHeaders: Record<string, string> = headers || {}

    const forwardedHeaders: Record<string, string> = {}
    for (const [key, value] of Object.entries(userHeaders)) {
      const lower = key.toLowerCase()
      if (STRIP_HEADERS.has(lower)) continue
      // Don't forward Content-Type on bodyless requests
      if (lower === 'content-type' && ['GET', 'HEAD', 'DELETE'].includes(cleanMethod)) continue
      forwardedHeaders[key] = value as string
    }

    const fetchOptions: RequestInit = {
      method: cleanMethod,
      headers: forwardedHeaders,
      signal: AbortSignal.timeout(30_000),
    }

    if (body && !['GET', 'HEAD'].includes(cleanMethod)) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
    }

    const response = await fetch(parsedUrl.toString(), fetchOptions)

    const responseHeaders: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    const contentType = response.headers.get('content-type') || ''
    let responseBody: string

    if (contentType.includes('application/json')) {
      try {
        responseBody = JSON.stringify(await response.json())
      } catch {
        responseBody = await response.text()
      }
    } else {
      responseBody = await response.text()
    }

    // Limit response body to 5MB
    if (responseBody.length > 5 * 1024 * 1024) {
      responseBody = responseBody.slice(0, 5 * 1024 * 1024) + '\n\n[Response truncated at 5MB]'
    }

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
    })
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timed out after 30 seconds' }, { status: 408 })
    }
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Failed to fetch: ${message}` }, { status: 500 })
  }
}
