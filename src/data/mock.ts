// All data in the mockup is static and lives here — there is no backend.
import { reactive } from 'vue'

export type CallStatus = 'answered' | 'missed'

export interface DialerRow {
  id: string
  callStatus: CallStatus
  idNumber: string
  fullName: string
  gender: 'זכר' | 'נקבה'
  age: number
  birthDate: string
  stage: string
  stageGroup: 'before12' | 'after12' | 'draftDodgers'
  track: string
  office: string
}

export const lastUpdated = '10:17'
export const editLockTime = '16:00'

export const dialerRows: DialerRow[] = [
  { id: '1', callStatus: 'missed', idNumber: '12345678', fullName: 'יקיר הדר', gender: 'זכר', age: 17.7, birthDate: '23.05.2005', stage: '1 לפני הכרזה', stageGroup: 'before12', track: 'גיוס רגיל', office: 'טבריה' },
  { id: '2', callStatus: 'answered', idNumber: '12345678', fullName: 'שלום מלכה', gender: 'זכר', age: 17.8, birthDate: '05.05.2005', stage: '1 - לפני הכרזה', stageGroup: 'before12', track: 'גיוס רגיל', office: 'מחווה אלון' },
  { id: '3', callStatus: 'missed', idNumber: '12345678', fullName: 'בר כהן', gender: 'נקבה', age: 18.7, birthDate: '20.08.2005', stage: '2 - אחרי הכרזה', stageGroup: 'after12', track: 'בחו״ל ללא אישור', office: 'תל השומר' },
  { id: '4', callStatus: 'answered', idNumber: '12345678', fullName: 'דניאל לוי', gender: 'נקבה', age: 17.7, birthDate: '18.03.2005', stage: '1 - לפני הכרזה', stageGroup: 'before12', track: 'גיוס רגיל', office: 'תל השומר' },
  { id: '5', callStatus: 'missed', idNumber: '12345678', fullName: 'שירן פרץ', gender: 'זכר', age: 19.4, birthDate: '29.11.2005', stage: '2 - אחרי הכרזה', stageGroup: 'after12', track: 'גיוס רגיל', office: 'באר שבע' },
  { id: '6', callStatus: 'missed', idNumber: '12345678', fullName: 'אברהם כהן', gender: 'זכר', age: 20.8, birthDate: '02.01.2005', stage: '3 - משתמטים', stageGroup: 'draftDodgers', track: 'גיוס רגיל', office: 'תל השומר' },
  { id: '7', callStatus: 'missed', idNumber: '12345678', fullName: 'דני דניאלי', gender: 'זכר', age: 17.7, birthDate: '15.09.2005', stage: '2 - אחרי הכרזה', stageGroup: 'after12', track: 'גיוס רגיל', office: 'תל השומר' },
  { id: '8', callStatus: 'missed', idNumber: '12345678', fullName: 'דני דניאלי', gender: 'זכר', age: 17.7, birthDate: '10.12.2005', stage: '1 - לפני הכרזה', stageGroup: 'before12', track: 'גיוס רגיל', office: 'תל השומר' },
  { id: '9', callStatus: 'missed', idNumber: '12345678', fullName: 'דני דניאלי', gender: 'זכר', age: 17.8, birthDate: '10.12.2005', stage: '1 - לפני הכרזה', stageGroup: 'before12', track: 'גיוס רגיל', office: 'ירושלים' },
  { id: '10', callStatus: 'missed', idNumber: '12345678', fullName: 'דני דניאלי', gender: 'זכר', age: 17.4, birthDate: '10.12.2005', stage: '1 - לפני הכרזה', stageGroup: 'before12', track: 'גיוס רגיל', office: 'ירושלים' },
  { id: '11', callStatus: 'missed', idNumber: '12345678', fullName: 'דני דניאלי', gender: 'זכר', age: 17.4, birthDate: '10.12.2005', stage: '2 - אחרי הכרזה', stageGroup: 'after12', track: 'גיוס רגיל', office: 'טבריה' },
  { id: '12', callStatus: 'answered', idNumber: '12345678', fullName: 'נועה אברהם', gender: 'נקבה', age: 18.1, birthDate: '14.02.2005', stage: '3 - משתמטים', stageGroup: 'draftDodgers', track: 'גיוס רגיל', office: 'חיפה' },
]

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
