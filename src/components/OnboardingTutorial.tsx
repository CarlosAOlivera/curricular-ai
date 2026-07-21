'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const STEPS = [
  {
    emoji: '👋',
    iconBg: 'bg-navy',
    title: '¡Bienvenido/a a LumIA!',
    desc: 'Tu plataforma de planificación curricular alineada al DEPR. En unos pasos te mostramos todo lo que puedes hacer.',
    cta: null,
  },
  {
    emoji: '📋',
    iconBg: 'bg-navy',
    title: 'Planificador Semanal',
    desc: 'Genera planes semanales completos en segundos. Selecciona el grado, unidad y semana — la IA hace el resto alineado al estándar del DEPR.',
    cta: { label: 'Ver Planificador', href: '/planner' },
  },
  {
    emoji: '📖',
    iconBg: 'bg-teal',
    title: 'DE Leer',
    desc: 'Crea guías de lectura mensuales con actividades de pre-lectura, durante y post-lectura alineadas al currículo.',
    cta: { label: 'Ver DE Leer', href: '/de-leer' },
  },
  {
    emoji: '✦',
    iconBg: 'bg-gold-tint border border-gold/40',
    emojiClass: 'text-gold-deep',
    title: 'Herramientas Premium',
    desc: 'Rúbricas de evaluación, Assessments y Planillas de Especificaciones. Activa tu trial gratis de 7 días — sin tarjeta de crédito.',
    cta: { label: 'Activar trial gratis', href: '/rubrica' },
  },
  {
    emoji: '📅',
    iconBg: 'bg-navy-mid',
    title: 'Calendario DEPR',
    desc: 'El calendario escolar oficial siempre al lado: feriados, períodos de evaluaciones, recesos y más. También puedes agregar tus propias tareas.',
    cta: null,
  },
]

const STORAGE_KEY = 'onboarding_v1_done'

export default function OnboardingTutorial() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch { /* ignore */ }
  }, [])

  function finish() {
    try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* ignore */ }
    setVisible(false)
  }

  function goTo(i: number) {
    if (animating) return
    setAnimating(true)
    setTimeout(() => { setStep(i); setAnimating(false) }, 150)
  }

  function next() {
    if (step < STEPS.length - 1) goTo(step + 1)
    else finish()
  }

  function prev() {
    if (step > 0) goTo(step - 1)
  }

  if (!visible) return null

  const s = STEPS[step]
  const isLast = step === STEPS.length - 1
  const isFirst = step === 0

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
      <div
        className="bg-paper rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        style={{ transition: 'opacity 150ms', opacity: animating ? 0 : 1 }}
      >
        {/* Progress bar */}
        <div className="h-1 bg-navy-tint">
          <div
            className="h-full bg-navy transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="p-6 space-y-5">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl ${s.iconBg} flex items-center justify-center text-2xl ${s.emojiClass ?? 'text-white'}`}>
            {s.emoji}
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h2 className="font-display text-xl font-semibold text-ink leading-snug">{s.title}</h2>
            <p className="text-navy-mid text-sm leading-relaxed">{s.desc}</p>
          </div>

          {/* Optional CTA link */}
          {s.cta && (
            <Link
              href={s.cta.href}
              onClick={finish}
              className="inline-block text-xs font-semibold text-navy hover:text-navy-mid underline underline-offset-2 transition-colors"
            >
              {s.cta.label} →
            </Link>
          )}

          {/* Step dots */}
          <div className="flex gap-1.5 justify-center">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-5 bg-navy' : 'w-1.5 bg-navy-tint hover:bg-navy-mid/40'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            {!isFirst ? (
              <button
                onClick={prev}
                className="px-4 py-2.5 text-sm text-navy-mid hover:text-ink border border-navy-tint hover:border-navy-mid/40 rounded-xl transition-colors"
              >
                ← Atrás
              </button>
            ) : (
              <button
                onClick={finish}
                className="px-4 py-2.5 text-sm text-navy-mid/60 hover:text-navy-mid transition-colors"
              >
                Saltar
              </button>
            )}
            <button
              onClick={next}
              className="flex-1 py-2.5 bg-navy hover:bg-navy-mid text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {isLast ? '¡Empezar! 🚀' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
