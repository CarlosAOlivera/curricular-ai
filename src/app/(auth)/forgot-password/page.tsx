'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const redirectTo = `${window.location.origin}/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) {
      setError('No se pudo enviar el correo. Verifica que el email sea correcto.')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Restablecer contraseña</h1>
          <p className="text-slate-400 mt-2">Te enviaremos un enlace a tu correo</p>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <div className="bg-green-900/30 border border-green-700 rounded-xl p-5">
              <p className="text-green-400 font-medium">¡Correo enviado!</p>
              <p className="text-slate-400 text-sm mt-1">
                Revisa tu bandeja de entrada y haz clic en el enlace para crear una nueva contraseña.
              </p>
            </div>
            <Link href="/login" className="block text-blue-400 text-sm hover:underline">
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Correo electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                placeholder="maestro@escuela.pr"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg font-semibold text-white transition-colors"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
            <p className="text-center text-slate-400 text-sm">
              <Link href="/login" className="text-blue-400 hover:underline">
                Volver al inicio de sesión
              </Link>
            </p>
          </form>
        )}
      </div>
    </main>
  )
}
