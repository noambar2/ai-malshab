<script setup lang="ts">
import { sayarotFields, sayarotFlags } from '@/data/sectionsB'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="layout">
    <div v-for="f in sayarotFields" :key="f.label" class="field">
      <span class="label">{{ f.label }}</span>
      <span class="value">{{ f.value }}</span>
    </div>

    <ul class="flags">
      <li v-for="flag in sayarotFlags" :key="flag.label">
        <button class="flag" :class="{ done: flag.done }" @click="flag.done = !flag.done">
          <span class="mark" aria-hidden="true">
            <svg v-if="flag.done" width="10" height="8" viewBox="0 0 10 8">
              <path d="M1 4.2 3.7 7 9 1" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else width="8" height="8" viewBox="0 0 8 8">
              <path d="m1.5 1.5 5 5m0-5-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
            </svg>
          </span>
          {{ flag.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  align-items: flex-start;
  gap: 40px;
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
.flags {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0;
  list-style: none;
}
.flag {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 500;
  color: var(--c-text);
  white-space: nowrap;
}
.flag:not(.done) {
  color: rgba(51, 60, 93, 0.5);
}
.mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e6e8f0;
  color: var(--c-muted-2);
  transition: background 0.15s;
}
.flag.done .mark {
  background: var(--c-primary);
}
.flag:hover .mark {
  box-shadow: 0 0 0 3px var(--c-primary-soft);
}
</style>
