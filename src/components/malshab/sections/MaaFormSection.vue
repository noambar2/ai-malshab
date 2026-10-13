<script setup lang="ts">
import { maaForm } from '@/data/sectionsB'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="row">
    <div v-for="f in maaForm" :key="f.label" class="field">
      <span class="label">{{ f.label }}</span>
      <span class="value">{{ f.value }}</span>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px 40px;
  padding-top: 10px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 130px;
}
.label {
  font-size: 14px;
  color: var(--c-primary-dark);
  white-space: nowrap;
}
.value {
  font-size: 16px;
  font-weight: 700;
  color: var(--c-text);
  white-space: nowrap;
}
</style>
