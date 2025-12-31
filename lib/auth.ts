import { sql } from './db'
import bcrypt from 'bcryptjs'

export interface User {
  id: number
  email: string
  role: string
  name: string | null
  company_id: string | null
  guard_id: number | null
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const users = await sql`
      SELECT id, email, password_hash, role, name, company_id, guard_id
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `

    if (users.length === 0) {
      return null
    }

    const user = users[0]
    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      company_id: user.company_id,
      guard_id: user.guard_id
    }
  } catch (error) {
    console.error('[v0] Authentication error:', error)
    return null
  }
}

export async function createUser(
  email: string,
  password: string,
  role: string,
  name: string,
  company_id?: string
): Promise<User | null> {
  try {
    const passwordHash = await hashPassword(password)

    const users = await sql`
      INSERT INTO users (email, password_hash, role, name, company_id)
      VALUES (${email}, ${passwordHash}, ${role}, ${name}, ${company_id || null})
      RETURNING id, email, role, name, company_id, guard_id
    `

    if (users.length === 0) {
      return null
    }

    return users[0] as User
  } catch (error) {
    console.error('[v0] User creation error:', error)
    return null
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const users = await sql`
      SELECT id, email, role, name, company_id, guard_id
      FROM users
      WHERE id = ${id}
      LIMIT 1
    `

    if (users.length === 0) {
      return null
    }

    return users[0] as User
  } catch (error) {
    console.error('[v0] Get user error:', error)
    return null
  }
}
