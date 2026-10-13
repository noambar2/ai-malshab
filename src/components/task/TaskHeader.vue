<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'
import type { DodgerTask } from '@/data/dodgers'
import { taskHeader } from '@/data/tasks'

defineProps<{
  task: DodgerTask
  title: string
  handlerName: string
  handlerTitle: string
  canPull: boolean
}>()
defineEmits<{ back: []; pull: [] }>()
</script>

<template>
  <section class="header">
    <div class="identity">
      <button class="back" @click="$emit('back')">
        <AppIcon name="chevron-right" :size="14" />
        חזרה אחורה
      </button>
      <h1>{{ task.fullName }} {{ title }}</h1>
    </div>
    <dl class="stats">
      <div>
        <dt>מספר מועמד</dt>
        <dd>{{ task.candidateId }}</dd>
      </div>
      <div>
        <dt>לשכה</dt>
        <dd>{{ taskHeader.office }}</dd>
      </div>
      <div>
        <dt>תת סוג</dt>
        <dd>{{ task.subType }}</dd>
      </div>
      <div>
        <dt>סיבת הסטטוס</dt>
        <dd>
          {{ task.statusReason }}
          <small>{{ task.statusReasonCode }}</small>
          <small>({{ taskHeader.statusReasonDate }})</small>
        </dd>
      </div>
      <div>
        <dt>
          גורם מטפל
          <button v-if="canPull" class="pull" title="העברת המשימה לטיפולי" @click="$emit('pull')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M10 4h9a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-9v-1.6h8.4V5.6H10V4Zm1.1 3.9 1.1-1.1L17.4 12l-5.2 5.2-1.1-1.1 3.3-3.3H4v-1.6h10.4l-3.3-3.3Z" />
            </svg>
            משיכה אליי
          </button>
        </dt>
        <dd>
          {{ handlerName }}
          <small>{{ handlerTitle }}</small>
        </dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.header {
  position: sticky;
  top: 56px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  min-height: 86px;
  padding: 10px 30px;
  background: var(--c-header-bg);
  color: var(--c-brand);
}
.back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--c-primary);
}
h1 {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.48px;
  white-space: nowrap;
}
.stats {
  display: flex;
  padding: 8px 0;
}
.stats > div {
  min-width: 50px;
  padding: 0 20px;
}
.stats > div + div {
  border-inline-start: 1px solid #b9c6ea;
}
.stats > div:last-child {
  padding-inline-end: 0;
}
dt {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  letter-spacing: -0.28px;
  height: 23px;
  white-space: nowrap;
}
dd {
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
}
dd small {
  font-size: 14px;
  font-weight: 400;
  margin-inline-start: 5px;
}
.pull {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  font-weight: 500;
  color: var(--c-primary);
}
.pull:hover {
  text-decoration: underline;
}
</style>
