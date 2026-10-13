<script setup lang="ts">
import { educationRows } from '@/data/sectionsB'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="rows">
    <div v-for="(row, i) in educationRows" :key="i" class="row">
      <div v-for="f in row" :key="f.label" class="field">
        <span class="label">{{ f.label }}</span>
        <span class="value">{{ f.value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rows {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-top: 10px;
}
.row {
  display: flex;
  gap: 40px;
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
