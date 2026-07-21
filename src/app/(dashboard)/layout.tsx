import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CalendarPanel from '@/components/CalendarPanel'
import LanguageToggle from '@/components/LanguageToggle'
import NavLinks from '@/components/NavLinks'
import OnboardingTutorial from '@/components/OnboardingTutorial'
import RestartTutorialButton from '@/components/RestartTutorialButton'
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
      <OnboardingTutorial />
      <div className="min-h-screen bg-paper text-ink flex flex-col">
        {/* ── Nav — fixed so it stays on scroll ── */}
        <nav className="fixed top-0 inset-x-0 bg-navy border-b border-navy-deep/50 px-4 py-2.5 flex items-center justify-between z-30">
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

        {/* Spacer to offset fixed nav (~41px) */}
        <div className="h-[41px] shrink-0" />

        {/* On mobile: flex-col (content → calendar below). On lg+: flex-row side-by-side. */}
        <div className="flex flex-1 flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
          <main className="px-4 py-5 sm:px-6 sm:py-8 bg-paper lg:flex-1 lg:overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              {children}
            </div>
            {/* ── Footer ── */}
            <footer className="mt-12 pt-6 border-t border-navy-tint text-center space-y-1.5">
              <p className="text-xs text-navy-mid/40">
                © 2026–2027 Built by{' '}
                <span className="font-semibold text-gold">LevelUp Labs</span>
              </p>
              <RestartTutorialButton />
            </footer>
          </main>
          {/* Mobile: fixed-height panel below content. Desktop: sticky sidebar. */}
          <aside className="shrink-0 h-80 border-t border-navy-tint lg:border-t-0 lg:w-72 lg:h-[calc(100vh-41px)] lg:overflow-y-auto lg:sticky lg:top-[41px] lg:flex lg:flex-col">
            <CalendarPanel />
          </aside>
        </div>
      </div>
    </LanguageProvider>
  )
}
