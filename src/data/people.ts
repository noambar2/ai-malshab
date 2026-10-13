// A small directory of malshabim for the home-page search. The mockup has a single full
// profile (src/data/mock.ts), so every result opens that profile page.
import { malshab } from './mock'

export interface Person {
  idNumber: string
  personalNumber: string
  fullName: string
  office: string
  profile: string
  status: string
}

export const people: Person[] = [
  { idNumber: malshab.idNumber, personalNumber: malshab.personalNumber, fullName: malshab.fullName, office: 'טבריה', profile: '97', status: 'שיחת אזהרה' },
  { idNumber: '214567890', personalNumber: '96112045', fullName: 'בר כהן', office: 'תל השומר', profile: '82', status: 'הכרזת צו 12' },
  { idNumber: '318245671', personalNumber: '96230118', fullName: 'דניאל לוי', office: 'תל השומר', profile: '97', status: 'גיוס רגיל' },
  { idNumber: '207731542', personalNumber: '95877310', fullName: 'גליה לוין', office: 'באר שבע', profile: '72', status: 'בירור כתובת' },
  { idNumber: '322190876', personalNumber: '96401552', fullName: 'שלום מלכה', office: 'מחווה אלון', profile: '97', status: 'גיוס רגיל' },
  { idNumber: '209415338', personalNumber: '95790461', fullName: 'יקיר הדר', office: 'טבריה', profile: '64', status: 'לפני הכרזה' },
  { idNumber: '315678902', personalNumber: '96055873', fullName: 'שירן פרץ', office: 'באר שבע', profile: '82', status: 'אחרי הכרזה' },
  { idNumber: '204889127', personalNumber: '95612398', fullName: 'אברהם כהן', office: 'תל השומר', profile: '97', status: 'משתמט' },
  { idNumber: '327004561', personalNumber: '96518820', fullName: 'נועה אברהם', office: 'חיפה', profile: '97', status: 'גיוס רגיל' },
  { idNumber: '211356790', personalNumber: '95933107', fullName: 'אלי בלום', office: 'ירושלים', profile: '45', status: 'צו 12' },
]

export function searchPeople(q: string, limit = 6): Person[] {
  const t = q.trim()
  if (!t) return []
  return people
    .filter((p) => p.idNumber.startsWith(t) || p.personalNumber.startsWith(t) || p.fullName.includes(t))
    .slice(0, limit)
}

export const findPerson = (idNumber: string) => people.find((p) => p.idNumber === idNumber)
