'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'

const SUBJECTS = [
  'Inglés / English',
  'Español',
  'Matemáticas',
  'Ciencias',
  'Estudios Sociales',
  'Educación Física',
  'Arte',
  'Música',
  'Otro',
]

const GRADES = ['K','1','2','3','4','5','6','7','8','9','10','11','12']

interface Profile {
  full_name: string
  school: string
  subject_preference: string
  grade_preference: string
  role: string
  email: string
}

export default function ProfilePage() {
  const { t } = useLanguage()
  const [profile, setProfile] = useState<Profile>({ full_name: '', school: '', subject_preference: '', grade_preference: '', role: 'free', email: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('full_name, school, subject_preference, grade_preference, role, email').eq('id', user.id).single()
        .then(({ data }) => {
          if (data) setProfile({ ...data, full_name: data.full_name || '', school: data.school || '', subject_preference: data.subject_preference || '', grade_preference: data.grade_preference || '' })
          setLoading(false)
        })
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(''); setSaved(false)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('profiles').update({
      full_name: profile.full_name,
      school: profile.school,
      subject_preference: profile.subject_preference,
      grade_preference: profile.grade_preference,
    }).eq('id', user.id)
    if (error) setError(error.message)
    else setSaved(true)
    setSaving(false)
  }

  const roleLabel: Record<string, string> = { free: 'Free', premium: 'Premium ✦', institutional: 'Institucional' }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('profile.title')}</h1>
        <p className="text-slate-400 mt-1">{t('profile.subtitle')}</p>
      </div>

      {/* Role badge */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">{t('profile.plan')}</p>
          <p className="text-white font-semibold mt-0.5">{roleLabel[profile.role] || profile.role}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">{t('profile.email')}</p>
          <p className="text-slate-300 text-sm mt-0.5">{profile.email}</p>
        </div>
        {profile.role === 'free' && (
          <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold transition-colors">
            {t('common.upgradePremium')}
          </button>
        )}
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">{t('profile.name')}</label>
          <input
            type="text"
            value={profile.full_name}
            onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
            placeholder={t('profile.namePlaceholder')}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">{t('profile.school')}</label>
          <input
            type="text"
            value={profile.school}
            onChange={e => setProfile(p => ({ ...p, school: e.target.value }))}
            placeholder={t('profile.schoolPlaceholder')}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t('profile.subject')}</label>
            <select
              value={profile.subject_preference}
              onChange={e => setProfile(p => ({ ...p, subject_preference: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">{t('profile.selectSubject')}</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t('profile.grade')}</label>
            <select
              value={profile.grade_preference}
              onChange={e => setProfile(p => ({ ...p, grade_preference: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">{t('profile.selectGrade')}</option>
              {GRADES.map(g => <option key={g} value={g}>{t('common.grade')} {g}</option>)}
            </select>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {saved && <p className="text-green-400 text-sm">{t('profile.saved')}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-semibold transition-colors"
        >
          {saving ? t('common.saving') : t('profile.saveBtn')}
        </button>
      </form>
    </div>
  )
}
