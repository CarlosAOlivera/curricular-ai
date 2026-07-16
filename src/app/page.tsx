import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">
          Asistente Curricular
          <span className="text-blue-400"> PR</span>
        </h1>
        <p className="text-xl text-slate-400">
          Genera planificaciones alineadas al currículo del DEPR en segundos.
          Para maestros de escuelas publicas de Puerto Rico.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/register"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors"
          >
            Comenzar gratis
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
        <p className="text-sm text-slate-500 pt-4">
          Materias Básicas disponibles ahora · Más materias próximamente
        </p>
      </div>
    </main>
  )
}
