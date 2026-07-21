'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Credenciales incorrectas. Verifica tu correo y contrasena.')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <p className="text-xs font-semibold text-navy-mid uppercase tracking-widest mb-3">DEPR · Puerto Rico</p>
          <h1 className="font-display text-3xl font-semibold text-ink">Iniciar sesión</h1>
          <p className="text-navy-mid mt-2">Asistente Curricular PR</p>
        </div>
        <div className="bg-white border border-navy-tint rounded-2xl p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Correo electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-paper border border-navy-tint rounded-xl text-ink placeholder-ink/30 focus:outline-none focus:border-navy transition-colors"
                placeholder="maestro@escuela.pr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-paper border border-navy-tint rounded-xl text-ink placeholder-ink/30 focus:outline-none focus:border-navy transition-colors"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-clay text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-navy hover:bg-navy-mid disabled:opacity-50 rounded-xl font-semibold text-white transition-colors"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
        <div className="space-y-2 text-center">
          <p className="text-navy-mid text-sm">
            <Link href="/forgot-password" className="text-navy hover:text-navy-mid underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
          <p className="text-navy-mid text-sm">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-navy font-semibold hover:text-navy-mid">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
