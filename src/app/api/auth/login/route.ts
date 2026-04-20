import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import nacl from 'tweetnacl'
import bs58 from 'bs58'
import { pendingNonces } from '../nonce/route'

const SESSION_DURATION_SECS = 30 * 24 * 60 * 60 // 30 days
const BSP_REGISTRY_URL = process.env.BSP_REGISTRY_URL ?? 'https://registry.bsp.bio'

// Fix 1: Validate SESSION_SECRET at startup
const SESSION_SECRET = process.env.SESSION_SECRET
if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
  throw new Error('SESSION_SECRET must be at least 32 characters')
}

interface LoginBody {
  domain: string
  signature: string
  nonce: string
  timestamp_secs: number
}

async function fetchPublicKey(domain: string): Promise<string | null> {
  try {
    const res = await fetch(`${BSP_REGISTRY_URL}/api/beo/${encodeURIComponent(domain)}`)
    if (!res.ok) return null
    const data = await res.json()
    return data?.public_key ?? null
  } catch {
    return null
  }
}

function verifySignature(
  domain: string,
  nonce: string,
  timestampSecs: number,
  signatureB58: string,
  publicKeyB58: string,
): boolean {
  try {
    const message = `bsp-login:${domain}:${nonce}:${timestampSecs}`
    const msgBytes = new TextEncoder().encode(message)
    const sigBytes = bs58.decode(signatureB58)
    const pubBytes = bs58.decode(publicKeyB58)
    return nacl.sign.detached.verify(msgBytes, sigBytes, pubBytes)
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

  let body: LoginBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { domain, signature, nonce, timestamp_secs } = body

  if (!domain || !signature || !nonce || !timestamp_secs) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Reject stale timestamps (5 min window)
  const nowSecs = Math.floor(Date.now() / 1000)
  if (Math.abs(nowSecs - timestamp_secs) > 300) {
    console.error(JSON.stringify({ event: 'auth_failure', reason: 'timestamp_expired', domain, ip, ts: new Date().toISOString() }))
    return NextResponse.json({ error: 'Timestamp expired' }, { status: 401 })
  }

  // Fix 3: Server-side nonce validation — look up nonce issued by /api/auth/nonce
  const pending = pendingNonces.get(nonce)
  if (!pending) {
    console.error(JSON.stringify({ event: 'auth_failure', reason: 'nonce_not_found_or_expired', domain, ip, ts: new Date().toISOString() }))
    return NextResponse.json({ error: 'Nonce not found or expired' }, { status: 409 })
  }
  if (pending.domain !== domain) {
    pendingNonces.delete(nonce)
    console.error(JSON.stringify({ event: 'auth_failure', reason: 'nonce_domain_mismatch', domain, ip, ts: new Date().toISOString() }))
    return NextResponse.json({ error: 'Nonce domain mismatch' }, { status: 409 })
  }
  // Consume nonce (single use)
  pendingNonces.delete(nonce)

  const publicKey = await fetchPublicKey(domain)
  if (!publicKey) {
    console.error(JSON.stringify({ event: 'auth_failure', reason: 'domain_not_found', domain, ip, ts: new Date().toISOString() }))
    return NextResponse.json({ error: 'Domain not found in registry' }, { status: 401 })
  }

  const valid = verifySignature(domain, nonce, timestamp_secs, signature, publicKey)
  if (!valid) {
    console.error(JSON.stringify({ event: 'auth_failure', reason: 'invalid_signature', domain, ip, ts: new Date().toISOString() }))
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const key = new TextEncoder().encode(SESSION_SECRET)
  const token = await new SignJWT({ domain })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECS}s`)
    .sign(key)

  const res = NextResponse.json({ success: true, domain })
  res.cookies.set('bsp_session', token, {
    httpOnly: true,
    secure: true, // Fix 2: always secure
    sameSite: 'lax',
    maxAge: SESSION_DURATION_SECS,
    path: '/',
  })
  return res
}
