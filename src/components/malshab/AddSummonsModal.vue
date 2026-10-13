<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import alertImg from '@/assets/img/alert.gif'
import stationeryImg from '@/assets/img/stationery.gif'
import sentMailImg from '@/assets/img/sent-mail.gif'
import {
  malshab,
  sortingOptions,
  summonsState,
  timeSlots,
  type SortingOption,
} from '@/data/mock'

const emit = defineEmits<{ close: [] }>()

type Step = 'choose' | 'blockingAlert' | 'schedule' | 'summary' | 'done'
const step = ref<Step>('choose')
const stepIndex = computed(() =>
  step.value === 'schedule' ? 1 : step.value === 'summary' ? 2 : 0,
)

// --- Step 1: choose sorting ---
const query = ref('')
const option = ref<SortingOption | null>(null)
const options = computed(() => {
  const q = query.value.trim()
  return q ? sortingOptions.filter((o) => o.name.includes(q) || o.code.includes(q)) : sortingOptions
})

function choose(o: SortingOption) {
  option.value = o
  step.value = o.blocking ? 'blockingAlert' : 'schedule'
}

// --- Step 2: date & time ---
const WEEKDAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
const MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
const today = new Date(2024, 3, 7)
const viewMonth = ref(new Date(2024, 3, 1))
const selectedDate = ref<Date | null>(new Date(2024, 3, 10))
const selectedSlot = ref<string | null>(null)
const requestOnly = ref(false)
const showPast = ref(false)

// Days with no free slots, so the calendar looks realistic.
const fullDays = new Set([9, 11, 15, 18, 19])

const calendarDays = computed(() => {
  const y = viewMonth.value.getFullYear()
  const m = viewMonth.value.getMonth()
  const start = new Date(y, m, 1 - new Date(y, m, 1).getDay())
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    const inMonth = d.getMonth() === m
    const past = d < today
    const full = inMonth && fullDays.has(d.getDate()) && m === 3
    return {
      date: d,
      inMonth,
      isToday: sameDay(d, today),
      disabled: !inMonth || full || (past && !showPast.value),
    }
  })
})

function sameDay(a: Date | null, b: Date | null) {
  return !!a && !!b && a.toDateString() === b.toDateString()
}

function fmt(d: Date) {
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}

function shiftMonth(delta: number) {
  const d = viewMonth.value
  viewMonth.value = new Date(d.getFullYear(), d.getMonth() + delta, 1)
}

function pickDate(d: Date) {
  selectedDate.value = d
  selectedSlot.value = null
  requestOnly.value = false
}

function pickSlot(s: string) {
  selectedSlot.value = s
  requestOnly.value = false
}

function pickRequest() {
  requestOnly.value = true
  selectedSlot.value = null
}

const slotStart = computed(() => selectedSlot.value?.split(' - ')[0] ?? '')
const canContinueSchedule = computed(
  () => requestOnly.value || (!!selectedDate.value && !!selectedSlot.value),
)

// --- Step 3: summary ---
const address = ref(malshab.mailingAddresses[0]!)
const note = ref('')
const kindLabel = computed(() => `מיון ${option.value?.kind ?? ''}`)

function submit() {
  if (!option.value) return
  summonsState.list.unshift({
    date: requestOnly.value || !selectedDate.value ? '-' : fmt(selectedDate.value),
    type: option.value.kind,
    name: option.value.name,
    topic: option.value.shortName,
    status: requestOnly.value ? 'required' : 'open',
    statusReason: requestOnly.value ? 'דרישה לזימון' : 'פתוח',
    closeReason: '-',
  })
  if (option.value.blocking) summonsState.hasBlocking = true
  step.value = 'done'
}

function back() {
  if (step.value === 'blockingAlert' || step.value === 'schedule') step.value = 'choose'
  else if (step.value === 'summary') step.value = 'schedule'
}

const cleanAddress = computed(() => address.value.replace(/^עיקרית - /, '').replace(/\.$/, ''))
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="modal" role="dialog" aria-modal="true">
      <button class="close" aria-label="סגירה" @click="emit('close')">
        <AppIcon name="close" :size="16" />
      </button>

      <ol v-if="step !== 'done'" class="steps">
        <li
          v-for="i in 3"
          :key="i"
          :class="{ done: i - 1 < stepIndex, current: i - 1 === stepIndex }"
        >
          <span class="dot"><AppIcon v-if="i - 1 < stepIndex" name="check" :size="12" /></span>
        </li>
      </ol>

      <!-- Step 1: choose -->
      <template v-if="step === 'choose'">
        <h2>הוספת זימון חדש</h2>
        <p class="sub">בחר מיון מהרשימה אליו תרצה לזמן את המלש״ב {{ malshab.fullName }}.</p>
        <div class="toolbar">
          <label class="search">
            <AppIcon name="search" :size="18" />
            <input v-model="query" placeholder="חיפוש כללי" />
          </label>
          <button class="icon-btn"><AppIcon name="filter" :size="18" /></button>
        </div>
        <div class="table-wrap options">
          <table class="table">
            <thead>
              <tr>
                <th>מזהה זימון</th>
                <th>שם זימון</th>
                <th>סוג מיון</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in options" :key="o.code">
                <td>{{ o.code }}</td>
                <td class="strong">{{ o.name }}</td>
                <td>{{ o.kind }}</td>
                <td>
                  <button class="btn btn-soft choose" @click="choose(o)">
                    בחירה
                    <AppIcon name="arrow-left" :size="16" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- Blocking warning -->
      <template v-else-if="step === 'blockingAlert'">
        <div class="center-msg">
          <img :src="alertImg" alt="" width="50" height="50" />
          <p>שימו לב, בחירת מיון {{ option?.name }} עבור {{ malshab.fullName }} -</p>
          <p class="bold">תחסום אוטומטית את האפשרות לזמן אותו/ה למיונים נוספים.</p>
          <p class="gap">האם להמשיך?</p>
        </div>
        <div class="footer">
          <button class="btn btn-primary" @click="step = 'schedule'">המשך לשלב הבא</button>
          <button class="btn btn-soft" @click="back">חזרה אחורה</button>
        </div>
      </template>

      <!-- Step 2: schedule -->
      <template v-else-if="step === 'schedule'">
        <div class="title-row">
          <div>
            <h2>הוספת זימון חדש - {{ option?.name }}</h2>
            <p class="sub">בחר תאריך ושעה</p>
          </div>
          <label class="toggle">
            <input v-model="showPast" type="checkbox" />
            <span class="track" />
            הצג תאריכי עבר
          </label>
        </div>

        <div class="schedule">
          <div class="calendar">
            <div class="cal-head">
              <button aria-label="חודש קודם" @click="shiftMonth(-1)">
                <AppIcon name="chevron-right" :size="22" />
              </button>
              <span>{{ MONTHS[viewMonth.getMonth()] }} {{ viewMonth.getFullYear() }}</span>
              <button aria-label="חודש הבא" @click="shiftMonth(1)">
                <AppIcon name="chevron-left" :size="22" />
              </button>
            </div>
            <div class="cal-grid">
              <span v-for="w in WEEKDAYS" :key="w" class="wd">{{ w }}</span>
              <button
                v-for="d in calendarDays"
                :key="d.date.toISOString()"
                class="day"
                :class="{
                  today: d.isToday,
                  selected: sameDay(d.date, selectedDate),
                }"
                :disabled="d.disabled"
                @click="pickDate(d.date)"
              >
                {{ d.date.getDate() }}
              </button>
            </div>
          </div>

          <div class="slots-col">
            <p class="slots-title">
              <template v-if="selectedDate"><b>{{ fmt(selectedDate) }}</b> - שעות פנויות:</template>
              <template v-else>בחר תאריך כדי לראות שעות פנויות</template>
            </p>
            <div class="slots">
              <button
                v-for="s in timeSlots"
                :key="s"
                class="slot"
                :class="{ selected: selectedSlot === s }"
                :disabled="!selectedDate"
                @click="pickSlot(s)"
              >
                {{ s }}
              </button>
            </div>
            <div class="or"><span>או</span></div>
            <button class="slot request" :class="{ selected: requestOnly }" @click="pickRequest">
              דרישה לזימון
            </button>
          </div>
        </div>

        <div class="footer">
          <button class="btn btn-primary" :disabled="!canContinueSchedule" @click="step = 'summary'">
            המשך לשלב הבא
          </button>
          <button class="btn btn-soft" @click="back">חזרה אחורה</button>
        </div>
      </template>

      <!-- Step 3: summary -->
      <template v-else-if="step === 'summary'">
        <h2>הוספת זימון חדש - {{ option?.name }}</h2>
        <p class="sub">סיכום זימון לפני שליחה</p>

        <div class="summary-box">
          <img :src="stationeryImg" alt="" width="100" height="100" />
          <div class="summary-col">
            <h4>פרטים מלאים</h4>
            <p class="strong">{{ kindLabel }} - {{ option?.name }}</p>
            <template v-if="requestOnly">
              <p class="strong">דרישה לזימון</p>
            </template>
            <template v-else>
              <p>תאריך <b>{{ selectedDate && fmt(selectedDate) }}</b></p>
              <p>שעה <b>{{ slotStart }}</b></p>
            </template>
          </div>
          <div class="summary-col">
            <h4>כתובת למשלוח</h4>
            <label v-for="a in malshab.mailingAddresses" :key="a" class="radio">
              <input v-model="address" type="radio" name="address" :value="a" />
              <span>{{ a }}</span>
            </label>
          </div>
        </div>

        <label class="note">
          <span>הוספת הערה</span>
          <input v-model="note" placeholder="הקלד/י הערה כאן..." />
        </label>

        <div class="footer">
          <button class="btn btn-primary" @click="submit">אישור ושליחה סופית</button>
          <button class="btn btn-soft" @click="back">חזרה אחורה</button>
        </div>
      </template>

      <!-- Done -->
      <template v-else>
        <div class="center-msg big">
          <img :src="sentMailImg" alt="" width="100" height="100" />
          <p>זימון ל{{ option?.name }} נוסף בהצלחה!</p>
          <p v-if="requestOnly">נשלחה דרישה לזימון</p>
          <p v-else>
            תאריך <b>{{ selectedDate && fmt(selectedDate) }}</b>, שעה <b>{{ slotStart }}</b>
          </p>
          <p>הזימון יישלח לכתובת {{ cleanAddress }}.</p>
        </div>
        <div class="footer">
          <button class="btn btn-soft" @click="emit('close')">סגירה</button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(7, 25, 56, 0.45);
}
.modal {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 956px;
  min-height: 535px;
  max-height: calc(100vh - 40px);
  overflow: auto;
  padding: 30px;
  background: #fff;
  border-radius: 10px;
  box-shadow: var(--shadow-popup);
}
.close {
  position: absolute;
  top: 10px;
  left: 10px;
  color: var(--c-muted);
}
.steps {
  list-style: none;
  display: flex;
  justify-content: center;
  padding: 0;
  margin-bottom: 10px;
}
.steps li {
  display: flex;
  align-items: center;
}
.steps li + li::before {
  content: '';
  width: 186px;
  height: 4px;
  margin: 0 20px;
  border-radius: 2px;
  background: var(--c-step-idle);
}
.steps li.done + li::before {
  background: var(--c-primary);
}
.dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--c-step-idle);
  color: #fff;
}
.done .dot,
.current .dot {
  background: var(--c-primary);
}
h2 {
  font-size: 18px;
  font-weight: 600;
}
.sub {
  margin-top: 10px;
  font-size: 14px;
  color: var(--c-text-2);
}
.toolbar {
  display: flex;
  gap: 10px;
  margin: 20px 0 12px;
}
.toolbar .search {
  width: 240px;
}
.options td {
  height: 46px;
}
.strong {
  font-weight: 700;
}
.choose {
  height: 30px;
  min-width: 92px;
}
.center-msg {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--c-text-2);
  text-align: center;
}
.center-msg img {
  margin-bottom: 10px;
}
.center-msg .bold {
  font-weight: 700;
}
.center-msg .gap {
  margin-top: 18px;
}
.center-msg.big {
  font-size: 16px;
  font-weight: 500;
  color: var(--c-text);
  gap: 10px;
}
.footer {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
  font-size: 14px;
  color: var(--c-text-2);
  cursor: pointer;
}
.toggle input {
  display: none;
}
.toggle .track {
  position: relative;
  width: 34px;
  height: 20px;
  border-radius: 10px;
  background: #c9d6ff;
  transition: background 0.15s;
}
.toggle .track::after {
  content: '';
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: right 0.15s;
}
.toggle input:checked + .track {
  background: var(--c-primary);
}
.toggle input:checked + .track::after {
  right: 16px;
}
.schedule {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 20px;
  margin-top: 16px;
}
.calendar {
  border: 1px solid var(--c-border);
  border-radius: 6px;
  overflow: hidden;
}
.cal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 46px;
  padding: 0 14px;
  background: var(--c-table-head);
  font-size: 18px;
  font-weight: 600;
}
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 4px;
  padding: 12px 14px 14px;
  text-align: center;
}
.wd {
  font-size: 14px;
  color: var(--c-muted-2);
  padding-bottom: 8px;
}
.day {
  justify-self: center;
  width: 33px;
  height: 33px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
  border: 1.5px solid transparent;
}
.day:hover:not(:disabled) {
  background: var(--c-primary-soft);
}
.day:disabled {
  color: #b2b6c4;
  font-weight: 400;
  cursor: default;
}
.day.today {
  border-color: var(--c-border);
}
.day.selected {
  border-color: var(--c-primary);
  color: var(--c-primary);
}
.slots-title {
  font-size: 16px;
  margin-bottom: 16px;
}
.slots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.slot {
  height: 42px;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  font-size: 16px;
  background: #fff;
  transition: border-color 0.1s;
}
.slot:hover:not(:disabled) {
  border-color: #9fb5f5;
}
.slot.selected {
  border: 2px solid var(--c-primary);
  color: var(--c-primary);
  font-weight: 700;
}
.slot:disabled {
  color: #b2b6c4;
  cursor: default;
}
.slot.request {
  width: 100%;
}
.or {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 0;
  font-size: 14px;
  color: var(--c-muted-2);
}
.or::before,
.or::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--c-divider);
}
.summary-box {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-top: 30px;
  padding: 30px 40px;
  border: 1px solid var(--c-divider);
  border-radius: 8px;
}
.summary-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 220px;
  font-size: 16px;
}
.summary-col + .summary-col {
  margin-inline-start: 40px;
}
.summary-col h4 {
  font-size: 14px;
  font-weight: 400;
  color: var(--c-muted);
  margin-bottom: 4px;
}
.radio {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.radio input {
  width: 18px;
  height: 18px;
  accent-color: var(--c-primary);
}
.note {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 350px;
  margin-top: 30px;
  font-size: 14px;
  color: var(--c-muted);
}
.note input {
  height: 48px;
  padding: 0 10px;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  outline: none;
}
.note input:focus {
  border-color: var(--c-primary);
}
.footer {
  margin-top: auto;
  padding-top: 20px;
}
</style>
