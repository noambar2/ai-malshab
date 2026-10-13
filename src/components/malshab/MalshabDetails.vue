<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'
import { malshab } from '@/data/mock'

const process = malshab.process
</script>

<template>
  <section class="details">
    <div class="groups">
      <div class="group personal">
        <h3>פרטים אישיים</h3>
        <dl class="grid cols-4">
          <div v-for="f in malshab.personal" :key="f.label">
            <dt>{{ f.label }}</dt>
            <dd>
              {{ f.value }}
              <AppIcon v-if="f.info" name="info" :size="12" class="info" />
            </dd>
          </div>
        </dl>
      </div>
      <div class="group">
        <h3>מוצא</h3>
        <dl class="grid cols-2">
          <div v-for="f in malshab.origin" :key="f.label">
            <dt>{{ f.label }}</dt>
            <dd>{{ f.value }}</dd>
          </div>
        </dl>
      </div>
      <div class="group">
        <h3>פרטי גיוס</h3>
        <dl class="grid cols-1">
          <div v-for="f in malshab.draft" :key="f.label">
            <dt>{{ f.label }}</dt>
            <dd class="link">{{ f.value }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <div class="group address">
      <h3>כתובת</h3>
      <dl class="grid cols-6">
        <div v-for="f in malshab.address" :key="f.label">
          <dt>{{ f.label }}</dt>
          <dd>{{ f.value }}</dd>
        </div>
      </dl>
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
.groups {
  display: flex;
}
.group.personal {
  flex: 1.4;
}
.groups .group {
  padding-inline-end: 40px;
}
.groups .group + .group {
  flex: 1;
  padding-inline-start: 40px;
  border-inline-start: 1px solid var(--c-divider);
}
.groups .group:last-child {
  flex: 0.6;
  padding-inline-end: 0;
}
.grid {
  display: grid;
  gap: 12px 24px;
}
.cols-1 {
  grid-template-columns: 1fr;
}
.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}
.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}
.cols-6 {
  grid-template-columns: repeat(6, minmax(0, 130px));
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
.address {
  margin-top: 24px;
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
