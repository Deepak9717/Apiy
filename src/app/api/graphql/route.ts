import { NextRequest, NextResponse } from 'next/server'

const BLOCKED_PATTERNS = [
  /^localhost$/i, /^127\./, /^10\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./,
  /^169\.254\./, /^::1$/, /^fc00:/i, /^fe80:/i,
]

function isBlockedHost(h: string) {
  return BLOCKED_PATTERNS.some((p) => p.test(h))
}

export async function POST(req: NextRequest) {
  try {
    const { url, query, variables, headers: userHeaders } = await req.json()

    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

    let parsedUrl: URL
    try { parsedUrl = new URL(url) }
    catch { return NextResponse.json({ error: `Invalid URL: "${url}"` }, { status: 400 }) }

    if (!['http:', 'https:'].includes(parsedUrl.protocol))
      return NextResponse.json({ error: 'Only http/https allowed' }, { status: 400 })

    if (isBlockedHost(parsedUrl.hostname))
      return NextResponse.json({ error: `Requests to "${parsedUrl.hostname}" are not allowed` }, { status: 403 })

    const STRIP = new Set(['host', 'origin', 'referer', 'x-forwarded-for', 'x-forwarded-host'])
    const forwardedHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    if (userHeaders && typeof userHeaders === 'object') {
      for (const [k, v] of Object.entries(userHeaders)) {
        if (!STRIP.has(k.toLowerCase())) forwardedHeaders[k] = v as string
      }
    }

    const body = JSON.stringify({
      query,
      variables: variables && Object.keys(variables).length ? variables : undefined,
    })

    const start = Date.now()
    const response = await fetch(parsedUrl.toString(), {
      method: 'POST',
      headers: forwardedHeaders,
      body,
      signal: AbortSignal.timeout(30_000),
    })

    const time = Date.now() - start
    const text = await response.text()

    let parsed: unknown = null
    try { parsed = JSON.parse(text) } catch { /* not JSON */ }

    return NextResponse.json({ status: response.status, body: text, parsed, time })

  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError')
      return NextResponse.json({ error: 'Request timed out after 30 seconds' }, { status: 408 })
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `GraphQL request failed: ${msg}` }, { status: 500 })
  }
}
