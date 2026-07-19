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

function parseList(val: string): string[] {
  if (!val) return []
  try { return JSON.parse(val) } catch { return val.split(',').map(s => s.trim()).filter(Boolean) }
}

function serializeList(arr: string[]): string {
  return JSON.stringify(arr)
}

function CheckGroup({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const safe = Array.isArray(selected) ? selected : []
  function toggle(opt: string) {
    onChange(safe.includes(opt) ? safe.filter(s => s !== opt) : [...safe, opt])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = safe.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              active
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

export default function ProfilePage() {
  const { t } = useLanguage()
  const [profile, setProfile] = useState<Profile>({ full_name: '', school: '', subject_preference: '', grade_preference: '', role: 'free', email: '' })
  const [subjects, setSubjects] = useState<string[]>([])
  const [grades, setGrades] = useState<string[]>([])
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
          if (data) {
            setProfile({ ...data, full_name: data.full_name || '', school: data.school || '', subject_preference: data.subject_preference || '', grade_preference: data.grade_preference || '' })
            setSubjects(parseList(data.subject_preference || ''))
            setGrades(parseList(data.grade_preference || ''))
          }
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
      subject_preference: serializeList(subjects),
      grade_preference: serializeList(grades),
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

      <form onSubmit={handleSave} className="space-y-6">
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

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">{t('profile.subject')}</label>
          <CheckGroup options={SUBJECTS} selected={subjects} onChange={setSubjects} />
          {subjects.length === 0 && <p className="text-slate-500 text-xs mt-1">{t('profile.selectSubject')}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">{t('profile.grade')}</label>
          <CheckGroup options={GRADES} selected={Array.isArray(grades) ? grades : []} onChange={setGrades} />
          {grades.length === 0 && <p className="text-slate-500 text-xs mt-1">{t('profile.selectGrade')}</p>}
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
