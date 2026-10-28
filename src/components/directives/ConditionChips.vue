<script setup lang="ts">
// A placement target's conditions read back as small chips ("דפ״ר לפחות 50", "פרופיל שווה 97").
import { conditionComplete, conditionText, type Condition } from '@/data/directives'

defineProps<{ conditions: Condition[] }>()
</script>

<template>
  <span v-if="conditions.some(conditionComplete)" class="chips">
    <span v-for="c in conditions.filter(conditionComplete)" :key="c.id" class="chip">{{ conditionText(c) }}</span>
  </span>
  <span v-else>-</span>
</template>

<style scoped>
.chips {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
}
.chip {
  padding: 1px 8px;
  border-radius: 10px;
  background: #eef2fd;
  font-size: 13px;
  white-space: nowrap;
  color: var(--c-brand);
}
</style>
