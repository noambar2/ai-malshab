// All data in the mockup is static and lives here — there is no backend.
import { reactive } from 'vue'

export type CallStatus = 'answered' | 'missed'

// A call decision: the מש״ק recommends, the רמ״ד approves.
export type CallDecision = 'approved' | 'rejected' | 'pending'

export interface DialerRow {
  id: string
  personalNumber: string
  idNumber: string
  fullName: string
  gender: 'זכר' | 'נקבה'
  age: number
  birthDate: string
  stage: string
  stageGroup: 'before12' | 'after12' | 'draftDodgers'
  track: string
  office: string
  /** The מש״ק's recommendation (edited in the מש״ק view). */
  recommendation: CallDecision
  /** The רמ״ד's approval (edited in the רמ״ד view). */
  approval: CallDecision
}

export const lastUpdated = '10:17'
export const editLockTime = '16:00'

// Live state of the dialer page; reactive so edits survive navigating away and back.
export const dialerState = reactive({
  lastUpdated,
  editLockTime,
  editClosed: false,
})

type Seed = [string, string, DialerRow['gender'], number, string, DialerRow['stageGroup'], string, string, CallDecision, CallDecision]
const stageLabels: Record<DialerRow['stageGroup'], string> = {
  before12: '1 - לפני הכרזה',
  after12: '2 - אחרי הכרזה',
  draftDodgers: '3 - משתמטים',
}
const seeds: Seed[] = [
  ['12345678', 'יקיר הדר', 'זכר', 17.7, '23.05.2005', 'before12', 'גיוס רגיל', 'טבריה', 'rejected', 'pending'],
  ['22345671', 'שלום מלכה', 'זכר', 17.8, '05.05.2005', 'after12', 'גיוס רגיל', 'מחווה אלון', 'approved', 'approved'],
  ['32345672', 'בר כהן', 'נקבה', 18.7, '20.08.2005', 'before12', 'בחו״ל ללא אישור', 'תל השומר', 'rejected', 'rejected'],
  ['42345673', 'דניאל לוי', 'נקבה', 17.7, '18.03.2005', 'after12', 'גיוס רגיל', 'תל השומר', 'approved', 'approved'],
  ['52345674', 'שירן פרץ', 'זכר', 19.4, '29.11.2005', 'draftDodgers', 'גיוס רגיל', 'באר שבע', 'rejected', 'approved'],
  ['62345675', 'אברהם כהן', 'זכר', 20.8, '02.01.2005', 'before12', 'גיוס רגיל', 'תל השומר', 'approved', 'pending'],
  ['72345676', 'דני דניאלי', 'זכר', 17.7, '15.09.2005', 'before12', 'גיוס רגיל', 'תל השומר', 'pending', 'pending'],
  ['82345677', 'יוסי אדרי', 'זכר', 17.7, '10.12.2005', 'draftDodgers', 'גיוס רגיל', 'תל השומר', 'pending', 'pending'],
  ['92345678', 'מאיה גבאי', 'נקבה', 17.8, '11.12.2005', 'before12', 'גיוס רגיל', 'טבריה', 'approved', 'pending'],
  ['10234567', 'עומר שטרן', 'זכר', 17.4, '04.07.2005', 'before12', 'גיוס רגיל', 'ירושלים', 'rejected', 'pending'],
  ['11234567', 'נועה אברהם', 'נקבה', 17.4, '14.02.2005', 'before12', 'גיוס רגיל', 'ירושלים', 'rejected', 'pending'],
  ['12234567', 'איתי ברק', 'זכר', 17.5, '27.10.2005', 'after12', 'גיוס רגיל', 'תל השומר', 'approved', 'pending'],
]

export const dialerRows: DialerRow[] = reactive(
  seeds.map(([personalNumber, fullName, gender, age, birthDate, stageGroup, track, office, recommendation, approval], i) => ({
    id: String(i + 1),
    personalNumber,
    idNumber: String(209842881 + i * 7919).slice(0, 9),
    fullName,
    gender,
    age,
    birthDate,
    stage: stageLabels[stageGroup],
    stageGroup,
    track,
    office,
    recommendation,
    approval,
  })),
)

export const malshab = {
  fullName: 'נתנאל בן ציון',
  personalNumber: '95684578',
  idNumber: '209842881',
  summary: {
    profile: '97',
    dapar: '60',
    status: '1',
    statusReason: 'רגיל',
    statusReasonCode: '01',
    track: 'גיוס רגיל',
    draftDate: '18.08.2020',
  },
  personal: [
    { label: 'תאריך לידה', value: '29.05.05' },
    { label: 'גיל', value: '18.4' },
    { label: 'טלפון', value: '050-1234567' },
    { label: 'יישוב / סוציואקונומי', value: 'תל אביב / 7', info: true },
    { label: 'דת', value: 'יהודי' },
    { label: 'מעמד', value: 'רווק' },
    { label: 'שם אב', value: 'ישראל בן ציון' },
    { label: 'שם אם', value: 'מיכל בן ציון' },
  ],
  origin: [
    { label: 'ארץ לידה', value: 'ישראל' },
    { label: 'אזרחות', value: 'ישראלית' },
    { label: 'תאריך עליה', value: '10.06.2015' },
    { label: 'אזרחויות נוספות', value: 'אמריקאית' },
  ],
  draft: [
    { label: 'לשכה', value: 'לשכת גיוס טבריה', link: true },
    { label: 'מקום גיוס', value: 'טבריה', link: true },
  ],
  address: [
    { label: 'יישוב', value: 'תל אביב - יפו' },
    { label: 'רחוב', value: 'זבוטינסקי' },
    { label: 'בית מס׳', value: '22' },
    { label: 'דירה', value: '15' },
    { label: 'מיקוד', value: '6396412' },
    { label: 'תת מרחב', value: 'גוש דן' },
  ],
  mailingAddresses: ['עיקרית - ארלוזורוב 152, תל אביב.', 'הרימון 5, חדרה', 'הרצל 66, תל אביב'],
  process: {
    title: 'תהליך צו 12',
    current: 1,
    steps: [
      { label: 'אי התייצבות ל-3 זימונים מחייבים', date: '12.02.22' },
      { label: 'שיחת אזהרה' },
      { label: 'הכרזת צו 12' },
      { label: 'שיחה אחרי צו 12' },
      { label: 'אי התייצבות ליום גיוס' },
      { label: 'שיחת אזהרה' },
      { label: 'הכרזת השתמטות' },
    ],
  },
}

export type SummonsStatus = 'open' | 'required' | 'attended' | 'absent' | 'cancelled'

export const summonsStatusLabel: Record<SummonsStatus, string> = {
  open: 'פתוח',
  required: 'דרישה לזימון',
  attended: 'התייצב',
  absent: 'לא התייצב',
  cancelled: 'מבוטל',
}

export interface Summons {
  date: string
  type: string
  name: string
  topic: string
  status: SummonsStatus
  statusReason: string
  closeReason: string
}

// Reactive so a summons added through the popup shows up in the table.
export const summonsState = reactive({
  updatedAt: '12.08.2022',
  hasBlocking: false,
  list: [
    { date: '17.12.2023', type: 'ראשוני', name: 'מיון לוחמים', topic: 'מיון לוחמים', status: 'open', statusReason: 'פתוח', closeReason: '-' },
    { date: '17.12.2023', type: 'מתקדם', name: 'מיון מקצועות המחשב', topic: 'סייבר', status: 'open', statusReason: 'פתוח', closeReason: '-' },
    { date: '17.12.2023', type: 'מתקדם', name: 'כל״ץ כללי', topic: 'סוהר/ת', status: 'required', statusReason: 'סיבה', closeReason: '-' },
    { date: '17.12.2023', type: 'ראשוני', name: 'לחימה התנדבותית', topic: 'יום סיירות', status: 'attended', statusReason: 'התייצב', closeReason: '-' },
    { date: '17.12.2023', type: 'ראשוני', name: 'מקצועות המחשב', topic: 'מנהל רשת', status: 'absent', statusReason: 'לא הגיע', closeReason: '-' },
    { date: '17.12.2023', type: 'ראשוני', name: 'לחימה התנדבותית', topic: 'יום סיירות', status: 'required', statusReason: 'קד״צ', closeReason: '-' },
    { date: '17.12.2023', type: 'מתקדם', name: 'לחימה התנדבותית', topic: 'יום סיירות', status: 'cancelled', statusReason: 'תאריך נדחה', closeReason: '-' },
    { date: '17.12.2023', type: 'ראשוני', name: 'לחימה התנדבותית', topic: 'מיון לוחמים', status: 'open', statusReason: 'פתוח', closeReason: '-' },
  ] as Summons[],
})

export interface SortingOption {
  code: string
  name: string
  kind: 'ראשוני' | 'מתקדם'
  blocking?: boolean
  shortName: string
}

export const sortingOptions: SortingOption[] = [
  { code: '26322200', name: 'יום המא״ה מרחוק', kind: 'ראשוני', shortName: 'יום המא״ה' },
  { code: '26322201', name: 'יום המא״ה מרחוק', kind: 'ראשוני', shortName: 'יום המא״ה' },
  { code: '00001122', name: 'טיס', kind: 'מתקדם', blocking: true, shortName: 'טיס' },
  { code: '66372890', name: 'סיירות', kind: 'ראשוני', shortName: 'סיירות' },
  { code: '66372891', name: 'סיירות', kind: 'ראשוני', shortName: 'סיירות' },
  { code: '66372892', name: 'סיירות', kind: 'ראשוני', shortName: 'סיירות' },
]

export const timeSlots = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
]
