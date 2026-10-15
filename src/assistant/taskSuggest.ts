// "הצעה חכמה" for the comment box on a draft-dodger task: drafts a recommendation from the
// task's own data (summonses, dialer calls, indications) and the last step in its history.
// Like the rest of the assistant it runs on the mockup's data — no model or backend.
import type { DodgerTask } from '@/data/dodgers'
import { printoutTables, type ProcessEntry } from '@/data/tasks'
import type { Role } from '@/stores/role'

const rows = (key: string) => printoutTables.find((t) => t.key === key)?.rows ?? []

interface Context {
  task: DodgerTask
  role: Role
  history: ProcessEntry[]
  dodgeType?: string
}

export function suggestComment({ task, role, history, dodgeType }: Context): string {
  const female = task.gender === 'נקבה'
  const missed = rows('summons').filter((r) => r.status === 'לא התייצב')
  const lastMissed = missed[0]?.date
  const calls = rows('calls')
  const reached = calls.filter((r) => r.status === 'בוצעה').length
  const medical = rows('indications').some((r) => r.status?.includes('רפואי'))
  const kind = task.declarationType
  const didNotShow = female ? 'לא התייצבה' : 'לא התייצב'
  const last = history[history.length - 1]
  const wasReturned = last?.badge.label.includes('תיקון')

  const facts = `${didNotShow} ל־${missed.length} זימוני חובה (אחרון ${lastMissed}); בוצעו ${reached} שיחות חייגן מתוך ${calls.length}`

  if (role === 'pakad') {
    const type = dodgeType ? ` — ${dodgeType}` : ''
    return `לאחר בחינת התיק: ${facts}, ללא שינוי בהתנהלות. ${medical ? 'האינדיקציה הרפואית נבדקה ואינה מונעת הכרזה. ' : ''}הוחלט על הכרזת ${kind}${type}.`
  }

  if (role === 'ramad') {
    return `${wasReturned ? 'התיקונים שהתבקשו בוצעו. ' : ''}מאשר/ת את המלצת המש״ק: ${facts}. ${medical ? 'אינדיקציה רפואית מאושרת נבדקה ואינה חוסמת. ' : ''}ממליץ/ה להעביר לפוקד להכרזת ${kind}.`
  }

  // מש״ק
  return `${wasReturned ? `בהמשך להערות ${last!.name}: הושלמו הבדיקות שהתבקשו. ` : ''}${female ? 'המלש״בית' : 'המלש״ב'} ${facts}. סיבת הסטטוס: ${task.statusReasonCode} ${task.statusReason}. ממליץ/ה על ${kind}.`
}
