import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const { patrol_id, transcript, sentiment_score, is_sos } = await req.json()

    const result = await sql`
      INSERT INTO voice_reports (patrol_id, guard_id, transcript, sentiment_score, is_sos)
      VALUES (${patrol_id}, 1, ${transcript}, ${sentiment_score}, ${is_sos})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to save voice report" }, { status: 500 })
  }
}
