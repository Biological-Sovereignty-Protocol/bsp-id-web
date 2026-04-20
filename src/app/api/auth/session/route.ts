import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function GET(req: NextRequest) {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    return NextResponse.json({ authenticated: false })
  }

  const token = req.cookies.get('bsp_session')?.value
  if (!token) {
    return NextResponse.json({ authenticated: false })
  }

  try {
    const key = new TextEncoder().encode(secret)
    const { payload } = await jwtVerify(token, key)
    return NextResponse.json({
      authenticated: true,
      domain: payload.domain as string,
      exp: payload.exp,
    })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
