'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { englishCurriculum } from '@/lib/curriculum/english'
import { spanishCurriculum } from '@/lib/curriculum/spanish'
import { adquisicionCurriculum } from '@/lib/curriculum/adquisicion'
import { matematicasCurriculum } from '@/lib/curriculum/matematicas'
import { cienciasCurriculum } from '@/lib/curriculum/ciencias'
import { CurriculumGrade, GenerateRequest, WeeklyPlanData } from '@/types'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

const WeeklyPlanTable = dynamic(() => import('@/components/WeeklyPlanTable'), { ssr: false })

// ── Loading screen ──────────────────────────────────────────────────────────
function GeneratingScreen({ messages }: { messages: string[] }) {
  const { t } = useLanguage()
  const [idx, setIdx]         = useState(0)
  const [visible, setVisible] = useState(true)
  useEffect(() => { setIdx(Math.floor(Math.random() * messages.length)) }, [messages.length])
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => { let n = Math.floor(Math.random() * messages.length); while (n === i) n = Math.floor(Math.random() * messages.length); return n })
        setVisible(true)
      }, 400)
    }, 16000)
    return () => clearInterval(t)
  }, [messages.length])
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin" />
      <p className="text-ink text-lg">{t('planner.generating')}</p>
      <p className="text-navy-mid text-sm">{t('planner.generatingMsg')}</p>
      <p className="text-navy-mid/50 text-xs italic max-w-xs text-center" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s' }}>
        {messages[idx]}
      </p>
    </div>
  )
}

// ── Constants ───────────────────────────────────────────────────────────────
type Step = 'select' | 'generating' | 'result'

const SUBJECTS = [
  { id: 'english',     label: 'Ingles',                   curriculum: englishCurriculum     },
  { id: 'spanish',     label: 'Espanol',                  curriculum: spanishCurriculum     },
  { id: 'adquisicion', label: 'Adquisicion de la Lengua', curriculum: adquisicionCurriculum },
  { id: 'matematicas', label: 'Matematicas',              curriculum: matematicasCurriculum },
  { id: 'ciencias',    label: 'Ciencias',                 curriculum: cienciasCurriculum    },
]

const ALL_GRADES = [
  { value: 'K',  label: 'Kinder'   }, { value: '1',  label: 'Grado 1'  },
  { value: '2',  label: 'Grado 2'  }, { value: '3',  label: 'Grado 3'  },
  { value: '4',  label: 'Grado 4'  }, { value: '5',  label: 'Grado 5'  },
  { value: '6',  label: 'Grado 6'  }, { value: '7',  label: 'Grado 7'  },
  { value: '8',  label: 'Grado 8'  }, { value: '9',  label: 'Grado 9'  },
  { value: '10', label: 'Grado 10' }, { value: '11', label: 'Grado 11' },
  { value: '12', label: 'Grado 12' },
]

const TEACHER_MSGS = [
  'Contando los marcadores que le faltan en el salon...',
  'Buscando papel para la impresora... encontramos 3 hojas.',
  'Recordando que el viernes hay duty en el pasillo...',
  'Sobreviviendo a otra reunion de facultad sin cafe...',
  'Preguntandole a los estudiantes que se sienten...',
  'Calculando cuantos dias faltan para las vacaciones...',
  'Buscando el proyector que siempre esta ocupado...',
  'Leyendo el correo de las 4:59pm del viernes...',
  'Completando el portafolio de evidencias automaticamente...',
  'Recordando los nombres de todos los estudiantes nuevos...',
  'Verificando que el libro de calificaciones no se perdio...',
  'Buscando las tijeras que desaparecieron en octubre...',
  'Preparando excusas creativas para el proximo consejo escolar...',
  'Tomando la lista de asistencia por cuarta vez hoy...',
  'Enviando el correo que debia ir ayer...',
  'Encontrando fotocopias de 1994 en el archivo...',
  'Esperando que el internet del salon funcione hoy...',
  'Calculando si quedan fondos para materiales este mes...',
  'Preparando el salon antes de que lleguen 30 personas a la vez...',
  'Buscando ese formulario que piden cada agosto...',
]

function getSubjectLabel(id: string) { return SUBJECTS.find(s => s.id === id)?.label ?? id }
function getCurriculum(id: string): CurriculumGrade[] { return SUBJECTS.find(s => s.id === id)?.curriculum ?? [] }

// ── Main Component ───────────────────────────────────────────────────────────
export default function PlannerPage() {
  const { t } = useLanguage()
  const [subject, setSubject]   = useState('english')
  const [grade, setGrade]       = useState('')
  const [unitId, setUnitId]     = useState('')
  const [week, setWeek]         = useState<number | ''>('')
  const [teacherNotes, setTeacherNotes]     = useState('')
  const [teacherName, setTeacherName]       = useState('')
  const [school, setSchool]                 = useState('')
  const [weekStartDate, setWeekStartDate]   = useState('')
  const [step, setStep]         = useState<Step>('select')
  const [plan, setPlan]         = useState<WeeklyPlanData | null>(null)
  const [planId, setPlanId]     = useState<string | null>(null)
  const [error, setError]       = useState('')
  const [userRole, setUserRole] = useState<string>('free')
  const [remaining, setRemaining] = useState<number | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [exportingDocx, setExportingDocx] = useState(false)
  const [exportingPptx, setExportingPptx] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('full_name, school, role').eq('id', user.id).single()
        .then(({ data }) => {
          if (data?.full_name) setTeacherName(data.full_name)
          if (data?.school) setSchool(data.school)
          if (data?.role) setUserRole(data.role)
        })
    })
  }, [])

  const curriculum = getCurriculum(subject)
  const gradeData  = curriculum.find(g => g.grade === grade)
  const unitData   = gradeData?.units.find(u => u.id === unitId)

  function handleSubjectChange(s: string) { setSubject(s); setUnitId(''); setWeek('') }
  function handleGradeChange(g: string)   { setGrade(g);   setUnitId(''); setWeek('') }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!gradeData || !unitData || week === '') return
    setStep('generating'); setError('')
    const body: GenerateRequest = { grade, subject: getSubjectLabel(subject), unitId, unitName: unitData.name, week: Number(week), standards: unitData.standards, teacherNotes, teacherName, school, weekStartDate }
    try {
      const res  = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (res.status === 403 && data.limitReached) {
        setShowUpgrade(true); setStep('select'); return
      }
      if (!res.ok) throw new Error(data.error)
      const parsed: WeeklyPlanData = JSON.parse(data.content)
      setPlan(parsed)
      setPlanId(data.planId || null)
      if (data.remaining !== null) setRemaining(data.remaining)
      setStep('result')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado'); setStep('select')
    }
  }

  function handleReset() { setStep('select'); setPlan(null); setPlanId(null); setGrade(''); setUnitId(''); setWeek(''); setTeacherNotes('') }

  const downloadPDF = useCallback(() => {
    if (!plan) return
    window.print()
  }, [plan])

  const downloadDocx = useCallback(async () => {
    if (!plan) return
    setExportingDocx(true)
    try {
      const res = await fetch('/api/office/docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan),
      })
      if (!res.ok) throw new Error('Error generando el Word')
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `plan-${plan.weekCode}-${plan.grade}.docx`.replace(/\s/g, '-').toLowerCase()
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      alert('Error generando el documento Word.')
    } finally {
      setExportingDocx(false)
    }
  }, [plan])

  const downloadPptx = useCallback(async () => {
    if (!plan) return
    setExportingPptx(true)
    try {
      const PptxGenJS = (await import('pptxgenjs')).default
      const pptx = new PptxGenJS()
      pptx.layout = 'LAYOUT_WIDE'

      const isEn = plan.language === 'english'
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const
      const dayLabels = isEn
        ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        : ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
      const phaseLabels = isEn
        ? { initial: 'Opening', developing: 'Development', closing: 'Closing' }
        : { initial: 'Inicio', developing: 'Desarrollo', closing: 'Cierre' }

      // ── Cover slide ──────────────────────────────────────────────────────
      const cover = pptx.addSlide()
      cover.background = { color: '0F172A' }
      cover.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.06, fill: { color: '2563EB' }, line: { color: '2563EB' } })
      cover.addText(plan.theme, {
        x: 0.6, y: 0.9, w: 8.8, h: 1.0, color: 'FFFFFF', fontSize: 38, bold: true, align: 'left',
      })
      cover.addText(`${plan.unitNumber ? (isEn ? 'Unit ' : 'Unidad ') + plan.unitNumber + ': ' : ''}${plan.unitName}`, {
        x: 0.6, y: 2.0, w: 8.8, h: 0.5, color: '93C5FD', fontSize: 18, italic: true,
      })
      cover.addText([
        `${plan.grade} · ${plan.subject}`,
        `${isEn ? 'Week' : 'Semana'} ${plan.weekCode.split('W')[1] ?? plan.weekCode}`,
        plan.weekStartDate ? `${isEn ? 'Week of' : 'Semana del'} ${plan.weekStartDate}` : '',
        plan.teacher ? plan.teacher + (plan.school ? '  ·  ' + plan.school : '') : plan.school,
      ].filter(Boolean).join('   |   '), {
        x: 0.6, y: 2.65, w: 8.8, h: 0.4, color: '64748B', fontSize: 13,
      })

      // Weekly objectives
      const objSlide = pptx.addSlide()
      objSlide.background = { color: '0F172A' }
      objSlide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.55, fill: { color: '1E40AF' }, line: { color: '1E40AF' } })
      objSlide.addText(isEn ? 'Weekly Objectives' : 'Objetivos de la semana', {
        x: 0.4, y: 0.1, w: 9.2, h: 0.38, color: 'FFFFFF', fontSize: 18, bold: true,
      })
      const objText = days.map((day, i) =>
        `${dayLabels[i]}: ${plan.days[day].objectives?.[0] ?? '—'}`
      ).join('\n\n')
      objSlide.addText(objText, {
        x: 0.5, y: 0.75, w: 9.1, h: 6.2, color: 'E2E8F0', fontSize: 14, lineSpacingMultiple: 2.2, valign: 'top',
      })

      // ── Day slides ───────────────────────────────────────────────────────
      days.forEach((day, i) => {
        const d = plan.days[day]
        const s = pptx.addSlide()
        s.background = { color: '0F172A' }

        // Day header bar
        s.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.55, fill: { color: '1E40AF' }, line: { color: '1E40AF' } })
        s.addText(dayLabels[i], { x: 0.4, y: 0.08, w: 5, h: 0.38, color: 'FFFFFF', fontSize: 20, bold: true })
        s.addText(d.standards ?? '', { x: 5.5, y: 0.1, w: 4.1, h: 0.34, color: 'BFDBFE', fontSize: 12, align: 'right' })

        // Objective
        s.addText(d.objectives?.[0] ?? '—', {
          x: 0.4, y: 0.65, w: 9.2, h: 0.7, color: 'F1F5F9', fontSize: 16, bold: true, wrap: true,
        })

        // Three phase columns
        const phases = ['initial', 'developing', 'closing'] as const
        const phaseBarColors  = { initial: '1E3A8A', developing: '14532D', closing: '713F12' }
        const phaseBgColors   = { initial: '172554', developing: '052E16', closing: '1C1204' }
        const phaseTextColors = { initial: 'BFDBFE', developing: 'BBF7D0', closing: 'FEF08A' }
        const colX = [0.1, 3.4, 6.7]
        const colW2 = 3.1

        phases.forEach((phase, pi) => {
          const cx = colX[pi]
          s.addShape('rect', { x: cx, y: 1.45, w: colW2, h: 0.36, fill: { color: phaseBarColors[phase] }, line: { color: phaseBarColors[phase] } })
          s.addText(phaseLabels[phase].toUpperCase(), {
            x: cx + 0.1, y: 1.48, w: colW2 - 0.2, h: 0.3, color: 'FFFFFF', fontSize: 11, bold: true,
          })
          s.addShape('rect', { x: cx, y: 1.81, w: colW2, h: 5.1, fill: { color: phaseBgColors[phase] }, line: { color: '1E293B' } })
          s.addText(d[phase]?.[0] ?? '—', {
            x: cx + 0.18, y: 1.9, w: colW2 - 0.36, h: 4.9,
            color: phaseTextColors[phase], fontSize: 13, wrap: true, valign: 'top', lineSpacingMultiple: 1.4,
          })
        })

        // Materials
        if (d.materials?.length) {
          s.addText((isEn ? '📦 ' : '📦 ') + d.materials.slice(0, 6).join('  ·  '), {
            x: 0, y: 6.95, w: '100%', h: 0.22, color: '475569', fontSize: 9, align: 'center',
          })
        }
      })

      // ── Materials summary slide ───────────────────────────────────────────
      const allMats = [...new Set(days.flatMap(d => plan.days[d].materials ?? []))]
      if (allMats.length) {
        const ms = pptx.addSlide()
        ms.background = { color: '0F172A' }
        ms.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.55, fill: { color: '0F3460' }, line: { color: '0F3460' } })
        ms.addText(isEn ? 'Materials for the Week' : 'Materiales de la semana', {
          x: 0.4, y: 0.1, w: 9.2, h: 0.38, color: 'FFFFFF', fontSize: 18, bold: true,
        })
        ms.addText(allMats.map(m => '• ' + m).join('\n'), {
          x: 0.6, y: 0.85, w: 9.0, h: 6.0, color: '94A3B8', fontSize: 15, wrap: true, valign: 'top', lineSpacingMultiple: 1.8,
        })
      }

      const filename = `presentacion-${plan.weekCode}-${plan.grade}.pptx`.replace(/\s/g, '-').toLowerCase()
      await pptx.writeFile({ fileName: filename })
    } catch (e) {
      console.error(e)
      alert('Error generando la presentación.')
    } finally {
      setExportingPptx(false)
    }
  }, [plan])

  if (step === 'generating') return <GeneratingScreen messages={TEACHER_MSGS} />

  if (step === 'result' && plan) {
    return (
      <div className="space-y-6">
        <style>{`@media print { body * { visibility: hidden; } #weekly-plan, #weekly-plan * { visibility: visible; } #weekly-plan { position: absolute; top: 0; left: 0; width: 100%; padding: 8px; } @page { margin: 1cm; size: landscape; } .no-print { display: none !important; } }`}</style>

        <div className="flex items-center justify-between no-print">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Planificacion generada</h2>
            <p className="text-navy-mid text-sm mt-1">{gradeData?.label} · {getSubjectLabel(subject)} · {unitData?.name} · {t('planner.week')} {week}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={downloadPDF} className="px-4 py-2 bg-teal hover:bg-teal-deep text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              {t('common.downloadPdf')}
            </button>

            {/* Premium exports */}
            {userRole === 'premium' || userRole === 'institutional' ? (
              <>
                <button onClick={downloadDocx} disabled={exportingDocx}
                  className="px-4 py-2 bg-navy hover:bg-navy-mid disabled:opacity-50 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2">
                  {exportingDocx
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/></svg>}
                  Word / Google Docs
                </button>
                {/* PowerPoint temporarily disabled */}
              </>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-gold-tint border border-gold/30 rounded-lg text-xs text-gold-deep">
                <span>🔒</span> Word / Google Docs <span className="text-gold-deep/60 ml-1">Premium</span>
              </div>
            )}

            <button onClick={handleReset} className="px-4 py-2 bg-navy-tint hover:bg-navy-mid/20 text-ink rounded-lg text-sm font-medium transition-colors">
              {t('planner.newPlan')}
            </button>
          </div>
        </div>

        {/* Premium callout */}
        <div className="no-print bg-gold-tint border border-gold/30 rounded-xl p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-gold-deep font-medium text-sm">{t('planner.premiumFeatures')}</p>
            <p className="text-navy-mid/60 text-xs mt-0.5">Funciones Premium — selecciona el dia y la fase de la clase</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/rubrica"    className="px-3 py-2 bg-navy hover:bg-navy-mid text-white rounded-lg text-xs font-semibold transition-colors">{t('nav.rubrica')}</Link>
            <Link href="/assessment" className="px-3 py-2 bg-navy hover:bg-navy-mid text-white rounded-lg text-xs font-semibold transition-colors">{t('nav.assessment')}</Link>
          </div>
        </div>

        <div ref={printRef} id="weekly-plan" className="bg-white rounded-xl overflow-hidden">
          <WeeklyPlanTable plan={plan} />
        </div>
   
      </div>
    )
  }

  // ── Selection form ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">{t('planner.title')}</h1>
        <p className="text-navy-mid mt-2">{t('planner.subtitle')}</p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        {/* Teacher info */}
        <div className="bg-white border border-navy-tint rounded-lg p-4 space-y-4">
          <p className="text-xs text-navy-mid/50 font-medium uppercase tracking-wide">{t('planner.teacherInfo')}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">{t('planner.teacherName')}</label>
              <input type="text" value={teacherName} onChange={e => setTeacherName(e.target.value)}
                placeholder={t('planner.teacherNamePlaceholder')}
                className="w-full bg-paper border border-navy-tint rounded-lg px-3 py-2 text-sm text-ink placeholder-ink/30 focus:outline-none focus:border-navy" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">{t('planner.school')}</label>
              <input type="text" value={school} onChange={e => setSchool(e.target.value)}
                placeholder={t('planner.schoolPlaceholder')}
                className="w-full bg-paper border border-navy-tint rounded-lg px-3 py-2 text-sm text-ink placeholder-ink/30 focus:outline-none focus:border-navy" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">{t('planner.weekStart')}</label>
            <input type="date" value={weekStartDate} onChange={e => setWeekStartDate(e.target.value)}
              className="bg-paper border border-navy-tint rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-navy" />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">{t('planner.subject')}</label>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map(s => (
              <button key={s.id} type="button" onClick={() => handleSubjectChange(s.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${subject === s.id ? 'bg-navy border-navy text-white' : 'bg-white border-navy-tint text-ink hover:border-navy-mid/40'}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grade */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">{t('planner.grade')}</label>
          <div className="flex flex-wrap gap-2">
            {ALL_GRADES.map(g => (
              <button key={g.value} type="button" onClick={() => handleGradeChange(g.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${grade === g.value ? 'bg-navy border-navy text-white' : 'bg-white border-navy-tint text-ink hover:border-navy-mid/40'}`}>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Unit */}
        {grade && (
          <div>
            <label className="block text-sm font-medium text-ink mb-2">{t('planner.unit')}</label>
            {gradeData ? (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {gradeData.units.map(u => (
                  <button key={u.id} type="button" onClick={() => { setUnitId(u.id); setWeek('') }}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${unitId === u.id ? 'bg-navy/10 border-navy text-ink' : 'bg-white border-navy-tint text-ink hover:border-navy-mid/40'}`}>
                    <p className="font-medium text-sm">{u.name}</p>
                    <p className="text-xs text-navy-mid/50 mt-0.5">{u.standards.slice(0,2).join(' · ')}</p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-navy-mid/50 text-sm">{t('planner.unitNotAvailable')}</p>
            )}
          </div>
        )}

        {/* Week */}
        {unitData && (
          <div>
            <label className="block text-sm font-medium text-ink mb-2">{t('planner.week')}</label>
            <div className="flex flex-wrap gap-2">
              {unitData.weeks.map(w => (
                <button key={w} type="button" onClick={() => setWeek(w)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors border ${week === w ? 'bg-navy border-navy text-white' : 'bg-white border-navy-tint text-ink hover:border-navy-mid/40'}`}>
                  {w}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            {t('planner.notes')} <span className="text-navy-mid/40 text-xs">({t('planner.optional')})</span>
          </label>
          <p className="text-xs text-navy-mid/50 mb-2">{t('planner.notesHint')}</p>
          <textarea value={teacherNotes} onChange={e => setTeacherNotes(e.target.value)}
            placeholder={t('planner.notesPlaceholder')} rows={4}
            className="w-full bg-white border border-navy-tint rounded-lg px-3 py-2 text-sm text-ink placeholder-ink/30 focus:outline-none focus:border-navy resize-none" />
        </div>

        {error && <p className="text-clay text-sm">{error}</p>}

        {/* Remaining badge for free users */}
        {userRole === 'free' && remaining !== null && (
          <p className="text-xs text-navy-mid text-center">
            Te quedan <span className="font-semibold text-ink">{remaining}</span> de 15 generaciones este mes.{' '}
            <button type="button" onClick={() => setShowUpgrade(true)} className="text-gold-deep underline font-semibold">Mejora a Premium</button>
          </p>
        )}

        <button type="submit" disabled={!gradeData || !unitData || week === ''}
          className="w-full py-4 bg-navy hover:bg-navy-mid disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-lg text-white transition-colors">
          {t('planner.generateBtn')}
        </button>
      </form>

      {/* Upgrade modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl space-y-4">
            <div className="text-center space-y-2">
              <p className="text-2xl">✨</p>
              <h2 className="font-display text-xl font-semibold text-ink">Alcanzaste tu límite mensual</h2>
              <p className="text-navy-mid text-sm">El plan Free incluye 15 planificaciones por mes. Con Premium generas sin límite.</p>
            </div>
            <ul className="space-y-2 text-sm text-ink">
              {['Generaciones ilimitadas','Exportar a Word y PowerPoint','Rúbricas y assessments','Historial completo'].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-teal font-bold">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={async () => {
                const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: 'monthly' }) })
                const { url } = await res.json()
                if (url) window.location.href = url
              }}
              className="w-full py-3 bg-navy hover:bg-navy-mid text-white font-semibold rounded-xl transition-colors"
            >
              Mensual — $7.99/mes
            </button>
            <button
              onClick={async () => {
                const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: 'annual' }) })
                const { url } = await res.json()
                if (url) window.location.href = url
              }}
              className="w-full py-3 bg-gold hover:bg-gold-deep text-ink font-semibold rounded-xl transition-colors"
            >
              Anual — $59.99/año <span className="text-xs font-normal">(ahorras $36)</span>
            </button>
            <button onClick={() => setShowUpgrade(false)} className="w-full text-navy-mid text-sm hover:text-ink">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
