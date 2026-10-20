<script setup lang="ts">
// "טווח תאריכים" field. Opens a two-month range calendar (like hotel booking sites): the first
// click sets the start, the second the end, and the range previews while hovering. Nothing is
// written back until "אישור".
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from './DvIcon.vue'
import { TODAY, fmtDate } from '@/data/directives'

defineProps<{ invalid?: boolean }>()
const from = defineModel<string>('from', { default: '' })
const to = defineModel<string>('to', { default: '' })

const WEEKDAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']
const MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']

const root = ref<HTMLElement | null>(null)
const open = ref(false)
const start = ref('')
const end = ref('')
const hover = ref('')
// First of the right-hand (earlier) month shown; the left one is the month after.
const view = ref({ y: 0, m: 0 })

const pad = (n: number) => String(n).padStart(2, '0')
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`

function show() {
  start.value = from.value
  end.value = to.value
  hover.value = ''
  const base = from.value || TODAY
  view.value = { y: Number(base.slice(0, 4)), m: Number(base.slice(5, 7)) - 1 }
  open.value = true
}

function shift(delta: number) {
  const d = new Date(view.value.y, view.value.m + delta, 1)
  view.value = { y: d.getFullYear(), m: d.getMonth() }
}

function monthGrid(y: number, m: number) {
  const first = new Date(y, m, 1).getDay()
  const days = new Date(y, m + 1, 0).getDate()
  return [...Array<null>(first).fill(null), ...Array.from({ length: days }, (_, i) => iso(y, m, i + 1))]
}

const months = computed(() =>
  [0, 1].map((k) => {
    const d = new Date(view.value.y, view.value.m + k, 1)
    return { key: k, title: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, days: monthGrid(d.getFullYear(), d.getMonth()) }
  }),
)

// While only the start is picked, the hovered day stands in for the end.
const rangeEnd = computed(() => end.value || (start.value && hover.value > start.value ? hover.value : ''))

function pick(day: string) {
  if (!start.value || end.value || day < start.value) {
    start.value = day
    end.value = ''
  } else {
    end.value = day
  }
}

const nights = computed(() => {
  if (!start.value || !end.value) return 0
  return Math.round((new Date(end.value).getTime() - new Date(start.value).getTime()) / 86400000) + 1
})

function apply() {
  if (!start.value || !end.value) return
  from.value = start.value
  to.value = end.value
  open.value = false
}
function clear() {
  start.value = ''
  end.value = ''
  hover.value = ''
}

function onDoc(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('mousedown', onDoc))
onBeforeUnmount(() => document.removeEventListener('mousedown', onDoc))
</script>

<template>
  <div ref="root" class="range" @keydown.esc="open = false">
    <button type="button" class="dv-input trigger" :class="{ invalid, active: open }" @click="open ? (open = false) : show()">
      <span :class="{ ph: !from && !to }">
        {{ from || to ? `${fmtDate(from) || '...'} - ${fmtDate(to) || '...'}` : 'בחרו טווח תאריכים' }}
      </span>
      <DvIcon name="calendar" :size="22" />
    </button>

    <div v-if="open" class="pop" role="dialog" aria-label="בחירת טווח תאריכים">
      <div class="months">
        <button type="button" class="nav prev" aria-label="חודש קודם" @click="shift(-1)">
          <AppIcon name="chevron-right" :size="20" />
        </button>
        <button type="button" class="nav next" aria-label="חודש הבא" @click="shift(1)">
          <AppIcon name="chevron-left" :size="20" />
        </button>

        <div v-for="mo in months" :key="mo.key" class="month">
          <h4>{{ mo.title }}</h4>
          <div class="grid" @mouseleave="hover = ''">
            <span v-for="w in WEEKDAYS" :key="w" class="wd">{{ w }}</span>
            <template v-for="(day, i) in mo.days" :key="day ?? `e${i}`">
              <span v-if="!day" />
              <button
                v-else
                type="button"
                class="day"
                :class="{
                  today: day === TODAY,
                  start: day === start,
                  end: day === rangeEnd,
                  inrange: !!start && !!rangeEnd && day > start && day < rangeEnd,
                  edge: day === start || day === rangeEnd,
                  'has-end': day === start && !!rangeEnd,
                }"
                @click="pick(day)"
                @mouseenter="hover = day"
              >
                {{ Number(day.slice(8)) }}
              </button>
            </template>
          </div>
        </div>
      </div>

      <footer class="foot">
        <div class="summary">
          <template v-if="start && end">
            <b>{{ fmtDate(start) }} - {{ fmtDate(end) }}</b>
            <span>{{ nights }} ימים</span>
          </template>
          <span v-else-if="start" class="hint">בחרו תאריך סיום</span>
          <span v-else class="hint">בחרו תאריך התחלה</span>
        </div>
        <button type="button" class="btn btn-soft" :disabled="!start" @click="clear">ניקוי</button>
        <button type="button" class="btn btn-primary" :disabled="!start || !end" @click="apply">אישור</button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.range {
  position: relative;
}
.trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
  text-align: start;
}
.trigger.active {
  border-color: var(--c-primary);
}
.ph {
  color: var(--c-muted);
}
.pop {
  position: absolute;
  top: calc(100% + 6px);
  inset-inline-end: 0;
  z-index: 30;
  width: 600px;
  padding: 18px 20px 14px;
  background: #fff;
  border: 1px solid var(--c-border-2);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(7, 25, 56, 0.14);
}
.months {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
}
.nav {
  position: absolute;
  top: -4px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: var(--c-text);
}
.nav:hover {
  background: var(--c-primary-soft);
}
.nav.prev {
  inset-inline-start: 0;
}
.nav.next {
  inset-inline-end: 0;
}
h4 {
  margin: 0 0 12px;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: var(--c-text);
  line-height: 22px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 2px;
}
.wd {
  padding-bottom: 6px;
  text-align: center;
  font-size: 12px;
  color: var(--c-muted);
}
.day {
  position: relative;
  height: 36px;
  font-size: 14px;
  color: var(--c-text);
  font-variant-numeric: tabular-nums;
}
/* Two layers behind the number: ::before is the range band, ::after the round marker on top of it. */
.day::before,
.day::after {
  content: '';
  position: absolute;
  z-index: -1;
}
.day::before {
  top: 3px;
  bottom: 3px;
  left: 0;
  right: 0;
}
.day::after {
  top: 50%;
  left: 50%;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.day:hover::after {
  background: var(--c-primary-soft);
}
.day.today {
  font-weight: 700;
  color: var(--c-primary);
}
.day.inrange::before {
  background: var(--c-primary-soft);
}
.day.edge {
  color: #fff;
  font-weight: 700;
}
.day.edge::after {
  background: var(--c-primary);
}
/* Half band into the start / end markers. RTL: the start is on the right, so its band runs left. */
.day.start.has-end::before {
  right: 50%;
  background: var(--c-primary-soft);
}
.day.end:not(.start)::before {
  left: 50%;
  background: var(--c-primary-soft);
}
.grid {
  isolation: isolate;
}
.foot {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--c-divider);
}
.summary {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-inline-end: auto;
  font-size: 14px;
}
.summary b {
  font-weight: 700;
  color: var(--c-text);
}
.summary span {
  color: var(--c-muted-2);
}
.hint {
  color: var(--c-muted) !important;
}
.foot .btn:disabled {
  opacity: 0.5;
}
</style>
