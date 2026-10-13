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
// The design splits the 8-column grid into two halves with a divider between them.
const personalRight = computed(() => [...personalFields.value.slice(0, 4), ...personalFields.value.slice(8, 12)])
const personalLeft = computed(() => [...personalFields.value.slice(4, 8), ...personalFields.value.slice(12, 16)])
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

    <div class="block indent">
      <button class="toggle" :aria-expanded="open.personal" @click="open.personal = !open.personal">
        <span>פרטים אישיים</span>
        <AppIcon :name="open.personal ? 'chevron-up' : 'chevron-down'" :size="18" />
      </button>
      <template v-if="open.personal">
        <div class="split">
          <dl class="grid cols-4">
            <div v-for="f in personalRight" :key="f.label">
              <dt>{{ f.label }}</dt>
              <dd>{{ f.value }}</dd>
            </div>
          </dl>
          <dl class="grid cols-4">
            <div v-for="f in personalLeft" :key="f.label">
              <dt>{{ f.label }}</dt>
              <dd>{{ f.value }}</dd>
            </div>
          </dl>
        </div>
        <hr />
        <div class="split">
          <dl class="grid cols-2">
            <div v-for="f in candidateStatus" :key="f.label">
              <dt>{{ f.label }}</dt>
              <dd>{{ f.value }}</dd>
            </div>
          </dl>
          <dl class="grid cols-4">
            <div v-for="(f, i) in candidateScores" :key="i">
              <dt>{{ f.label }}</dt>
              <dd>{{ f.value }}</dd>
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
      <dl v-if="open.address" class="grid cols-7">
        <div v-for="f in address" :key="f.label">
          <dt>{{ f.label }}</dt>
          <dd>{{ f.value }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.details {
  background: var(--c-surface);
  padding: 30px 30px 30px 90px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.indent {
  padding-inline-start: 19px;
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
  margin-bottom: 10px;
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

.split {
  display: flex;
}
.split > .grid + .grid {
  margin-inline-start: 15px;
  padding-inline-start: 15px;
  border-inline-start: 1px solid var(--c-divider);
}
hr {
  border: 0;
  border-top: 1px solid var(--c-divider);
  margin: 40px 0;
}
.grid {
  display: grid;
  gap: 40px 0;
}
.cols-2 {
  grid-template-columns: repeat(2, 145px);
}
.cols-4 {
  grid-template-columns: repeat(4, 145px);
}
.cols-7 {
  grid-template-columns: repeat(7, 145px);
}
dt {
  font-size: 14px;
  color: var(--c-text);
  margin-bottom: 8px;
  min-height: 19px;
}
dd {
  font-size: 16px;
  font-weight: 700;
  color: var(--c-text);
  white-space: nowrap;
}
</style>
