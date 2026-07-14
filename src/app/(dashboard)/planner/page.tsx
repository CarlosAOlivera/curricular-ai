'use client'
import { useState, useEffect, useRef } from 'react'
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
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-300 text-lg">{t('planner.generating')}</p>
      <p className="text-slate-500 text-sm">{t('planner.generatingMsg')}</p>
      <p className="text-slate-600 text-xs italic max-w-xs text-center" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s' }}>
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
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('full_name, school').eq('id', user.id).single()
        .then(({ data }) => {
          if (data?.full_name) setTeacherName(data.full_name)
          if (data?.school) setSchool(data.school)
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
      if (!res.ok) throw new Error(data.error)
      const parsed: WeeklyPlanData = JSON.parse(data.content)
      setPlan(parsed)
      setPlanId(data.planId || null)
      setStep('result')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado'); setStep('select')
    }
  }

  function handleReset() { setStep('select'); setPlan(null); setPlanId(null); setGrade(''); setUnitId(''); setWeek(''); setTeacherNotes('') }

  if (step === 'generating') return <GeneratingScreen messages={TEACHER_MSGS} />

  if (step === 'result' && plan) {
    return (
      <div className="space-y-6">
        <style>{`@media print { body * { visibility: hidden; } #weekly-plan, #weekly-plan * { visibility: visible; } #weekly-plan { position: absolute; top: 0; left: 0; width: 100%; padding: 8px; } @page { margin: 1cm; size: landscape; } .no-print { display: none !important; } }`}</style>

        <div className="flex items-center justify-between no-print">
          <div>
            <h2 className="text-2xl font-bold">Planificacion generada</h2>
            <p className="text-slate-400 text-sm mt-1">{gradeData?.label} · {getSubjectLabel(subject)} · {unitData?.name} · {t('planner.week')} {week}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => window.print()} className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg text-sm font-medium transition-colors">
              Imprimir / PDF
            </button>
            <button onClick={handleReset} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
              {t('planner.newPlan')}
            </button>
          </div>
        </div>

        {/* Premium callout */}
        <div className="no-print bg-violet-900/20 border border-violet-700/30 rounded-xl p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-violet-300 font-medium text-sm">{t('planner.premiumFeatures')}</p>
            <p className="text-slate-500 text-xs mt-0.5">Funciones Premium — selecciona el dia y la fase de la clase</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/rubrica"    className="px-3 py-2 bg-violet-700 hover:bg-violet-600 rounded-lg text-xs font-semibold transition-colors">{t('nav.rubrica')}</Link>
            <Link href="/assessment" className="px-3 py-2 bg-violet-700 hover:bg-violet-600 rounded-lg text-xs font-semibold transition-colors">{t('nav.assessment')}</Link>
          </div>
        </div>

        <div ref={printRef} className="bg-white rounded-xl overflow-hidden">
          <WeeklyPlanTable plan={plan} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('planner.title')}</h1>
        <p className="text-slate-400 mt-2">{t('planner.subtitle')}</p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{t('planner.teacherInfo')}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('planner.teacherName')}</label>
              <input type="text" value={teacherName} onChange={e => setTeacherName(e.target.value)} placeholder="Prof. Juan Garcia" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('planner.school')}</label>
              <input type="text" value={school} onChange={e => setSchool(e.target.value)} placeholder={t('planner.schoolPlaceholder')} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('planner.weekStart')}</label>
              <input type="date" value={weekStartDate} onChange={e => setWeekStartDate(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('planner.grade')}</label>
              <select value={grade} onChange={e => handleGradeChange(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm">
                <option value="">{t('planner.selectGrade')}...</option>
                {ALL_GRADES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t('planner.subject')}</label>
            <select value={subject} onChange={e => handleSubjectChange(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm">
              {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {grade && !gradeData && (
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-400 text-sm">
            {t('planner.unitNotAvailable')}
          </div>
        )}

        {gradeData && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t('planner.unit')}</label>
            <div className="grid grid-cols-2 gap-3">
              {gradeData.units.map(u => (
                <button key={u.id} type="button" onClick={() => { setUnitId(u.id); setWeek('') }}
                  className={`py-3 px-4 rounded-lg border text-sm text-left transition-colors ${unitId === u.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500'}`}>
                  {u.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {unitData && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t('planner.week')}</label>
            <div className="flex flex-wrap gap-2">
              {unitData.weeks.map(w => (
                <button key={w} type="button" onClick={() => setWeek(w)}
                  className={`w-12 h-12 rounded-lg border text-sm font-medium transition-colors ${week === w ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500'}`}>
                  {w}
                </button>
              ))}
            </div>
          </div>
        )}

        {unitData && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Estandares de esta unidad</p>
            <div className="flex flex-wrap gap-2">
              {unitData.standards.map(s => <span key={s} className="px-2 py-1 bg-slate-800 rounded text-xs text-blue-300 font-mono">{s}</span>)}
            </div>
          </div>
        )}

        {week !== '' && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t('planner.notes')} <span className="text-slate-500 font-normal">{t('planner.optional')}</span></label>
            <textarea value={teacherNotes} onChange={e => setTeacherNotes(e.target.value)} rows={3}
              placeholder="Ej: grupo avanzado, enfoque en escritura, proyecto especial esta semana..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none" />
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button type="submit" disabled={!grade || !unitId || week === ''}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-lg transition-colors">
          {t('planner.generateBtn')}
        </button>
 
      </form>
    </div>
  )
}
