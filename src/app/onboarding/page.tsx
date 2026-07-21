'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  MUNICIPIOS, MUNICIPIO_REGION, SCHOOL_LEVELS, YEARS_EXPERIENCE,
  ACADEMIC_PREPARATION, CERTIFICATIONS, SUBJECTS, GRADES,
} from '@/lib/profile-data'

function ChipGroup({ options, selected, onChange, color = 'blue' }:
  { options: string[]; selected: string[]; onChange: (v: string[]) => void; color?: 'blue' | 'teal' }) {
  const safe = Array.isArray(selected) ? selected : []
  const active = color === 'blue'
    ? 'bg-navy border-navy text-white'
    : 'bg-teal border-teal-deep text-white'
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} type="button"
          onClick={() => onChange(safe.includes(opt) ? safe.filter(s => s !== opt) : [...safe, opt])}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
            safe.includes(opt) ? active : 'bg-white border-navy-tint text-ink hover:border-navy-mid/40'
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
              ? 'bg-navy border-navy text-white'
              : 'bg-white border-navy-tint text-ink hover:border-navy-mid/40'
          }`}>
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Step 1 fields
  const [fullName,    setFullName]    = useState('')
  const [school,      setSchool]      = useState('')
  const [municipality, setMunicipality] = useState('')
  const [region,      setRegion]      = useState('')
  const [schoolLevel, setSchoolLevel] = useState('')

  // Step 2 fields
  const [yearsExp,    setYearsExp]    = useState('')
  const [academicPrep, setAcademicPrep] = useState('')
  const [subjects,    setSubjects]    = useState<string[]>([])
  const [grades,      setGrades]      = useState<string[]>([])
  const [certs,       setCerts]       = useState<string[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      const { data } = await supabase
        .from('profiles')
        .select('full_name, school, municipality, subject_preference, grade_preference')
        .eq('id', user.id)
        .single()
      if (data?.municipality) { router.push('/dashboard'); return }
      if (data?.full_name) setFullName(data.full_name)
      if (data?.school) setSchool(data.school)
      if (data?.subject_preference) {
        try { setSubjects(JSON.parse(data.subject_preference)) } catch { /* ignore */ }
      }
      if (data?.grade_preference) {
        try { setGrades(JSON.parse(data.grade_preference)) } catch { /* ignore */ }
      }
      setLoading(false)
    })
  }, [router])

  function handleMunicipalityChange(m: string) {
    setMunicipality(m)
    setRegion(MUNICIPIO_REGION[m] ?? '')
  }

  function step1Valid() {
    return fullName.trim() && school.trim() && municipality && schoolLevel
  }

  async function handleFinish() {
    setSaving(true); setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('profiles').update({
      full_name: fullName,
      school,
      municipality,
      region,
      school_level: schoolLevel,
      years_experience: yearsExp,
      academic_preparation: academicPrep,
      subject_preference: JSON.stringify(subjects),
      grade_preference: JSON.stringify(grades),
      certifications: JSON.stringify(certs),
    }).eq('id', user.id)
    if (error) { setError(error.message); setSaving(false); return }
    router.push('/dashboard')
  }

  if (loading) return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col items-center justify-start px-4 py-12">
      <div className="w-full max-w-xl space-y-8">

        {/* Header */}
        <div className="text-center">
          <p className="text-navy-mid font-semibold text-sm tracking-widest uppercase mb-2">
            LumIA
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink">Completa tu perfil</h1>
          <p className="text-navy-mid mt-2 text-sm">
            Esta información nos ayuda a personalizar la herramienta y a mejorar el servicio para los maestros de Puerto Rico.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          {[1, 2].map(s => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${
                s <= step ? 'bg-navy' : 'bg-navy-tint'
              }`} />
              <p className={`text-xs mt-1.5 font-medium ${s <= step ? 'text-navy' : 'text-ink/30'}`}>
                {s === 1 ? 'Tu escuela' : 'Tu experiencia'}
              </p>
            </div>
          ))}
        </div>

        {/* ── Step 1 ─────────────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Nombre completo</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Tu nombre y apellidos"
                className="w-full bg-white border border-navy-tint rounded-xl px-4 py-3 text-ink placeholder-ink/30 focus:outline-none focus:border-navy transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Nombre de la escuela</label>
              <input type="text" value={school} onChange={e => setSchool(e.target.value)}
                placeholder="Ej. Escuela Superior Fernando Suria Chaves"
                className="w-full bg-white border border-navy-tint rounded-xl px-4 py-3 text-ink placeholder-ink/30 focus:outline-none focus:border-navy transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Municipio</label>
              <select value={municipality} onChange={e => handleMunicipalityChange(e.target.value)}
                className="w-full bg-white border border-navy-tint rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-navy transition-colors">
                <option value="">Selecciona un municipio…</option>
                {MUNICIPIOS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              {region && (
                <p className="text-navy-mid/60 text-xs mt-1.5">
                  Región educativa DEPR: <span className="text-navy font-medium">{region}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">Nivel escolar</label>
              <SingleSelect options={SCHOOL_LEVELS} value={schoolLevel} onChange={setSchoolLevel} />
            </div>

            <button onClick={() => setStep(2)} disabled={!step1Valid()}
              className="w-full py-3.5 bg-navy hover:bg-navy-mid disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-colors">
              Continuar →
            </button>
          </div>
        )}

        {/* ── Step 2 ─────────────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-7">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Años de experiencia docente</label>
              <SingleSelect options={YEARS_EXPERIENCE} value={yearsExp} onChange={setYearsExp} />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">Preparación académica</label>
              <SingleSelect options={ACADEMIC_PREPARATION} value={academicPrep} onChange={setAcademicPrep} />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Materias que enseñas <span className="text-navy-mid/50 text-xs">(selecciona todas las que apliquen)</span>
              </label>
              <ChipGroup options={SUBJECTS} selected={subjects} onChange={setSubjects} />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Grados que enseñas <span className="text-navy-mid/50 text-xs">(selecciona todos los que apliquen)</span>
              </label>
              <ChipGroup options={GRADES} selected={grades} onChange={setGrades} />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Certificaciones <span className="text-slate-500 text-xs">(opcional)</span>
              </label>
              <ChipGroup options={CERTIFICATIONS} selected={certs} onChange={setCerts} color="teal" />
            </div>

            {error && <p className="text-clay text-sm">{error}</p>}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="px-5 py-3 bg-navy-tint hover:bg-navy-mid/20 text-ink rounded-xl font-medium transition-colors">
                ← Atrás
              </button>
              <button onClick={handleFinish} disabled={saving}
                className="flex-1 py-3 bg-navy hover:bg-navy-mid disabled:opacity-50 rounded-xl font-semibold text-white transition-colors">
                {saving ? 'Guardando…' : 'Completar y entrar al dashboard →'}
              </button>
            </div>

            <button onClick={() => router.push('/dashboard')}
              className="w-full text-ink/30 hover:text-navy-mid text-sm transition-colors">
              Saltar por ahora — completar más tarde desde Perfil
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
