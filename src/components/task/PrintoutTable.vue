<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import TonePill from './TonePill.vue'
import type { PrintoutTable } from '@/data/tasks'

const props = defineProps<{ table: PrintoutTable }>()

const open = ref(true)
const query = ref('')
const sortKey = ref<string | null>(null)
const sortDesc = ref(false)

const rows = computed(() => {
  const q = query.value.trim()
  let list = q
    ? props.table.rows.filter((r) => Object.values(r).some((v) => v.includes(q)))
    : [...props.table.rows]
  if (sortKey.value) {
    const k = sortKey.value
    list = list.sort((a, b) => (a[k] ?? '').localeCompare(b[k] ?? '', 'he', { numeric: true }) * (sortDesc.value ? -1 : 1))
  }
  return list
})

function toggleSort(key: string) {
  if (sortKey.value === key) sortDesc.value = !sortDesc.value
  else {
    sortKey.value = key
    sortDesc.value = false
  }
}

function refresh() {
  query.value = ''
  sortKey.value = null
}

// Tables have different column counts, so the first column and the status column get the
// same fixed width in every table and the middle columns share the rest evenly. This keeps
// the start, the end and the status pills on the same vertical guides across tables.
const FIRST = 16
const STATUS = 14
// Long free-text columns get a bit more of the middle share.
const weight = (key: string) => (key === 'reason' ? 1.8 : 1)
const middleTotal = computed(() =>
  props.table.columns.slice(1).reduce((sum, c) => sum + weight(c.key), 0),
)
const middleWidth = (key: string) => `${((100 - FIRST - STATUS) * weight(key)) / middleTotal.value}%`
</script>

<template>
  <div class="block">
    <div class="head">
      <button class="toggle" :aria-expanded="open" @click="open = !open">
        <span>{{ table.title }} ({{ table.rows.length }})</span>
        <AppIcon :name="open ? 'chevron-up' : 'chevron-down'" :size="18" />
      </button>
      <div v-if="open" class="tools">
        <button class="icon-btn small" title="רענון" @click="refresh">
          <AppIcon name="refresh" :size="14" />
        </button>
        <button class="icon-btn small" title="עמודות">
          <AppIcon name="columns" :size="14" />
        </button>
        <button class="icon-btn small" title="סינון">
          <AppIcon name="filter" :size="14" />
        </button>
        <label class="search">
          <AppIcon name="search" :size="16" />
          <input v-model="query" type="text" placeholder="חיפוש כללי" />
        </label>
      </div>
    </div>
    <div v-if="open" class="table-wrap">
      <table class="table anchored">
        <colgroup>
          <col class="anchor-first" />
          <col v-for="c in table.columns.slice(1)" :key="c.key" :style="{ width: middleWidth(c.key) }" />
          <col class="anchor-status" />
        </colgroup>
        <thead>
          <tr>
            <th v-for="c in table.columns" :key="c.key">
              <button v-if="c.sortable" class="sort" @click="toggleSort(c.key)">
                {{ c.label }}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" :class="{ flip: sortKey === c.key && sortDesc }">
                  <path d="M11 4h2v12.2l4.6-4.6 1.4 1.4-7 7-7-7 1.4-1.4 4.6 4.6V4Z" />
                </svg>
              </button>
              <template v-else>{{ c.label }}</template>
            </th>
            <th>סטטוס</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in rows" :key="i">
            <td v-for="c in table.columns" :key="c.key">
              <span v-if="c.key === 'reason' && r.reasonCode" class="code">{{ r.reasonCode }}</span>
              {{ r[c.key] }}
            </td>
            <td>
              <TonePill v-bind="table.status(r)" />
            </td>
          </tr>
          <tr v-if="!rows.length">
            <td :colspan="table.columns.length + 1" class="empty">לא נמצאו תוצאות</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  margin-bottom: 10px;
}
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 500;
  color: var(--c-muted);
}
.tools {
  display: flex;
  align-items: center;
  gap: 10px;
}
.icon-btn.small {
  width: 24px;
  height: 24px;
}
.search {
  width: 238px;
}
.anchored {
  table-layout: fixed;
}
.anchor-first {
  width: 16%;
}
.anchor-status {
  width: 14%;
}
.anchored td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.table td {
  font-size: 16px;
  font-weight: 400;
  height: 46px;
}
.code {
  color: var(--c-muted);
  margin-inline-end: 4px;
}
.sort {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: inherit;
}
.flip {
  transform: rotate(180deg);
}
.empty {
  color: var(--c-muted);
}
</style>
