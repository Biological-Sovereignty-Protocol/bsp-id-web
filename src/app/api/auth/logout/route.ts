import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.set('bsp_session', '', {
    httpOnly: true,
    secure: true, // Fix 2: always secure
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return res
}
