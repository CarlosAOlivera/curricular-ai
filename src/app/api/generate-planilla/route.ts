import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { WeeklyPlanData } from '@/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function isPremiumActive(t: string | null, role: string) {
  return role === 'premium' || (!!t && new Date(t) > new Date())
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

  const { planIds, totalPoints = 100 } = await req.json() as { planIds: string[]; totalPoints: number }
  if (!planIds?.length) return NextResponse.json({ error: 'Selecciona al menos un plan' }, { status: 400 })

  const { data: plansRows } = await supabase
    .from('lesson_plans').select('*').in('id', planIds).eq('user_id', user.id)

  if (!plansRows?.length) return NextResponse.json({ error: 'Planes no encontrados' }, { status: 404 })

  const parsedPlans: { plan: WeeklyPlanData; week: number }[] = []
  let grade = '', subject = '', unitName = '', language = 'spanish'
  const allStandards: string[] = []

  for (const row of plansRows) {
    try {
      const p: WeeklyPlanData = JSON.parse(row.content)
      if (p?.version === 2) {
        parsedPlans.push({ plan: p, week: row.week })
        grade = p.grade; subject = p.subject; unitName = p.unitName; language = p.language
        Object.values(p.days).forEach(d => { if (d?.standards) allStandards.push(d.standards) })
      }
    } catch { /* skip */ }
  }

  const uniqueStandards = [...new Set(allStandards)]

  // Build detailed content summary for Claude
  const contentLines: string[] = []
  for (const { plan, week } of parsedPlans) {
    contentLines.push(`=== Semana ${week}: ${plan.theme} ===`)
    for (const [day, dayPlan] of Object.entries(plan.days)) {
      if (!dayPlan) continue
      contentLines.push(`  ${day}: Estandar ${dayPlan.standards}`)
      contentLines.push(`    Objetivo: ${dayPlan.objectives[0] || ''}`)
      contentLines.push(`    Actividad principal: ${dayPlan.developing[0] || ''}`)
    }
  }

  const isEnglish = language === 'english'
  const langRule = isEnglish
    ? 'Write ALL content in ENGLISH (this is an English class).'
    : 'Escribe TODO el contenido en ESPANOL.'

  const bloomLevels = isEnglish
    ? ['Knowledge', 'Comprehension', 'Application', 'Analysis']
    : ['Conocimiento', 'Comprension', 'Aplicacion', 'Analisis']

  const qTypes = isEnglish
    ? ['Multiple choice', 'True/False', 'Short answer', 'Essay']
    : ['Seleccion multiple', 'Verdadero/Falso', 'Respuesta corta', 'Ensayo']

  const prompt = `You are an expert in Puerto Rico Department of Education (DEPR) curriculum and educational assessment.
Create a complete unit exam with a planilla de especificaciones (test specification table).
${langRule}

Grade: ${grade}
Subject: ${subject}
Unit: ${unitName}
Standards: ${uniqueStandards.join(', ')}
Total points: ${totalPoints}

UNIT CONTENT COVERED:
${contentLines.join('\n')}

Return ONLY a valid JSON object:
{
  "planilla": {
    "title": "<Planilla de Especificaciones — Subject Grade Unit>",
    "subject": "${subject}",
    "grade": "${grade}",
    "unitName": "${unitName}",
    "totalItems": <total number of questions>,
    "totalPoints": ${totalPoints},
    "rows": [
      {
        "standard": "<standard code, e.g. R.1>",
        "objective": "<brief objective description>",
        "bloomLevel": "<one of: ${bloomLevels.join(', ')}>",
        "questionType": "<one of: ${qTypes.join(', ')}>",
        "numItems": <number>,
        "points": <points this row is worth>,
        "percentage": <percentage of total>
      }
    ]
  },
  "exam": {
    "title": "<Examen de Unidad — Subject Grade Unit>",
    "instructions": "<general instructions for students>",
    "sections": [
      {
        "title": "<e.g. Parte I: Seleccion multiple>",
        "type": "multiple_choice",
        "pointsPerQuestion": <number>,
        "questions": [
          {
            "number": 1,
            "standard": "<standard>",
            "bloomLevel": "<level>",
            "question": "<question text>",
            "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
            "answer": "A",
            "points": <number>
          }
        ]
      },
      {
        "title": "<e.g. Parte II: Verdadero o Falso>",
        "type": "true_false",
        "pointsPerQuestion": <number>,
        "questions": [
          {
            "number": <n>,
            "standard": "<standard>",
            "bloomLevel": "<level>",
            "question": "<statement>",
            "answer": "true",
            "points": <number>
          }
        ]
      },
      {
        "title": "<e.g. Parte III: Respuesta corta>",
        "type": "short_answer",
        "pointsPerQuestion": <number>,
        "questions": [
          {
            "number": <n>,
            "standard": "<standard>",
            "bloomLevel": "<level>",
            "question": "<question>",
            "answer": "<expected answer>",
            "points": <number>
          }
        ]
      }
    ]
  }
}

RULES:
- The planilla rows must match the exam questions (one row per standard per question type)
- Total points across all sections must equal ${totalPoints}
- At minimum: 8 multiple choice (1-2 pts each), 5 true/false (1 pt each), 3 short answer (3-5 pts each)
- Include higher Bloom levels for at least 2 questions (Analysis/Analisis)
- Questions must be specific to the content above, not generic
- Return ONLY the JSON, no markdown, no explanation
`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 10000,
      messages: [{ role: 'user', content: prompt }],
    })
    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    const first = raw.indexOf('{'); const last = raw.lastIndexOf('}')
    if (first === -1 || last === -1) throw new Error('No JSON found')
    const result = JSON.parse(raw.slice(first, last + 1))

    await supabase.from('planillas').insert({
      user_id: user.id, grade, subject, unit: unitName,
      content: JSON.stringify(result),
    })

    return NextResponse.json(result)
  } catch (e) {
    console.error('Planilla generation error:', e)
    return NextResponse.json({ error: 'Error generando la planilla' }, { status: 500 })
  }
}
