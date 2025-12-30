import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const { device_name, device_id, guard_id, battery_level, is_connected } = await req.json()

    const result = await sql`
      INSERT INTO bluetooth_devices (guard_id, device_name, device_id, battery_level, is_connected, last_connected_at)
      VALUES (${guard_id || 1}, ${device_name}, ${device_id}, ${battery_level}, ${is_connected}, NOW())
      ON CONFLICT (device_id) DO UPDATE SET
        battery_level = EXCLUDED.battery_level,
        is_connected = EXCLUDED.is_connected,
        last_connected_at = EXCLUDED.last_connected_at,
        updated_at = NOW()
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error updating bluetooth device:", error)
    return NextResponse.json({ error: "Failed to update device" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const guard_id = searchParams.get("guard_id")
    const sql = neon(process.env.DATABASE_URL!)

    const devices = await sql`
      SELECT * FROM bluetooth_devices 
      WHERE guard_id = ${guard_id || 1} 
      ORDER BY updated_at DESC
    `

    return NextResponse.json(devices)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch devices" }, { status: 500 })
  }
}
