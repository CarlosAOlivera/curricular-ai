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
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          {name ? `${t('dashboard.welcome')}, ${name}` : t('dashboard.welcome')}
        </h1>
        <p className="text-navy-mid text-sm mt-0.5">{t('dashboard.subtitle')}</p>
      </div>

      {/* Stats — compact strip */}
      <div>
        <p className="text-[10px] text-navy-mid/50 uppercase tracking-widest font-semibold mb-2">{t('dashboard.stats')}</p>
        {loading ? (
          <div className="grid grid-cols-3 gap-3">
            {[1,2,3].map(i => <div key={i} className="bg-white border border-navy-tint rounded-xl p-3 h-20 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'dashboard.weeklyPlans', count: stats.plans,       href: '/history',    icon: '📋' },
              { key: 'dashboard.rubrics',     count: stats.rubrics,     href: '/rubrica',    icon: '📊' },
              { key: 'dashboard.assessments', count: stats.assessments, href: '/assessment', icon: '📝' },
            ].map(({ key, count, href, icon }) => (
              <Link key={href} href={href} className="block bg-white border border-navy-tint hover:border-navy-mid/40 hover:shadow-sm rounded-xl p-3 transition-all group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl">{icon}</span>
                  <span className="text-2xl font-bold text-navy group-hover:text-navy-mid transition-colors">{count}</span>
                </div>
                <p className="text-ink font-medium text-xs leading-snug">{t(key)}</p>
                <p className="text-navy-mid/40 text-[10px] mt-0.5 group-hover:text-navy-mid transition-colors">{t('dashboard.go')} →</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-[10px] text-navy-mid/50 uppercase tracking-widest font-semibold mb-2">{t('dashboard.quickActions')}</p>
        <div className="grid grid-cols-2 gap-3">
          {/* Planificador — hero card, spans full row on very small screens */}
          <Link href="/planner" className="col-span-2 sm:col-span-1 block rounded-xl p-4 bg-navy border border-navy hover:bg-navy-mid transition-all hover:scale-[1.01] hover:shadow-sm">
            <h3 className="font-display font-semibold text-base text-white">{t('dashboard.createPlan')}</h3>
            <p className="text-white/70 text-xs mt-1 leading-snug">{t('dashboard.createPlanDesc')}</p>
          </Link>

          {/* Premium cards */}
          {[
            { titleKey: 'dashboard.createRubric',     descKey: 'dashboard.createRubricDesc',     href: '/rubrica'    },
            { titleKey: 'dashboard.createAssessment', descKey: 'dashboard.createAssessmentDesc', href: '/assessment' },
            { titleKey: 'dashboard.createPlanilla',   descKey: 'dashboard.createPlanillaDesc',   href: '/planilla'   },
          ].map(({ titleKey, descKey, href }) => (
            <Link key={href} href={href} className="block rounded-xl p-4 bg-gold-tint border border-gold/30 hover:border-gold/60 transition-all hover:scale-[1.01] hover:shadow-sm">
              <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gold/20 text-gold-deep mb-2">✦ Premium</span>
              <h3 className="font-display font-semibold text-sm text-ink">{t(titleKey)}</h3>
              <p className="text-ink/60 text-xs mt-0.5 leading-snug">{t(descKey)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
