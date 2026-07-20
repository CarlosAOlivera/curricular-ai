'use client'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function NavLinks() {
  const { t } = useLanguage()
  const links = [
    { href: '/dashboard',  key: 'nav.dashboard'  },
    { href: '/planner',    key: 'nav.planner'    },
    { href: '/rubrica',    key: 'nav.rubrica'    },
    { href: '/assessment', key: 'nav.assessment' },
    { href: '/planilla',   key: 'nav.planilla'   },
    { href: '/de-leer',    key: 'nav.deleer'     },
    { href: '/history',    key: 'nav.history'    },
    { href: '/profile',    key: 'nav.profile'    },
  ]
  return (
    <div className="flex gap-0.5">
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-medium"
        >
          {t(link.key)}
        </Link>
      ))}
    </div>
  )
}
