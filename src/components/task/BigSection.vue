<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'

defineProps<{ title: string }>()
const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <section class="big-section" :class="{ open }">
    <button class="title" :aria-expanded="open" @click="open = !open">
      <h2>{{ title }}</h2>
      <AppIcon :name="open ? 'chevron-up' : 'chevron-down'" :size="24" />
    </button>
    <div v-if="open" class="content card">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.big-section {
  padding: 0 30px;
}
.big-section:not(.open) {
  border-bottom: 1px solid var(--c-divider);
}
.big-section.open {
  padding-bottom: 30px;
}
.title {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 74px;
  color: var(--c-primary-dark);
}
h2 {
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.48px;
}
.content {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
