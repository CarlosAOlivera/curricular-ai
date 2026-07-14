'use client'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  return (
    <button
      onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-all text-xs font-semibold tracking-wide"
      title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      <span className={lang === 'es' ? 'text-white' : 'text-slate-500'}>ES</span>
      <span className="text-slate-700">/</span>
      <span className={lang === 'en' ? 'text-white' : 'text-slate-500'}>EN</span>
    </button>
  )
}
