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

function PlanEntry({ plan }: { plan: LessonPlan }) {
  const { t, lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const parsed = parsePlan(plan.content)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-white truncate">{plan.unit}</p>
          <p className="text-slate-400 text-sm mt-0.5">
            {plan.subject} · {plan.grade} · {t('common.week')} {plan.week}
          </p>
        </div>
        <span className="text-slate-500 text-xs shrink-0">
          {new Date(plan.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-PR', {
            year: 'numeric', month: 'short', day: 'numeric'
          })}
        </span>
      </div>
      <button
        onClick={() => setOpen(v => !v)}
        className="text-blue-400 text-sm hover:underline text-left"
      >
        {open ? t('common.hide') : t('history.viewPlan')}
      </button>
      {open && (
        <div className="mt-3 pt-3 border-t border-slate-800">
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
            <div className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
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
        <h1 className="text-3xl font-bold">{t('history.title')}</h1>
        <p className="text-slate-400 mt-1">{t('history.subtitle')}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 text-slate-500 space-y-2">
          <p className="text-lg">{t('history.noHistory')}</p>
          <a href="/planner" className="text-blue-400 hover:underline text-sm inline-block">
            {t('history.noHistoryHint')}
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map(plan => <PlanEntry key={plan.id} plan={plan} />)}
        </div>
      )}
    </div>
  )
}
