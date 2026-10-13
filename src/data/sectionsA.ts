// Mock data for the medical, goals, allocations and draft-status sections.

export interface Field {
  label: string
  value: string
}

export interface FieldGroup {
  title: string
  fields: Field[]
}

export const medical = {
  profile: '97',
  general: {
    enteredAt: '24.08.2022',
    fields: [
      { label: 'פרופיל', value: '97' },
      { label: 'פרופיל קודם', value: '-' },
      { label: 'חודשי זמניות', value: '0' },
      { label: 'מדרג הגנה נפשי', value: '-' },
      { label: 'וועדה', value: 'וועדה רפואית ל״ג תה״ג' },
      { label: 'סעיפי ליקוי', value: '62347, 34803, 34579, 02139, 03859' },
    ] as Field[],
  },
  groups: [
    {
      title: 'משקל וגובה',
      fields: [
        { label: 'משקל', value: '79.00' },
        { label: 'גובה', value: '173 ס״מ' },
        { label: 'BMI', value: '26.40' },
      ],
    },
    {
      title: 'ראייה',
      fields: [
        { label: 'עין ימין', value: '-0.50' },
        { label: 'עין שמאל', value: '-0.75' },
      ],
    },
    {
      title: 'קה״ס',
      fields: [
        { label: 'קה״ס', value: '-' },
        { label: 'תאריך קה״ס', value: '-' },
      ],
    },
  ] as FieldGroup[],
}

export type GoalStatus = 'התקבל/שובץ' | 'בתהליך מיון' | 'לא התקבל' | 'בוטל'

export interface Goal {
  id: number
  startDate: string
  endDate: string
  goal: string
  status: GoalStatus
  statusReason: string
  roofRule: string
  season: string
  closeReason: string
}

export const goalsMeta = {
  count: '03',
  updatedAt: '12.08.2022',
  inProcess: 24,
}

export const goalStatuses: GoalStatus[] = ['התקבל/שובץ', 'בתהליך מיון', 'לא התקבל', 'בוטל']

export const goals: Goal[] = [
  { id: 1, startDate: '17.12.2023', endDate: '17.01.2024', goal: 'כל״צ כללי', status: 'התקבל/שובץ', statusReason: '-', roofRule: 'נשים', season: '-', closeReason: '-' },
  { id: 2, startDate: '17.12.2023', endDate: '17.01.2024', goal: 'דסקאי/ת מודיעין ב׳ הצרעה חמ״ן', status: 'התקבל/שובץ', statusReason: 'סיים מיון בהצלחה', roofRule: 'כללי', season: '-', closeReason: '-' },
  { id: 3, startDate: '17.12.2023', endDate: '17.01.2024', goal: 'כל״צ כללי', status: 'התקבל/שובץ', statusReason: '-', roofRule: 'נשים', season: '-', closeReason: '-' },
  { id: 4, startDate: '17.12.2023', endDate: '17.01.2024', goal: 'לחימה התנדבותית', status: 'בתהליך מיון', statusReason: 'מתוכנן למיון', roofRule: 'קד״צ', season: 'מיון לוחמות א24', closeReason: '-' },
  { id: 5, startDate: '17.12.2023', endDate: '17.01.2024', goal: 'מקצועות המחשב', status: 'בתהליך מיון', statusReason: 'מתוכנן למיון', roofRule: 'כללי', season: '-', closeReason: '-' },
  { id: 6, startDate: '17.12.2023', endDate: '17.01.2024', goal: 'לחימה התנדבותית', status: 'בתהליך מיון', statusReason: 'מתוכנן למיון', roofRule: 'קד״צ', season: 'מיון לוחמות א24', closeReason: '-' },
  { id: 7, startDate: '17.12.2023', endDate: '17.01.2024', goal: 'לחימה התנדבותית', status: 'בתהליך מיון', statusReason: 'מתוכנן למיון', roofRule: 'קד״צ', season: 'מיון לוחמות א24', closeReason: '-' },
  { id: 8, startDate: '17.12.2023', endDate: '17.01.2024', goal: 'לחימה התנדבותית', status: 'בתהליך מיון', statusReason: 'מתוכנן למיון', roofRule: 'קד״צ', season: 'מיון לוחמות א24', closeReason: '-' },
]

export interface Allocation {
  index: string
  startDate: string
  endDate: string
  jobNumber: string
  activity: string
  status: string
}

export const allocationsMeta = {
  count: '01',
  label: 'התאמות',
  updatedAt: '12.08.2022',
}

export const allocations: Allocation[] = [
  { index: '01', startDate: '17.01.2024', endDate: '17.01.2025', jobNumber: '27393840', activity: 'תפקידי חיל הרפואה', status: 'התקבל' },
  { index: '02', startDate: '12.01.2024', endDate: '17.01.2025', jobNumber: '27393840', activity: 'תפקידי חיל הרפואה', status: 'לא התקבל / שונה שיבוץ' },
  { index: '02', startDate: '06.01.2024', endDate: '17.01.2025', jobNumber: '27393840', activity: 'תפקידי חיל הרפואה', status: 'לא התקבל / שונה שיבוץ' },
]

export const draftStatus = {
  status: '02',
  updatedAt: '12.08.2022',
  // Column-major: each inner array is one column of stacked fields, right to left.
  columns: [
    [
      { label: 'סוג שירות', value: '24.08.2022' },
      { label: 'אורך שירות', value: '36 חודשים' },
    ],
    [
      { label: 'לא לגייס לפני', value: '23.04.2024' },
      { label: 'לא לגייס אחרי', value: '23.08.2024' },
    ],
    [
      { label: 'גיל 18 עברי', value: '23.04.2024' },
      { label: 'סעיף 20 נוכחי', value: '30.05.2025' },
    ],
    [
      { label: 'ציון ר״פ', value: '-' },
      { label: 'ציון ר״פ בעבר', value: '-' },
    ],
    [
      { label: 'דפ״ר תקן', value: '0.652' },
      { label: 'דפ״ר רצף', value: '-' },
    ],
  ] as Field[][],
  secondary: [
    [
      { label: 'מס׳ התאמה', value: '-' },
      { label: 'צה״ר', value: '-' },
    ],
    [
      { label: 'רישום פלילי', value: '-' },
      { label: 'סיבת דחייה', value: '-' },
    ],
    [{ label: 'צו תורן', value: '00000066 צו תורן ניסן תשפ״ג' }],
  ] as Field[][],
  flags: [
    { label: 'שנתון בסיסי', on: true },
    { label: 'דגל התאמה/ סטטוסר דולק', on: false },
    { label: 'מין', on: false },
  ],
}
