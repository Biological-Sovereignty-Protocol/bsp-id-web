import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

// Server-side nonce store with TTL — prevents replay attacks
export const pendingNonces = new Map<string, { domain: string; expiresAt: number }>()

// Cleanup expired nonces every minute
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of pendingNonces) {
    if (now > v.expiresAt) pendingNonces.delete(k)
  }
}, 60_000)

export function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get('domain')
  if (!domain) return NextResponse.json({ error: 'domain required' }, { status: 400 })
  const nonce = randomBytes(32).toString('hex')
  pendingNonces.set(nonce, { domain, expiresAt: Date.now() + 5 * 60 * 1000 })
  return NextResponse.json({ nonce })
}
