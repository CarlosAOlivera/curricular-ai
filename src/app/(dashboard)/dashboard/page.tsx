'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

interface Stats { plans: number; rubrics: number; assessments: number }

export default function DashboardPage() {
  const { t } = useLanguage()
  const [stats, setStats] = useState<Stats>({ plans: 0, rubrics: 0, assessments: 0 })
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      Promise.all([
        supabase.from('profiles').select('full_name').eq('id', user.id).single(),
        supabase.from('lesson_plans').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('rubrics').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('assessments').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ]).then(([profile, plans, rubrics, assessments]) => {
        if (profile.data?.full_name) setName(profile.data.full_name.split(' ')[0])
        setStats({ plans: plans.count || 0, rubrics: rubrics.count || 0, assessments: assessments.count || 0 })
        setLoading(false)
      })
    })
  }, [])

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">
          {name ? `${t('dashboard.welcome')}, ${name}` : t('dashboard.welcome')}
        </h1>
        <p className="text-slate-400 mt-1">{t('dashboard.subtitle')}</p>
      </div>

      {/* Stats */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-4">{t('dashboard.stats')}</p>
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-32 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: 'dashboard.weeklyPlans', count: stats.plans,       href: '/history',    icon: '📋' },
              { key: 'dashboard.rubrics',     count: stats.rubrics,     href: '/rubrica',    icon: '📊' },
              { key: 'dashboard.assessments', count: stats.assessments, href: '/assessment', icon: '📝' },
            ].map(({ key, count, href, icon }) => (
              <Link key={href} href={href} className="block bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-6 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{icon}</span>
                  <span className="text-4xl font-bold text-white group-hover:text-blue-400 transition-colors">{count}</span>
                </div>
                <p className="text-slate-300 font-medium">{t(key)}</p>
                <p className="text-slate-600 text-xs mt-1 group-hover:text-slate-400 transition-colors">{t('dashboard.go')}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-4">{t('dashboard.quickActions')}</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { titleKey: 'dashboard.createPlan',     descKey: 'dashboard.createPlanDesc',     href: '/planner',    badge: undefined,    color: 'bg-blue-700/40 border-blue-600/40 hover:border-blue-500/60' },
            { titleKey: 'dashboard.createRubric',   descKey: 'dashboard.createRubricDesc',   href: '/rubrica',    badge: 'Premium',    color: 'bg-violet-700/30 border-violet-600/40 hover:border-violet-500/60' },
            { titleKey: 'dashboard.createAssessment', descKey: 'dashboard.createAssessmentDesc', href: '/assessment', badge: 'Premium', color: 'bg-violet-700/30 border-violet-600/40 hover:border-violet-500/60' },
            { titleKey: 'dashboard.createPlanilla', descKey: 'dashboard.createPlanillaDesc', href: '/planilla',   badge: 'Premium',    color: 'bg-amber-700/30 border-amber-600/40 hover:border-amber-500/60' },
          ].map(({ titleKey, descKey, href, badge, color }) => (
            <Link key={href} href={href} className={`block rounded-2xl p-6 border transition-all hover:scale-[1.02] ${color}`}>
              {badge && (
                <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white mb-3">{badge}</span>
              )}
              <h3 className="text-white font-semibold text-lg">{t(titleKey)}</h3>
              <p className="text-white/70 text-sm mt-1">{t(descKey)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
