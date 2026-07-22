'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext'

const PlanillaView = dynamic(() => import('@/components/PlanillaView'), { ssr: false })

interface LessonPlan { id: string; grade: string; subject: string; unit: string; week: number; created_at: string }

interface PlanillaRow {
  standard: string; objective: string; bloomLevel: string; questionType: string
  numItems: number; points: number; percentage: number
}
interface PlanillaData {
  title: string; subject: string; grade: string; unitName: string
  totalItems: number; totalPoints: number; rows: PlanillaRow[]
}
interface ExamQuestion {
  number: number; standard: string; bloomLevel: string; question: string
  options?: string[]; answer: string; points: number
}
interface ExamSection { title: string; type: string; pointsPerQuestion: number; questions: ExamQuestion[] }
interface UnitExam { title: string; instructions: string; sections: ExamSection[] }

function isPremiumActive(t: string | null, role: string) {
  return role === 'premium' || (!!t && new Date(t) > new Date())
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      <p className="text-ink text-lg">Generando planilla y examen...</p>
      <p className="text-navy-mid text-sm">Esto puede tomar 2-3 minutos</p>
    </div>
  )
}

export default function PlanillaPage() {
  const [plans, setPlans] = useState<LessonPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [totalPoints, setTotalPoints] = useState(100)
  const [generating, setGenerating] = useState(false)
  const [planilla, setPlanilla] = useState<PlanillaData | null>(null)
  const [exam, setExam] = useState<UnitExam | null>(null)
  const [activeView, setActiveView] = useState<'planilla' | 'exam'>('planilla')
  const [showAnswers, setShowAnswers] = useState(false)
  const [error, setError] = useState('')
  const [userRole, setUserRole] = useState('free')
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null)
  const [activatingTrial, setActivatingTrial] = useState(false)
  const [step, setStep] = useState<'select' | 'options' | 'result'>('select')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      Promise.all([
        supabase.from('profiles').select('role, trial_ends_at').eq('id', user.id).single(),
        supabase.from('lesson_plans').select('id, grade, subject, unit, week, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(80),
      ]).then(([profileRes, plansRes]) => {
        if (profileRes.data) { setUserRole(profileRes.data.role); setTrialEndsAt(profileRes.data.trial_ends_at) }
        if (plansRes.data) setPlans(plansRes.data as LessonPlan[])
        setLoading(false)
      })
    })
  }, [])

  const { t } = useLanguage()
  const isPremium = isPremiumActive(trialEndsAt, userRole)

  async function handleActivateTrial() {
    setActivatingTrial(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    else { setError('Error al iniciar el checkout'); setActivatingTrial(false) }
  }

  function togglePlan(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  async function handleGenerate() {
    setGenerating(true); setError('')
    try {
      const res = await fetch('/api/generate-planilla', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planIds: [...selectedIds], totalPoints }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error generando la planilla'); setGenerating(false); return }
      setPlanilla(data.planilla)
      setExam(data.exam)
      setActiveView('planilla')
      setStep('result')
    } catch {
      setError('Error de conexion')
    }
    setGenerating(false)
  }

  const selectedPlans = plans.filter(p => selectedIds.has(p.id))

  // --- Premium gate ---
  if (!loading && !isPremium) {
    return (
      <div className="max-w-lg mx-auto pt-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gold-tint border border-gold/40 flex items-center justify-center mx-auto text-3xl">
          📋
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink">{t('planilla.title')}</h1>
        <p className="text-navy-mid">Crea examenes de unidad con tabla de especificaciones. Funcion Premium.</p>
        <div className="bg-white border border-gold/40 rounded-2xl p-6 space-y-4">
          {!trialEndsAt ? (
            <>
              <p className="text-ink font-semibold">Prueba Premium gratis por 7 dias</p>
              <p className="text-navy-mid text-sm">7 días gratis, luego $7.99/mes. Cancela cuando quieras.</p>
              <button
                onClick={handleActivateTrial}
                disabled={activatingTrial}
                className="w-full py-3 bg-navy hover:bg-navy-mid disabled:opacity-50 rounded-xl font-semibold text-white transition-colors"
              >
                {activatingTrial ? 'Activando...' : 'Activar trial gratis'}
              </button>
            </>
          ) : (
            <>
              <p className="text-ink font-semibold">Tu periodo de prueba ha terminado</p>
              <button
                className="w-full py-3 bg-navy hover:bg-navy-mid rounded-xl font-semibold text-white transition-colors"
                onClick={async () => {
                  const res = await fetch('/api/stripe/checkout', { method: 'POST' })
                  const { url } = await res.json()
                  if (url) window.location.href = url
                }}
              >
                Ver planes Premium
              </button>
            </>
          )}
        </div>
        {error && <p className="text-clay text-sm">{error}</p>}
      </div>
    )
  }

  if (generating) return <LoadingSpinner />

  // --- Result ---
  if (step === 'result' && planilla && exam) {
    return (
      <div className="space-y-6">
        <div className="no-print flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">{t('planilla.title')}</h1>
            <p className="text-navy-mid text-sm mt-1">
              {selectedPlans.length} {selectedPlans.length !== 1 ? t('common.selected_many') : t('common.selected_one')} &bull; {planilla.totalItems} {t('common.week').toLowerCase()} &bull; {planilla.totalPoints} {t('planilla.points')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setStep('select'); setPlanilla(null); setExam(null); setSelectedIds(new Set()) }}
              className="px-4 py-2 bg-navy-tint hover:bg-navy-mid/20 rounded-lg text-sm text-ink transition-colors"
            >
              Nueva planilla
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-gold hover:bg-gold-deep rounded-lg text-sm text-ink font-semibold transition-colors"
            >
              Imprimir
            </button>
          </div>
        </div>

        {/* View tabs */}
        <div className="no-print flex gap-2 items-center">
          <button
            onClick={() => setActiveView('planilla')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'planilla' ? 'bg-gold hover:bg-gold-deep text-ink' : 'bg-navy-tint text-ink hover:bg-navy-mid/20'
            }`}
          >
            📋 Planilla de especificaciones
          </button>
          <button
            onClick={() => setActiveView('exam')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'exam' ? 'bg-gold hover:bg-gold-deep text-ink' : 'bg-navy-tint text-ink hover:bg-navy-mid/20'
            }`}
          >
            📝 Examen de unidad
          </button>
          {activeView === 'exam' && (
            <label className="flex items-center gap-2 ml-4 text-sm text-navy-mid cursor-pointer">
              <input
                type="checkbox"
                checked={showAnswers}
                onChange={e => setShowAnswers(e.target.checked)}
                className="accent-gold-deep"
              />
              Mostrar respuestas
            </label>
          )}
        </div>

        <PlanillaView planilla={planilla} exam={exam} showAnswers={showAnswers} view={activeView} />
      </div>
    )
  }

  // --- Options step ---
  if (step === 'options') {
    return (
      <div className="space-y-8 max-w-2xl">
        <div>
          <button
            onClick={() => setStep('select')}
            className="text-navy-mid hover:text-ink text-sm mb-4 flex items-center gap-1 transition-colors"
          >
            ← Cambiar seleccion
          </button>
          <h1 className="font-display text-2xl font-semibold text-ink">Opciones del examen</h1>
        </div>

        {/* Selected weeks */}
        <div className="bg-white border border-navy-tint rounded-xl p-4 space-y-2">
          <p className="text-navy-mid/50 text-xs font-medium uppercase tracking-wide mb-3">
            Semanas seleccionadas ({selectedPlans.length})
          </p>
          {selectedPlans.map(p => (
            <div key={p.id} className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-gold-tint border border-gold/40 flex items-center justify-center text-gold-deep text-xs font-bold shrink-0">
                {p.week}
              </span>
              <span className="text-ink">{p.subject}</span>
              <span className="text-navy-mid">{p.unit}</span>
              <span className="text-navy-mid/50 ml-auto">{p.grade}</span>
            </div>
          ))}
        </div>

        {/* Total points */}
        <div className="space-y-3">
          <div>
            <p className="text-ink font-semibold">Puntuacion total del examen</p>
            <p className="text-navy-mid text-sm mt-0.5">El sistema distribuira los puntos automaticamente entre todos los reactivos.</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[50, 75, 100, 150].map(pts => (
              <button
                key={pts}
                onClick={() => setTotalPoints(pts)}
                className={`py-3 rounded-xl border text-center transition-all ${
                  totalPoints === pts
                    ? 'bg-gold-tint border-gold text-ink'
                    : 'bg-white border-navy-tint text-ink hover:border-navy-mid/40'
                }`}
              >
                <div className="text-xl font-bold">{pts}</div>
                <div className="text-xs mt-0.5 text-navy-mid">{t('planilla.points')}</div>
              </button>
            ))}
          </div>
        </div>

        {/* What will be generated */}
        <div className="bg-gold-tint border border-gold/30 rounded-xl p-4 space-y-2">
          <p className="text-ink text-sm font-medium">{t('planilla.willGenerate')}</p>
          <div className="space-y-1.5 text-sm text-navy-mid">
            <div className="flex items-center gap-2"><span className="text-gold-deep">✓</span> {t('planilla.item1')}</div>
            <div className="flex items-center gap-2"><span className="text-gold-deep">✓</span> {t('planilla.item2')}</div>
            <div className="flex items-center gap-2"><span className="text-gold-deep">✓</span> {t('planilla.item3')}</div>
          </div>
        </div>

        {error && <p className="text-clay text-sm">{error}</p>}

        <button
          onClick={handleGenerate}
          className="w-full py-3 bg-navy hover:bg-navy-mid rounded-xl font-semibold text-white transition-colors"
        >
          {t('planilla.generateBtn')}
        </button>
      </div>
    )
  }

  // --- Select step ---
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">{t('planilla.title')}</h1>
        <p className="text-navy-mid text-sm mt-1">
          {t('planilla.subtitle')}
        </p>
      </div>

      {loading ? (
        <div className="text-navy-mid text-sm">Cargando planes...</div>
      ) : plans.length === 0 ? (
        <div className="bg-white border border-navy-tint rounded-xl p-8 text-center">
          <p className="text-ink">No tienes planes generados aun.</p>
          <p className="text-navy-mid text-sm mt-2">Genera un plan semanal primero desde el Planificador.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {plans.map(plan => {
              const selected = selectedIds.has(plan.id)
              return (
                <button
                  key={plan.id}
                  onClick={() => togglePlan(plan.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border text-left transition-all ${
                    selected
                      ? 'bg-gold-tint border-gold text-ink'
                      : 'bg-white border-navy-tint text-ink hover:border-navy-mid/40'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    selected ? 'bg-gold border-gold' : 'border-navy-tint'
                  }`}>
                    {selected && (
                      <svg viewBox="0 0 10 8" className="w-3 h-3 text-ink fill-none stroke-current stroke-2">
                        <polyline points="1,4 4,7 9,1" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gold-deep">Semana {plan.week}</span>
                      <span className="text-navy-tint text-xs">&bull;</span>
                      <span className="text-xs text-navy-mid/50">{plan.grade}</span>
                    </div>
                    <p className="text-sm font-medium truncate mt-0.5">{plan.subject}</p>
                    <p className="text-xs text-navy-mid/50 truncate">{plan.unit}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-navy-mid text-sm">
              {selectedIds.size === 0
                ? t('common.noneSelected')
                : `${selectedIds.size} ${selectedIds.size !== 1 ? t('common.selected_many') : t('common.selected_one')} — ${selectedIds.size > 1 ? t('planilla.unitExamNote') : t('planilla.quizNote')}`}
            </p>
            <button
              onClick={() => setStep('options')}
              disabled={selectedIds.size === 0}
              className="px-6 py-2.5 bg-navy hover:bg-navy-mid disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white transition-colors"
            >
              {t('common.continue')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
