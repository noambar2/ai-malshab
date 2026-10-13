<script setup lang="ts">
// Date field shown as dd.mm.yyyy with a calendar icon; opens the native date picker.
import { ref } from 'vue'
import DvIcon from './DvIcon.vue'
import { fmtDate } from '@/data/directives'

defineProps<{ invalid?: boolean }>()
const model = defineModel<string>({ default: '' })
const native = ref<HTMLInputElement | null>(null)

function openPicker() {
  const el = native.value
  if (!el) return
  try {
    el.showPicker()
  } catch {
    el.focus()
  }
}
</script>

<template>
  <div class="dv-input date" :class="{ invalid }" role="button" tabindex="0" @click="openPicker" @keydown.enter="openPicker">
    <span :class="{ ph: !model }">{{ model ? fmtDate(model) : 'dd/mm/yyyy' }}</span>
    <DvIcon name="calendar" :size="22" class="ico" />
    <input ref="native" v-model="model" type="date" class="native" tabindex="-1" aria-hidden="true" />
  </div>
</template>

<style scoped>
.date {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
.ph {
  color: #a3a8bb;
}
.ico {
  color: var(--c-text);
}
.native {
  position: absolute;
  inset-inline-end: 0;
  bottom: 0;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
</style>
