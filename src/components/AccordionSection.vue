<script setup lang="ts">
import AppIcon from './AppIcon.vue'

defineProps<{ title: string }>()
const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <section class="accordion card" :class="{ open }">
    <button class="head" :aria-expanded="open" @click="open = !open">
      <h2>{{ title }}</h2>
      <span class="meta"><slot name="meta" /></span>
      <span class="divider" />
      <span class="summary"><slot name="summary" /></span>
      <AppIcon :name="open ? 'chevron-up' : 'chevron-down'" :size="22" class="chevron" />
    </button>
    <div v-if="open" class="body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.accordion {
  overflow: hidden;
}
.head {
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 0 30px;
  text-align: start;
}
h2 {
  font-size: 22px;
  font-weight: 600;
  color: var(--c-text);
}
.meta {
  margin-inline-start: auto;
  font-size: 12px;
  color: var(--c-muted);
  padding-inline-end: 30px;
}
.divider {
  width: 1px;
  height: 20px;
  background: var(--c-border);
}
.summary {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 170px;
  padding-inline-start: 24px;
  font-size: 18px;
  color: var(--c-muted);
}
.chevron {
  color: var(--c-text);
}
.body {
  padding: 0 30px 40px;
}
</style>
