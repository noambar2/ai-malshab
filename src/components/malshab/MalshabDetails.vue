<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'
import SmartSummary from './SmartSummary.vue'
import { malshab } from '@/data/mock'

const process = malshab.process

// The fields sit on one 6-column grid (4 + 2, with a divider between them) so every row
// lines up; the smart summary takes the space beside them.
type Cell = { label: string; value: string; info?: boolean; link?: boolean } | null
const half = (list: Cell[], from: number, n: number) =>
  Array.from({ length: n }, (_, i) => list[from + i] ?? null)

const bands = [
  {
    titles: ['פרטים אישיים', 'מוצא'],
    rows: [0, 1].map((r) => [...half(malshab.personal, r * 4, 4), ...half(malshab.origin, r * 2, 2)]),
  },
  {
    titles: ['כתובת', 'פרטי גיוס'],
    rows: [
      [...half(malshab.address, 0, 4), ...half(malshab.draft, 0, 2)],
      [...half(malshab.address, 4, 4), null, null],
    ],
  },
]
</script>

<template>
  <section class="details">
    <div class="top">
      <div class="fields">
        <div v-for="band in bands" :key="band.titles[0]" class="band">
          <div class="row6 titles">
            <h3>{{ band.titles[0] }}</h3>
            <h3>{{ band.titles[1] }}</h3>
          </div>
          <dl v-for="(row, r) in band.rows" :key="r" class="row6">
            <div v-for="(f, i) in row" :key="i">
              <template v-if="f">
                <dt>{{ f.label }}</dt>
                <dd :class="{ link: f.link }">
                  {{ f.value }}
                  <AppIcon v-if="f.info" name="info" :size="12" class="info" />
                </dd>
              </template>
            </div>
          </dl>
        </div>
      </div>
      <SmartSummary class="summary" />
    </div>

    <div class="process">
      <div class="process-head">
        <h3>{{ process.title }}</h3>
        <button class="btn btn-soft">
          <AppIcon name="arrow-left" :size="16" />
          פרטים מלאים
        </button>
      </div>
      <ol class="stepper">
        <li
          v-for="(step, i) in process.steps"
          :key="i"
          :class="{ done: i < process.current, current: i === process.current }"
        >
          <span class="dot">
            <AppIcon v-if="i < process.current" name="check" :size="9" />
          </span>
          <span class="label">{{ step.label }}</span>
          <span v-if="step.date" class="date">{{ step.date }}</span>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.details {
  background: var(--c-surface);
  padding: 24px 30px 28px;
}
h3 {
  font-size: 14px;
  font-weight: 500;
  color: var(--c-muted);
  margin-bottom: 12px;
}
.top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  gap: 32px;
  align-items: stretch;
}
.fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.row6 {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  column-gap: 20px;
}
.row6 + .row6 {
  margin-top: 12px;
}
.row6 > * {
  min-width: 0;
}
/* Divider between the 4-column and the 2-column halves, on the same guide in every row. */
.row6 > :nth-child(5) {
  padding-inline-start: 20px;
  border-inline-start: 1px solid var(--c-divider);
}
.titles h3 {
  margin: 0;
}
.titles > :nth-child(1) {
  grid-column: span 4;
}
.titles > :nth-child(2) {
  grid-column: span 2;
}
.titles > :nth-child(2) {
  padding-inline-start: 20px;
  border-inline-start: 1px solid var(--c-divider);
}
dt {
  font-size: 12px;
  color: var(--c-text-2);
  margin-bottom: 4px;
}
dd {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}
dd.link {
  color: var(--c-brand);
  cursor: pointer;
}
.info {
  color: var(--c-primary);
}
.process {
  margin-top: 24px;
}
.process-head {
  display: flex;
  align-items: center;
  gap: 20px;
}
.process-head h3 {
  margin: 0;
  font-size: 16px;
}
.stepper {
  list-style: none;
  padding: 0 20px;
  margin-top: 16px;
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
  max-width: 110px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
}
.date {
  font-size: 11px;
  color: var(--c-text-2);
}
</style>
