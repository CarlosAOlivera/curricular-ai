import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { WeeklyPlanData } from '@/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function isPremiumActive(t: string | null, role: string) {
  return role === 'premium' || (!!t && new Date(t) > new Date())
}

function summarizePlan(p: WeeklyPlanData, week: number): string {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const
  const lines: string[] = [`Semana ${week} — ${p.theme}`]
  days.forEach(d => {
    const day = p.days[d]
    if (!day) return
    lines.push(`  ${d}: [${day.standards}] ${day.objectives[0] || ''} | ${day.developing[0] || ''}`)
  })
  return lines.join('\n')
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role, trial_ends_at').eq('id', user.id).single()
  if (!profile || !isPremiumActive(profile.trial_ends_at, profile.role)) {
    return NextResponse.json({ error: 'premium_required' }, { status: 403 })
  }

  const { planIds, versions = 1 } = await req.json() as { planIds: string[]; versions: number }
  if (!planIds?.length) return NextResponse.json({ error: 'Selecciona al menos un plan' }, { status: 400 })

  const { data: plansRows } = await supabase
    .from('lesson_plans')
    .select('*')
    .in('id', planIds)
    .eq('user_id', user.id)

  if (!plansRows?.length) return NextResponse.json({ error: 'Planes no encontrados' }, { status: 404 })

  const parsed: WeeklyPlanData[] = []
  let grade = '', subject = '', unitName = '', language = 'spanish'
  const standards = new Set<string>()

  for (const row of plansRows) {
    try {
      const p: WeeklyPlanData = JSON.parse(row.content)
      if (p?.version === 2) {
        parsed.push(p)
        grade = p.grade; subject = p.subject; unitName = p.unitName; language = p.language
        Object.values(p.days).forEach(d => { if (d?.standards) standards.add(d.standards) })
      }
    } catch { /* skip */ }
  }

  if (!parsed.length) return NextResponse.json({ error: 'No se pudo leer el contenido de los planes' }, { status: 400 })

  const isEnglish = language === 'english'
  const langRule = isEnglish
    ? 'Write the ENTIRE assessment in ENGLISH (this is an English class).'
    : 'Escribe el assessment COMPLETO en ESPANOL.'

  const weeksContext = parsed.map((p, i) => summarizePlan(p, plansRows[i]?.week || i + 1)).join('\n\n')

  const numVersions = Math.min(Math.max(versions, 1), 3)

  const versionInstruction = numVersions === 1
    ? 'Generate 1 assessment.'
    : `Generate ${numVersions} DIFFERENT versions of the assessment. Each version must have COMPLETELY DIFFERENT questions (same standards, different content, different question order, different wording). Students in the same class will get different versions.`

  const prompt = `You are an expert in Puerto Rico Department of Education (DEPR) curriculum.
Create a short assessment (prueba corta) based on the weekly lesson plan content below.
${langRule}

Grade: ${grade}
Subject: ${subject}
Unit: ${unitName}
Standards covered: ${[...standards].join(', ')}

WEEKLY CONTENT:
${weeksContext}

${versionInstruction}

Return ONLY a valid JSON object with this structure:
{
  "assessments": [
    {
      "title": "<title — include subject, grade, unit/week info>",
      "instructions": "<brief student-facing instructions>",
      "questions": [
        {
          "number": 1,
          "type": "multiple_choice",
          "question": "<question text>",
          "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
          "answer": "A"
        },
        {
          "number": 2,
          "type": "true_false",
          "question": "<statement>",
          "answer": "true"
        },
        {
          "number": 3,
          "type": "short_answer",
          "question": "<question>",
          "answer": "<expected answer>"
        }
      ]
    }
  ]
}

RULES:
- Each version: 10-12 questions, mix of types (at least 4 multiple choice, 2 true/false, 2 short answer)
- Questions must be directly tied to the lesson content above
- Multiple choice: always 4 options labeled A. B. C. D.
- True/false answer: "true" or "false" (lowercase)
- If multiple versions, questions must differ significantly — not just reworded
- Return ONLY the JSON, no markdown, no explanation
`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: numVersions === 1 ? 3000 : numVersions === 2 ? 5500 : 8000,
      messages: [{ role: 'user', content: prompt }],
    })
    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    const first = raw.indexOf('{'); const last = raw.lastIndexOf('}')
    if (first === -1 || last === -1) throw new Error('No JSON found')
    const parsed2 = JSON.parse(raw.slice(first, last + 1))

    // Save to DB (save first version as canonical)
    const firstAssessment = parsed2.assessments?.[0]
    if (firstAssessment) {
      await supabase.from('assessments').insert({
        user_id: user.id,
        grade, subject,
        unit: unitName,
        week: plansRows[0]?.week || 0,
        content: JSON.stringify(parsed2),
      })
    }

    return NextResponse.json({ assessments: parsed2.assessments })
  } catch (e) {
    console.error('Assessment generation error:', e)
    return NextResponse.json({ error: 'Error generando el assessment' }, { status: 500 })
  }
}
