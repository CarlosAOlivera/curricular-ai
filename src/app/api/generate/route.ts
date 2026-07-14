import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { GenerateRequest } from '@/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Free tier: unlimited plan generation. Premium unlocks Word/PPT/rubrics/assessments/full history.
// const FREE_LIMIT = 5  // kept for reference — not enforced

function isEnglishSubject(subject: string): boolean {
  const s = subject.toLowerCase()
  return s.includes('english') || s.includes('ingles') || s.includes('esl') || s.includes('ela')
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, generations_this_month')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })
  }

  // No generation limit — free tier is unlimited on basic plans.
  // Premium unlocks Word export, PPT, rubrics, assessments, and full history.

  const body: GenerateRequest = await req.json()
  const { grade, subject, unitId, unitName, week, standards, teacherNotes, teacherName, school, weekStartDate } = body

  const lang = isEnglishSubject(subject) ? 'english' : 'spanish'
  const notesSection = teacherNotes ? '\nTeacher notes: ' + teacherNotes : ''

  const unitParts = unitId.split('.')
  const unitNumber = unitParts[1] || unitParts[0]
  const weekCode = unitId + '.W' + week

  const langInstruction = lang === 'english'
    ? 'Write ALL plan content (objectives, activities, materials, etc.) in ENGLISH. This is an English class.'
    : 'Escribe TODO el contenido del plan (objetivos, actividades, materiales, etc.) en ESPANOL. Es una clase en espanol.'

  const actLang = lang === 'english'
    ? 'At the end of the lesson students will be able to:'
    : 'Al finalizar la clase el estudiante podra:'

  const prompt = 'You are an expert in the Puerto Rico Department of Education (DEPR) curriculum.\n' +
    'Generate a complete weekly lesson plan in valid JSON format matching the WeeklyPlanData interface below.\n\n' +
    'LANGUAGE RULE: ' + langInstruction + '\n\n' +
    'PLAN DATA:\n' +
    'Subject: ' + subject + '\n' +
    'Grade: ' + grade + '\n' +
    'Unit ' + unitNumber + ': ' + unitName + '\n' +
    'Unit ID: ' + unitId + '\n' +
    'Week: ' + week + ' (' + weekCode + ')\n' +
    'Standards: ' + standards.join(', ') + '\n' +
    'Teacher: ' + (teacherName || '') + '\n' +
    'School: ' + (school || '') + '\n' +
    'Week start date: ' + (weekStartDate || '') + '\n' +
    notesSection + '\n\n' +
    'OUTPUT: Return ONLY a valid JSON object. No markdown, no code fences, no explanation.\n\n' +
    'JSON STRUCTURE:\n' +
    '{\n' +
    '  "version": 2,\n' +
    '  "teacher": "' + (teacherName || '') + '",\n' +
    '  "school": "' + (school || '') + '",\n' +
    '  "weekStartDate": "' + (weekStartDate || '') + '",\n' +
    '  "grade": "' + grade + '",\n' +
    '  "subject": "' + subject + '",\n' +
    '  "theme": "<main theme/topic of this unit week>",\n' +
    '  "unitNumber": "' + unitNumber + '",\n' +
    '  "unitName": "' + unitName + '",\n' +
    '  "weekCode": "' + weekCode + '",\n' +
    (lang === 'english'
      ? '  "transversalThemes": ["<applicable from: Equity and Respect Among All Human Beings, Cultural Identity and Interculturality, Health Awareness, Education for Environmental and Ecological Awareness, Entrepreneurship and Innovation, Information and Communications Technology (ICT)>"],\n' +
        '  "generatorThemes": ["<applicable from: Diversity, Ethical Coexistence>"],\n'
      : '  "transversalThemes": ["<aplicables de: Equidad y respeto entre todos los seres humanos, Identidad cultural e interculturalidad, Conciencia de la salud, Educacion para la conciencia ambiental y ecologica, Emprendimiento e innovacion, Tecnologia de la informacion y la comunicacion (TIC)>"],\n' +
        '  "generatorThemes": ["<aplicables de: Diversidad, Convivencia etica>"],\n') +
    '  "language": "' + lang + '",\n' +
    '  "days": {\n' +
    '    "monday": <DayPlan>,\n' +
    '    "tuesday": <DayPlan>,\n' +
    '    "wednesday": <DayPlan>,\n' +
    '    "thursday": <DayPlan>,\n' +
    '    "friday": <DayPlan>\n' +
    '  }\n' +
    '}\n\n' +
    'Each DayPlan:\n' +
    '{\n' +
    '  "standards": "<standard code(s) for this day, e.g. L.1, R.2>",\n' +
    '  "indicators": "<specific indicator/expectation code>",\n' +
    '  "objectives": ["' + actLang + ' <ONE clear, measurable objective for this day>"],\n' +
    '  "initial": ["<ONE hook/warm-up activity (~10 min) — activates prior knowledge or sets context>"],\n' +
    '  "developing": ["<ONE main activity (~35 min) — core instruction, practice or exploration>"],\n' +
    '  "closing": ["<ONE closing activity (~10 min) — exit ticket, reflection or quick check>"],\n' +
    '  "integration": "<subject integrated, e.g. Math, Science, or N/A>",\n' +
    '  "evaluation": ["formative"],\n' +
    '  "accommodations": ["special_ed", "immigrant"],\n' +
    '  "differentiation": "<differentiation strategies for Beginning, Intermediate, Advanced>",\n' +
    '  "materials": ["<material 1>", "<material 2>", "<material 3>"]\n' +
    '}\n\n' +
    'IMPORTANT:\n' +
    '- SIMPLICITY RULE: exactly ONE item per objectives, initial, developing, and closing array. No more.\n' +
    '- Class time is 50-60 min. Account for attendance and interruptions — keep activities realistic and doable.\n' +
    '- Activities must be CONCRETE and specific, not generic. Ready to use in the classroom.\n' +
    '- Build logical progression across the 5 days.\n' +
    '- Distribute standards (' + standards.join(', ') + ') across the days.\n' +
    '- evaluation array values must be from: "diagnostic", "formative", "summative"\n' +
    '- accommodations array values must be from: "special_ed", "immigrant", "504", "gifted"\n' +
    '- Return ONLY the JSON object, nothing else.\n'

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawContent = message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract JSON — handle markdown fences and any preamble/postamble text
    let jsonStr = rawContent
      .replace(/^```json\s*/im, '')
      .replace(/^```\s*/im, '')
      .replace(/```\s*$/im, '')
      .trim()

    // If Claude still added text before/after the JSON object, extract the outermost { ... }
    const firstBrace = jsonStr.indexOf('{')
    const lastBrace  = jsonStr.lastIndexOf('}')
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      jsonStr = jsonStr.slice(firstBrace, lastBrace + 1)
    }

    // Validate it parses as JSON
    let parsedPlan
    try {
      parsedPlan = JSON.parse(jsonStr)
    } catch (parseErr) {
      console.error('JSON parse error. Raw response:', rawContent.slice(0, 500))
      return NextResponse.json({ error: 'Plan generation failed - invalid JSON response. Please try again.' }, { status: 500 })
    }

    const content = JSON.stringify(parsedPlan)

    await Promise.all([
      supabase.from('lesson_plans').insert({
        user_id: user.id,
        grade,
        subject,
        unit: unitName,
        week,
        content,
      }),
      supabase
        .from('profiles')
        .update({ generations_this_month: profile.generations_this_month + 1 })
        .eq('id', user.id),
    ])

    const remaining = null // no limit on free tier

    return NextResponse.json({ content, remaining, role: profile.role })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json({ error: 'Error generando la planificacion' }, { status: 500 })
  }
}
