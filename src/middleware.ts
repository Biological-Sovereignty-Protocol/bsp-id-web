import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const RATE_LIMIT = 30
const WINDOW_MS = 60 * 1000

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

async function verifySession(req: NextRequest): Promise<boolean> {
  const secret = process.env.SESSION_SECRET
  if (!secret) return false

  const key = new TextEncoder().encode(secret)

  const cookie = req.cookies.get('bsp_session')?.value
  const authHeader = req.headers.get('authorization')
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  const token = cookie ?? bearer
  if (!token) return false

  try {
    await jwtVerify(token, key)
    return true
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Auth guard for /dashboard/*
  if (pathname.startsWith('/dashboard')) {
    const authenticated = await verifySession(req)
    if (!authenticated) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Rate limiting for /api/* routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  const ip = getClientIp(req)
  const now = Date.now()

  let entry = store.get(ip)

  if (!entry || now >= entry.resetAt) {
    entry = { count: 1, resetAt: now + WINDOW_MS }
    store.set(ip, entry)
  } else {
    entry.count += 1
  }

  const remaining = Math.max(0, RATE_LIMIT - entry.count)

  if (entry.count > RATE_LIMIT) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(RATE_LIMIT),
          'X-RateLimit-Remaining': '0',
          'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)),
        },
      }
    )
  }

  const res = NextResponse.next()
  res.headers.set('X-RateLimit-Limit', String(RATE_LIMIT))
  res.headers.set('X-RateLimit-Remaining', String(remaining))
  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
}
