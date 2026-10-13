<script setup lang="ts">
import TonePill from './TonePill.vue'
import type { Tone } from '@/data/tasks'

// Shown under a process history when the viewer can't act on it: either the task
// belongs to someone else, or the viewer already acted (outcome).
defineProps<{
  outcome?: { label: string; tone: Tone }
  handlerTitle: string
  canPull: boolean
}>()
defineEmits<{ pull: [] }>()
</script>

<template>
  <footer class="footer">
    <template v-if="outcome">
      <TonePill :tone="outcome.tone" :label="outcome.label" />
      <span>הטיפול שלך במשימה הסתיים</span>
      <RouterLink to="/dodgers" class="btn btn-soft">חזרה למשימות</RouterLink>
    </template>
    <template v-else>
      <span>גורם מטפל - {{ handlerTitle }}</span>
      <button v-if="canPull" class="btn btn-soft" @click="$emit('pull')">משיכה אליי</button>
    </template>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-top: 1px solid var(--c-divider);
  padding-top: 20px;
  font-size: 14px;
  color: var(--c-muted);
}
</style>
