<script setup lang="ts">
// "טווח תאריכים" field: shows "dd.mm.yyyy - dd.mm.yyyy", opens a small popover with from/to dates.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import DvIcon from './DvIcon.vue'
import { fmtDate } from '@/data/directives'

defineProps<{ invalid?: boolean }>()
const from = defineModel<string>('from', { default: '' })
const to = defineModel<string>('to', { default: '' })

const root = ref<HTMLElement | null>(null)
const open = ref(false)

function onDoc(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('mousedown', onDoc))
onBeforeUnmount(() => document.removeEventListener('mousedown', onDoc))
</script>

<template>
  <div ref="root" class="range">
    <button type="button" class="dv-input trigger" :class="{ invalid }" @click="open = !open">
      <span :class="{ ph: !from && !to }">
        {{ from || to ? `${fmtDate(from) || '...'} - ${fmtDate(to) || '...'}` : 'dd/mm/yyyy - dd/mm/yyyy' }}
      </span>
      <DvIcon name="calendar" :size="22" />
    </button>
    <div v-if="open" class="pop">
      <label>
        <span>מתאריך</span>
        <input v-model="from" type="date" class="dv-input" :max="to || undefined" />
      </label>
      <label>
        <span>עד תאריך</span>
        <input v-model="to" type="date" class="dv-input" :min="from || undefined" />
      </label>
      <button type="button" class="btn btn-primary" @click="open = false">אישור</button>
    </div>
  </div>
</template>

<style scoped>
.range {
  position: relative;
  min-width: 0;
}
.trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  text-align: start;
  cursor: pointer;
}
.ph {
  color: #a3a8bb;
}
.pop {
  position: absolute;
  z-index: 30;
  top: calc(100% + 4px);
  inset-inline-start: 0;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 14px;
  background: #fff;
  border: 1px solid #e2e8f8;
  border-radius: 6px;
  box-shadow: 0 6px 20px rgba(7, 25, 56, 0.12);
}
.pop label {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 13px;
  color: #6d6e8d;
}
.pop .dv-input {
  width: 160px;
  font-size: 14px;
}
.pop .btn {
  height: 42px;
}
</style>
