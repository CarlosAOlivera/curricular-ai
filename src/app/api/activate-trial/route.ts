import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, trial_ends_at')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })

  if (profile.role === 'premium') {
    return NextResponse.json({ error: 'Ya tienes cuenta Premium' }, { status: 400 })
  }

  if (profile.trial_ends_at) {
    return NextResponse.json({ error: 'Ya usaste tu trial gratuito' }, { status: 400 })
  }

  const trialEndsAt = new Date()
  trialEndsAt.setDate(trialEndsAt.getDate() + 7)

  await supabase
    .from('profiles')
    .update({ trial_ends_at: trialEndsAt.toISOString() })
    .eq('id', user.id)

  return NextResponse.json({ trial_ends_at: trialEndsAt.toISOString() })
}
