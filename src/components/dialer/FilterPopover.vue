<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'

export interface FilterGroup {
  key: string
  label: string
  options: { value: string; label: string }[]
}

// "סינון" popover: one accordion group per filterable column, checkbox per value.
// An empty group means "no filter on this column".
const props = defineProps<{ groups: FilterGroup[]; modelValue: Record<string, string[]> }>()
const emit = defineEmits<{ 'update:modelValue': [Record<string, string[]>] }>()

const openKey = ref<string | null>(props.groups[0]?.key ?? null)

function isChecked(group: string, value: string) {
  return props.modelValue[group]?.includes(value) ?? false
}

function toggle(group: string, value: string) {
  const current = props.modelValue[group] ?? []
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
  emit('update:modelValue', { ...props.modelValue, [group]: next })
}

function clearAll() {
  emit('update:modelValue', {})
}

function count(group: string) {
  return props.modelValue[group]?.length ?? 0
}
</script>

<template>
  <div class="popover" role="dialog" aria-label="סינון">
    <div class="pop-head">
      <span>סינון</span>
      <button type="button" class="clear" @click="clearAll">נקה הכל</button>
    </div>
    <div v-for="g in groups" :key="g.key" class="group" :class="{ open: openKey === g.key }">
      <button
        type="button"
        class="group-head"
        :aria-expanded="openKey === g.key"
        @click="openKey = openKey === g.key ? null : g.key"
      >
        <span>
          {{ g.label }}
          <span v-if="count(g.key)" class="count">{{ count(g.key) }}</span>
        </span>
        <AppIcon :name="openKey === g.key ? 'chevron-up' : 'chevron-down'" :size="15" />
      </button>
      <div v-if="openKey === g.key" class="options">
        <label v-for="o in g.options" :key="o.value" class="option">
          <input type="checkbox" :checked="isChecked(g.key, o.value)" @change="toggle(g.key, o.value)" />
          <span>{{ o.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popover {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  width: 190px;
  max-height: 460px;
  overflow-y: auto;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
  z-index: 40;
  text-align: start;
}
.pop-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid #ebf0ff;
  font-size: 12px;
  font-weight: 500;
  color: var(--c-text);
}
.clear {
  padding: 2px 5px;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 500;
  color: var(--c-primary);
}
.clear:hover {
  background: var(--c-primary-soft);
}
.group {
  border-bottom: 1px solid #ebf0ff;
}
.group:last-child {
  border-bottom: 0;
}
.group-head {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--c-text);
  background: #fff;
  text-align: start;
}
.group-head:hover {
  background: #f9f9fe;
}
.group.open .group-head {
  position: relative;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
}
.group-head :deep(.app-icon) {
  color: var(--c-muted-2);
}
.count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  margin-inline-start: 4px;
  padding: 0 4px;
  border-radius: 8px;
  background: var(--c-primary);
  color: #fff;
  font-size: 10px;
}
.options {
  padding: 8px 0;
}
.option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 7px 12px;
  font-size: 14px;
  color: var(--c-text);
  cursor: pointer;
}
.option:hover {
  background: #f9f9fe;
}
.option input {
  width: 18px;
  height: 18px;
  accent-color: var(--c-primary);
  cursor: pointer;
}
</style>
