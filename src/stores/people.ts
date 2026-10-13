// Favorites and recently viewed malshabim, kept per browser.
import { reactive, watch } from 'vue'
import { malshab } from '@/data/mock'

interface Recent {
  idNumber: string
  at: number
}

const KEY = 'malshabia-people'
const HOUR = 60 * 60 * 1000

function load(): { favorites: string[]; recent: Recent[] } {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '')
    if (Array.isArray(saved.favorites) && Array.isArray(saved.recent)) return saved
  } catch {}
  // First visit: seed a realistic history so the home page isn't empty.
  const now = Date.now()
  return {
    favorites: ['214567890', '207731542', '211356790'],
    recent: [
      { idNumber: '318245671', at: now - 2 * HOUR },
      { idNumber: '214567890', at: now - 5 * HOUR },
      { idNumber: '322190876', at: now - 26 * HOUR },
      { idNumber: '315678902', at: now - 50 * HOUR },
    ],
  }
}

export const peopleState = reactive(load())

watch(peopleState, (s) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {}
})

export const isFavorite = (idNumber: string) => peopleState.favorites.includes(idNumber)

export function toggleFavorite(idNumber: string) {
  const i = peopleState.favorites.indexOf(idNumber)
  if (i === -1) peopleState.favorites.unshift(idNumber)
  else peopleState.favorites.splice(i, 1)
}

export function markViewed(idNumber = malshab.idNumber) {
  const rest = peopleState.recent.filter((r) => r.idNumber !== idNumber)
  peopleState.recent = [{ idNumber, at: Date.now() }, ...rest].slice(0, 8)
}

export function timeAgo(at: number) {
  const mins = Math.round((Date.now() - at) / 60000)
  if (mins < 1) return 'עכשיו'
  if (mins < 60) return `לפני ${mins} דק׳`
  const hours = Math.round(mins / 60)
  if (hours < 24) return hours === 1 ? 'לפני שעה' : `לפני ${hours} שעות`
  const days = Math.round(hours / 24)
  return days === 1 ? 'אתמול' : `לפני ${days} ימים`
}
