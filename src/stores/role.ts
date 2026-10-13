import { ref, watch } from 'vue'

// The mockup has no login, so the viewer picks which role to see the screens as.
export type Role = 'ramad' | 'mashak' | 'pakad'

export const roleLabels: Record<Role, string> = {
  ramad: 'רמ״ד',
  mashak: 'מש״ק',
  pakad: 'פוקד',
}

function load(): Role {
  try {
    const saved = localStorage.getItem('role')
    if (saved && saved in roleLabels) return saved as Role
  } catch {}
  return 'ramad'
}

export const role = ref<Role>(load())

watch(role, (r) => {
  try {
    localStorage.setItem('role', r)
  } catch {}
})
