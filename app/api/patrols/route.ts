import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const { guard_id, location, status, sentiment_score, ai_risk_score } = await req.json()

    const result = await sql`
      INSERT INTO patrols (guard_id, company_id, location, started_at, status, sentiment_score, ai_risk_score)
      VALUES (${guard_id || 1}, 1, ${location}, NOW(), ${status}, ${sentiment_score}, ${ai_risk_score})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error creating patrol:", error)
    return NextResponse.json({ error: "Failed to create patrol" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const patrols = await sql`
      SELECT p.*, u.name as guard_name 
      FROM patrols p
      JOIN guards g ON p.guard_id = g.id
      JOIN users u ON g.user_id = u.id
      WHERE p.status = 'active'
      ORDER BY p.started_at DESC
    `
    return NextResponse.json(patrols)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch patrols" }, { status: 500 })
  }
}
