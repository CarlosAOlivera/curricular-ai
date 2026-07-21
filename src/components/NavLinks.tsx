'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

const links = [
  { href: '/dashboard',  key: 'nav.dashboard',  premium: false },
  { href: '/planner',    key: 'nav.planner',     premium: false },
  { href: '/de-leer',    key: 'nav.deleer',      premium: false },
  { href: '/rubrica',    key: 'nav.rubrica',     premium: true  },
  { href: '/assessment', key: 'nav.assessment',  premium: true  },
  { href: '/planilla',   key: 'nav.planilla',    premium: true  },
  { href: '/history',    key: 'nav.history',     premium: false },
  { href: '/profile',    key: 'nav.profile',     premium: false },
]

export default function NavLinks() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [open])

  function isActive(href: string) {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  }

  return (
    <>
      {/* ── Desktop: horizontal links ── */}
      <div className="hidden sm:flex gap-0.5">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-2.5 py-1.5 rounded-lg transition-colors text-xs font-medium ${
              isActive(link.href)
                ? 'bg-white/15 text-white'
                : link.premium
                ? 'text-gold hover:text-gold hover:bg-gold/10'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {link.premium && <span className="mr-0.5 opacity-70">✦</span>}
            {t(link.key)}
          </Link>
        ))}
      </div>

      {/* ── Mobile: hamburger ── */}
      <button
        className="sm:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        onClick={() => setOpen(v => !v)}
        aria-label="Menú"
      >
        {open ? (
          // X icon
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        ) : (
          // Hamburger icon
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* ── Mobile: dropdown menu ── */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 sm:hidden"
            onClick={() => setOpen(false)}
          />
          {/* Menu panel */}
          <div className="fixed left-0 right-0 top-[41px] z-50 bg-navy border-b border-navy-deep/60 shadow-lg sm:hidden">
            <div className="flex flex-col py-1">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-white/10 text-white'
                      : link.premium
                      ? 'text-gold hover:bg-gold/10'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.premium && <span className="text-gold/70 text-xs">✦</span>}
                  {t(link.key)}
                  {isActive(link.href) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
