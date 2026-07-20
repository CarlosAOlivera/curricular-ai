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
import { DE_LEER_LOGO_B64 } from '@/lib/de-leer-logo-b64'

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
  const [ore, setOre] = useState('')
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

  // PDF completo con planificación pedagógica (para el maestro)
  const downloadPDF = useCallback(async () => {
    if (!plan) return
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })

    const W = 215.9
    const margin = 15
    const pw = W - margin * 2
    let y = 14

    // ── Header ──────────────────────────────────────────────
    // Logo DE Leer (top right)
    doc.addImage(DE_LEER_LOGO_B64, 'PNG', W - margin - 32, y - 4, 32, 17)

    // Título
    doc.setFontSize(15)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 100, 80)
    doc.text('Proyecto DE Leer', margin, y + 3)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    doc.text('Planificación Docente — Departamento de Educación de Puerto Rico', margin, y + 9)
    y += 22

    // ── Info grid ───────────────────────────────────────────
    doc.setFillColor(240, 248, 240)
    doc.rect(margin, y, pw, 28, 'F')
    doc.setDrawColor(180, 220, 180)
    doc.rect(margin, y, pw, 28)
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(8.5)
    const L = margin + 3
    const R = W / 2 + 3

    doc.setFont('helvetica', 'bold')
    doc.text('Escuela:', L, y + 7)
    doc.setFont('helvetica', 'normal')
    doc.text(school || '—', L + 17, y + 7)

    doc.setFont('helvetica', 'bold')
    doc.text('Grado:', R, y + 7)
    doc.setFont('helvetica', 'normal')
    doc.text(`${grade}${group ? ' — Grupo ' + group : ''}`, R + 14, y + 7)

    doc.setFont('helvetica', 'bold')
    doc.text('Maestro/a:', L, y + 14)
    doc.setFont('helvetica', 'normal')
    doc.text(teacherName || '—', L + 21, y + 14)

    doc.setFont('helvetica', 'bold')
    doc.text('Fecha:', R, y + 14)
    doc.setFont('helvetica', 'normal')
    doc.text(date, R + 14, y + 14)

    doc.setFont('helvetica', 'bold')
    doc.text('Mes:', L, y + 21)
    doc.setFont('helvetica', 'normal')
    doc.text(monthData?.name || '—', L + 10, y + 21)

    doc.setFont('helvetica', 'bold')
    doc.text('Lema:', R, y + 21)
    doc.setFont('helvetica', 'normal')
    const lemaShort = doc.splitTextToSize(monthData?.lema || '', pw / 2 - 16)[0] || ''
    doc.text(lemaShort, R + 13, y + 21)
    y += 34

    // ── Tema + Lectura ──────────────────────────────────────
    doc.setFillColor(60, 140, 140)
    doc.rect(margin, y, pw, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('Planificación de la sesión', margin + 3, y + 5.5)
    doc.setTextColor(0, 0, 0)
    y += 12

    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Tema:', margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(selectedTema || monthData?.temas[0] || '', margin + 14, y)
    y += 6

    doc.setFont('helvetica', 'bold')
    doc.text('Lectura:', margin, y)
    doc.setFont('helvetica', 'normal')
    const lecLines = doc.splitTextToSize(`${plan.titulo_lectura}  (${plan.tipo_texto})`, pw - 20)
    doc.text(lecLines, margin + 18, y)
    y += lecLines.length * 4.5 + 3

    doc.setFont('helvetica', 'bold')
    doc.text('Vocabulario:', margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(plan.vocabulario.join('  ·  '), margin + 25, y)
    y += 6

    doc.setFont('helvetica', 'bold')
    doc.text('Resumen:', margin, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    const resLines = doc.splitTextToSize(plan.resumen, pw)
    doc.text(resLines, margin, y)
    y += resLines.length * 4.2 + 6

    // ── Etapas ──────────────────────────────────────────────
    const stages = [
      { label: 'PRELECTURA', sub: 'Antes de la lectura', text: plan.prelectura,  fill: [220,235,255] as [number,number,number], head: [60,100,180] as [number,number,number] },
      { label: 'DURANTE',    sub: 'Durante la lectura',  text: plan.durante,      fill: [235,220,255] as [number,number,number], head: [100,60,180] as [number,number,number] },
      { label: 'POSLECTURA', sub: 'Evaluación de comprensión', text: plan.poslectura, fill: [255,240,210] as [number,number,number], head: [180,120,0] as [number,number,number] },
    ]

    for (const s of stages) {
      // Header bar
      doc.setFillColor(...s.head)
      doc.rect(margin, y, pw, 7, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.text(`${s.label}  —  ${s.sub}`, margin + 3, y + 5)
      y += 7

      // Content bg
      const textLines = doc.splitTextToSize(s.text, pw - 6)
      const boxH = textLines.length * 4.2 + 6
      doc.setFillColor(...s.fill)
      doc.rect(margin, y, pw, boxH, 'F')
      doc.setTextColor(30, 30, 30)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.text(textLines, margin + 3, y + 5)
      y += boxH + 4
    }

    // ── Actividad / Evaluación ──────────────────────────────
    if (activityType || evaluationType) {
      doc.setFontSize(8.5)
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'bold')
      doc.text('Actividad realizada:', margin, y)
      doc.setFont('helvetica', 'normal')
      doc.text(DE_LEER_ACTIVITIES.find(a => a.id === activityType)?.label || '—', margin + 38, y)
      y += 5
      doc.setFont('helvetica', 'bold')
      doc.text('Evaluación:', margin, y)
      doc.setFont('helvetica', 'normal')
      doc.text(DE_LEER_EVALUATIONS.find(a => a.id === evaluationType)?.label || '—', margin + 24, y)
      y += 8
    }

    // ── Footer ──────────────────────────────────────────────
    doc.setFontSize(7)
    doc.setTextColor(150)
    doc.setFont('helvetica', 'normal')
    doc.text('NOTA: Incluya la lectura y la actividad de evaluación como anejo.', margin, 270)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 120, 120)
    doc.text('#lectoresenacción', W / 2, 275, { align: 'center' })

    doc.save(`planificacion-de-leer-${grade}-${date}.pdf`)
  }, [plan, grade, group, date, teacherName, school, monthData, selectedTema, activityType, evaluationType])

  // Anejo 1 oficial DEPR (para entregar al director)
  // Usa la lista EXACTA del formulario oficial — no la lista expandida de DE_LEER_ACTIVITIES
  const downloadAnejoOficial = useCallback(async () => {
    if (!plan) return
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })

    const W = 215.9
    const margin = 15
    const pw = W - margin * 2
    let y = 14

    // Items exactos del formulario oficial DEPR
    const OFICIAL_ACTS = [
      { id: 'presentacion_digital', label: 'Presentación digital' },
      { id: 'cuento_poema',         label: 'Cuento o poema digitalizado o ilustrado' },
      { id: 'recetas',              label: 'Recetas' },
      { id: 'personalidades',       label: 'Invitación de personalidades para leer en el salón' },
      { id: 'dramatizacion',        label: 'Dramatización' },
      { id: 'narracion',            label: 'Narración' },
      { id: 'refranes',             label: 'Refrenes o trabalenguas' },
      { id: 'lectura_compartida',   label: 'Lectura compartida' },
      { id: 'lectura_guiada',       label: 'Lectura guiada o dirigida' },
      { id: 'lectura_voz_alta',     label: 'Lectura en voz alta' },
      { id: 'lectura_tutores',      label: 'Lectura con tutores' },
      { id: 'karaoke',              label: 'Karaoke' },
    ]
    const OFICIAL_EVALS = [
      { id: 'ficha_lectura',        label: 'Ficha de lectura' },
      { id: 'cadena',               label: 'Desarrollo de eslabón para cadena de lectura' },
      { id: 'discusion_socializada',label: 'Discusión socializada' },
      { id: 'respuesta_escrita',    label: 'Respuesta escrita inmediata' },
      { id: 'vocabulario',          label: 'Discusión de vocabulario en contexto' },
      { id: 'ejercicio_aplicacion', label: 'Ejercicio de aplicación' },
      { id: 'trabajo_creativo',     label: 'Trabajo creativo integrando las Bellas Artes' },
    ]

    // Si la actividad seleccionada no está en la lista oficial, marcar "Otra"
    const actInOficial = OFICIAL_ACTS.some(a => a.id === activityType)
    const evalInOficial = OFICIAL_EVALS.some(a => a.id === evaluationType)
    const otraActLabel = !actInOficial && activityType
      ? DE_LEER_ACTIVITIES.find(a => a.id === activityType)?.label || '' : ''
    const otraEvalLabel = !evalInOficial && evaluationType
      ? DE_LEER_EVALUATIONS.find(a => a.id === evaluationType)?.label || '' : ''

    // Helper checkbox section — modifica y del scope externo
    const drawSection = (title: string, items: {id:string;label:string}[], selectedId: string, actInList: boolean, otraLabel: string, hasEsquema?: boolean) => {
      doc.setFillColor(144, 200, 144)
      doc.rect(margin, y, pw, 7, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(0, 0, 0)
      doc.text(title, margin + 2, y + 5)
      y += 12

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)

      for (const item of items) {
        const checked = actInList && item.id === selectedId
        doc.setDrawColor(80)
        doc.rect(margin + 2, y - 3.2, 3.5, 3.5)
        if (checked) {
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(0, 100, 0)
          doc.text('X', margin + 2.8, y - 0.3)
          doc.setTextColor(0, 0, 0)
          doc.setFont('helvetica', 'normal')
        }
        doc.text(item.label, margin + 7, y)
        y += 5.5
      }

      // Esquema (solo evaluación)
      if (hasEsquema) {
        const checkedEsquema = selectedId === 'organizador_grafico'
        doc.rect(margin + 2, y - 3.2, 3.5, 3.5)
        if (checkedEsquema) {
          doc.setFont('helvetica', 'bold'); doc.setTextColor(0,100,0)
          doc.text('X', margin + 2.8, y - 0.3)
          doc.setTextColor(0,0,0); doc.setFont('helvetica', 'normal')
        }
        doc.text('Esquema u organizadores gráfico:', margin + 7, y)
        doc.line(margin + 65, y + 0.5, W - margin, y + 0.5)
        y += 5.5
      }

      // Otra
      const otraChecked = !actInList && !!otraLabel
      doc.rect(margin + 2, y - 3.2, 3.5, 3.5)
      if (otraChecked) {
        doc.setFont('helvetica', 'bold'); doc.setTextColor(0,100,0)
        doc.text('X', margin + 2.8, y - 0.3)
        doc.setTextColor(0,0,0); doc.setFont('helvetica', 'normal')
      }
      doc.text('Otra:', margin + 7, y)
      if (otraLabel) doc.text(otraLabel, margin + 22, y)
      doc.line(margin + 21, y + 0.5, W - margin, y + 0.5)
      y += 7
    }

    // ── Header ──────────────────────────────────────────────
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Anejo 1', W - margin, y, { align: 'right' })

    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')
    doc.text('DEPARTAMENTO DE', margin, y - 3)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 80, 160)
    doc.text('EDUCACIÓN', margin, y + 4)
    doc.setFontSize(5.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text('GOBIERNO DE PUERTO RICO', margin, y + 8)
    y += 16

    // ── Escuela / ORE ───────────────────────────────────────
    doc.setFontSize(9)
    const fS = W / 2, fE = W - margin
    doc.text('Escuela:', fS, y)
    if (school) doc.text(school, fS + 19, y)
    doc.line(fS + 18, y + 0.5, fE, y + 0.5)
    y += 7
    doc.text('ORE de:', fS, y)
    if (ore) doc.text(ore, fS + 17, y)
    doc.line(fS + 16, y + 0.5, fE, y + 0.5)
    y += 9

    // ── Banner ──────────────────────────────────────────────
    doc.setFillColor(60, 140, 140)
    doc.rect(margin, y, pw, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Planificación docente', W / 2, y + 5.8, { align: 'center' })
    doc.setTextColor(0, 0, 0)
    y += 12

    // ── Info grid ───────────────────────────────────────────
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'normal')
    const c1 = margin, c2 = W / 2, hPw = pw / 2 - 4

    doc.text('Fecha:', c1, y)
    doc.text(date, c1 + 14, y)
    doc.line(c1 + 13, y + 0.5, c1 + hPw, y + 0.5)
    doc.text('Grado y Grupo:', c2, y)
    doc.text(`${grade}${group ? `-${group}` : ''}`, c2 + 29, y)
    doc.line(c2 + 28, y + 0.5, W - margin, y + 0.5)
    y += 6

    doc.text('Maestro:', c1, y)
    const ts = doc.splitTextToSize(teacherName, hPw - 17)[0] || ''
    doc.text(ts, c1 + 17, y)
    doc.line(c1 + 16, y + 0.5, c1 + hPw, y + 0.5)
    doc.text('Maestro:', c2, y)
    doc.line(c2 + 16, y + 0.5, W - margin, y + 0.5)
    y += 6

    doc.text('Tema:', c1, y)
    const tema = doc.splitTextToSize(selectedTema || monthData?.temas[0] || '', hPw - 13)[0] || ''
    doc.text(tema, c1 + 13, y)
    doc.line(c1 + 12, y + 0.5, c1 + hPw, y + 0.5)
    doc.text('Lectura:', c2, y)
    const lec = doc.splitTextToSize(plan.titulo_lectura, hPw - 17)[0] || ''
    doc.text(lec, c2 + 17, y)
    doc.line(c2 + 16, y + 0.5, W - margin, y + 0.5)
    y += 10

    // ── Checklists ──────────────────────────────────────────
    drawSection('Actividad realizada:', OFICIAL_ACTS, activityType, actInOficial, otraActLabel)
    y += 2
    drawSection('Actividad de evaluación:', OFICIAL_EVALS, evaluationType, evalInOficial, otraEvalLabel, true)
    y += 3

    // ── NOTA ────────────────────────────────────────────────
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.text('NOTA.', margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(' Incluya la lectura y la actividad de evaluación como anejo.', margin + 9, y)
    y += 9

    // ── #lectoresenacción + logo ─────────────────────────────
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 120, 120)
    doc.text('#lectoresenacción', margin, y)
    doc.addImage(DE_LEER_LOGO_B64, 'PNG', W - margin - 26, y - 7, 26, 13)

    // Page number
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.setFont('helvetica', 'normal')
    doc.text('20', W - margin, 272, { align: 'right' })

    doc.save(`anejo1-oficial-${grade}-${date}.pdf`)
  }, [plan, grade, group, date, teacherName, school, ore, monthData, selectedTema, activityType, evaluationType])

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
          <button onClick={downloadAnejoOficial} className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg text-sm font-semibold transition-colors">
            Anejo 1 Oficial (director)
          </button>
          <button onClick={downloadPDF} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-semibold transition-colors">
            Planificación completa
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">ORE de <span className="text-slate-600 text-xs">(opcional)</span></label>
            <input type="text" value={ore} onChange={e => setOre(e.target.value)}
              placeholder="Nombre de la ORE"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 transition-colors" />
          </div>
          <div />
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
              <option value="">La IA elige la más apropiada</option>
              {DE_LEER_ACTIVITIES.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Evaluación de comprensión <span className="text-slate-600 text-xs">(opcional)</span></label>
            <select value={evaluationType} onChange={e => setEvaluationType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors">
              <option value="">La IA elige la más apropiada</option>
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