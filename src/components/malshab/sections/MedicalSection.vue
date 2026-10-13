<script setup lang="ts">
import { medical } from '@/data/sectionsA'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="medical">
    <div class="block">
      <p class="group-title">
        כללי - <span class="light">תאריך הזנה {{ medical.general.enteredAt }}</span>
      </p>
      <div class="fields">
        <div v-for="f in medical.general.fields" :key="f.label" class="field">
          <span class="label">{{ f.label }}</span>
          <span class="value">{{ f.value }}</span>
        </div>
      </div>
    </div>

    <div class="groups">
      <template v-for="(g, i) in medical.groups" :key="g.title">
        <span v-if="i > 0" class="vdivider" />
        <div class="block">
          <p class="group-title">{{ g.title }}</p>
          <div class="fields">
            <div v-for="f in g.fields" :key="f.label" class="field">
              <span class="label">{{ f.label }}</span>
              <span class="value" dir="ltr">{{ f.value }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.medical {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-top: 10px;
}
.block {
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
.group-title .light {
  font-weight: 400;
}
.fields {
  display: flex;
  flex-wrap: wrap;
  gap: 20px 40px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 105px;
}
.label {
  font-size: 14px;
  color: var(--c-primary-dark);
}
.value {
  font-size: 16px;
  font-weight: 700;
  color: var(--c-text);
  align-self: flex-start;
}
.groups {
  display: flex;
  align-items: stretch;
  gap: 40px;
}
.vdivider {
  width: 1px;
  background: var(--c-border);
}
</style>
