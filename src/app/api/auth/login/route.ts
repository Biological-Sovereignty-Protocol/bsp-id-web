import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import nacl from 'tweetnacl'
import bs58 from 'bs58'

const SESSION_DURATION_SECS = 30 * 24 * 60 * 60 // 30 days
const BSP_REGISTRY_URL = process.env.BSP_REGISTRY_URL ?? 'https://registry.bsp.bio'

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
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

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
    return NextResponse.json({ error: 'Timestamp expired' }, { status: 401 })
  }

  const publicKey = await fetchPublicKey(domain)
  if (!publicKey) {
    return NextResponse.json({ error: 'Domain not found in registry' }, { status: 401 })
  }

  const valid = verifySignature(domain, nonce, timestamp_secs, signature, publicKey)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const key = new TextEncoder().encode(secret)
  const token = await new SignJWT({ domain })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECS}s`)
    .sign(key)

  const res = NextResponse.json({ success: true, domain })
  res.cookies.set('bsp_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_SECS,
    path: '/',
  })
  return res
}
