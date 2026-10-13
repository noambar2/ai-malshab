<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { allocations, type Allocation } from '@/data/sectionsA'

defineOptions({ inheritAttrs: false })

type ColKey = keyof Allocation

const columns: { key: ColKey; label: string; width?: number }[] = [
  { key: 'index', label: 'פ.', width: 100 },
  { key: 'startDate', label: 'תאריך תחילה', width: 173 },
  { key: 'endDate', label: 'תאריך סיום', width: 173 },
  { key: 'jobNumber', label: 'משרה לא.' },
  { key: 'activity', label: 'פעילות' },
  { key: 'status', label: 'סטטוס הקצאת משרה לאיוש' },
]

const statuses = [...new Set(allocations.map((a) => a.status))]

const hidden = reactive(new Set<ColKey>())
const statusFilter = reactive(new Set<string>())
const openMenu = ref<'filter' | 'columns' | null>(null)
const selected = ref<number | null>(null)

const visibleColumns = computed(() => columns.filter((c) => !hidden.has(c.key)))
const visibleRows = computed(() =>
  statusFilter.size ? allocations.filter((a) => statusFilter.has(a.status)) : allocations,
)

function toggle<T>(set: Set<T>, value: T) {
  if (set.has(value)) set.delete(value)
  else set.add(value)
}

function toggleMenu(menu: 'filter' | 'columns') {
  openMenu.value = openMenu.value === menu ? null : menu
}

function closeOnOutside(e: MouseEvent) {
  if (!(e.target as Element).closest('.menu-wrap')) openMenu.value = null
}
onMounted(() => document.addEventListener('mousedown', closeOnOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', closeOnOutside))
</script>

<template>
  <div class="toolbar">
    <div class="menu-wrap">
      <button class="icon-btn" :class="{ active: openMenu === 'columns' }" @click="toggleMenu('columns')">
        <AppIcon name="columns" :size="18" />
      </button>
      <span v-if="openMenu !== 'columns'" class="tip">בחירה וסידור עמודות</span>
      <div v-if="openMenu === 'columns'" class="menu">
        <label v-for="c in columns" :key="c.key" class="option">
          <input type="checkbox" :checked="!hidden.has(c.key)" @change="toggle(hidden, c.key)" />
          {{ c.label }}
        </label>
      </div>
    </div>
    <div class="menu-wrap">
      <button class="icon-btn" :class="{ active: openMenu === 'filter' || statusFilter.size }" @click="toggleMenu('filter')">
        <AppIcon name="filter" :size="18" />
      </button>
      <span v-if="openMenu !== 'filter'" class="tip">סינון</span>
      <div v-if="openMenu === 'filter'" class="menu">
        <p class="menu-title">סטטוס הקצאה</p>
        <label v-for="s in statuses" :key="s" class="option">
          <input type="checkbox" :checked="statusFilter.has(s)" @change="toggle(statusFilter, s)" />
          {{ s }}
        </label>
        <button v-if="statusFilter.size" class="clear" @click="statusFilter.clear()">ניקוי סינון</button>
      </div>
    </div>
  </div>

  <div class="table-wrap">
    <table class="table clickable">
      <thead>
        <tr>
          <th v-for="c in visibleColumns" :key="c.key" :style="c.width ? { width: c.width + 'px' } : undefined">
            {{ c.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(a, i) in visibleRows"
          :key="i"
          :class="{ selected: selected === i }"
          @click="selected = selected === i ? null : i"
        >
          <td v-for="c in visibleColumns" :key="c.key">{{ a[c.key] }}</td>
        </tr>
        <tr v-if="!visibleRows.length" class="empty">
          <td :colspan="visibleColumns.length">לא נמצאו הקצאות התואמות לסינון</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.icon-btn.active {
  background: var(--c-primary);
  color: #fff;
}
.menu-wrap {
  position: relative;
}
.tip {
  display: none;
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 10px;
  border-radius: 4px;
  background: var(--c-divider);
  color: #777;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 2;
}
.tip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  border: 6px solid transparent;
  border-top-color: var(--c-divider);
  transform: translateX(-50%);
}
.menu-wrap:hover .tip {
  display: block;
}
.menu {
  position: absolute;
  top: calc(100% + 6px);
  inset-inline-start: 0;
  min-width: 200px;
  padding: 10px;
  border-radius: 8px;
  background: var(--c-surface);
  box-shadow: var(--shadow-popup);
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.menu-title {
  font-size: 12px;
  color: var(--c-muted);
}
.option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}
.option input {
  accent-color: var(--c-primary);
}
.clear {
  align-self: flex-start;
  margin-top: 4px;
  font-size: 12px;
  color: var(--c-primary);
}
.table-wrap {
  border-color: var(--c-primary-soft);
  border-radius: 10px;
}
.table td {
  height: 42px;
}
.table tbody tr.selected {
  background: var(--c-row-selected);
}
.table tbody tr.empty {
  cursor: default;
}
.empty td {
  color: var(--c-muted);
  font-weight: 400;
}
</style>
