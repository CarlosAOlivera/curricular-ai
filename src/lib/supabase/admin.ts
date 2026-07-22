import { createClient } from '@supabase/supabase-js'

// Service role client — bypasses RLS. Only use in server-side admin routes.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// Admin emails — only these users can access /admin
export const ADMIN_EMAILS = ['coliveracuba@gmail.com']
