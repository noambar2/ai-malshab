// Mock data for the draft-dodgers ("משתמטים וצו 12") area.
import { reactive } from 'vue'

export type TaskStatus = 'new' | 'returned' | 'overdue'

export const taskStatusLabel: Record<TaskStatus, string> = {
  new: 'חדש',
  returned: 'הוחזר לתיקון',
  overdue: 'מעל 48 שעות',
}

export interface DodgerTask {
  id: string
  candidateId: string
  fullName: string
  idNumber: string
  gender: 'זכר' | 'נקבה'
  subTypeCode: string
  subType: string
  statusReasonCode: string
  statusReason: string
  declarationType: 'צו 12' | 'השתמטות'
  status: TaskStatus
  // Who currently holds the task, when it isn't mine.
  handler?: string
}

const base = [
  { candidateId: '167238237', fullName: 'בר כהן', gender: 'נקבה', statusReasonCode: '01', statusReason: 'רגיל', declarationType: 'צו 12' },
  { candidateId: '347280392', fullName: 'דניאל לוי', gender: 'זכר', statusReasonCode: '01', statusReason: 'רגיל', declarationType: 'השתמטות' },
  { candidateId: '398438404', fullName: 'גליה לוין', gender: 'נקבה', statusReasonCode: '21', statusReason: 'בירור כתובת לפני פ״מ', declarationType: 'השתמטות' },
  { candidateId: '927372903', fullName: 'לילך בן', gender: 'נקבה', statusReasonCode: '22', statusReason: 'התראה לפני פ״מ', declarationType: 'צו 12' },
  { candidateId: '927372904', fullName: 'רוני דוד', gender: 'נקבה', statusReasonCode: '31', statusReason: 'משתמט ללא פ״מ', declarationType: 'השתמטות' },
  { candidateId: '927372905', fullName: 'אלי בלום', gender: 'זכר', statusReasonCode: '33', statusReason: 'צו 12', declarationType: 'צו 12' },
] as const

const myStatuses: TaskStatus[] = ['returned', 'new', 'overdue', 'new', 'new', 'new']
const handlers = ['ישראל ישראלי', 'ישראל ישראלי', 'תומר ציון', 'תומר ציון', 'ישראל ישראלי', 'ישראל ישראלי']

function make(prefix: string, i: number, b: (typeof base)[number]): DodgerTask {
  return {
    ...b,
    id: `${prefix}${i + 1}`,
    idNumber: '214567890',
    subTypeCode: '02',
    subType: 'חוסר שת״פ',
    status: myStatuses[i]!,
  }
}

export const dodgersState = reactive({
  mine: base.map((b, i) => make('m', i, b)),
  others: base.map((b, i) => ({ ...make('o', i, b), handler: handlers[i] })),
})

export function findTask(id: string) {
  return dodgersState.mine.find((t) => t.id === id) ?? dodgersState.others.find((t) => t.id === id)
}

// Move a task from someone else's queue into mine.
export function pullTask(id: string) {
  const i = dodgersState.others.findIndex((t) => t.id === id)
  if (i === -1) return
  const [task] = dodgersState.others.splice(i, 1)
  dodgersState.mine.unshift({ ...task!, handler: undefined, status: 'new' })
}

export const dodgersKpis = {
  dialerApprovedPct: 22,
  mine: 13,
  newTasks: 10,
  returned: 3,
  withMashak: 21,
  withRamad: 17,
  declaredDodgers: 6,
  declaredTzav12: 3,
  completed: 41,
  completedOf: 54,
  completedSinceYesterday: 12,
}

// True when the task currently sits in my queue (also after pulling it from someone else).
export function isMyTask(id: string) {
  return dodgersState.mine.some((t) => t.id === id)
}
