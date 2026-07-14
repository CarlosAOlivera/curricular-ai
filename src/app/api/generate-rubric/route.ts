import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function isPremiumActive(trialEndsAt: string | null, role: string): boolean {
  if (role === 'premium') return true
  if (!trialEndsAt) return false
  return new Date(trialEndsAt) > new Date()
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, trial_ends_at')
    .eq('id', user.id)
    .single()

  if (!profile || !isPremiumActive(profile.trial_ends_at, profile.role)) {
    return NextResponse.json({ error: 'premium_required' }, { status: 403 })
  }

  const { grade, subject, unitName, standards, language, weekCode, day, objective, activity } = await req.json()

  const isEnglish = language === 'english'
  const lang = isEnglish
    ? 'Write the rubric entirely in ENGLISH.'
    : 'Escribe la rubrica completamente en ESPANOL.'

  const scope = day
    ? (isEnglish ? `Specific day: ${day}` : `Dia especifico: ${day}`)
    : (isEnglish ? 'Scope: full week' : 'Alcance: toda la semana')

  const focusBlock = objective || activity
    ? (isEnglish
        ? `Day objective: ${objective || ''}\nDay activities: ${activity || ''}`
        : `Objetivo del dia: ${objective || ''}\nActividades del dia: ${activity || ''}`)
    : ''

  const prompt = `You are an expert in Puerto Rico Department of Education (DEPR) curriculum.
Generate a grading rubric. ${lang}

Grade: ${grade}
Subject: ${subject}
Unit: ${unitName}
Week: ${weekCode}
Standards: ${standards.join(', ')}
${scope}
${focusBlock}

Return ONLY a valid JSON object:
{
  "title": "<rubric title that mentions the day or scope>",
  "criteria": [
    {
      "name": "<criterion name>",
      "excellent": "<4 points>",
      "good": "<3 points>",
      "developing": "<2 points>",
      "beginning": "<1 point>"
    }
  ]
}

Include 4-5 criteria directly tied to the objective/activity above. No markdown, no explanation, only JSON.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })
    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    const first = raw.indexOf('{'); const last = raw.lastIndexOf('}')
    const jsonStr = first !== -1 && last > first ? raw.slice(first, last + 1) : raw
    return NextResponse.json({ rubric: JSON.parse(jsonStr) })
  } catch {
    return NextResponse.json({ error: 'Error generando la rubrica' }, { status: 500 })
  }
}
