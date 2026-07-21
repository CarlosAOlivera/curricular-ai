import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CalendarPanel from '@/components/CalendarPanel'
import LanguageToggle from '@/components/LanguageToggle'
import NavLinks from '@/components/NavLinks'
import { LanguageProvider } from '@/contexts/LanguageContext'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Redirect to onboarding if profile is incomplete
  const { data: profile } = await supabase
    .from('profiles')
    .select('municipality')
    .eq('id', user.id)
    .single()
  if (!profile?.municipality) redirect('/onboarding')

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-paper text-ink flex flex-col">
        <nav className="bg-navy border-b border-navy-deep/50 px-4 py-2.5 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="font-display font-semibold text-sm text-gold shrink-0 mr-2 hidden sm:block tracking-wide">
              Asistente Curricular PR
            </Link>
            <NavLinks />
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <span className="text-white/30 text-xs hidden lg:block truncate max-w-[140px]">{user.email}</span>
            <form action={signOut}>
              <button type="submit" className="text-xs text-white/60 hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-white/10">
                Salir
              </button>
            </form>
          </div>
        </nav>
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto px-6 py-8 bg-paper">
            <div className="max-w-3xl mx-auto">
              {children}
            </div>
          </main>
          <aside className="w-72 shrink-0 overflow-y-auto hidden lg:flex flex-col sticky top-0 h-[calc(100vh-49px)]">
            <CalendarPanel />
          </aside>
        </div>
      </div>
    </LanguageProvider>
  )
}
