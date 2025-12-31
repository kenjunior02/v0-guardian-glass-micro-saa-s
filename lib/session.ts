import * as jose from 'jose'
import { cookies } from 'next/headers'
import type { User } from './auth'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
const secret = new TextEncoder().encode(JWT_SECRET)

export interface SessionData {
  userId: number
  email: string
  role: string
}

export async function createSession(user: User): Promise<string> {
  const token = await new jose.SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(secret)

  return token
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value

    if (!token) {
      return null
    }

    const verified = await jose.jwtVerify(token, secret)
    return verified.payload as unknown as SessionData
  } catch (error) {
    console.error('[v0] Session verification error:', error)
    return null
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 24 hours
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
