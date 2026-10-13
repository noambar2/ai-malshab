import { reactive } from 'vue'

export interface InfoField {
  label: string
  value?: string
  /** Column-header style: bold label. */
  strong?: boolean
  /** Tooltip shown next to the label. */
  info?: string
  /** Muted text shown after the value, e.g. "(2 ציון קודם)". */
  note?: string
  icon?: 'error' | 'warning'
  /** Renders the value as a red status pill. */
  pill?: string
}

export interface Opinion {
  title: string
  text: string
}

export interface Flag {
  label: string
  done: boolean
}

export const updatedAt = '12.08.2022'
const asOf = 'נכון לתאריך 24.11.2020'

/* נתוני גיוס, איכות, אינדיקציות */
export const firstOrderColumns: InfoField[][] = [
  [
    { label: 'ראיון לכל', value: '-', strong: true },
    { label: 'קרבי', value: '-' },
    { label: 'תובעני', value: '-' },
  ],
  [
    { label: 'דפ״ר', value: '64', strong: true },
    { label: 'דפ״ר רציף', value: '-' },
    { label: 'דפ״ר תקין', value: '-' },
  ],
  [
    { label: 'עברית', value: '8', strong: true, info: asOf },
    { label: 'דיבור', value: '5' },
    { label: 'הבנת הנקרא', value: '-' },
  ],
  [
    { label: 'שנו״ל', value: '12', strong: true },
    { label: 'תל״מ', value: '-' },
  ],
  [
    { label: 'צד״כ', value: '25', info: asOf },
    { label: 'צמ״א', value: '0' },
  ],
]

export const placementRows: InfoField[][] = [
  [
    { label: 'ת״ש', value: '-' },
    { label: 'מדד אוכ׳ במיקוד', value: '00', info: asOf },
    { label: 'מדרג שיבוצי', value: '90' },
    { label: 'מתאם קצונה', value: '00', info: asOf },
    { label: 'מדד מנהיגות', value: '36 חודשים' },
  ],
  [
    { label: 'כלים', value: '148' },
    { label: 'מדד תכנוני', value: '2' },
    { label: 'סוציואקונומי', value: '6' },
  ],
]

export const draftOpinions: Opinion[] = [
  {
    title: 'חוו״ד פוקד',
    text: 'מלש״ב הגיע בזמן לצו הראשון, לבוש בהתאם והתנהל באופן מכבד מול הצוות. הביע רצון ברור לשירות משמעותי ומוטיבציה גבוהה לשירות קרבי. ציין כי עוסק בספורט באופן קבוע ומתנדב במד״א בשנתיים האחרונות. לא עלו קשיים מיוחדים במהלך הראיון, ממליץ על המשך מיון ליחידות מובחרות.',
  },
  {
    title: 'חוו״ד מאבחנ/ת פסיכוטכני',
    text: 'נבחן הפגין יכולת ריכוז טובה לאורך כל המבחנים והבנה מהירה של ההוראות. ביצועים גבוהים במטלות חשיבה כמותית ובינוניים במטלות מילוליות. לא נצפו סימני חרדת בחינה. מומלץ לשקול שיבוץ במסלולים טכנולוגיים.',
  },
  {
    title: 'חוו״ד תובעני',
    text: 'מתאים לשירות בתנאי עומס. מתאר הסתגלות טובה למסגרות חדשות ועמידה בלחצים במהלך לימודי התיכון ופעילות בתנועת הנוער. אין מניעה לשיבוץ בתפקיד תובעני, יש להמשיך מעקב בתחילת השירות.',
  },
  {
    title: 'חוו״ד קרבי',
    text: 'מוטיבציה גבוהה לשירות קרבי, כושר גופני טוב. מומלץ לזמן לגיבוש ולמיונים ליחידות מובחרות.',
  },
]

/* מא״ה */
export const maaGeneral: InfoField[] = [
  { label: 'תאריך זימון', value: '12.10.2022' },
  { label: 'סטטוס מלש״ב', pill: 'לא סיים תהליכים' },
  { label: 'סטטוס שאלון מא״ה', value: '90' },
  { label: 'סטטוס זימון', value: '-' },
  { label: 'תפיסה מרחבית', value: '6' },
  { label: 'מס׳ מופעי ציונים', value: '0' },
]

export const maaZoomScores: InfoField[] = [
  { label: 'הדרכה', value: '5', note: '(4 ציון קודם)' },
  { label: 'טיפול באדם', value: '1' },
  { label: 'פיקוד', value: '2' },
  { label: 'התנהגות מסגרתית', value: '6' },
  { label: 'בגרות ובשלות', value: '5', note: '(2 ציון קודם)' },
  { label: 'השקעה והתמדה', note: 'השלמה', icon: 'error' },
  { label: 'עבודת צוות', value: '5' },
]

export const maaComputerScores: InfoField[] = [
  { label: 'עיבוד מידע', value: '4' },
  { label: 'מנהל וארגון', value: '1', note: 'ערעור', icon: 'warning' },
  { label: 'סיבת זימון', value: '2' },
  { label: 'טכני - הפעלה', value: '4' },
  { label: 'קשב מתמשך', value: '5', note: '(3 ציון קודם)' },
]

export const maaNotes: Opinion[] = [
  {
    title: 'הערות',
    text: 'המלש״ב הגיע למא״ה אך לא השלים את כל הרכיבים בשל תקלה במערכת הבחינות הממוחשבות. נקבע מועד השלמה לרכיב השקעה והתמדה. הוגש ערעור על ציון מנהל וארגון, ממתין להחלטת ועדה.',
  },
  {
    title: 'הערות פעילות',
    text: 'נשלח זימון להשלמה במייל ובהודעת SMS. יש לוודא הגעה עד סוף החודש.',
  },
]

/* שאלון מא״ה */
export const maaForm: InfoField[] = [
  { label: 'תאריך הפקה', value: '-' },
  { label: 'שאלת החלומות', value: '-' },
  { label: 'איתור', value: '-' },
  { label: 'קביעה', value: '-' },
  { label: 'תאריך השבה', value: '-' },
]

/* השכלה */
export const educationRows: InfoField[][] = [
  [
    { label: 'תאריך אימות', value: '02.01.2023' },
    { label: 'מסגרת', value: 'תיכון דתי עתיד' },
    { label: 'סוג מסגרת', value: '-' },
    { label: 'אפיון מוסד', value: 'תיכוני' },
    { label: 'ק. מקצוע', value: '00000008' },
    { label: 'ק. מגמה', value: '00000024' },
  ],
  [
    { label: 'תחום', value: 'חשמלאי כללי' },
    { label: 'קב״ס', value: '-' },
    { label: 'תל״ס', value: '30.06.2024' },
  ],
]

/* עתודה */
export const atudaRows: InfoField[][] = [
  [
    { label: 'מחזור לימוד', value: '54' },
    { label: 'בקשת בגרות', value: '0.652' },
    { label: 'מסלולים מיוחדים', value: '90' },
    { label: 'יישוב עתידים', value: '-' },
    { label: 'פסיכומטרי', value: '-' },
  ],
  [
    { label: 'שליחת חוברת עבודה', value: '-' },
    { label: 'הרשאה לקבלת בגרות', value: '-' },
    { label: 'ציון עתודה', value: '12' },
    { label: 'מבחני קצונה', value: '5' },
    { label: 'פסיכומטרי מיוחד', value: '-' },
  ],
]

export const atudaFlags = reactive<Flag[]>([
  { label: 'ביצוע מבחן SAT', done: false },
  { label: 'ויתור עתודה', done: false },
])

/* משרות */
export const positionRows: InfoField[][] = [
  [
    { label: 'יח״ש כללי', value: '02.01.2023' },
    { label: 'עונה', value: '-' },
    { label: 'מסלולים מיוחדים', value: '90' },
    { label: 'יישוב עתידים', value: '-' },
    { label: 'פסיכומטרי', value: '-' },
  ],
  [
    { label: 'צו 12', value: '27.08.2023' },
    { label: 'סטטוס', value: 'התקבל/שובץ' },
    { label: 'ציון עתודה', value: '12' },
    { label: 'מבחני קצונה', value: '5' },
    { label: 'פסיכומטרי מיוחד', value: '-' },
  ],
]

export const positionFlags = reactive<Flag[]>([
  { label: 'ביצוע מבחן SAT', done: false },
  { label: 'ויתור עתודה', done: false },
])

/* סיירות */
export const sayarotFields: InfoField[] = [
  { label: 'SPH', value: '-' },
  { label: 'ויתור', value: '-' },
]

export const sayarotFlags = reactive<Flag[]>([
  { label: 'גדנ״ע חובלים', done: true },
  { label: 'גדנ״ע צלילה', done: false },
])
