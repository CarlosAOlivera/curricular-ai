'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { WeeklyPlanData } from '@/types'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext'

const RubricView = dynamic(() => import('@/components/RubricView'), { ssr: false })

// ── Types ──────────────────────────────────────────────────────────────
interface LessonPlan {
  id: string; grade: string; subject: string; unit: string; week: number; content: string; created_at: string
}
interface RubricData { title: string; criteria: { name: string; excellent: string; good: string; developing: string; beginning: string }[] }

type DayKey   = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'
type PhaseKey = 'initial' | 'developing' | 'closing'

const DAY_KEYS:   DayKey[]   = ['monday','tuesday','wednesday','thursday','friday']
const PHASE_KEYS: PhaseKey[] = ['initial','developing','closing']

function parsePlan(content: string): WeeklyPlanData | null {
  try { const p = JSON.parse(content); return p?.version === 2 ? p : null } catch { return null }
}

function isPremiumActive(trialEndsAt: string | null, role: string): boolean {
  if (role === 'premium') return true
  if (!trialEndsAt) return false
  return new Date(trialEndsAt) > new Date()
}

// ── Main ───────────────────────────────────────────────────────────────
export default function RubricaPage() {
  const { t } = useLanguage()
  const [plans, setPlans]           = useState<LessonPlan[]>([])
  const [loading, setLoading]       = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null)
  const [parsedPlan, setParsedPlan] = useState<WeeklyPlanData | null>(null)
  const [selectedDay, setSelectedDay]   = useState<DayKey | null>(null)
  const [selectedPhase, setSelectedPhase] = useState<PhaseKey | null>(null)
  const [generating, setGenerating] = useState(false)
  const [rubric, setRubric]         = useState<RubricData | null>(null)
  const [error, setError]           = useState('')
  const [userRole, setUserRole]     = useState('free')
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null)
  const [activatingTrial, setActivatingTrial] = useState(false)

  const DAY_LABELS: Record<DayKey, string>   = {
    monday: t('rubrica.dayMon'), tuesday: t('rubrica.dayTue'),
    wednesday: t('rubrica.dayWed'), thursday: t('rubrica.dayThu'), friday: t('rubrica.dayFri'),
  }
  const PHASE_LABELS: Record<PhaseKey, string> = {
    initial: t('rubrica.phaseInitial'), developing: t('rubrica.phaseDev'), closing: t('rubrica.phaseClose'),
  }

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      Promise.all([
        supabase.from('profiles').select('role, trial_ends_at').eq('id', user.id).single(),
        supabase.from('lesson_plans').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
      ]).then(([profile, plansResult]) => {
        if (profile.data) { setUserRole(profile.data.role); setTrialEndsAt(profile.data.trial_ends_at) }
        setPlans((plansResult.data as LessonPlan[]) || [])
        setLoading(false)
      })
    })
  }, [])

  function selectPlan(plan: LessonPlan) {
    setSelectedPlan(plan)
    setParsedPlan(parsePlan(plan.content))
    setSelectedDay(null)
    setSelectedPhase(null)
    setRubric(null)
    setError('')
  }

  async function handleActivateTrial() {
    setActivatingTrial(true)
    const res = await fetch('/api/activate-trial', { method: 'POST' })
    const data = await res.json()
    if (res.ok) setTrialEndsAt(data.trial_ends_at)
    else setError(data.error)
    setActivatingTrial(false)
  }

  async function handleGenerate() {
    if (!selectedPlan || !parsedPlan || !selectedDay || !selectedPhase) return
    setGenerating(true); setError('')
    const dayPlan  = parsedPlan.days[selectedDay]
    const objective = dayPlan?.objectives?.[0] || ''
    const activity  = dayPlan?.[selectedPhase]?.[0] || ''
    try {
      const res  = await fetch('/api/generate-rubric', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: selectedPlan.grade, subject: selectedPlan.subject, unitName: selectedPlan.unit,
          standards: parsedPlan.days[selectedDay]?.standards ? [parsedPlan.days[selectedDay].standards] : [],
          language: parsedPlan.language, weekCode: parsedPlan.weekCode,
          day: selectedDay, phase: selectedPhase, objective, activity,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRubric(data.rubric)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('rubrics').insert({
          user_id: user.id, lesson_plan_id: selectedPlan.id,
          grade: selectedPlan.grade, subject: selectedPlan.subject,
          unit: selectedPlan.unit, week: selectedPlan.week,
          day: selectedDay, phase: selectedPhase,
          title: data.rubric.title, content: data.rubric,
        })
      }
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Error generando rubrica') }
    setGenerating(false)
  }

  const premiumActive = isPremiumActive(trialEndsAt, userRole)
  const daysLeft = !trialEndsAt ? 0 : Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000))

  if (generating) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin" />
      <p className="text-ink text-lg">{t('rubrica.generating')}</p>
      <p className="text-navy-mid text-sm">{t('common.generating')}</p>
    </div>
  )

  // ── Result view ──────────────────────────────────────────────────────
  if (rubric) {
    return (
      <div className="space-y-6">
        <style>{`@media print { body * { visibility: hidden; } #rubric-print, #rubric-print * { visibility: visible; } #rubric-print { position: absolute; top: 0; left: 0; width: 100%; padding: 8px; } @page { margin: 1cm; size: landscape; } .no-print { display: none !important; } }`}</style>
        <div className="flex items-center justify-between no-print">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">{t('rubrica.generated')}</h2>
            <p className="text-navy-mid text-sm mt-1">{selectedPlan?.subject} · {selectedPlan?.unit} · {DAY_LABELS[selectedDay!]} · {PHASE_LABELS[selectedPhase!]}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => window.print()} className="px-4 py-2 bg-teal hover:bg-teal-deep text-white rounded-lg text-sm font-medium transition-colors">{t('rubrica.printPdf')}</button>
            <button onClick={() => { setRubric(null); setSelectedDay(null); setSelectedPhase(null) }} className="px-4 py-2 bg-navy-tint hover:bg-navy-mid/20 text-ink rounded-lg text-sm font-medium transition-colors">{t('rubrica.newRubric')}</button>
          </div>
        </div>
        <div className="bg-white rounded-xl overflow-hidden"><RubricView rubric={rubric} /></div>
      </div>
    )
  }

  // ── Selection flow ───────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">{t('rubrica.title')}</h1>
        <p className="text-navy-mid mt-1">{t('rubrica.subtitle')}</p>
      </div>

      {/* Premium banner */}
      {!premiumActive && !trialEndsAt && (
        <div className="bg-gold-tint border border-gold/40 rounded-xl p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-ink font-semibold text-sm">{t('rubrica.premiumFeatureTitle')}</p>
            <p className="text-navy-mid text-xs mt-0.5">{t('rubrica.premiumFeatureDesc')}</p>
          </div>
          <button onClick={handleActivateTrial} disabled={activatingTrial} className="shrink-0 px-4 py-2 bg-navy hover:bg-navy-mid disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors whitespace-nowrap">
            {activatingTrial ? t('common.activating') : t('common.activateTrial')}
          </button>
        </div>
      )}
      {premiumActive && daysLeft > 0 && userRole !== 'premium' && (
        <div className="bg-gold-tint border border-gold/30 rounded-xl p-3 flex items-center gap-3">
          <span className="text-gold-deep">✦</span>
          <p className="text-ink text-sm">
            <span className="text-gold-deep font-semibold">{t('rubrica.trialActive')}</span> — {daysLeft} {daysLeft === 1 ? t('rubrica.trialDays_one') : t('rubrica.trialDays_many')}.
          </p>
        </div>
      )}
      {!premiumActive && trialEndsAt && (
        <div className="bg-clay/10 border border-clay/30 rounded-xl p-3 flex items-center justify-between gap-3">
          <p className="text-clay text-sm">{t('rubrica.trialExpiredMsg')}</p>
          <button className="px-4 py-2 bg-navy hover:bg-navy-mid text-white rounded-lg text-sm font-semibold transition-colors">{t('rubrica.upgradePremium')}</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" /></div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-ink">{t('rubrica.noPlans')}</p>
          <a href="/planner" className="text-navy hover:underline text-sm mt-2 inline-block">{t('rubrica.createFirstPlan')}</a>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Step 1: Pick plan */}
          <div>
            <p className="text-sm font-semibold text-navy-mid/50 uppercase tracking-wide mb-3">{t('rubrica.pickPlan')}</p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {plans.map(plan => (
                <button key={plan.id} onClick={() => selectPlan(plan)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${selectedPlan?.id === plan.id ? 'bg-navy/10 border-navy text-ink' : 'bg-white border-navy-tint text-ink hover:border-navy-mid/40'}`}>
                  <p className="font-medium">{plan.unit}</p>
                  <p className="text-xs text-navy-mid/50 mt-0.5">{plan.subject} · {t('common.grade')} {plan.grade} · {t('common.week')} {plan.week} · {new Date(plan.created_at).toLocaleDateString('es-PR', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Pick day */}
          {selectedPlan && parsedPlan && (
            <div>
              <p className="text-sm font-semibold text-navy-mid/50 uppercase tracking-wide mb-3">{t('rubrica.pickDay')}</p>
              <div className="grid grid-cols-5 gap-2">
                {DAY_KEYS.map(d => {
                  const obj = parsedPlan.days[d]?.objectives?.[0]
                  return (
                    <button key={d} onClick={() => { setSelectedDay(d); setSelectedPhase(null) }}
                      className={`py-3 px-2 rounded-xl border text-sm font-medium text-center transition-all flex flex-col items-center gap-1 ${selectedDay === d ? 'bg-navy border-navy text-white' : 'bg-white border-navy-tint text-ink hover:border-navy'}`}>
                      <span>{DAY_LABELS[d]}</span>
                      {obj && <span className="text-xs opacity-60 leading-tight line-clamp-2 text-center normal-case font-normal hidden lg:block">{obj.slice(0, 50)}...</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Pick phase */}
          {selectedDay && parsedPlan && (
            <div>
              <p className="text-sm font-semibold text-navy-mid/50 uppercase tracking-wide mb-3">{t('rubrica.pickPhase')}</p>
              <div className="space-y-2">
                {PHASE_KEYS.map(phase => {
                  const activity = parsedPlan.days[selectedDay]?.[phase]?.[0] || ''
                  return (
                    <button key={phase} onClick={() => setSelectedPhase(phase)}
                      className={`w-full text-left px-4 py-4 rounded-xl border transition-all ${selectedPhase === phase ? 'bg-navy/10 border-navy' : 'bg-white border-navy-tint hover:border-navy/40'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-3 h-3 rounded-full border-2 shrink-0 ${selectedPhase === phase ? 'border-navy bg-navy' : 'border-navy-tint'}`} />
                        <div>
                          <p className={`text-sm font-semibold ${selectedPhase === phase ? 'text-navy' : 'text-ink'}`}>{PHASE_LABELS[phase]}</p>
                          {activity && <p className="text-xs text-navy-mid/50 mt-1 leading-relaxed">{activity}</p>}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Objective preview */}
          {selectedDay && selectedPhase && parsedPlan && (
            <div className="bg-white border border-navy-tint rounded-xl p-4 space-y-2">
              <p className="text-xs text-navy-mid/50 uppercase tracking-wide font-medium">{t('rubrica.objectivePreview')}</p>
              <p className="text-ink/80 text-sm">{parsedPlan.days[selectedDay]?.objectives?.[0] || '—'}</p>
            </div>
          )}

          {error && <p className="text-clay text-sm">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={!selectedPlan || !selectedDay || !selectedPhase || !premiumActive}
            className="w-full py-4 bg-navy hover:bg-navy-mid disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-lg text-white transition-colors"
          >
            {!premiumActive ? t('common.premiumRequired') : t('rubrica.generateBtn')}
          </button>
        </div>
      )}
    </div>
  )
}
