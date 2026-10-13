<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'
import { draftStatus } from '@/data/sectionsA'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="draft">
    <div class="row">
      <div v-for="(col, i) in draftStatus.columns" :key="i" class="col">
        <div v-for="f in col" :key="f.label" class="field">
          <span class="label">{{ f.label }}</span>
          <span class="value">{{ f.value }}</span>
        </div>
      </div>
    </div>

    <div class="row">
      <div v-for="(col, i) in draftStatus.secondary" :key="i" class="col">
        <div v-for="f in col" :key="f.label" class="field">
          <span class="label">{{ f.label }}</span>
          <span class="value">{{ f.value }}</span>
        </div>
      </div>
      <span class="vdivider" />
      <ul class="flags">
        <li v-for="flag in draftStatus.flags" :key="flag.label" :class="{ off: !flag.on }">
          <span class="mark">
            <AppIcon :name="flag.on ? 'check' : 'close'" :size="flag.on ? 14 : 12" />
          </span>
          <span class="flag-label">{{ flag.label }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.draft {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-top: 10px;
}
.row {
  display: flex;
  align-items: stretch;
  gap: 40px;
}
.col {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 130px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.label {
  font-size: 14px;
  color: var(--c-primary-dark);
}
.value {
  font-size: 16px;
  font-weight: 700;
  color: var(--c-text);
}
.vdivider {
  width: 1px;
  background: var(--c-border);
}
.flags {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.flags li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 500;
}
.mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--c-primary);
  color: #fff;
}
.off .mark {
  width: 16px;
  height: 16px;
  margin: 2px;
  background: #e1e3ea;
  color: var(--c-muted-2);
}
.off .flag-label {
  opacity: 0.5;
}
</style>
