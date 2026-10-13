<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import TonePill from './TonePill.vue'
import type { ProcessEntry } from '@/data/tasks'

const props = defineProps<{ entries: ProcessEntry[] }>()

const list = ref<HTMLElement | null>(null)

// Keep the newest entry in view when one is added.
watch(
  () => props.entries.length,
  async () => {
    await nextTick()
    list.value?.scrollTo({ top: list.value.scrollHeight, behavior: 'smooth' })
  },
)
</script>

<template>
  <div ref="list" class="history">
    <article v-for="(e, i) in entries" :key="i" class="entry">
      <header>
        <div class="who">
          <strong>{{ e.name }}</strong>
          <span>{{ e.title }}</span>
        </div>
        <div class="when">
          <span class="date">{{ e.date }}</span>
          <TonePill :tone="e.badge.tone" :label="e.badge.label" class="badge" />
        </div>
      </header>
      <p v-if="e.text">{{ e.text }}</p>
    </article>
  </div>
</template>

<style scoped>
.history {
  max-height: 230px;
  overflow-y: auto;
  padding-inline-end: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  scrollbar-width: thin;
  scrollbar-color: rgba(217, 217, 217, 0.6) rgba(217, 217, 217, 0.3);
}
.history::-webkit-scrollbar {
  width: 10px;
}
.history::-webkit-scrollbar-track {
  background: rgba(217, 217, 217, 0.3);
  border-radius: 100px;
}
.history::-webkit-scrollbar-thumb {
  background: rgba(217, 217, 217, 0.6);
  border-radius: 100px;
}
.entry {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.entry + .entry {
  border-top: 1px solid var(--c-divider);
  padding-top: 20px;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.who {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--c-text);
}
.who strong {
  font-size: 16px;
  font-weight: 700;
}
.who span {
  font-size: 14px;
}
.when {
  display: flex;
  align-items: center;
  gap: 10px;
}
.date {
  font-size: 14px;
  color: var(--c-text);
  opacity: 0.5;
}
.when .badge {
  min-width: 95px;
  height: 28px;
  padding: 0 20px;
}
p {
  font-size: 14px;
  color: var(--c-text);
  white-space: pre-line;
}
</style>
