'use client'
import { useState } from 'react'
import Link from 'next/link'

// ── FAQ accordion ─────────────────────────────────────────────
const FAQS = [
  {
    q: '¿Funciona para todas las materias y grados?',
    a: 'Por ahora está disponible para Inglés grados 9–12. Estamos añadiendo más materias y grados próximamente. Regístrate gratis y te avisamos cuando llegue la tuya.',
  },
  {
    q: '¿Está realmente alineado al currículo del DEPR?',
    a: 'Sí. Usamos los estándares, expectativas e indicadores oficiales del Departamento de Educación de Puerto Rico para cada grado y materia. Sin plantillas genéricas.',
  },
  {
    q: '¿Puedo editar el plan después de generarlo?',
    a: 'Claro. Descárgalo en Word y edítalo como quieras, o imprímelo directo en PDF. El plan es tuyo.',
  },
  {
    q: '¿Mis datos y planificaciones son privados?',
    a: 'Sí. Tus planificaciones son completamente privadas. Solo tú puedes verlas. No las compartimos con nadie.',
  },
  {
    q: '¿Qué pasa si no me gusta el resultado?',
    a: 'El plan gratis es para siempre, sin tarjeta. Si pruebas Premium y no te convence, cancelas en cualquier momento sin cargos adicionales.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-navy-tint last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left py-4 flex items-center justify-between gap-4 group"
      >
        <span className="font-medium text-ink group-hover:text-navy transition-colors">{q}</span>
        <span className={`shrink-0 w-5 h-5 rounded-full border border-navy-tint flex items-center justify-center text-navy-mid transition-transform ${open ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      {open && <p className="pb-4 text-navy-mid text-sm leading-relaxed">{a}</p>}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-navy-deep/50 px-4 py-2.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-display font-semibold text-sm tracking-wide">
            <span className="text-white">Lum</span><span className="text-gold">IA</span><span className="text-white/60"> Labs</span>
          </span>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/register" className="text-xs font-semibold px-3 py-1.5 bg-gold hover:bg-gold-deep text-ink rounded-lg transition-colors">
              Empieza gratis →
            </Link>
          </div>
        </div>
      </nav>
      <div className="h-[41px]" />

      {/* ── HERO ── */}
      <section className="relative px-4 pt-20 pb-24 text-center overflow-hidden">
        {/* Subtle background grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#1C2854 1px, transparent 1px)', backgroundSize: '24px 24px'}} />

        <div className="relative max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-tint border border-gold/30 text-gold-deep text-xs font-semibold">
            ✦ LumIA Labs — Diseñado para maestros de Puerto Rico
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-tight">
            Deja de regalarle tus{' '}
            <span className="text-navy">domingos</span>{' '}
            al DEPR.
          </h1>

          <p className="text-navy-mid text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Tu planificación semanal completa, rúbricas y assessments,
            alineados al currículo oficial, listos en{' '}
            <strong className="text-ink">60 segundos</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/register"
              className="px-7 py-3.5 bg-navy hover:bg-navy-mid text-white font-semibold rounded-xl transition-all hover:shadow-lg text-sm"
            >
              Empieza gratis, sin tarjeta
            </Link>
            <a
              href="#como-funciona"
              className="px-7 py-3.5 bg-white border border-navy-tint hover:border-navy-mid/40 text-ink font-semibold rounded-xl transition-all text-sm"
            >
              Ver cómo funciona ↓
            </a>
          </div>

          {/* Trust bar */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-xs text-navy-mid/60">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" />Alineado al DEPR</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" />Listo para imprimir</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" />Plan gratis para siempre</span>
          </div>
        </div>
      </section>

      {/* ── PAIN ── */}
      <section className="px-4 py-20 bg-navy-tint/40">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-semibold text-ink text-center mb-3">
            ¿Te suena familiar?
          </h2>
          <p className="text-navy-mid text-center mb-10 text-sm">Escuchamos a maestros de PR. Esto es lo que nos dijeron.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { quote: '"El viernes llego agotado... y todavía tengo que planificar el fin de semana."', icon: '😓' },
              { quote: '"Busco plantillas en Facebook y termino pagando $15 por algo que ni es mío."', icon: '💸' },
              { quote: '"Paso horas buscando los estándares correctos para alinear mi unidad."', icon: '🔍' },
              { quote: '"El domingo se convierte en mi segundo día de trabajo."', icon: '📆' },
            ].map(({ quote, icon }) => (
              <div key={icon} className="bg-white border border-navy-tint rounded-2xl p-5 flex gap-4">
                <span className="text-2xl shrink-0">{icon}</span>
                <p className="text-ink text-sm leading-relaxed italic">{quote}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 font-display text-xl font-semibold text-ink">
            No debería ser así.
          </p>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="px-4 py-20 bg-navy text-white text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest">La solución</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-snug">
            El primer asistente de IA diseñado para maestros de Puerto Rico.
          </h2>
          <p className="text-white/70 leading-relaxed">
            No es una herramienta genérica en inglés. Es un asistente que conoce el currículo del DEPR, los estándares por grado y materia, y el calendario escolar. Genera tu planificación en el tiempo que tardas en tomarte el café.
          </p>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section id="como-funciona" className="px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-gold-deep text-xs font-semibold uppercase tracking-widest mb-3">Proceso</p>
          <h2 className="font-display text-3xl font-semibold text-ink text-center mb-12">
            Tres pasos. Sesenta segundos.
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { n: '1', title: 'Selecciona', desc: 'Elige tu grado, materia y la semana del año escolar. Sin formularios complicados.' },
              { n: '2', title: 'Genera', desc: 'La IA crea tu plan completo: objetivos, actividades por día, estándares y tema transversal.' },
              { n: '3', title: 'Descarga y enseña', desc: 'Exporta en PDF o Word. Imprime. Llega el lunes completamente listo.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-navy text-white font-display text-xl font-bold flex items-center justify-center mx-auto">
                  {n}
                </div>
                <h3 className="font-display font-semibold text-ink text-lg">{title}</h3>
                <p className="text-navy-mid text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-sm text-navy-mid/60 italic">
            Sin esperar 48 horas. Sin mandar emails. Sin pagar por cada plan.
          </p>
        </div>
      </section>

      {/* ── FUNCIONES ── */}
      <section className="px-4 py-20 bg-navy-tint/40">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-gold-deep text-xs font-semibold uppercase tracking-widest mb-3">Funciones</p>
          <h2 className="font-display text-3xl font-semibold text-ink text-center mb-10">
            Todo lo que necesitas. En un solo lugar.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '📋', title: 'Planificación semanal', desc: 'Planes completos alineados al estándar DEPR con objetivos y actividades por día.', free: true },
              { icon: '📅', title: 'Calendario DEPR', desc: 'Feriados, períodos de evaluaciones, recesos y fechas clave siempre visibles.', free: true },
              { icon: '🗂️', title: 'Historial de planes', desc: 'Todos tus planes guardados. Búscalos, imprímelos o edítalos cuando los necesites.', free: true },
              { icon: '📊', title: 'Rúbricas de evaluación', desc: 'Rúbricas detalladas por día y fase de la lección. Listas para usar.', free: false },
              { icon: '📝', title: 'Assessments', desc: 'Pruebas cortas generadas automáticamente para cada semana o unidad.', free: false },
              { icon: '📌', title: 'Planilla de Especificaciones', desc: 'Tabla completa de especificaciones + examen de unidad alineado.', free: false },
            ].map(({ icon, title, desc, free }) => (
              <div key={title} className="bg-white border border-navy-tint rounded-2xl p-5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl">{icon}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${free ? 'bg-teal/10 text-teal-deep' : 'bg-gold-tint text-gold-deep border border-gold/30'}`}>
                    {free ? 'Gratis' : '✦ Premium'}
                  </span>
                </div>
                <h3 className="font-semibold text-ink text-sm">{title}</h3>
                <p className="text-navy-mid text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIOS ── */}
      <section className="px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-gold-deep text-xs font-semibold uppercase tracking-widest mb-3">Precios</p>
          <h2 className="font-display text-3xl font-semibold text-ink text-center mb-3">
            Invierte menos de lo que pagas por un solo plan en Facebook.
          </h2>
          <p className="text-navy-mid text-center text-sm mb-10">Sin contratos. Cancela cuando quieras.</p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="bg-white border border-navy-tint rounded-2xl p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold text-navy-mid uppercase tracking-wide mb-1">Gratis</p>
                <p className="font-display text-3xl font-bold text-ink">$0</p>
                <p className="text-navy-mid/60 text-xs mt-1">Para siempre</p>
              </div>
              <ul className="space-y-2.5">
                {['Planificaciones semanales ilimitadas', 'Exportación en PDF', 'Historial de planes', 'Calendario DEPR'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-ink">
                    <span className="w-4 h-4 rounded-full bg-teal/10 text-teal flex items-center justify-center text-[10px] shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block w-full py-3 text-center border border-navy text-navy font-semibold rounded-xl hover:bg-navy-tint transition-colors text-sm">
                Empieza gratis
              </Link>
            </div>

            {/* Premium */}
            <div className="bg-navy rounded-2xl p-6 space-y-5 relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-gold text-ink text-[10px] font-bold px-2 py-0.5 rounded-full">
                MÁS POPULAR
              </div>
              <div>
                <p className="text-xs font-semibold text-gold uppercase tracking-wide mb-1">Premium</p>
                <p className="font-display text-3xl font-bold text-white">$4.99<span className="text-base font-normal text-white/50">/mes</span></p>
                <p className="text-white/40 text-xs mt-1">Plan anual · $7.99/mes mensual · 7 días gratis</p>
              </div>
              <ul className="space-y-2.5">
                {['Todo lo del plan gratis', 'Rúbricas de evaluación', 'Assessments por semana', 'Planilla de Especificaciones', 'Exportación a Word'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/80">
                    <span className="w-4 h-4 rounded-full bg-gold/20 text-gold flex items-center justify-center text-[10px] shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register?intent=premium" className="block w-full py-3 text-center bg-gold hover:bg-gold-deep text-ink font-semibold rounded-xl transition-colors text-sm">
                Prueba Premium gratis →
              </Link>
            </div>
          </div>

          <p className="text-center mt-6 text-xs text-navy-mid/50">
            Por menos de un café a la semana, recuperas tus fines de semana.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 py-20 bg-navy-tint/40">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-semibold text-ink text-center mb-10">
            Preguntas frecuentes
          </h2>
          <div className="bg-white border border-navy-tint rounded-2xl px-6 divide-y divide-navy-tint">
            {FAQS.map(faq => <FAQItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-4 py-24 text-center bg-navy">
        <div className="max-w-xl mx-auto space-y-5">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white leading-snug">
            Tu primer plan, listo en 60 segundos.
          </h2>
          <p className="text-white/60">
            Únete a los maestros de PR que ya dejaron de planificar los domingos.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-gold hover:bg-gold-deep text-ink font-semibold rounded-xl transition-all hover:shadow-lg text-sm"
          >
            Empieza gratis ahora →
          </Link>
          <p className="text-white/30 text-xs">Sin tarjeta de crédito. Sin compromisos. Para siempre.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-navy-deep px-4 py-8 text-center space-y-2">
        <p className="font-display text-sm font-semibold">
          <span className="text-white">Lum</span><span className="text-gold">IA</span><span className="text-white/60"> Labs</span>
        </p>
        <p className="text-white/40 text-xs italic">La inteligencia que ilumina tu enseñanza.</p>
        <p className="text-white/30 text-xs">© 2026–2027 Built by <span className="text-gold/70 font-semibold">LevelUp Labs</span></p>
        <div className="flex justify-center gap-4 text-xs text-white/20 pt-1">
          <a href="/login" className="hover:text-white/50 transition-colors">Iniciar sesión</a>
          <a href="/register" className="hover:text-white/50 transition-colors">Registrarse</a>
        </div>
      </footer>

    </div>
  )
}
