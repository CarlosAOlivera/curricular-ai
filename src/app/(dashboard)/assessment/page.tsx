'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext'

const AssessmentView = dynamic(() => import('@/components/AssessmentView'), { ssr: false })

interface LessonPlan { id: string; grade: string; subject: string; unit: string; week: number; created_at: string }
interface Question { number: number; type: string; question: string; options?: string[]; answer: string }
interface AssessmentData { title: string; instructions: string; questions: Question[] }

function isPremiumActive(t: string | null, role: string) {
  return role === 'premium' || (!!t && new Date(t) > new Date())
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-300 text-lg">Generando assessment...</p>
      <p className="text-slate-500 text-sm">Esto puede tomar 1-2 minutos</p>
    </div>
  )
}

export default function AssessmentPage() {
  const [plans, setPlans] = useState<LessonPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [versions, setVersions] = useState(1)
  const [showAnswers, setShowAnswers] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [assessments, setAssessments] = useState<AssessmentData[]>([])
  const [activeVersion, setActiveVersion] = useState(0)
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
    const res = await fetch('/api/activate-trial', { method: 'POST' })
    const data = await res.json()
    if (res.ok) { setTrialEndsAt(data.trial_ends_at); setUserRole(data.role || userRole) }
    else setError(data.error || 'Error activando trial')
    setActivatingTrial(false)
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
      const res = await fetch('/api/generate-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planIds: [...selectedIds], versions }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error generando el assessment'); setGenerating(false); return }
      setAssessments(data.assessments)
      setActiveVersion(0)
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
        <div className="w-16 h-16 rounded-2xl bg-violet-900/40 border border-violet-700/40 flex items-center justify-center mx-auto text-3xl">
          📝
        </div>
        <h1 className="text-2xl font-bold text-white">{t('assessment.title')}</h1>
        <p className="text-slate-400">Crea pruebas cortas cubiertas por semana. Funcion Premium.</p>
        <div className="bg-slate-900 border border-violet-700/40 rounded-2xl p-6 space-y-4">
          {!trialEndsAt ? (
            <>
              <p className="text-white font-semibold">Prueba Premium gratis por 7 dias</p>
              <p className="text-slate-400 text-sm">Sin tarjeta de credito. Accede a Assessment, Rubrica y Planilla de Especificaciones.</p>
              <button
                onClick={handleActivateTrial}
                disabled={activatingTrial}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl font-semibold text-white transition-colors"
              >
                {activatingTrial ? 'Activando...' : 'Activar trial gratis'}
              </button>
            </>
          ) : (
            <>
              <p className="text-white font-semibold">Tu periodo de prueba ha terminado</p>
              <p className="text-slate-400 text-sm">Suscribete a Premium para seguir usando esta funcion.</p>
              <button className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-white transition-colors">
                Ver planes Premium
              </button>
            </>
          )}
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    )
  }

  // --- Generating spinner ---
  if (generating) return <LoadingSpinner />

  // --- Step: result ---
  if (step === 'result' && assessments.length > 0) {
    return (
      <div className="space-y-6">
        <div className="no-print flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Assessment generado</h1>
            <p className="text-slate-400 text-sm mt-1">
              {selectedPlans.length} {selectedPlans.length !== 1 ? t('common.selected_many') : t('common.selected_one')} &bull; {assessments.length} {assessments.length !== 1 ? t('assessment.versions') : t('assessment.version')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setStep('select'); setAssessments([]); setSelectedIds(new Set()) }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
            >
              Nuevo assessment
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm text-white font-semibold transition-colors"
            >
              Imprimir
            </button>
          </div>
        </div>

        {assessments.length > 1 && (
          <div className="no-print flex gap-2">
            {assessments.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveVersion(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeVersion === i
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Version {i + 1}
              </button>
            ))}
            <label className="flex items-center gap-2 ml-4 text-sm text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={showAnswers}
                onChange={e => setShowAnswers(e.target.checked)}
                className="accent-violet-500"
              />
              Mostrar respuestas
            </label>
          </div>
        )}

        {assessments.length === 1 && (
          <div className="no-print">
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={showAnswers}
                onChange={e => setShowAnswers(e.target.checked)}
                className="accent-violet-500"
              />
              Mostrar clave de respuestas
            </label>
          </div>
        )}

        <AssessmentView assessment={assessments[activeVersion]} showAnswers={showAnswers} />
      </div>
    )
  }

  // --- Step: options ---
  if (step === 'options') {
    return (
      <div className="space-y-8 max-w-2xl">
        <div>
          <button
            onClick={() => setStep('select')}
            className="text-slate-400 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors"
          >
            ← Cambiar seleccion
          </button>
          <h1 className="text-2xl font-bold text-white">Opciones del assessment</h1>
        </div>

        {/* Selected weeks summary */}
        <div className="bg-slate-900 rounded-xl p-4 space-y-2">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-3">
            Semanas seleccionadas ({selectedPlans.length})
          </p>
          {selectedPlans.map(p => (
            <div key={p.id} className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-violet-900/60 border border-violet-700/40 flex items-center justify-center text-violet-400 text-xs font-bold shrink-0">
                {p.week}
              </span>
              <span className="text-white">{p.subject}</span>
              <span className="text-slate-500">{p.unit}</span>
              <span className="text-slate-600 ml-auto">{p.grade}</span>
            </div>
          ))}
        </div>

        {/* Versions selector */}
        <div className="space-y-3">
          <div>
            <p className="text-white font-semibold">Numero de versiones</p>
            <p className="text-slate-500 text-sm mt-0.5">
              Genera versiones diferentes del mismo assessment para prevenir copia entre estudiantes.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(v => (
              <button
                key={v}
                onClick={() => setVersions(v)}
                className={`py-4 rounded-xl border text-center transition-all ${
                  versions === v
                    ? 'bg-violet-900/40 border-violet-500 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <div className="text-2xl font-bold">{v}</div>
                <div className="text-xs mt-1">{v === 1 ? t('assessment.version') : t('assessment.versions')}</div>
              </button>
            ))}
          </div>
          {versions > 1 && (
            <p className="text-slate-500 text-xs">
              {t('assessment.versionsNote').replace('{n}', String(versions))}
            </p>
          )}
        </div>

        {/* Show answers */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={showAnswers}
            onChange={e => setShowAnswers(e.target.checked)}
            className="w-4 h-4 accent-violet-500"
          />
          <div>
            <p className="text-white text-sm group-hover:text-violet-300 transition-colors">Incluir clave de respuestas</p>
            <p className="text-slate-500 text-xs">Para uso del maestro. No se muestra al imprimir la version del estudiante.</p>
          </div>
        </label>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleGenerate}
          className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-white transition-colors"
        >
          {t('assessment.generateBtn')}{versions > 1 ? ` (${versions} ${t('assessment.versions')})` : ''}
        </button>
      </div>
    )
  }

  // --- Step: select ---
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">{t('assessment.title')}</h1>
        <p className="text-slate-400 text-sm mt-1">
          {t('assessment.subtitle')}
        </p>
      </div>

      {loading ? (
        <div className="text-slate-500 text-sm">Cargando planes...</div>
      ) : plans.length === 0 ? (
        <div className="bg-slate-900 rounded-xl p-8 text-center">
          <p className="text-slate-400">No tienes planes generados aun.</p>
          <p className="text-slate-500 text-sm mt-2">Genera un plan semanal primero desde el Planificador.</p>
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
                      ? 'bg-violet-900/30 border-violet-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    selected ? 'bg-violet-600 border-violet-600' : 'border-slate-600'
                  }`}>
                    {selected && (
                      <svg viewBox="0 0 10 8" className="w-3 h-3 text-white fill-none stroke-current stroke-2">
                        <polyline points="1,4 4,7 9,1" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-violet-400">Semana {plan.week}</span>
                      <span className="text-slate-600 text-xs">&bull;</span>
                      <span className="text-xs text-slate-500">{plan.grade}</span>
                    </div>
                    <p className="text-sm font-medium truncate mt-0.5">{plan.subject}</p>
                    <p className="text-xs text-slate-500 truncate">{plan.unit}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-slate-500 text-sm">
              {selectedIds.size === 0
                ? t('common.noneSelected')
                : `${selectedIds.size} ${selectedIds.size !== 1 ? t('common.selected_many') : t('common.selected_one')}`}
            </p>
            <button
              onClick={() => setStep('options')}
              disabled={selectedIds.size === 0}
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white transition-colors"
            >
              {t('common.continue')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
