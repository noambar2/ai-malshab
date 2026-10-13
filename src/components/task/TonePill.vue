<script setup lang="ts">
import type { Tone } from '@/data/tasks'

defineProps<{ tone: Tone; label: string }>()
</script>

<template>
  <span class="pill" :class="tone">{{ label }}</span>
</template>

<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 78px;
  height: 24px;
  padding: 0 12px;
  border-radius: 60px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
.green {
  background: #daf9ec;
  color: var(--c-success);
}
.red {
  background: #fde7ea;
  color: #f0142f;
}
.yellow {
  background: #fff4c9;
  color: #dc8707;
}
.grey {
  background: #e6e9f4;
  color: var(--c-muted-2);
}
</style>
