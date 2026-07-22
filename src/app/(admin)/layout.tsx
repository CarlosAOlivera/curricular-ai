import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAILS } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-paper text-ink">
      <nav className="bg-navy border-b border-navy-deep/50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-display font-semibold text-sm">
            <span className="text-white">Lum</span><span className="text-gold">IA</span><span className="text-white/60"> Labs</span>
            <span className="ml-2 text-[10px] font-normal text-white/30 uppercase tracking-widest">Admin</span>
          </span>
          <div className="flex items-center gap-1">
            <Link href="/admin" className="text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
              Métricas
            </Link>
            <Link href="/admin/users" className="text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
              Usuarios
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/30 text-xs">{user.email}</span>
          <Link href="/dashboard" className="text-xs text-white/50 hover:text-white transition-colors">
            ← App
          </Link>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
