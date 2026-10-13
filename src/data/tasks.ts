// Extra mock data for the task page ("סיכום תיק") in the draft-dodgers area.
import { reactive } from 'vue'
import type { Role } from '@/stores/role'

export interface Field {
  label: string
  value: string
}

// Who "I" am in each role — the mockup has no login.
export const currentUser: Record<Role, { name: string; title: string }> = {
  mashak: { name: 'ישראל ישראלי', title: 'מש״ק תו״ם' },
  ramad: { name: 'דניאל לוי', title: 'רמ״ד תו״ם' },
  pakad: { name: 'אורי לוי', title: 'פוקד' },
}

// The person a task moves to when the current role recommends it onward.
export const nextStage: Record<Role, string> = {
  mashak: 'רמ״ד',
  ramad: 'פוקד',
  pakad: '',
}

export const taskHeader = {
  office: 'תל השומר',
  statusReasonDate: '18.08.2020',
}

export const timeline = [
  { label: 'אי התייצבות ל-3\nזימונים מחייבים', date: '12.02.22' },
  { label: 'שיחת אזהרה', date: '12.09.22 (חייגן 1)' },
  { label: 'הכרזת\nצו 12' },
  { label: 'שיחה אחרי\nצו 12' },
  { label: 'אי התייצבות\nליום גיוס' },
  { label: 'שיחת אזהרה' },
  { label: 'הכרזת\nהשתמטות' },
]

export const personal: Field[] = [
  { label: 'שם פרטי', value: '' },
  { label: 'שם משפחה', value: '' },
  { label: 'מספר אישי', value: '12345678' },
  { label: 'תעודת זהות', value: '' },
  { label: 'ארץ לידה', value: 'ישראל' },
  { label: 'אזרחות', value: 'ישראלית' },
  { label: 'לשכת גיוס', value: 'תל השומר' },
  { label: 'תאריך גיוס', value: '13.12.2023' },
  { label: 'תאריך לידה', value: '29.05.05' },
  { label: 'גיל', value: '18.4' },
  { label: 'מצב משפחתי', value: 'רווק' },
  { label: 'דת', value: 'יהודי' },
  { label: 'תאריך עליה', value: '-' },
  { label: 'לאום', value: 'אוקראיני' },
  { label: 'תל״מ', value: '00.00.0000' },
  { label: 'אורך שירות', value: '24 חודשים' },
]

export const candidateStatus: Field[] = [
  { label: 'טווח מועמד', value: 'גיוס רגיל' },
  { label: 'סטטוס', value: 'מתוכנן למיון ראשוני' },
  { label: 'סיבת סטטוס', value: 'רגיל' },
  { label: 'תוקף סטטוס', value: '26.06.2025' },
]

export const candidateScores: Field[] = [
  { label: 'ציון ר״פ', value: '00000000' },
  { label: 'התש', value: '0' },
  { label: 'פטור שבת וחג', value: 'לא' },
  { label: '', value: '' },
  { label: 'פרופיל', value: '-' },
  { label: 'קה״ס', value: '-' },
  { label: 'מדרג הגנה נפשי', value: '-' },
  { label: 'סעיפי ליקוי', value: '-' },
]

export const address: Field[] = [
  { label: 'סמל יישוב', value: '6543' },
  { label: 'יישוב', value: 'תל אביב - יפו' },
  { label: 'סמל רחוב', value: '5322' },
  { label: 'רחוב', value: 'זבוטינסקי' },
  { label: 'בית מס׳', value: '22' },
  { label: 'כניסה', value: 'ג' },
  { label: 'דירה', value: '15' },
]

// Pill colours used across the printout tables.
export type Tone = 'green' | 'red' | 'yellow' | 'grey'

export interface Column {
  key: string
  label: string
  sortable?: boolean
}

export interface PrintoutTable {
  key: string
  title: string
  columns: Column[]
  rows: Record<string, string>[]
  // Status cell: the label and its tone.
  status: (row: Record<string, string>) => { label: string; tone: Tone }
}

const indicatorTone: Record<string, Tone> = {
  'מאושר | רפואי': 'green',
  מאושר: 'green',
  בתהליך: 'yellow',
  'לא מאושר': 'red',
}
const summonsTone: Record<string, Tone> = { 'לא התייצב': 'red', אושר: 'green', בוטל: 'grey' }
const callTone: Record<string, Tone> = { בוצעה: 'green', 'אין מענה': 'red', 'ניתק באמצע': 'grey' }

export const printoutTables: PrintoutTable[] = [
  {
    key: 'indications',
    title: 'אינדיקציות',
    columns: [
      { key: 'code', label: 'מספר אינדיקציה' },
      { key: 'name', label: 'שם אינדיקציה' },
      { key: 'start', label: 'תאריך התחלה' },
      { key: 'end', label: 'תאריך סיום' },
    ],
    rows: [
      { code: '01', name: 'לילות לינה 7', start: '03.06.2024', end: '31.12.9999', status: 'מאושר | רפואי' },
      { code: '30', name: 'חוסר שיתוף פעולה', start: '02.06.2024', end: '31.12.9999', status: 'בתהליך' },
      { code: '28', name: 'רישום פלילי', start: '13.12.2023', end: '31.12.9999', status: 'מאושר' },
      { code: '16', name: 'לילות לינה 7', start: '02.03.2020', end: '03.06.2024', status: 'לא מאושר' },
    ],
    status: (r) => ({ label: r.status!, tone: indicatorTone[r.status!] ?? 'grey' }),
  },
  {
    key: 'summons',
    title: 'זימוני חובה',
    columns: [
      { key: 'name', label: 'שם זימון' },
      { key: 'date', label: 'תאריך זימון' },
      { key: 'reason', label: 'סיבת סטטוס' },
      { key: 'printed', label: 'תאריך הדפסה' },
      { key: 'valid', label: 'תקינות הזימון' },
      { key: 'level', label: 'מדרג זימון' },
    ],
    rows: [
      { name: 'צו ראשון בנות', date: '20.06.2025', reasonCode: '01', reason: 'רגיל', printed: '20.04.2025', valid: '20', level: '1', status: 'לא התייצב' },
      { name: 'צו ראשון בנות', date: '06.05.2025', reasonCode: '01', reason: 'רגיל', printed: '06.03.2025', valid: '2', level: '2', status: 'אושר' },
      { name: 'צו ראשון בנות', date: '04.05.2025', reasonCode: '21', reason: 'בירור כתובת לפני פ״מ', printed: '04.03.2025', valid: '10', level: '2', status: 'לא התייצב' },
      { name: 'צו ראשון בנות', date: '20.04.2025', reasonCode: '22', reason: 'התראה לפני פ״מ', printed: '20.02.2025', valid: '7', level: '1', status: 'בוטל' },
    ],
    status: (r) => ({ label: r.status!, tone: summonsTone[r.status!] ?? 'grey' }),
  },
  {
    key: 'calls',
    title: 'חייגנים',
    columns: [
      { key: 'date', label: 'תאריך שיחה' },
      { key: 'time', label: 'שעה' },
      { key: 'phone', label: 'מספר פלאפון' },
      { key: 'kind', label: 'סוג מספר' },
      { key: 'dialer', label: 'חייגן', sortable: true },
      { key: 'duration', label: 'משך שיחה' },
    ],
    rows: [
      { date: '20.06.2025', time: '18:24', phone: '054-0000000', kind: 'נייד פרטי', dialer: '1', duration: '00:11:33', status: 'בוצעה' },
      { date: '20.06.2025', time: '18:24', phone: '054-0000000', kind: 'בית', dialer: '1', duration: '-', status: 'אין מענה' },
      { date: '06.05.2025', time: '17:11', phone: '052-0000000', kind: 'נייד פרטי', dialer: '2', duration: '00:10:03', status: 'בוצעה' },
      { date: '04.05.2025', time: '16:32', phone: '055-0000000', kind: 'נייד אם', dialer: '2', duration: '-', status: 'אין מענה' },
      { date: '20.04.2025', time: '16:02', phone: '050-0000000', kind: 'נייד אב', dialer: '2', duration: '00:00:04', status: 'ניתק באמצע' },
    ],
    status: (r) => ({ label: r.status!, tone: callTone[r.status!] ?? 'grey' }),
  },
]

export const dodgeTypes = ['משתמט בארץ', 'משתמט בחו״ל', 'אופציה 3'] as const

// A single entry in a declaration process history.
export interface ProcessEntry {
  name: string
  title: string
  date: string
  badge: { label: string; tone: Tone }
  text: string
}

function seedHistory(): ProcessEntry[] {
  return [
    {
      name: 'ישראל ישראלי',
      title: 'מש״ק תו״ם',
      date: '18.09.22 בשעה 16:00',
      badge: { label: 'הועבר לטיפול רמ״ד', tone: 'green' },
      text: 'ממליץ להכריז על צו 12 ככה וככה',
    },
    {
      name: 'דניאל לוי',
      title: 'רמ״ד תו״ם',
      date: '18.09.22 בשעה 16:23',
      badge: { label: 'הוחזר לתיקון', tone: 'red' },
      text: 'חסרים הדברים הבאים:\n1. לבדוק ככה וככה\n2. עוד משהו',
    },
  ]
}

export interface TaskProcess {
  history: ProcessEntry[]
  // Set once the current holder acted; the task then waits for someone else.
  outcome?: { label: string; tone: Tone }
}

// Per-task process state, created lazily so actions survive navigating away and back.
// The map itself isn't reactive (so creating an entry inside a computed doesn't re-trigger it);
// each entry is.
const processes = new Map<string, TaskProcess>()

export function getProcess(taskId: string): TaskProcess {
  let p = processes.get(taskId)
  if (!p) {
    p = reactive<TaskProcess>({ history: seedHistory() })
    processes.set(taskId, p)
  }
  return p
}

export function nowStamp() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${String(d.getFullYear()).slice(2)} בשעה ${p(d.getHours())}:${p(d.getMinutes())}`
}
