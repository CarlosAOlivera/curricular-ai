'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const intent = searchParams.get('intent') // 'premium' if coming from landing CTA
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [school, setSchool] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, school } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else if (intent === 'premium') {
      // Go straight to Stripe annual checkout
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'annual' }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
      else router.push('/onboarding')
    } else {
      router.push('/onboarding')
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <p className="text-xs font-semibold text-navy-mid uppercase tracking-widest mb-3">DEPR · Puerto Rico</p>
          <h1 className="font-display text-3xl font-semibold text-ink">Crear cuenta</h1>
          {intent === 'premium' ? (
            <p className="text-navy-mid mt-2">Crea tu cuenta y activa tu prueba de 7 días gratis.</p>
          ) : (
            <p className="text-navy-mid mt-2">Gratis — sin tarjeta de crédito</p>
          )}
        </div>
        <div className="bg-white border border-navy-tint rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Nombre completo</label>
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-paper border border-navy-tint rounded-xl text-ink placeholder-ink/30 focus:outline-none focus:border-navy transition-colors"
                placeholder="Nombre y Apellidos" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Correo electrónico</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-paper border border-navy-tint rounded-xl text-ink placeholder-ink/30 focus:outline-none focus:border-navy transition-colors"
                placeholder="correo@escuela.pr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Escuela</label>
              <input type="text" value={school} onChange={e => setSchool(e.target.value)}
                className="w-full px-4 py-2.5 bg-paper border border-navy-tint rounded-xl text-ink placeholder-ink/30 focus:outline-none focus:border-navy transition-colors"
                placeholder="Nombre de tu escuela" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Contraseña</label>
              <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-paper border border-navy-tint rounded-xl text-ink placeholder-ink/30 focus:outline-none focus:border-navy transition-colors"
                placeholder="Mínimo 8 caracteres" />
            </div>
            {error && <p className="text-clay text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-navy hover:bg-navy-mid disabled:opacity-50 rounded-xl font-semibold text-white transition-colors">
              {loading ? 'Creando cuenta...' : intent === 'premium' ? 'Crear cuenta y activar Premium' : 'Crear cuenta gratis'}
            </button>
          </form>
        </div>
        <p className="text-center text-navy-mid text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-navy font-semibold hover:text-navy-mid">Inicia sesión</Link>
        </p>
      </div>
    </main>
  )
}
