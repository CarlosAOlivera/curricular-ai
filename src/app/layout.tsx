import type { Metadata } from 'next'
import { Geist, Geist_Mono, Fraunces } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
})

export const metadata: Metadata = {
  title: 'LumIA — La inteligencia que ilumina tu enseñanza.',
  description: 'Planificaciones semanales, rúbricas y assessments alineados al currículo del DEPR, listos en 60 segundos.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
