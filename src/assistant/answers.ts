// The smart assistant answers from the mockup's own data — there is no model or backend.
// Each topic has trigger words; a question can hit several topics and gets one combined answer.
// Answers use a tiny markup: **bold** and lines starting with "- " for bullets.
import { malshab, summonsState, summonsStatusLabel } from '@/data/mock'
import { allocations, draftStatus, goals, medical } from '@/data/sectionsA'
import {
  atudaFlags,
  educationRows,
  maaComputerScores,
  maaGeneral,
  maaNotes,
  maaZoomScores,
  sayarotFlags,
} from '@/data/sectionsB'

const firstName = malshab.fullName.split(' ')[0]!
const field = (list: { label: string; value: string }[], label: string) =>
  list.find((f) => f.label === label)?.value ?? '-'

const s = malshab.summary
const process = malshab.process

function openSummons() {
  return summonsState.list.filter((x) => x.status === 'open' || x.status === 'required')
}

export const QUICK_QUESTIONS = [
  'תן לי סיכום מלא על המלש״ב',
  'אילו זימונים פתוחים יש לו?',
  'מה הפרופיל הרפואי שלו?',
  'איפה הוא עומד בתהליך צו 12?',
  'מה הציונים שלו במא״ה?',
  'לאילו יעדים הוא בתהליך מיון?',
  'איך יוצרים איתו קשר?',
]

export function greeting(): string[] {
  const open = openSummons().length
  return [
    `היי 👋 אני העוזר החכם של מלש״ביה. הנה תמונת מצב קצרה על **${malshab.fullName}**:`,
    [
      `- בן ${field(malshab.personal, 'גיל')}, גר ב${field(malshab.personal, 'יישוב / סוציואקונומי').split(' /')[0]}, משויך ל${field(malshab.draft, 'לשכה')}`,
      `- פרופיל **${s.profile}**, דפ״ר **${s.dapar}**, טווח מועמד **${s.track}**`,
      `- בתהליך צו 12: השלב הנוכחי הוא **${process.steps[process.current]!.label}**`,
      `- ${open ? `**${open} זימונים פתוחים**` : 'אין זימונים פתוחים'} מתוך ${summonsState.list.length} זימונים`,
      `- מא״ה: **לא סיים תהליכים** — ממתין להשלמה וערעור`,
    ].join('\n'),
    'אפשר לשאול אותי כל פרט שתרצו לדעת עליו — זימונים, רפואי, ציונים, יעדים, פרטי קשר ועוד.',
  ]
}

let lastQuestion = ''

interface Topic {
  match: RegExp
  answer: () => string
}

const topics: Topic[] = [
  {
    match: /סיכום|תמונת מצב|ספר לי|הכל|כל הנתונים|מי זה|מי הוא/,
    answer: () =>
      [
        `**${malshab.fullName}** · מ.א ${malshab.personalNumber} · ת.ז ${malshab.idNumber}`,
        `- **פרטים אישיים:** בן ${field(malshab.personal, 'גיל')}, ${field(malshab.personal, 'דת')}, ${field(malshab.personal, 'מעמד')}`,
        `- **מוצא:** נולד ב${field(malshab.origin, 'ארץ לידה')}, אזרחות נוספת ${field(malshab.origin, 'אזרחויות נוספות')}`,
        `- **נתוני גיוס:** פרופיל ${s.profile}, דפ״ר ${s.dapar}, ${s.track}, תאריך גיוס ${s.draftDate}`,
        `- **צו 12:** ${process.steps[process.current]!.label}`,
        `- **זימונים:** ${openSummons().length} פתוחים מתוך ${summonsState.list.length}`,
        `- **יעדים:** ${goals.filter((g) => g.status === 'התקבל/שובץ').length} התקבל/שובץ, ${goals.filter((g) => g.status === 'בתהליך מיון').length} בתהליך מיון`,
        `- **מא״ה:** לא סיים תהליכים`,
      ].join('\n'),
  },
  {
    match: /זימונ|מיון קרוב|הוזמן|זומן/,
    answer: () => {
      const open = openSummons()
      const onlyOpen = /פתוח/.test(lastQuestion)
      const lines = (onlyOpen ? open : summonsState.list).map(
        (x) => `- ${x.date} · **${x.name}** (${x.topic}) — ${summonsStatusLabel[x.status]}`,
      )
      return [
        `ל${firstName} יש **${summonsState.list.length} זימונים**, מתוכם **${open.length} פתוחים** (פתוח / דרישה לזימון):`,
        ...lines,
        summonsState.hasBlocking ? '\nשימו לב: קיים זימון חוסם, ולכן לא ניתן להוסיף זימון חדש.' : '',
      ]
        .filter(Boolean)
        .join('\n')
    },
  },
  {
    match: /רפוא|פרופיל|ליקוי|ועדה|וועדה|ראייה|ראיה|משקל|גובה|bmi|בריאות/i,
    answer: () => {
      const g = medical.general.fields
      const groupLines = medical.groups.flatMap((grp) =>
        grp.fields.map((f) => `- ${f.label}: **${f.value}**`),
      )
      return [
        `הפרופיל הרפואי של ${firstName} הוא **${medical.profile}** (הוזן ב-${medical.general.enteredAt}).`,
        `- וועדה: **${field(g, 'וועדה')}**`,
        `- סעיפי ליקוי: ${field(g, 'סעיפי ליקוי')}`,
        ...groupLines,
      ].join('\n')
    },
  },
  {
    match: /צו 12|צו12|תהליך|השתמט|אזהרה|הכרז/,
    answer: () => {
      const lines = process.steps.map((step, i) => {
        const mark = i < process.current ? '✓' : i === process.current ? '←' : '○'
        return `- ${mark} ${i === process.current ? `**${step.label}**` : step.label}${step.date ? ` (${step.date})` : ''}`
      })
      return [
        `${firstName} נמצא כרגע בשלב **${process.steps[process.current]!.label}** בתהליך צו 12.`,
        ...lines,
        `השלב הבא: **${process.steps[process.current + 1]?.label ?? '-'}**.`,
      ].join('\n')
    },
  },
  {
    match: /מא״ה|מא"ה|מאה|ציונ|זום|מבחנ|ערעור/,
    answer: () => {
      const zoom = maaZoomScores.map(
        (f) => `- ${f.label}: **${f.value ?? '-'}**${f.note ? ` ${f.note}` : ''}`,
      )
      const comp = maaComputerScores.map(
        (f) => `- ${f.label}: **${f.value ?? '-'}**${f.note ? ` ${f.note}` : ''}`,
      )
      return [
        `${firstName} זומן למא״ה ב-${maaGeneral[0]!.value} ו**לא סיים תהליכים**.`,
        '**ציוני זום:**',
        ...zoom,
        '**ציוני מבחני מחשב:**',
        ...comp,
        maaNotes[0]!.text,
      ].join('\n')
    },
  },
  {
    match: /דפ״ר|דפ"ר|דפר|איכות/,
    answer: () =>
      `הדפ״ר של ${firstName} הוא **${s.dapar}**, ודפ״ר תקן **${draftStatus.columns[4]![0]!.value}**.`,
  },
  {
    match: /יעד|שיבוץ|התקבל|הקצא|משרה|תפקיד/,
    answer: () => {
      const byStatus = goals.map((g) => `- **${g.goal}** — ${g.status}${g.season !== '-' ? ` (${g.season})` : ''}`)
      return [
        `ל${firstName} יש **${goals.length} יעדים**:`,
        ...byStatus,
        `הקצאה פעילה: **${allocations[0]!.activity}** (משרה ${allocations[0]!.jobNumber}) — ${allocations[0]!.status}.`,
      ].join('\n')
    },
  },
  {
    match: /טלפון|קשר|כתובת|גר |גרה|יישוב|מגורים|רחוב|הורים|אבא|אמא|אב |אם /,
    answer: () => {
      const a = malshab.address
      return [
        `פרטי הקשר של ${firstName}:`,
        `- טלפון: **${field(malshab.personal, 'טלפון')}**`,
        `- כתובת: **${field(a, 'רחוב')} ${field(a, 'בית מס׳')}/${field(a, 'דירה')}, ${field(a, 'יישוב')}** (מיקוד ${field(a, 'מיקוד')})`,
        `- שם האב: ${field(malshab.personal, 'שם אב')}, שם האם: ${field(malshab.personal, 'שם אם')}`,
        `- כתובות למשלוח זימונים: ${malshab.mailingAddresses.length}`,
      ].join('\n')
    },
  },
  {
    match: /גיל|נולד|לידה|תאריך לידה/,
    answer: () =>
      `${firstName} נולד ב-**${field(malshab.personal, 'תאריך לידה')}** והוא בן **${field(malshab.personal, 'גיל')}**.`,
  },
  {
    match: /אזרחות|עלה|עליה|עלייה|מוצא|ארץ/,
    answer: () =>
      `${firstName} נולד ב${field(malshab.origin, 'ארץ לידה')}, אזרחות **${field(malshab.origin, 'אזרחות')}** ואזרחות נוספת **${field(malshab.origin, 'אזרחויות נוספות')}** (תאריך עליה ${field(malshab.origin, 'תאריך עליה')}).`,
  },
  {
    match: /גיוס|לשכה|מתי מתגייס|טווח/,
    answer: () =>
      `תאריך הגיוס של ${firstName} הוא **${s.draftDate}**, בטווח **${s.track}**, דרך **${field(malshab.draft, 'לשכה')}**.`,
  },
  {
    match: /השכל|בגרות|תיכון|לימוד|מגמה/,
    answer: () => {
      const all = educationRows.flat()
      const get = (l: string) => all.find((f) => f.label === l)?.value ?? '-'
      return `${firstName} לומד ב**${get('מסגרת')}** (${get('אפיון מוסד')}), בתחום **${get('תחום')}**. תאריך סיום לימודים: ${get('תל״ס')}.`
    },
  },
  {
    match: /עתודה|sat/i,
    answer: () =>
      `לגבי עתודה: ${atudaFlags.map((f) => `${f.label} — **${f.done ? 'כן' : 'לא'}**`).join(', ')}.`,
  },
  {
    match: /סייר|גדנ״ע|גדנ"ע|חובלים|צלילה/,
    answer: () =>
      `בנושא סיירות: ${sayarotFlags.map((f) => `${f.label} — **${f.done ? 'בוצע' : 'לא בוצע'}**`).join(', ')}.`,
  },
]

export function answer(question: string): string {
  const q = question.trim()
  lastQuestion = q
  const hits = topics.filter((t) => t.match.test(q))
  if (hits.length) return hits.slice(0, 3).map((t) => t.answer()).join('\n\n')
  return [
    `לא מצאתי מידע שעונה בדיוק על השאלה הזו בתיק של ${firstName}.`,
    'אפשר לשאול למשל על זימונים, פרופיל רפואי, ציוני מא״ה, יעדים, תהליך צו 12 או פרטי קשר.',
  ].join('\n')
}
