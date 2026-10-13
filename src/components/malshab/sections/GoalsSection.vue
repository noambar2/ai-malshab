<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { goals as initialGoals, goalsMeta, goalStatuses, type Goal, type GoalStatus } from '@/data/sectionsA'

defineOptions({ inheritAttrs: false })

type ColKey = Exclude<keyof Goal, 'id'>

const columns: { key: ColKey; label: string }[] = [
  { key: 'startDate', label: 'ת. התחלה' },
  { key: 'endDate', label: 'ת. סיום' },
  { key: 'goal', label: 'יעד' },
  { key: 'status', label: 'סטטוס' },
  { key: 'statusReason', label: 'סיבת סטטוס' },
  { key: 'roofRule', label: 'חוקת גג' },
  { key: 'season', label: 'עונה' },
  { key: 'closeReason', label: 'סיבת סגירה' },
]

const rows = ref<Goal[]>([...initialGoals])
const hidden = reactive(new Set<ColKey>())
const statusFilter = reactive(new Set<GoalStatus>())
const openMenu = ref<'filter' | 'columns' | null>(null)
const selectedId = ref<number | null>(null)

const visibleColumns = computed(() => columns.filter((c) => !hidden.has(c.key)))
const visibleRows = computed(() =>
  statusFilter.size ? rows.value.filter((r) => statusFilter.has(r.status)) : rows.value,
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

function addGoal() {
  const today = new Date().toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')
  const id = Math.max(...rows.value.map((r) => r.id)) + 1
  rows.value.unshift({
    id,
    startDate: today,
    endDate: '-',
    goal: 'יעד חדש',
    status: 'בתהליך מיון',
    statusReason: 'מתוכנן למיון',
    roofRule: 'כללי',
    season: '-',
    closeReason: '-',
  })
  selectedId.value = id
}
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
        <p class="menu-title">סטטוס</p>
        <label v-for="s in goalStatuses" :key="s" class="option">
          <input type="checkbox" :checked="statusFilter.has(s)" @change="toggle(statusFilter, s)" />
          {{ s }}
        </label>
        <button v-if="statusFilter.size" class="clear" @click="statusFilter.clear()">ניקוי סינון</button>
      </div>
    </div>
    <span class="hint">
      {{ goalsMeta.inProcess }} מיונים בתהליך/ ללא שיבוץ - לחץ על שורה לפרטים מלאים ועריכה
    </span>
    <button class="btn btn-primary add" @click="addGoal">
      <AppIcon name="plus" :size="16" />
      הוספת יעד
    </button>
  </div>

  <div class="table-wrap">
    <table class="table clickable">
      <thead>
        <tr>
          <th v-for="c in visibleColumns" :key="c.key" :class="{ wide: c.key === 'goal' }">{{ c.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="r in visibleRows"
          :key="r.id"
          :class="{ selected: r.id === selectedId }"
          @click="selectedId = selectedId === r.id ? null : r.id"
        >
          <td v-for="c in visibleColumns" :key="c.key" :class="{ wide: c.key === 'goal' }">{{ r[c.key] }}</td>
        </tr>
        <tr v-if="!visibleRows.length" class="empty">
          <td :colspan="visibleColumns.length">לא נמצאו יעדים התואמים לסינון</td>
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
.hint {
  font-size: 16px;
  font-weight: 600;
}
.add {
  margin-inline-start: auto;
  padding: 0 15px 0 20px;
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
  min-width: 180px;
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
.table .wide {
  width: 250px;
  text-align: start;
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
