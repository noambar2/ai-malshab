<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'
import { draftOpinions, firstOrderColumns, placementRows } from '@/data/sectionsB'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="draft">
    <section class="group">
      <h3 class="group-title">צו ראשון</h3>
      <div class="columns">
        <div v-for="(col, i) in firstOrderColumns" :key="i" class="column">
          <div v-for="f in col" :key="f.label" class="field">
            <span class="label" :class="{ strong: f.strong }">
              <span v-if="f.info" class="info" tabindex="0">
                <AppIcon name="info" :size="12" />
                <span class="tip">{{ f.info }}</span>
              </span>
              {{ f.label }}
            </span>
            <span class="value">{{ f.value }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="group">
      <h3 class="group-title">שיבוץ וגיוס</h3>
      <div v-for="(row, i) in placementRows" :key="i" class="row">
        <div v-for="f in row" :key="f.label" class="field">
          <span class="label">
            <span v-if="f.info" class="info" tabindex="0">
              <AppIcon name="info" :size="12" />
              <span class="tip">{{ f.info }}</span>
            </span>
            {{ f.label }}
          </span>
          <span class="value">{{ f.value }}</span>
        </div>
      </div>
    </section>

    <hr class="divider" />

    <div class="opinions">
      <div v-for="o in draftOpinions" :key="o.title" class="opinion">
        <h4>{{ o.title }}</h4>
        <p>{{ o.text }}</p>
      </div>
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
.group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.group-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--c-text);
  opacity: 0.5;
}
.columns {
  display: flex;
  align-items: stretch;
  gap: 40px;
}
.column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.column + .column {
  padding-inline-start: 40px;
  border-inline-start: 1px solid var(--c-border);
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
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: var(--c-primary-dark);
  white-space: nowrap;
}
.label.strong {
  font-size: 16px;
  font-weight: 700;
  color: var(--c-text);
}
.value {
  font-size: 16px;
  font-weight: 700;
  color: var(--c-text);
  white-space: nowrap;
}
.info {
  position: relative;
  display: inline-flex;
  color: var(--c-primary);
  cursor: help;
  outline: none;
}
.tip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 10px;
  border-radius: 4px;
  background: #eaeaea;
  color: #777;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
  z-index: 5;
}
.tip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  border: 7px solid transparent;
  border-top-color: #eaeaea;
  transform: translateX(-50%);
}
.info:hover .tip,
.info:focus .tip {
  opacity: 1;
}
.divider {
  border: 0;
  border-top: 1px solid var(--c-divider);
}
.opinions {
  display: grid;
  grid-template-columns: repeat(2, minmax(110px, 500px));
  gap: 40px;
}
.opinion h4 {
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: 700;
  color: var(--c-text);
}
.opinion p {
  font-size: 14px;
  color: var(--c-text-2);
}
</style>
