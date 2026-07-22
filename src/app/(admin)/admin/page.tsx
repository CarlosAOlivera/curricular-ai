import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminPage() {
  const admin = createAdminClient()

  const [
    { count: totalUsers },
    { count: freeUsers },
    { count: premiumUsers },
    { count: totalPlans },
    { count: totalRubrics },
    { count: totalAssessments },
    { data: recentUsers },
  ] = await Promise.all([
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'free'),
    admin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'premium'),
    admin.from('lesson_plans').select('*', { count: 'exact', head: true }),
    admin.from('rubrics').select('*', { count: 'exact', head: true }),
    admin.from('assessments').select('*', { count: 'exact', head: true }),
    admin.from('profiles').select('full_name, email, role, municipality, created_at').order('created_at', { ascending: false }).limit(10),
  ])

  const stats = [
    { label: 'Usuarios totales',    value: totalUsers ?? 0,      color: 'bg-navy',          text: 'text-white' },
    { label: 'Plan Free',           value: freeUsers ?? 0,       color: 'bg-navy-tint',     text: 'text-ink' },
    { label: 'Plan Premium',        value: premiumUsers ?? 0,    color: 'bg-gold-tint',     text: 'text-ink' },
    { label: 'Planes generados',    value: totalPlans ?? 0,      color: 'bg-white border border-navy-tint', text: 'text-ink' },
    { label: 'Rúbricas',            value: totalRubrics ?? 0,    color: 'bg-white border border-navy-tint', text: 'text-ink' },
    { label: 'Assessments',         value: totalAssessments ?? 0,color: 'bg-white border border-navy-tint', text: 'text-ink' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Métricas</h1>
        <p className="text-navy-mid text-sm mt-1">Vista general de LumIA Labs</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, color, text }) => (
          <div key={label} className={`rounded-2xl p-5 ${color}`}>
            <p className={`text-3xl font-display font-bold ${text}`}>{value}</p>
            <p className={`text-xs mt-1 ${text === 'text-white' ? 'text-white/60' : 'text-navy-mid'}`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Conversión */}
      <div className="bg-white border border-navy-tint rounded-2xl p-5">
        <h2 className="font-semibold text-ink mb-3 text-sm">Conversión free → premium</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-navy-tint rounded-full h-3 overflow-hidden">
            <div
              className="bg-gold h-3 rounded-full transition-all"
              style={{ width: `${totalUsers ? Math.round(((premiumUsers ?? 0) / totalUsers) * 100) : 0}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-ink">
            {totalUsers ? Math.round(((premiumUsers ?? 0) / totalUsers) * 100) : 0}%
          </span>
        </div>
        <p className="text-xs text-navy-mid mt-2">{premiumUsers} de {totalUsers} usuarios en Premium</p>
      </div>

      {/* Usuarios recientes */}
      <div className="bg-white border border-navy-tint rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-navy-tint">
          <h2 className="font-semibold text-ink text-sm">Registros recientes</h2>
        </div>
        <div className="divide-y divide-navy-tint">
          {recentUsers?.map((u) => (
            <div key={u.email} className="px-5 py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink">{u.full_name ?? '—'}</p>
                <p className="text-xs text-navy-mid">{u.email} · {u.municipality ?? '—'}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  u.role === 'premium' ? 'bg-gold-tint text-gold-deep border border-gold/30' : 'bg-navy-tint text-navy-mid'
                }`}>
                  {u.role}
                </span>
                <span className="text-xs text-navy-mid/50">
                  {new Date(u.created_at).toLocaleDateString('es-PR', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
