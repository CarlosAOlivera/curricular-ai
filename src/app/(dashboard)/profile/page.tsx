'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  MUNICIPIOS, MUNICIPIO_REGION, SCHOOL_LEVELS, YEARS_EXPERIENCE,
  ACADEMIC_PREPARATION, CERTIFICATIONS, SUBJECTS, GRADES,
} from '@/lib/profile-data'

function parseList(val: string): string[] {
  if (!val) return []
  try { return JSON.parse(val) } catch { return val.split(',').map(s => s.trim()).filter(Boolean) }
}

function ChipGroup({ options, selected, onChange, color = 'blue' }:
  { options: string[]; selected: string[]; onChange: (v: string[]) => void; color?: 'blue' | 'teal' }) {
  const safe = Array.isArray(selected) ? selected : []
  const active = color === 'blue'
    ? 'bg-blue-600 border-blue-500 text-white'
    : 'bg-teal-700 border-teal-500 text-white'
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} type="button"
          onClick={() => onChange(safe.includes(opt) ? safe.filter(s => s !== opt) : [...safe, opt])}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
            safe.includes(opt) ? active : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
          }`}>
          {opt}
        </button>
      ))}
    </div>
  )
}

function SingleSelect({ options, value, onChange }:
  { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
            value === opt
              ? 'bg-blue-600 border-blue-500 text-white'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
          }`}>
          {opt}
        </button>
      ))}
    </div>
  )
}

interface Profile {
  full_name: string
  school: string
  email: string
  role: string
  municipality: string
  region: string
  school_level: string
  years_experience: string
  academic_preparation: string
  subject_preference: string
  grade_preference: string
  certifications: string
}

export default function ProfilePage() {
  const { t } = useLanguage()
  const [profile, setProfile] = useState<Profile>({
    full_name: '', school: '', email: '', role: 'free',
    municipality: '', region: '', school_level: '',
    years_experience: '', academic_preparation: '',
    subject_preference: '', grade_preference: '', certifications: '',
  })
  const [subjects, setSubjects] = useState<string[]>([])
  const [grades, setGrades] = useState<string[]>([])
  const [certs, setCerts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles')
        .select('full_name, school, email, role, municipality, region, school_level, years_experience, academic_preparation, subject_preference, grade_preference, certifications')
        .eq('id', user.id).single()
        .then(({ data }) => {
          if (data) {
            setProfile(data as Profile)
            setSubjects(parseList(data.subject_preference || ''))
            setGrades(parseList(data.grade_preference || ''))
            setCerts(parseList(data.certifications || ''))
          }
          setLoading(false)
        })
    })
  }, [])

  function handleMunicipalityChange(m: string) {
    setProfile(p => ({ ...p, municipality: m, region: MUNICIPIO_REGION[m] ?? '' }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(''); setSaved(false)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('profiles').update({
      full_name: profile.full_name,
      school: profile.school,
      municipality: profile.municipality,
      region: profile.region,
      school_level: profile.school_level,
      years_experience: profile.years_experience,
      academic_preparation: profile.academic_preparation,
      subject_preference: JSON.stringify(subjects),
      grade_preference: JSON.stringify(grades),
      certifications: JSON.stringify(certs),
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

      {/* Plan badge */}
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

      <form onSubmit={handleSave} className="space-y-7">
        {/* ── Sección: Información personal ────────────────────────────── */}
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Información personal</h2>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t('profile.name')}</label>
            <input type="text" value={profile.full_name}
              onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
              placeholder={t('profile.namePlaceholder')}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{t('profile.school')}</label>
            <input type="text" value={profile.school}
              onChange={e => setProfile(p => ({ ...p, school: e.target.value }))}
              placeholder={t('profile.schoolPlaceholder')}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Municipio</label>
            <select value={profile.municipality} onChange={e => handleMunicipalityChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors">
              <option value="">Selecciona un municipio…</option>
              {MUNICIPIOS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            {profile.region && (
              <p className="text-slate-500 text-xs mt-1.5">
                Región educativa DEPR: <span className="text-blue-400 font-medium">{profile.region}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nivel escolar</label>
            <SingleSelect options={SCHOOL_LEVELS} value={profile.school_level}
              onChange={v => setProfile(p => ({ ...p, school_level: v }))} />
          </div>
        </div>

        {/* ── Sección: Experiencia y preparación ───────────────────────── */}
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Experiencia y preparación</h2>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Años de experiencia docente</label>
            <SingleSelect options={YEARS_EXPERIENCE} value={profile.years_experience}
              onChange={v => setProfile(p => ({ ...p, years_experience: v }))} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Preparación académica</label>
            <SingleSelect options={ACADEMIC_PREPARATION} value={profile.academic_preparation}
              onChange={v => setProfile(p => ({ ...p, academic_preparation: v }))} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Certificaciones <span className="text-slate-500 text-xs">(selecciona todas las que apliquen)</span>
            </label>
            <ChipGroup options={CERTIFICATIONS} selected={certs} onChange={setCerts} color="teal" />
          </div>
        </div>

        {/* ── Sección: Lo que enseñas ───────────────────────────────────── */}
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Lo que enseñas</h2>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t('profile.subject')}</label>
            <ChipGroup options={SUBJECTS} selected={subjects} onChange={setSubjects} />
            {subjects.length === 0 && <p className="text-slate-500 text-xs mt-1">{t('profile.selectSubject')}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t('profile.grade')}</label>
            <ChipGroup options={GRADES} selected={grades} onChange={setGrades} />
            {grades.length === 0 && <p className="text-slate-500 text-xs mt-1">{t('profile.selectGrade')}</p>}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {saved && <p className="text-green-400 text-sm">{t('profile.saved')}</p>}

        <button type="submit" disabled={saving}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-semibold transition-colors">
          {saving ? t('common.saving') : t('profile.saveBtn')}
        </button>
      </form>
    </div>
  )
}
