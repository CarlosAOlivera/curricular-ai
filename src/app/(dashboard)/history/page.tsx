'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { WeeklyPlanData } from '@/types'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext'

const WeeklyPlanTable = dynamic(() => import('@/components/WeeklyPlanTable'), { ssr: false })

interface LessonPlan {
  id: string; grade: string; subject: string; unit: string
  week: number; content: string; created_at: string
}

function parsePlan(content: string): WeeklyPlanData | null {
  try { const p = JSON.parse(content); return p?.version === 2 ? p : null } catch { return null }
}

function PlanEntry({ plan, onDelete }: { plan: LessonPlan; onDelete: (id: string) => void }) {
  const { t, lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const parsed = parsePlan(plan.content)

  async function handleDelete() {
    if (!confirming) { setConfirming(true); return }
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('lesson_plans').delete().eq('id', plan.id)
    onDelete(plan.id)
  }

  return (
    <div className="bg-white border border-navy-tint rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-ink truncate">{plan.unit}</p>
          <p className="text-navy-mid text-sm mt-0.5">
            {plan.subject} · {plan.grade} · {t('common.week')} {plan.week}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-navy-mid/50 text-xs">
            {new Date(plan.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-PR', {
              year: 'numeric', month: 'short', day: 'numeric'
            })}
          </span>
          {confirming ? (
            <div className="flex items-center gap-1">
              <button onClick={handleDelete} disabled={deleting}
                className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs font-medium transition-colors disabled:opacity-50">
                {deleting ? '…' : '¿Borrar?'}
              </button>
              <button onClick={() => setConfirming(false)}
                className="px-2 py-1 bg-navy-tint hover:bg-navy-mid/20 text-ink rounded text-xs transition-colors">
                No
              </button>
            </div>
          ) : (
            <button onClick={handleDelete}
              className="p-1.5 text-navy-mid/40 hover:text-clay hover:bg-clay/10 rounded transition-colors"
              title="Borrar planificación">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            </button>
          )}
        </div>
      </div>
      <button
        onClick={() => setOpen(v => !v)}
        className="text-navy text-sm hover:underline text-left"
      >
        {open ? t('common.hide') : t('history.viewPlan')}
      </button>
      {open && (
        <div className="mt-3 pt-3 border-t border-navy-tint">
          {parsed ? (
            <div>
              <div className="mb-3 flex justify-end">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-green-700 hover:bg-green-600 rounded text-xs font-medium transition-colors"
                >
                  {t('history.printPlan')}
                </button>
              </div>
              <div className="bg-white rounded-xl overflow-hidden">
                <WeeklyPlanTable plan={parsed} />
              </div>
            </div>
          ) : (
            <div className="text-sm text-ink/70 whitespace-pre-wrap font-mono leading-relaxed">
              {plan.content}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function HistoryPage() {
  const { t } = useLanguage()
  const [plans, setPlans] = useState<LessonPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('lesson_plans').select('*').eq('user_id', user.id)
        .order('created_at', { ascending: false }).limit(20)
        .then(({ data }) => { setPlans((data as LessonPlan[]) || []); setLoading(false) })
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">{t('history.title')}</h1>
        <p className="text-navy-mid mt-1">{t('history.subtitle')}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 space-y-2">
          <p className="text-lg text-ink">{t('history.noHistory')}</p>
          <a href="/planner" className="text-navy hover:underline text-sm inline-block">
            {t('history.noHistoryHint')}
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map(plan => (
            <PlanEntry key={plan.id} plan={plan}
              onDelete={id => setPlans(prev => prev.filter(p => p.id !== id))} />
          ))}
        </div>
      )}
    </div>
  )
}
