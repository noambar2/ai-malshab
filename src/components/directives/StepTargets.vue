<script setup lang="ts">
// Wizard step 3 — "יעדים לשיבוץ": per basket (tabs), choose where each main target's recruits can be placed.
import { computed, reactive, ref } from 'vue'
import BasketStats from './BasketStats.vue'
import MainTargetCard from './MainTargetCard.vue'
import MetaLine from './MetaLine.vue'
import type { Directive } from '@/data/directives'

const props = defineProps<{ d: Directive; showErrors?: boolean; initialBasket?: string }>()
const emit = defineEmits<{ editBaskets: [] }>()

const activeId = ref(props.initialBasket ?? props.d.baskets[0]?.id ?? '')
const active = computed(() => props.d.baskets.find((b) => b.id === activeId.value) ?? props.d.baskets[0])
const openMap = reactive<Record<string, boolean>>({})

const missing = (id: string) => {
  const b = props.d.baskets.find((x) => x.id === id)
  return !!b && b.targets.some((t) => !t.subTargets.length)
}
</script>

<template>
  <nav class="tabs" aria-label="סלים">
    <button
      v-for="b in d.baskets"
      :key="b.id"
      type="button"
      class="tab"
      :class="{ active: b.id === active?.id }"
      @click="activeId = b.id"
    >
      {{ b.name }}
      <span v-if="missing(b.id)" class="dot" title="יש יעדים ללא יעדים לשיבוץ" />
    </button>
  </nav>

  <template v-if="active">
    <div class="banner">
      <div>
        <h2>{{ active.name }}</h2>
        <p>
          לעריכת הסל והיעדים יש
          <button type="button" class="back-link" @click="emit('editBaskets')">לחזור אחורה לשלב הקודם</button>
        </p>
      </div>
      <BasketStats :basket="active" tone="blue" />
    </div>

    <!-- Figma: the step title sits between the basket banner and its target cards. -->
    <div class="dv-title-row targets-title">
      <h1 class="dv-title">יעדים לשיבוץ</h1>
      <MetaLine :d="d" />
    </div>

    <div class="cards">
      <MainTargetCard
        v-for="t in active.targets"
        :key="t.id"
        v-model:open="openMap[t.id]"
        :target="t"
        editable
        :show-errors="showErrors"
      />
    </div>
  </template>
</template>

<style scoped>
.targets-title {
  margin-top: 24px;
}
.tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 20px;
}
.tab {
  position: relative;
  height: 32px;
  padding: 0 20px;
  border: 1px solid #8f94aa;
  border-radius: 16px;
  background: #fff;
  font-size: 12px;
  color: var(--c-text);
}
.tab.active {
  border-color: var(--c-primary);
  background: var(--c-primary-soft);
  color: var(--c-primary);
}
.dot {
  position: absolute;
  top: -2px;
  inset-inline-end: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-danger);
}
.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 30px;
  border-radius: 8px;
  background: #e2eafd;
}
.banner h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--c-brand);
}
.banner p {
  margin-top: 6px;
  font-size: 16px;
  color: var(--c-brand);
}
.back-link {
  font-size: inherit;
  color: inherit;
  text-decoration: underline;
}
.cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
