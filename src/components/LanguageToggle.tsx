'use client'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  return (
    <button
      onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/20 hover:border-white/40 text-white/60 hover:text-white transition-all text-xs font-semibold tracking-wide"
      title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      <span className={lang === 'es' ? 'text-white' : 'text-white/30'}>ES</span>
      <span className="text-white/20">/</span>
      <span className={lang === 'en' ? 'text-white' : 'text-white/30'}>EN</span>
    </button>
  )
}
