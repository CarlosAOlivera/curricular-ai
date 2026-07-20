'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  DE_LEER_MONTHS,
  DE_LEER_ACTIVITIES,
  DE_LEER_EVALUATIONS,
  getDeLeerMonth,
  type DeLeerMonth,
} from '@/lib/curriculum/de-leer'

const GRADES = ['K','1','2','3','4','5','6','7','8','9','10','11','12']

interface DeLeerPlan {
  titulo_lectura: string
  tipo_texto: string
  prelectura: string
  durante: string
  poslectura: string
  resumen: string
  vocabulario: string[]
  nivel_comprension: 'Literal' | 'Inferencial' | 'Crítico'
}

function getNextWednesday(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = day <= 3 ? 3 - day : 10 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().split('T')[0]
}

export default function DeLeerPage() {
  const [grade, setGrade] = useState('')
  const [group, setGroup] = useState('')
  const [date, setDate] = useState(getNextWednesday())
  const [teacherName, setTeacherName] = useState('')
  const [school, setSchool] = useState('')
  const [monthData, setMonthData] = useState<DeLeerMonth | null>(null)
  const [selectedTema, setSelectedTema] = useState('')
  const [activityType, setActivityType] = useState('')
  const [evaluationType, setEvaluationType] = useState('')
  const [step, setStep] = useState<'form' | 'generating' | 'result'>('form')
  const [plan, setPlan] = useState<DeLeerPlan | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('full_name, school').eq('id', user.id).single()
        .then(({ data }) => {
          if (data?.full_name) setTeacherName(data.full_name)
          if (data?.school) setSchool(data.school)
        })
    })
  }, [])

  useEffect(() => {
    if (!date) return
    const d = new Date(date + 'T12:00:00')
    const mo = getDeLeerMonth(d)
    setMonthData(mo || null)
    setSelectedTema('')
  }, [date])

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!grade || !date || !monthData) return
    setStep('generating')
    setError('')

    const gradeLevel = parseInt(grade) <= 5 || grade === 'K' ? '1-5' : '6-12'
    const prompt = `Eres un experto en el Proyecto DE Leer del DEPR de Puerto Rico.
Genera una planificación completa para una sesión de DE Leer con los siguientes datos:
- Grado: ${grade}
- Nivel: Grado ${gradeLevel}
- Fecha: ${date}
- Mes: ${monthData.name}
- Lema del mes: "${monthData.lema}"
- Tema seleccionado: "${selectedTema || monthData.temas[0]}"
- Tipo de actividad preferida: ${activityType ? DE_LEER_ACTIVITIES.find(a => a.id === activityType)?.label : 'cualquiera apropiada'}

Responde SOLO con un JSON con esta estructura exacta:
{
  "titulo_lectura": "Título de una lectura real, apropiada para el grado y tema",
  "tipo_texto": "Cuento/Poema/Artículo/Ensayo/Biografía/Leyenda/etc.",
  "prelectura": "Descripción detallada de la actividad ANTES de la lectura (2-3 oraciones)",
  "durante": "Descripción detallada de lo que hacen DURANTE la lectura (2-3 oraciones)",
  "poslectura": "Descripción detallada de la actividad DESPUÉS de la lectura / evaluación de comprensión (2-3 oraciones)",
  "resumen": "Breve descripción del argumento o contenido de la lectura recomendada (2-3 oraciones)",
  "vocabulario": ["palabra1", "palabra2", "palabra3", "palabra4", "palabra5"],
  "nivel_comprension": "Crítico"
}`

    try {
      const res = await fetch('/api/de-leer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPlan(JSON.parse(data.content))
      setStep('result')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
      setStep('form')
    }
  }

  const downloadPDF = useCallback(async () => {
    if (!plan) return
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })

    const margin = 20
    const pw = 215.9 - margin * 2
    let y = margin

    // Header
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('PROYECTO DE LEER — Anejo 1', 215.9 / 2, y, { align: 'center' })
    y += 7
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Departamento de Educación de Puerto Rico', 215.9 / 2, y, { align: 'center' })
    y += 10

    // Info box
    doc.setDrawColor(100)
    doc.rect(margin, y, pw, 30)
    doc.setFontSize(9)
    const col1 = margin + 3
    const col2 = margin + pw / 2 + 3
    doc.text(`Escuela: ${school || '___________________________'}`, col1, y + 7)
    doc.text(`Grado y Grupo: ${grade}${group ? `-${group}` : ''}`, col2, y + 7)
    doc.text(`Fecha: ${date}`, col1, y + 14)
    doc.text(`Maestro/a: ${teacherName || '___________________________'}`, col2, y + 14)
    doc.text(`Mes / Lema: ${monthData?.lema || ''}`, col1, y + 21)
    y += 35

    // Tema y lectura
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('TEMA:', margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(selectedTema || monthData?.temas[0] || '', margin + 20, y)
    y += 7
    doc.setFont('helvetica', 'bold')
    doc.text('LECTURA:', margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(`${plan.titulo_lectura} (${plan.tipo_texto})`, margin + 25, y)
    y += 7
    doc.text(`Vocabulario clave: ${plan.vocabulario.join(' · ')}`, margin, y)
    y += 10

    // Resumen
    doc.setFont('helvetica', 'bold')
    doc.text('Resumen del texto:', margin, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    const resLines = doc.splitTextToSize(plan.resumen, pw)
    doc.text(resLines, margin, y)
    y += resLines.length * 5 + 5

    // Stages
    const stages = [
      { label: 'PRELECTURA (Antes de la lectura)', text: plan.prelectura },
      { label: 'DURANTE LA LECTURA', text: plan.durante },
      { label: 'POSLECTURA (Después de la lectura / Evaluación)', text: plan.poslectura },
    ]

    for (const stage of stages) {
      doc.setFillColor(240, 240, 240)
      doc.rect(margin, y, pw, 7, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.text(stage.label, margin + 2, y + 5)
      y += 9
      doc.setFont('helvetica', 'normal')
      const lines = doc.splitTextToSize(stage.text, pw - 2)
      doc.text(lines, margin + 2, y)
      y += lines.length * 5 + 6
    }

    // Activity & evaluation
    if (activityType || evaluationType) {
      doc.setFont('helvetica', 'bold')
      doc.text('Actividad realizada:', margin, y)
      doc.setFont('helvetica', 'normal')
      doc.text(DE_LEER_ACTIVITIES.find(a => a.id === activityType)?.label || '_______________', margin + 42, y)
      y += 6
      doc.setFont('helvetica', 'bold')
      doc.text('Actividad de evaluación:', margin, y)
      doc.setFont('helvetica', 'normal')
      doc.text(DE_LEER_EVALUATIONS.find(a => a.id === evaluationType)?.label || '_______________', margin + 52, y)
      y += 6
    }

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text('NOTA: Incluya la lectura y la actividad de evaluación como anejo. — Generado por Asistente Curricular PR', 215.9 / 2, 275, { align: 'center' })

    doc.save(`anejo1-de-leer-${grade}-${date}.pdf`)
  }, [plan, grade, group, date, teacherName, school, monthData, selectedTema, activityType, evaluationType])

  function handleReset() { setStep('form'); setPlan(null); setError('') }

  if (step === 'generating') return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-300 text-lg">Generando planificación DE Leer...</p>
      <p className="text-slate-500 text-sm">Esto puede tomar unos segundos</p>
    </div>
  )

  if (step === 'result' && plan) return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Planificación DE Leer — Anejo 1</h1>
          <p className="text-slate-400 text-sm mt-1">Grado {grade} · {date} · {monthData?.name}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={downloadPDF} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-semibold transition-colors">
            Descargar Anejo 1
          </button>
          <button onClick={handleReset} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold transition-colors">
            Nueva planificación
          </button>
        </div>
      </div>

      {/* Lema */}
      <div className="bg-green-900/20 border border-green-800 rounded-xl p-4">
        <p className="text-green-400 text-xs uppercase tracking-wide font-medium mb-1">Lema del mes — {monthData?.name}</p>
        <p className="text-white italic">"{monthData?.lema}"</p>
      </div>

      {/* Lectura */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Lectura recomendada</p>
          <p className="text-white font-semibold text-lg mt-0.5">{plan.titulo_lectura}</p>
          <p className="text-slate-400 text-sm">{plan.tipo_texto} · Nivel de comprensión: {plan.nivel_comprension}</p>
        </div>
        <p className="text-slate-300 text-sm">{plan.resumen}</p>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Vocabulario clave</p>
          <div className="flex flex-wrap gap-2">
            {plan.vocabulario.map(v => (
              <span key={v} className="px-2 py-0.5 bg-slate-800 rounded text-sm text-slate-300">{v}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Stages */}
      {[
        { label: 'Prelectura', sublabel: 'Antes de la lectura', text: plan.prelectura, color: 'blue' },
        { label: 'Durante la lectura', sublabel: '', text: plan.durante, color: 'violet' },
        { label: 'Poslectura', sublabel: 'Evaluación de comprensión', text: plan.poslectura, color: 'amber' },
      ].map(s => (
        <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className={`text-xs uppercase tracking-wide font-medium mb-1 text-${s.color}-400`}>{s.label}{s.sublabel ? ` — ${s.sublabel}` : ''}</p>
          <p className="text-slate-200 leading-relaxed">{s.text}</p>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Proyecto DE Leer</h1>
        <p className="text-slate-400 mt-1">Genera la planificación del miércoles de lectura — Anejo 1</p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        {/* Teacher info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Maestro/a</label>
            <input type="text" value={teacherName} onChange={e => setTeacherName(e.target.value)}
              placeholder="Prof. Nombre Apellido"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Escuela</label>
            <input type="text" value={school} onChange={e => setSchool(e.target.value)}
              placeholder="Nombre de la escuela"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Grado</label>
            <select value={grade} onChange={e => setGrade(e.target.value)} required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors">
              <option value="">Selecciona</option>
              {GRADES.map(g => <option key={g} value={g}>Grado {g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Grupo / Sección</label>
            <input type="text" value={group} onChange={e => setGroup(e.target.value)}
              placeholder="Ej: A, B, 901..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Fecha (miércoles)</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors" />
          </div>
        </div>

        {/* Month theme auto-loaded */}
        {monthData && (
          <div className="bg-green-900/20 border border-green-800 rounded-xl p-4 space-y-3">
            <p className="text-green-400 text-xs uppercase tracking-wide font-medium">Mes de {monthData.name} — Tema del mes</p>
            <p className="text-white italic text-sm">"{monthData.lema}"</p>
            <div>
              <p className="text-slate-400 text-xs mb-2">Selecciona el tema de la sesión:</p>
              <div className="flex flex-wrap gap-2">
                {monthData.temas.map(t => (
                  <button key={t} type="button" onClick={() => setSelectedTema(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selectedTema === t
                        ? 'bg-green-600 border-green-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-green-600'
                    }`}>{t}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activity type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Tipo de actividad <span className="text-slate-600 text-xs">(opcional)</span></label>
            <select value={activityType} onChange={e => setActivityType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors">
              <option value="">Claude elige la más apropiada</option>
              {DE_LEER_ACTIVITIES.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Evaluación de comprensión <span className="text-slate-600 text-xs">(opcional)</span></label>
            <select value={evaluationType} onChange={e => setEvaluationType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors">
              <option value="">Claude elige la más apropiada</option>
              {DE_LEER_EVALUATIONS.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button type="submit" disabled={!grade || !date || !monthData}
          className="w-full py-4 bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-lg transition-colors">
          Generar Planificación DE Leer
        </button>
      </form>
    </div>
  )
}
