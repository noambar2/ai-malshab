<script setup lang="ts">
import { computed, reactive } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import type { DodgerTask } from '@/data/dodgers'
import { address, candidateScores, candidateStatus, personal, timeline } from '@/data/tasks'

const props = defineProps<{ task: DodgerTask; current: number }>()

const open = reactive({ timeline: true, personal: true, address: true })

// Fill the personal grid with this task's identity.
const personalFields = computed(() => {
  const [first, ...rest] = props.task.fullName.split(' ')
  const fill: Record<string, string> = {
    'שם פרטי': first ?? '',
    'שם משפחה': rest.join(' '),
    'תעודת זהות': props.task.idNumber,
  }
  return personal.map((f) => ({ ...f, value: fill[f.label] ?? f.value }))
})
// Every block sits on one shared 8-column grid, split into two halves by a divider
// between columns 4 and 5, so fields line up vertically across all rows.
type Cell = { label: string; value: string } | null
const COLS = 8
const pad = (cells: Cell[]) => [...cells, ...Array<Cell>(COLS - cells.length).fill(null)]

const byLabel = (labels: string[]) =>
  labels.map((l) => [...candidateStatus, ...candidateScores].find((f) => f.label === l) ?? null)

const personalRows = computed(() => [
  personalFields.value.slice(0, 8),
  personalFields.value.slice(8, 16),
])

// Right half: candidate status and scores. Left half: the medical fields.
const statusRows = computed(() => [
  [
    ...byLabel(['טווח מועמד', 'סטטוס', 'סיבת סטטוס', 'תוקף סטטוס']),
    ...byLabel(['פרופיל', 'קה״ס', 'מדרג הגנה נפשי', 'סעיפי ליקוי']),
  ],
  pad(byLabel(['ציון ר״פ', 'התש', 'פטור שבת וחג'])),
])

const addressRows = computed(() => [pad(address)])
</script>

<template>
  <section class="details">
    <div class="block">
      <button class="toggle" :aria-expanded="open.timeline" @click="open.timeline = !open.timeline">
        <span>ציר זמנים</span>
        <AppIcon :name="open.timeline ? 'chevron-up' : 'chevron-down'" :size="18" />
      </button>
      <ol v-if="open.timeline" class="stepper">
        <li
          v-for="(step, i) in timeline"
          :key="i"
          :class="{ done: i < current, current: i === current }"
        >
          <span class="dot">
            <AppIcon v-if="i < current" name="check" :size="9" />
          </span>
          <span class="label">{{ step.label }}</span>
          <span v-if="step.date && i < current" class="date">{{ step.date }}</span>
        </li>
      </ol>
    </div>

    <div class="block">
      <button class="toggle" :aria-expanded="open.personal" @click="open.personal = !open.personal">
        <span>פרטים אישיים</span>
        <AppIcon :name="open.personal ? 'chevron-up' : 'chevron-down'" :size="18" />
      </button>
      <template v-if="open.personal">
        <div class="rows">
          <dl v-for="(row, r) in personalRows" :key="r" class="row8 halves">
            <div v-for="(f, i) in row" :key="i">
              <template v-if="f"><dt>{{ f.label }}</dt><dd>{{ f.value }}</dd></template>
            </div>
          </dl>
        </div>
        <hr />
        <div class="rows">
          <dl v-for="(row, r) in statusRows" :key="r" class="row8 halves">
            <div v-for="(f, i) in row" :key="i">
              <template v-if="f"><dt>{{ f.label }}</dt><dd>{{ f.value }}</dd></template>
            </div>
          </dl>
        </div>
      </template>
    </div>

    <div class="block">
      <button class="toggle" :aria-expanded="open.address" @click="open.address = !open.address">
        <span>כתובת</span>
        <AppIcon :name="open.address ? 'chevron-up' : 'chevron-down'" :size="18" />
      </button>
      <div v-if="open.address" class="rows">
        <dl v-for="(row, r) in addressRows" :key="r" class="row8">
          <div v-for="(f, i) in row" :key="i">
            <template v-if="f"><dt>{{ f.label }}</dt><dd>{{ f.value }}</dd></template>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
.details {
  background: var(--c-surface);
  padding: 24px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  font-size: 16px;
  font-weight: 600;
  color: var(--c-text);
  opacity: 0.5;
  margin-bottom: 6px;
}
.toggle:hover {
  opacity: 0.75;
}

.stepper {
  list-style: none;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.stepper li {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
}
.stepper li:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 5px;
  inset-inline-start: calc(50% + 20px);
  width: calc(100% - 40px);
  height: 2px;
  border-radius: 2px;
  background: var(--c-step-idle);
}
.stepper li.done::after {
  background: var(--c-primary);
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--c-step-idle);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.done .dot,
.current .dot {
  background: var(--c-primary);
}
.label {
  white-space: pre-line;
  max-width: 110px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
}
.date {
  font-size: 11px;
  color: var(--c-primary-dark);
}

hr {
  border: 0;
  border-top: 1px solid var(--c-divider);
  margin: 20px 0;
}
.rows {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.row8 {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  column-gap: 16px;
}
.row8 > div {
  min-width: 0;
}
/* The divider sits in the gap between columns 4 and 5 (the exact middle), so it never
   shifts the fields and they stay on the same guides as rows without a divider. */
.halves {
  position: relative;
}
.halves::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  border-left: 1px solid var(--c-divider);
}
dt {
  font-size: 14px;
  color: var(--c-text);
  margin-bottom: 4px;
  min-height: 19px;
}
dd {
  font-size: 16px;
  font-weight: 700;
  color: var(--c-text);
  white-space: nowrap;
}
</style>
