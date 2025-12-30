import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const company_id = searchParams.get("company_id")

    if (!company_id) {
      return NextResponse.json({ error: "Missing company_id" }, { status: 400 })
    }

    const result = await sql`
      SELECT 
        u.id,
        u.name,
        u.status,
        g.badge_number,
        g.patrol_streak,
        g.total_patrols,
        g.ranking_score,
        g.sentiment_avg,
        c.name as company_name
      FROM users u
      LEFT JOIN guards g ON u.id = g.user_id
      LEFT JOIN companies c ON u.company_id = c.id
      WHERE u.company_id = ${company_id} AND u.role = 'guard'
      ORDER BY g.ranking_score DESC
    `

    return NextResponse.json({ success: true, guards: result })
  } catch (error) {
    console.error("[API] List guards error:", error)
    return NextResponse.json({ error: "Failed to fetch guards" }, { status: 500 })
  }
}
