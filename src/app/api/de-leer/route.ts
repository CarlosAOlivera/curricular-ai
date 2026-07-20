import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { prompt } = await req.json()

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = (message.content[0] as { type: string; text: string }).text
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const json = jsonMatch ? jsonMatch[0] : content

    return NextResponse.json({ content: json })
  } catch (err: unknown) {
    console.error('DE Leer API error:', err)
    return NextResponse.json({ error: 'Error generando planificación' }, { status: 500 })
  }
}
