import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

async function updateRole(formData: FormData) {
  'use server'
  const userId = formData.get('userId') as string
  const role = formData.get('role') as string
  const admin = createAdminClient()
  await admin.from('profiles').update({ role }).eq('id', userId)
  revalidatePath('/admin/users')
}

export default async function AdminUsersPage() {
  const admin = createAdminClient()
  const { data: users } = await admin
    .from('profiles')
    .select('id, full_name, email, role, school, municipality, generations_this_month, created_at, subject_preference, grade_preference')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Usuarios</h1>
        <p className="text-navy-mid text-sm mt-1">{users?.length ?? 0} usuarios registrados</p>
      </div>

      <div className="bg-white border border-navy-tint rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-tint bg-navy-tint/40">
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-mid uppercase tracking-wide">Usuario</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-mid uppercase tracking-wide">Escuela</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-mid uppercase tracking-wide">Municipio</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-mid uppercase tracking-wide">Materia</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-navy-mid uppercase tracking-wide">Generaciones</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-mid uppercase tracking-wide">Registro</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy-mid uppercase tracking-wide">Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-tint">
              {users?.map((u) => (
                <tr key={u.id} className="hover:bg-navy-tint/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{u.full_name ?? '—'}</p>
                    <p className="text-xs text-navy-mid">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-navy-mid text-xs">{u.school ?? '—'}</td>
                  <td className="px-4 py-3 text-navy-mid text-xs">{u.municipality ?? '—'}</td>
                  <td className="px-4 py-3 text-navy-mid text-xs">{u.subject_preference ?? '—'} {u.grade_preference ? `· G${u.grade_preference}` : ''}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-ink">{u.generations_this_month}</span>
                  </td>
                  <td className="px-4 py-3 text-navy-mid text-xs">
                    {new Date(u.created_at).toLocaleDateString('es-PR', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <form action={updateRole} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={u.id} />
                      <select
                        name="role"
                        defaultValue={u.role}
                        className="text-xs border border-navy-tint rounded-lg px-2 py-1 bg-white text-ink focus:outline-none focus:border-navy"
                      >
                        <option value="free">free</option>
                        <option value="premium">premium</option>
                        <option value="institutional">institutional</option>
                      </select>
                      <button
                        type="submit"
                        className="text-[10px] font-semibold px-2 py-1 bg-navy text-white rounded-lg hover:bg-navy-mid transition-colors"
                      >
                        Cambiar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
