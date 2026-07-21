'use client'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

const links = [
  { href: '/dashboard',  key: 'nav.dashboard',  premium: false },
  { href: '/planner',    key: 'nav.planner',    premium: false },
  { href: '/de-leer',    key: 'nav.deleer',     premium: false },
  { href: '/rubrica',    key: 'nav.rubrica',    premium: true  },
  { href: '/assessment', key: 'nav.assessment', premium: true  },
  { href: '/planilla',   key: 'nav.planilla',   premium: true  },
  { href: '/history',    key: 'nav.history',    premium: false },
  { href: '/profile',    key: 'nav.profile',    premium: false },
]

export default function NavLinks() {
  const { t } = useLanguage()
  return (
    <div className="flex gap-0.5">
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-2.5 py-1.5 rounded-lg transition-colors text-xs font-medium ${
            link.premium
              ? 'text-gold hover:text-gold hover:bg-gold/10'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          {link.premium && <span className="mr-0.5 opacity-70">✦</span>}
          {t(link.key)}
        </Link>
      ))}
    </div>
  )
}
