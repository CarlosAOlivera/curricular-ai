import { NextResponse } from 'next/server'
import { generateICS } from '@/lib/depr-calendar'

export async function GET() {
  const ics = generateICS()
  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="depr-calendario-2026-27.ics"',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
