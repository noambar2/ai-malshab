// Directives (דירקטיבות): catalogs for the create-directive wizard, seed directives,
// and an in-memory reactive store. There is no backend — everything resets on reload.
import { reactive } from 'vue'

/** The mockup's "today", so seed directives fall cleanly into future / past. */
export const TODAY = '2025-04-07'

// ---------- Catalogs ----------

export const districts = [
  'מתחם 60, שרשרת חיול 0100',
  'מתחם 61, שרשרת חיול 0200',
  'מתחם 70, שרשרת חיול 0300',
  'מתחם 80, שרשרת חיול 0400',
]

export const stations = [
  'קצין מיון או״ם 0100',
  'קצין מיון תל השומר 0110',
  'קצין מיון באר שבע 0210',
  'קצין מיון חיפה 0320',
  'קצין מיון ירושלים 0410',
]

export const owners = ['ליה לנד', 'נועה כהן', 'אבירן שלמה', 'דוד לוי', 'מאיה פרץ']

export const reasonOptions = [
  'ראיון קצין מיון',
  'הקפאת מג״ב',
  'הקפאת פינוי מחנה 80',
  'הקפאת ר׳ תחום פרט ומעקב',
  'אפסנאי 596846',
  'הקפאת טירי גלאט',
  'ראיון קצין מיון סדיר',
  'עוד דוגמא כדי שיהיה 2 שורות',
  'הקפאת מיון רפואי',
  'זימון חוזר',
]

export const forecastOptions = ['מרוצה ויתפנה', 'לא מרוצה ויתפנה', 'סרבן מג״ב', 'מסרב להתפנות', 'מתלבט', 'לא ידוע']

export const cohortOptions = [
  'ינואר 2024',
  'פברואר 2024',
  'מרץ 2024',
  'אפריל 2024',
  'מאי 2024',
  'יוני 2024',
  'יולי 2024',
  'אוגוסט 2024',
  'נובמבר 2024',
  'מרץ 2025',
  'אוגוסט 2025',
  'נובמבר 2025',
]

export const anchorTitles = ['גולני', 'גבעתי', 'צנחנים', 'כפיר', 'הנדסה קרבית', 'שריון', 'תותחנים']

export const placementTypes = ['שוחררים', 'מתגייסים', 'ממתינים לשיבוץ', 'חוזרים משירות']

/** Tabs shown at a station — the order is set from the "סדר לשוניות תחנה" popup. */
export const defaultTabOrder = [
  'תלונות',
  'סמכות',
  'היעדרות',
  'כליאה',
  'קורסים',
  'חוו״ד פוקד',
  'וועדות',
  'מקצוע צבאי',
  'כתובת',
  'השכלה',
  'טלפונים',
  'מועמדויות',
  'קליטה',
  'סיפוחים',
  'שאלונים',
  'תחנות ומשימות',
  'פרופיל',
  'סיווג בטחוני',
  'פעילויות',
  'נתוני הצבה',
  'הקצאה ארגונית',
]

export interface CatalogTarget {
  code: string
  name: string
  profession: string
  professionCode: string
  /** How many stabilized recruits currently sit on this target. */
  stabilized: number
}

export const targetCatalog: CatalogTarget[] = [
  { code: '12345678', name: 'מרפאת שיניים מרכזית', profession: 'שיננית', professionCode: '454', stabilized: 26 },
  { code: '12345690', name: 'מרפאת שיניים צפון', profession: 'שיננית', professionCode: '454', stabilized: 14 },
  { code: '2384395', name: 'סל תקשוב בהד 7 (מחשוב)', profession: 'תקשוב', professionCode: '49672', stabilized: 31 },
  { code: '3301744', name: 'רכז שירות ישיר', profession: 'שירות לקוחות', professionCode: '82463', stabilized: 12 },
  { code: '3302190', name: 'משק מילואים', profession: 'מילואים', professionCode: '532', stabilized: 18 },
  { code: '4410288', name: 'חובש קדמי', profession: 'רפואה', professionCode: '7346', stabilized: 22 },
  { code: '5512006', name: 'מש״ק/ית לוגיסטיקה - חל״ג', profession: 'לוגיסטיקה', professionCode: '776', stabilized: 20 },
  { code: '5512140', name: 'רכז גיוס ושיבוץ - ז״י', profession: 'כוח אדם', professionCode: '34859', stabilized: 17 },
  { code: '6620031', name: 'מפתח/ת תוכנה - ממר״ם', profession: 'פיתוח תוכנה', professionCode: '1234', stabilized: 9 },
  { code: '6620077', name: 'ארכיטקט/ית ענן', profession: 'תפקידי מקצועות התקשוב', professionCode: '1234', stabilized: 6 },
  { code: '7730412', name: 'מנהל/ת מוצר דיגיטלי', profession: 'ניהול מוצר', professionCode: '2210', stabilized: 8 },
  { code: '7730590', name: 'אנליסט/ית נתונים', profession: 'ניתוח נתונים', professionCode: '2215', stabilized: 11 },
  { code: '8840011', name: 'פקיד/ת משאבי אנוש', profession: 'משאבי אנוש', professionCode: '311', stabilized: 15 },
  { code: '8840033', name: 'עובד כללי - חטיבת המבצעים', profession: 'מנהלה', professionCode: '28923', stabilized: 20 },
  { code: '9950204', name: 'יעודי לקצונה - משא״ן', profession: 'קצונה', professionCode: '755', stabilized: 20 },
]

export function findTarget(code: string | null | undefined): CatalogTarget | undefined {
  return code ? targetCatalog.find((t) => t.code === code) : undefined
}

export const targetLabel = (t: CatalogTarget) => `${t.code} - ${t.name}`

// ---------- Model ----------

export interface AnchorDate {
  id: string
  title: string
  /** ISO yyyy-mm-dd */
  from: string
  to: string
}

/** A target a main target's recruits can be placed into (step "יעדים לשיבוץ"). */
export interface SubTarget {
  id: string
  targetCode: string
  quantity: number | null
  // Who can be placed here: all conditions must hold (e.g. דפ״ר ≥ 50 and פרופיל = 97).
  conditions: Condition[]
  notes: string
}

/** One placement condition on a recruit field: field, operator and value. */
export interface Condition {
  id: string
  field: string
  op: ConditionOp | ''
  value: string
}

export type ConditionOp = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte'

export interface ConditionField {
  key: string
  label: string
  // Numbers can be compared; a list of options can only be equal / not equal, unless its
  // options are in order (פרופיל 64 ומעלה).
  options?: string[]
  ordered?: boolean
}

export const conditionFields: ConditionField[] = [
  { key: 'dapar', label: 'דפ״ר' },
  { key: 'profile', label: 'פרופיל', options: ['21', '24', '45', '64', '72', '82', '97'], ordered: true },
  { key: 'kaba', label: 'קב״א' },
  { key: 'tzadach', label: 'צד״כ' },
  { key: 'attention', label: 'קשב מתמשך' },
  { key: 'education', label: 'השכלה', options: ['12 שנות לימוד', 'בגרות מלאה', 'הנדסאי', 'תואר ראשון'] },
]

// Long labels for choosing; short ones for reading a condition back in a table.
export const conditionOps: { key: ConditionOp; label: string; short: string; symbol: string }[] = [
  { key: 'eq', label: 'שווה ל', short: 'שווה', symbol: '=' },
  { key: 'ne', label: 'שונה מ', short: 'שונה מ', symbol: '≠' },
  { key: 'gt', label: 'גדול מ', short: 'מעל', symbol: '>' },
  { key: 'gte', label: 'גדול או שווה ל', short: 'לפחות', symbol: '≥' },
  { key: 'lt', label: 'קטן מ', short: 'מתחת ל', symbol: '<' },
  { key: 'lte', label: 'קטן או שווה ל', short: 'עד', symbol: '≤' },
]

export const findField = (key: string) => conditionFields.find((f) => f.key === key)
export const opsFor = (field: string) => {
  const f = findField(field)
  return f?.options && !f.ordered ? conditionOps.filter((o) => o.key === 'eq' || o.key === 'ne') : conditionOps
}
export const conditionComplete = (c: Condition) => !!c.field && !!c.op && !!c.value.trim()
export const conditionText = (c: Condition) =>
  `${findField(c.field)?.label ?? c.field} ${conditionOps.find((o) => o.key === c.op)?.short ?? ''} ${c.value}`

export interface MainTarget {
  id: string
  targetCode: string
  placementType: string
  evacTarget: string
  notes: string
  subTargets: SubTarget[]
}

export interface Basket {
  id: string
  name: string
  plans: number | null
  arrivalPct: number | null
  evacPct: number | null
  /** Free-text note on the whole basket. */
  notes: string
  targets: MainTarget[]
}

/** "יתר המיוצבים" — stabilized recruits outside the baskets, per target. */
/** A general note / guideline on the directive: a short title and free text. */
export interface Guideline {
  id: string
  title: string
  text: string
}

export interface Directive {
  id: string
  /** Free-text name, shown on the directives page. */
  name: string
  district: string
  station: string
  owner: string
  /** ISO yyyy-mm-dd — the directive's execution date. */
  date: string
  reasons: string[]
  forecasts: string[]
  cohorts: string[]
  anchors: AnchorDate[]
  tabOrder: string[]
  baskets: Basket[]
  /** יתר מיוצבים — main targets outside the baskets, with their placement targets. */
  rest: MainTarget[]
  /** הערות והנחיות — set on the first wizard step, shown again on the summary. */
  guidelines: Guideline[]
  draft: boolean
  createdBy: string
  /** ISO yyyy-mm-dd */
  updatedAt: string
}

export type DirectiveStatus = 'draft' | 'scheduled' | 'active' | 'done'

export const directiveStatusLabel: Record<DirectiveStatus, string> = {
  draft: 'טיוטה',
  scheduled: 'מתוכננת',
  active: 'פעילה היום',
  done: 'הסתיימה',
}

export function directiveStatus(d: Directive): DirectiveStatus {
  if (d.draft) return 'draft'
  if (d.date > TODAY) return 'scheduled'
  if (d.date === TODAY) return 'active'
  return 'done'
}

export const isPast = (d: Directive) => !d.draft && d.date < TODAY

// ---------- Derived numbers ----------

export function basketStats(b: Basket) {
  const plans = Number(b.plans) || 0
  const arrival = Math.round((plans * (Number(b.arrivalPct) || 0)) / 100)
  const evac = Math.round((arrival * (Number(b.evacPct) || 0)) / 100)
  const stabilized = b.targets.reduce((s, t) => s + (findTarget(t.targetCode)?.stabilized ?? 0), 0)
  return { plans, arrival, evac, stabilized, targets: b.targets.length }
}

/** A "יתר מיוצבים" target is complete when it and all its placement targets have the required fields. */
export function restTargetValid(t: MainTarget) {
  return (
    !!t.targetCode &&
    !!t.placementType &&
    !!t.evacTarget.trim() &&
    t.subTargets.every(
      (s) => !!s.targetCode && hasNum(s.quantity) && s.conditions.every(conditionComplete) && !!s.notes.trim(),
    )
  )
}

export function directiveTotals(d: Directive) {
  const baskets = d.baskets.length
  const targets = d.baskets.reduce((s, b) => s + b.targets.length, 0)
  const plans = d.baskets.reduce((s, b) => s + (Number(b.plans) || 0), 0)
  return { baskets, targets, plans }
}

// ---------- Formatting ----------

export function fmtDate(iso: string, sep = '.') {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}${sep}${m}${sep}${y}`
}

export const fmtRange = (a: AnchorDate) =>
  a.from || a.to ? `${fmtDate(a.from)} - ${fmtDate(a.to)}` : ''

// ---------- Factories ----------

let seq = 0
export const uid = (p = 'x') => `${p}${Date.now().toString(36)}${(seq++).toString(36)}`

export const newSubTarget = (): SubTarget => ({
  id: uid('s'),
  targetCode: '',
  quantity: null,
  conditions: [],
  notes: '',
})

export const newCondition = (): Condition => ({ id: uid('c'), field: '', op: '', value: '' })

export const newMainTarget = (): MainTarget => ({
  id: uid('t'),
  targetCode: '',
  placementType: '',
  evacTarget: '',
  notes: '',
  subTargets: [],
})

export const newBasket = (): Basket => ({
  id: uid('b'),
  name: '',
  plans: null,
  arrivalPct: null,
  evacPct: null,
  notes: '',
  targets: [newMainTarget()],
})

export const newAnchor = (): AnchorDate => ({ id: uid('a'), title: '', from: '', to: '' })

export function emptyDirective(): Directive {
  return {
    id: '',
    name: '',
    district: '',
    station: '',
    owner: '',
    date: '',
    reasons: [],
    forecasts: [],
    cohorts: [],
    anchors: [],
    tabOrder: [...defaultTabOrder],
    baskets: [],
    rest: [],
    guidelines: [],
    draft: true,
    createdBy: 'ליה לנד',
    updatedAt: TODAY,
  }
}

export const cloneDirective = (d: Directive): Directive => JSON.parse(JSON.stringify(d))

// ---------- Seed ----------

const sub = (targetCode: string, quantity: number, conditions: Condition[], notes: string): SubTarget => ({
  id: uid('s'),
  targetCode,
  quantity,
  conditions,
  notes,
})
const cond = (field: string, op: ConditionOp, value: string): Condition => ({ id: uid('c'), field, op, value })

const main = (targetCode: string, evacTarget: string, notes: string, subs: SubTarget[], placementType = 'שוחררים'): MainTarget => ({
  id: uid('t'),
  targetCode,
  placementType,
  evacTarget,
  notes,
  subTargets: subs,
})

const basket = (
  name: string,
  plans: number,
  arrivalPct: number,
  evacPct: number,
  targets: MainTarget[],
  notes = '',
): Basket => ({
  id: uid('b'),
  name,
  plans,
  arrivalPct,
  evacPct,
  notes,
  targets,
})

const lorem =
  'לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית קולורס מונפרד אדנדום סילקוף, מרגשי ומרגשח. עמחליף מוסן מנת.'

function seed(): Directive[] {
  const dental = () =>
    basket('בה״ד 20 הסל הראשון שלי', 154, 80, 80, [
      main('12345678', 'יעד פינוי', 'הערות יעד ראשי, הערה ארוכה רק התחלה ובטולטיפ הערה מלאה של היעד הראשי.', [
        sub('3301744', 5, [cond('kaba', 'lte', '49')], 'ללא התש'),
        sub('3302190', 5, [cond('attention', 'gte', '2')], 'כאן יש ממש הרבה טקסט בהערות מלא מה להעיר'),
        sub('2384395', 5, [cond('kaba', 'lte', '49')], 'ללא התש'),
        sub('4410288', 5, [cond('kaba', 'lte', '49')], 'ללא התש'),
      ]),
      main('12345690', 'יעד פינוי', 'יעד משני למרפאות הצפון.', [
        sub('3301744', 3, [cond('kaba', 'lte', '49')], ''),
        sub('4410288', 6, [cond('dapar', 'gte', '50'), cond('profile', 'eq', '97')], 'ירידה במאסף קרה״ד'),
      ]),
    ], 'סל מועדף למרפאות השיניים. לתאם עם קצין הרפואה לפני השיבוץ.')

  const restRows = () => [
    main('9950204', 'יעד פינוי', 'עדיפות להנג״א, לא לשכוח למלא טופס 16 א׳', [
      sub('8840011', 4, [cond('dapar', 'gte', '50'), cond('profile', 'eq', '97')], 'עדיפות לבוגרי מכינה'),
      sub('5512140', 3, [cond('kaba', 'lte', '49')], 'ללא התש'),
    ]),
    main('8840033', 'יעד פינוי', 'עדיפות להנג״א', [sub('5512006', 6, [cond('kaba', 'lte', '49')], 'ללא התש')]),
    main('5512006', 'שוחרר', '', [sub('8840011', 2, [cond('dapar', 'gte', '40')], 'ירידה במאסף')]),
  ]

  // Only some seeded directives carry guidelines; the rest start with none.
  const guidelines: Record<string, Guideline[]> = {
    '1042': [
      {
        id: uid('g'),
        title: 'הנחיות ליום הגיוס',
        text: 'הגעה לתחנה עד 07:30. יש לוודא שכל המלש״בים בסל הראשון עברו ראיון קצין מיון לפני השיבוץ.\nמלש״ב ללא אישור רפואי בתוקף לא ישובץ ביום זה.',
      },
      {
        id: uid('g'),
        title: 'דגשים לשיבוץ',
        text: 'עדיפות לשיבוץ יעדי הנג״א. יש להשאיר 10% מהתוכניות פנויות להשלמות אחרי יום הגיוס.',
      },
    ],
    '1045': [
      {
        id: uid('g'),
        title: 'תיאום מול המדור',
        text: 'לפני פרסום יש לקבל אישור מדור תכנון על מכסות הסל השני.',
      },
    ],
  }
  const withGuidelines = (list: Omit<Directive, 'guidelines'>[]): Directive[] =>
    list.map((d) => ({ ...d, guidelines: guidelines[d.id] ?? [] }))

  return withGuidelines([
    {
      id: '1042',
      name: 'שיבוץ בה״ד 20 ומרפאות שיניים',
      district: 'מתחם 60, שרשרת חיול 0100',
      station: 'קצין מיון או״ם 0100',
      owner: 'ליה לנד',
      date: '2025-04-10',
      reasons: ['ראיון קצין מיון', 'הקפאת מג״ב', 'הקפאת פינוי מחנה 80', 'אפסנאי 596846'],
      forecasts: ['מרוצה ויתפנה', 'לא מרוצה ויתפנה', 'סרבן מג״ב'],
      cohorts: ['ינואר 2024', 'פברואר 2024', 'מרץ 2024'],
      anchors: [{ id: uid('a'), title: 'גולני', from: '2025-04-10', to: '2025-05-13' }],
      tabOrder: [...defaultTabOrder],
      baskets: [
        dental(),
        basket('אדמיניסטרציה, משאבי אנוש ותפעול שוטף', 120, 75, 85, [
          main('8840011', 'מנהלה', 'עדיפות לבעלי ניסיון קודם.', [sub('8840033', 4, [cond('kaba', 'gte', '45')], '')]),
          main('5512140', 'כוח אדם', '', []),
        ]),
        basket('משרות פיתוח תוכנה וארכיטקטורת ענן', 60, 90, 70, [
          main('6620031', 'ממר״ם', 'מיון ממוחשב בלבד.', [sub('2384395', 5, [cond('attention', 'gte', '2')], 'ירידה במאסף קרה״ד')]),
          main('6620077', 'ממר״ם', '', [sub('2384395', 2, [cond('attention', 'gte', '2')], '')]),
        ]),
      ],
      rest: restRows(),
      draft: false,
      createdBy: 'ליה לנד',
      updatedAt: '2025-04-02',
    },
    {
      id: '1045',
      name: 'ניהול מוצר ומכירות - מאי',
      district: 'מתחם 61, שרשרת חיול 0200',
      station: 'קצין מיון באר שבע 0210',
      owner: 'נועה כהן',
      date: '2025-05-04',
      reasons: ['ראיון קצין מיון סדיר', 'הקפאת מיון רפואי'],
      forecasts: ['מרוצה ויתפנה', 'מתלבט'],
      cohorts: ['מרץ 2025'],
      anchors: [
        { id: uid('a'), title: 'גבעתי', from: '2025-05-04', to: '2025-05-20' },
        { id: uid('a'), title: 'הנדסה קרבית', from: '2025-05-11', to: '2025-06-01' },
      ],
      tabOrder: [...defaultTabOrder],
      baskets: [
        basket('ניהול מוצר, אסטרטגיה וניתוח נתונים', 80, 85, 75, [
          main('7730412', 'יעד פינוי', 'לשבץ רק בעלי תואר ראשון.', [sub('7730590', 4, [cond('dapar', 'gte', '60'), cond('education', 'eq', 'תואר ראשון')], '')]),
          main('7730590', 'יעד פינוי', '', []),
        ]),
        basket('מכירות שטח, פיתוח עסקי וניהול לקוחות', 45, 70, 80, [
          main('3301744', 'שירות', '', [sub('3302190', 3, [cond('kaba', 'lte', '49')], '')]),
        ]),
      ],
      rest: restRows().slice(0, 2),
      draft: false,
      createdBy: 'נועה כהן',
      updatedAt: '2025-03-28',
    },
    {
      id: '1047',
      name: 'תקשוב חיפה - יוני',
      district: 'מתחם 70, שרשרת חיול 0300',
      station: 'קצין מיון חיפה 0320',
      owner: 'דוד לוי',
      date: '2025-06-15',
      reasons: ['ראיון קצין מיון'],
      forecasts: ['לא ידוע'],
      cohorts: ['אוגוסט 2025'],
      anchors: [],
      tabOrder: [...defaultTabOrder],
      baskets: [
        basket('תקשוב', 40, 80, 0, [main('2384395', '', '', [])]),
      ],
      rest: [],
      draft: true,
      createdBy: 'דוד לוי',
      updatedAt: '2025-04-06',
    },
    {
      id: '1038',
      name: 'סבב דצמבר או״ם',
      district: 'מתחם 60, שרשרת חיול 0100',
      station: 'קצין מיון או״ם 0100',
      owner: 'ליה לנד',
      date: '2024-12-10',
      reasons: ['ראיון קצין מיון', 'הקפאת מג״ב', 'הקפאת טירי גלאט'],
      forecasts: ['מרוצה ויתפנה', 'מסרב להתפנות'],
      cohorts: ['אוגוסט 2024', 'נובמבר 2024'],
      anchors: [{ id: uid('a'), title: 'צנחנים', from: '2024-12-10', to: '2025-01-05' }],
      tabOrder: [...defaultTabOrder],
      baskets: [dental()],
      rest: restRows(),
      draft: false,
      createdBy: 'ליה לנד',
      updatedAt: '2024-12-01',
    },
    {
      id: '1031',
      name: 'קרבי ומשא״ן ירושלים',
      district: 'מתחם 80, שרשרת חיול 0400',
      station: 'קצין מיון ירושלים 0410',
      owner: 'מאיה פרץ',
      date: '2024-08-21',
      reasons: ['ראיון קצין מיון סדיר', 'זימון חוזר'],
      forecasts: ['לא מרוצה ויתפנה'],
      cohorts: ['מאי 2024', 'יוני 2024'],
      anchors: [{ id: uid('a'), title: 'כפיר', from: '2024-08-21', to: '2024-09-15' }],
      tabOrder: [...defaultTabOrder],
      baskets: [
        basket('קרבי', 210, 85, 90, [
          main('4410288', 'יעד פינוי', 'חובשים לגדודים.', [sub('4410288', 10, [cond('dapar', 'gte', '50'), cond('profile', 'eq', '97')], '')]),
        ]),
        basket('משאבי אנוש', 70, 80, 80, [main('8840011', '', '', [sub('5512140', 4, [cond('kaba', 'gte', '45')], '')])]),
      ],
      rest: restRows().slice(1),
      draft: false,
      createdBy: 'מאיה פרץ',
      updatedAt: '2024-08-14',
    },
    {
      id: '1027',
      name: 'סבב מרץ תל השומר',
      district: 'מתחם 61, שרשרת חיול 0200',
      station: 'קצין מיון תל השומר 0110',
      owner: 'אבירן שלמה',
      date: '2024-03-17',
      reasons: ['הקפאת פינוי מחנה 80'],
      forecasts: ['סרבן מג״ב'],
      cohorts: ['ינואר 2024'],
      anchors: [],
      tabOrder: [...defaultTabOrder],
      baskets: [basket('בה״ד 20', 130, 80, 80, [main('12345678', 'יעד פינוי', '', [sub('3301744', 5, [cond('kaba', 'lte', '49')], '')])])],
      rest: [],
      draft: false,
      createdBy: 'אבירן שלמה',
      updatedAt: '2024-03-10',
    },
  ])
}

// ---------- Store ----------

export const directivesState = reactive<{ list: Directive[] }>({ list: seed() })

export const getDirective = (id: string) => directivesState.list.find((d) => d.id === id)

/** Inserts a new directive or replaces an existing one (by id). Returns the saved id. */
export function saveDirective(d: Directive): string {
  const copy = cloneDirective(d)
  copy.updatedAt = TODAY
  if (!copy.id) {
    const max = Math.max(1000, ...directivesState.list.map((x) => Number(x.id) || 0))
    copy.id = String(max + 1)
  }
  const i = directivesState.list.findIndex((x) => x.id === copy.id)
  if (i >= 0) directivesState.list.splice(i, 1, copy)
  else directivesState.list.unshift(copy)
  return copy.id
}

/** v-model.number yields '' for an emptied field, so "is filled" must check the type. */
export const hasNum = (v: unknown): v is number => typeof v === 'number' && !Number.isNaN(v)
