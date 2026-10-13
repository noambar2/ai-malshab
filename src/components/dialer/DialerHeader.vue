<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '@/components/AppIcon.vue'

// Light-blue band at the top of the dialer page: title, edit-window badge and stats.
const props = defineProps<{
  closed: boolean
  lockTime: string
  total: number
  approved: number
  rejected: number
  pending: number
}>()
const emit = defineEmits<{ back: []; toggleClosed: [] }>()

const approvedPct = computed(() => (props.total ? Math.round((props.approved / props.total) * 100) : 0))
</script>

<template>
  <header class="band">
    <div class="titles">
      <button type="button" class="back" @click="emit('back')">
        <AppIcon name="chevron-right" :size="14" />
        חזרה אחורה
      </button>
      <div class="title-line">
        <h1>פוטנציאל לחייגן</h1>
        <button
          type="button"
          class="edit-badge"
          :class="closed ? 'closed' : 'open'"
          :title="closed ? 'הדגמה: לחצו כדי לפתוח מחדש את העריכה' : 'הדגמה: לחצו כדי לראות את המסך לאחר סגירת העריכה'"
          @click="emit('toggleClosed')"
        >
          <template v-if="closed">העריכה נסגרה ב{{ lockTime }}</template>
          <template v-else>העריכה פתוחה</template>
        </button>
      </div>
    </div>

    <dl v-if="!closed" class="stats">
      <div class="stat">
        <dt>נותרו לבדיקה</dt>
        <dd>{{ pending }} <small>/ {{ total }}</small></dd>
      </div>
      <div class="stat">
        <dt>שיחות שאושרו</dt>
        <dd>{{ approved }}</dd>
      </div>
      <div class="stat">
        <dt>שיחות שבוטלו</dt>
        <dd>{{ rejected }}</dd>
      </div>
      <div class="stat">
        <dt>סגירת עריכה</dt>
        <dd>{{ lockTime }}</dd>
      </div>
      <div class="progress">
        <strong>{{ approvedPct }}% אושרו</strong>
        <span class="bar"><span :style="{ width: `${Math.max(approvedPct, 4)}%` }" /></span>
      </div>
    </dl>
    <dl v-else class="stats">
      <div class="stat">
        <dt>סך הכל היו בפוטנציאל</dt>
        <dd>{{ total }}</dd>
      </div>
      <div class="stat">
        <dt>שיחות שאושרו</dt>
        <dd>{{ approved }}</dd>
      </div>
      <div class="stat">
        <dt>שיחות שלא אושרו</dt>
        <dd>{{ rejected }}</dd>
      </div>
      <div class="stat">
        <dt>יועברו למחר</dt>
        <dd>{{ pending }}</dd>
      </div>
    </dl>
  </header>
</template>

<style scoped>
.band {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 86px;
  padding: 10px 30px;
  background: #ebf0ff;
  color: #002a99;
}
.titles {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}
.back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--c-primary);
}
.back:hover {
  text-decoration: underline;
}
.title-line {
  display: flex;
  align-items: center;
  gap: 14px;
}
h1 {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.48px;
  line-height: 28px;
  color: #002a99;
}
.edit-badge {
  padding: 6px 20px;
  border: 1px solid;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: filter 0.15s;
}
.edit-badge:hover {
  filter: brightness(0.97);
}
.edit-badge.open {
  background: #daf9ec;
  border-color: #06a561;
  color: #06a561;
}
.edit-badge.closed {
  background: #e6e9f4;
  border-color: #5a607f;
  color: #5a607f;
}
.stats {
  display: flex;
  align-items: stretch;
  gap: 20px;
  padding: 8px 0;
}
.stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 50px;
  padding-inline-end: 20px;
  border-inline-end: 1px solid rgba(0, 42, 153, 0.2);
}
.stats > :last-child {
  padding-inline-end: 0;
  border-inline-end: 0;
}
dt {
  font-size: 14px;
  letter-spacing: -0.28px;
  line-height: 23px;
}
dd {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 27px;
  align-self: flex-end;
}
dd small {
  font-size: 14px;
  font-weight: 400;
}
.progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.progress strong {
  font-size: 18px;
}
.bar {
  position: relative;
  display: block;
  width: 100px;
  height: 10px;
  border-radius: 100px;
  background: rgba(0, 70, 254, 0.2);
  overflow: hidden;
}
.bar span {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  border-radius: 100px;
  background: var(--c-primary);
  transition: width 0.3s;
}
</style>
