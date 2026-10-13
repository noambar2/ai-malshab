<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import CallToggle from '@/components/dialer/CallToggle.vue'
import HoverTip from '@/components/dialer/HoverTip.vue'
import DialerHeader from '@/components/dialer/DialerHeader.vue'
import ColumnsPopover from '@/components/dialer/ColumnsPopover.vue'
import FilterPopover, { type FilterGroup } from '@/components/dialer/FilterPopover.vue'
import { dialerRows, dialerState, type CallDecision, type DialerRow } from '@/data/mock'
import { role } from '@/stores/role'

const router = useRouter()

// ---- Role & edit window -------------------------------------------------
// The מש״ק fills in recommendations; the רמ״ד (and פוקד, which has no frame of
// its own) approves calls and sees the מש״ק recommendation next to each row.
const isRamadView = computed(() => role.value !== 'mashak')
const decisionField = computed<'approval' | 'recommendation'>(() =>
  isRamadView.value ? 'approval' : 'recommendation',
)
const closed = computed(() => dialerState.editClosed)

function toggleClosed() {
  dialerState.editClosed = !dialerState.editClosed
  selected.value = new Set()
  showToast(dialerState.editClosed ? `הדגמה: העריכה נסגרה ב${dialerState.editLockTime}` : 'הדגמה: העריכה נפתחה מחדש')
}

// ---- Tabs / search ------------------------------------------------------
const tabs = [
  { key: 'all', label: 'כל החייגנים' },
  { key: 'before12', label: 'חייגן 1 - לפני צו 12' },
  { key: 'after12', label: 'חייגן 2 - אחרי צו 12' },
  { key: 'draftDodgers', label: 'חייגן 3 - משתמטים' },
] as const
const activeTab = ref<(typeof tabs)[number]['key']>('all')
const query = ref('')

const dialerNumber: Record<DialerRow['stageGroup'], number> = { before12: 1, after12: 2, draftDodgers: 3 }
const dialerDesc: Record<DialerRow['stageGroup'], string> = {
  before12: 'לפני הכרזת צו 12',
  after12: 'אחרי הכרזת צו 12',
  draftDodgers: 'משתמטים',
}

const decisionLabels: Record<CallDecision, string> = {
  approved: 'אושרה',
  rejected: 'לא אושרה',
  pending: 'לא הוחלט',
}
const recommendationLabels: Record<CallDecision, string> = {
  approved: 'אישר',
  rejected: 'לא אישר',
  pending: 'ממתין להמלצה',
}

// ---- Columns ------------------------------------------------------------
type ColumnKey =
  | 'status'
  | 'recommendation'
  | 'personalNumber'
  | 'idNumber'
  | 'fullName'
  | 'dialer'
  | 'dialerDesc'
  | 'gender'
  | 'birthDate'
  | 'age'
  | 'track'
  | 'office'

const statusLabel = computed(() => (closed.value ? 'סטטוס שיחה' : 'אישור שיחה'))
const columnLabels = computed<Record<ColumnKey, string>>(() => ({
  status: statusLabel.value,
  recommendation: 'המלצת מש״ק',
  personalNumber: 'מספר אישי',
  idNumber: 'תעודת זהות',
  fullName: 'שם מלא',
  dialer: 'חייגן',
  dialerDesc: 'תיאור חייגן',
  gender: 'מגדר',
  birthDate: 'תאריך לידה',
  age: 'גיל',
  track: 'טווח מועמד',
  office: 'לשכה',
}))

const columnOrder = ref<ColumnKey[]>([
  'status',
  'recommendation',
  'personalNumber',
  'idNumber',
  'fullName',
  'dialer',
  'dialerDesc',
  'gender',
  'birthDate',
  'age',
  'track',
  'office',
])
const hiddenColumns = ref(new Set<ColumnKey>(['dialerDesc']))

const availableColumns = computed(() =>
  columnOrder.value.filter((k) => k !== 'recommendation' || isRamadView.value),
)
const visibleColumns = computed(() => availableColumns.value.filter((k) => !hiddenColumns.value.has(k)))
const columnsForPopover = computed(() =>
  availableColumns.value.map((k) => ({ key: k, label: columnLabels.value[k], visible: !hiddenColumns.value.has(k) })),
)

function toggleColumn(key: string) {
  const next = new Set(hiddenColumns.value)
  const k = key as ColumnKey
  if (next.has(k)) next.delete(k)
  else if (visibleColumns.value.length > 1) next.add(k)
  hiddenColumns.value = next
}

function moveColumn(from: string, to: string) {
  const arr = [...columnOrder.value]
  const fi = arr.indexOf(from as ColumnKey)
  const ti = arr.indexOf(to as ColumnKey)
  if (fi < 0 || ti < 0 || fi === ti) return
  arr.splice(fi, 1)
  arr.splice(ti, 0, from as ColumnKey)
  columnOrder.value = arr
}

function cellText(row: DialerRow, key: ColumnKey): string {
  switch (key) {
    case 'dialer':
      return String(dialerNumber[row.stageGroup])
    case 'dialerDesc':
      return dialerDesc[row.stageGroup]
    case 'status':
      return decisionLabels[row[decisionField.value]]
    case 'recommendation':
      return recommendationLabels[row.recommendation]
    default:
      return String(row[key])
  }
}

// ---- Header drag-to-reorder + sort --------------------------------------
const dragCol = ref<ColumnKey | null>(null)
const overCol = ref<ColumnKey | null>(null)

function onThDragStart(e: DragEvent, key: ColumnKey) {
  dragCol.value = key
  e.dataTransfer?.setData('text/plain', key)
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}
function onThDragOver(e: DragEvent, key: ColumnKey) {
  if (!dragCol.value) return
  e.preventDefault()
  overCol.value = key
}
function onThDrop(key: ColumnKey) {
  if (dragCol.value && dragCol.value !== key) moveColumn(dragCol.value, key)
  dragCol.value = overCol.value = null
}
function onThDragEnd() {
  dragCol.value = overCol.value = null
}

const sort = ref<{ key: ColumnKey; dir: 1 | -1 } | null>(null)
function toggleSort(key: ColumnKey) {
  if (sort.value?.key !== key) sort.value = { key, dir: 1 }
  else if (sort.value.dir === 1) sort.value = { key, dir: -1 }
  else sort.value = null
}

const decisionRank: Record<CallDecision, number> = { approved: 0, rejected: 1, pending: 2 }
function sortValue(row: DialerRow, key: ColumnKey): string | number {
  if (key === 'age') return row.age
  if (key === 'dialer') return dialerNumber[row.stageGroup]
  if (key === 'status') return decisionRank[row[decisionField.value]]
  if (key === 'recommendation') return decisionRank[row.recommendation]
  if (key === 'birthDate') return row.birthDate.split('.').reverse().join('')
  return cellText(row, key)
}

// ---- Filters ------------------------------------------------------------
const filters = ref<Record<string, string[]>>({})
const unique = (values: string[]) => [...new Set(values)].map((v) => ({ value: v, label: v }))

const filterGroups = computed<FilterGroup[]>(() => {
  const groups: FilterGroup[] = [
    {
      key: 'status',
      label: statusLabel.value,
      options: (Object.keys(decisionLabels) as CallDecision[]).map((v) => ({ value: v, label: decisionLabels[v] })),
    },
  ]
  if (isRamadView.value)
    groups.push({
      key: 'recommendation',
      label: 'המלצת מש״ק',
      options: (Object.keys(recommendationLabels) as CallDecision[]).map((v) => ({
        value: v,
        label: recommendationLabels[v],
      })),
    })
  groups.push(
    {
      key: 'dialer',
      label: 'חייגן',
      options: tabs.slice(1).map((t) => ({ value: t.key, label: t.label })),
    },
    { key: 'gender', label: 'מגדר', options: unique(dialerRows.map((r) => r.gender)) },
    { key: 'track', label: 'טווח מועמד', options: unique(dialerRows.map((r) => r.track)) },
    { key: 'office', label: 'לשכה', options: unique(dialerRows.map((r) => r.office)) },
  )
  return groups
})

// Only filters for groups that exist in the current view count.
const activeFilters = computed(() => {
  const keys = new Set(filterGroups.value.map((g) => g.key))
  return Object.entries(filters.value).filter(([k, v]) => keys.has(k) && v.length)
})

function filterValue(row: DialerRow, group: string): string {
  switch (group) {
    case 'status':
      return row[decisionField.value]
    case 'recommendation':
      return row.recommendation
    case 'dialer':
      return row.stageGroup
    case 'gender':
      return row.gender
    case 'track':
      return row.track
    case 'office':
      return row.office
    default:
      return ''
  }
}

// ---- Rows ---------------------------------------------------------------
const rows = computed(() => {
  const q = query.value.trim()
  const list = dialerRows.filter((r) => {
    if (activeTab.value !== 'all' && r.stageGroup !== activeTab.value) return false
    for (const [group, values] of activeFilters.value) if (!values.includes(filterValue(r, group))) return false
    if (!q) return true
    return [r.fullName, r.idNumber, r.personalNumber, r.office, r.track].some((v) => v.includes(q))
  })
  const s = sort.value
  if (!s) return list
  return [...list].sort((a, b) => {
    const va = sortValue(a, s.key)
    const vb = sortValue(b, s.key)
    const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), 'he')
    return cmp * s.dir
  })
})

const stats = computed(() => {
  const field = decisionField.value
  const count = (d: CallDecision) => dialerRows.filter((r) => r[field] === d).length
  return {
    total: dialerRows.length,
    approved: count('approved'),
    rejected: count('rejected'),
    pending: count('pending'),
  }
})

// ---- Selection + bulk actions (kept from the earlier version) -------------
const selected = ref(new Set<string>())
const allSelected = computed(
  () => rows.value.length > 0 && rows.value.every((r) => selected.value.has(r.id)),
)

function toggle(row: DialerRow) {
  const next = new Set(selected.value)
  if (next.has(row.id)) next.delete(row.id)
  else next.add(row.id)
  selected.value = next
}
function toggleAll() {
  selected.value = allSelected.value ? new Set() : new Set(rows.value.map((r) => r.id))
}

function setSelected(decision: CallDecision) {
  const count = selected.value.size
  for (const r of dialerRows) if (selected.value.has(r.id)) r[decisionField.value] = decision
  selected.value = new Set()
  const verb = isRamadView.value
    ? decision === 'approved' ? 'אושרו' : 'בוטלו'
    : decision === 'approved' ? 'סומנו כמומלצות' : 'סומנו כלא מומלצות'
  showToast(`${count} שיחות ${verb}`)
}

// ---- Toast --------------------------------------------------------------
const toast = ref<{ msg: string; undo?: () => void } | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | undefined
function showToast(msg: string, undo?: () => void) {
  toast.value = { msg, undo }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = null), undo ? 5000 : 2500)
}
function runUndo() {
  toast.value?.undo?.()
  toast.value = null
}

// ---- Copy מש״ק recommendations (רמ״ד only) --------------------------------
const copied = ref(false)
function copyRecommendations() {
  const changes = dialerRows
    .filter((r) => r.recommendation !== 'pending' && r.approval !== r.recommendation)
    .map((r) => ({ row: r, prev: r.approval }))
  if (!changes.length) {
    showToast('כל השיחות כבר תואמות להמלצת המש״ק')
    return
  }
  for (const c of changes) c.row.approval = c.row.recommendation
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
  showToast(`${changes.length} שיחות מולאו לפי המלצת המש״ק`, () => {
    for (const c of changes) c.row.approval = c.prev
  })
}

// ---- Refresh ------------------------------------------------------------
const refreshing = ref(false)
function refresh() {
  if (refreshing.value) return
  refreshing.value = true
  setTimeout(() => {
    const now = new Date()
    dialerState.lastUpdated = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    refreshing.value = false
  }, 700)
}

// ---- Popovers -----------------------------------------------------------
const openPop = ref<'columns' | 'filter' | null>(null)
const columnsAnchor = ref<HTMLElement | null>(null)
const filterAnchor = ref<HTMLElement | null>(null)

function togglePop(which: 'columns' | 'filter') {
  openPop.value = openPop.value === which ? null : which
}
function onDocPointer(e: MouseEvent) {
  const t = e.target as Node
  if (openPop.value === 'columns' && columnsAnchor.value?.contains(t)) return
  if (openPop.value === 'filter' && filterAnchor.value?.contains(t)) return
  openPop.value = null
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') openPop.value = null
}
onMounted(() => {
  document.addEventListener('mousedown', onDocPointer)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocPointer)
  document.removeEventListener('keydown', onKey)
  clearTimeout(toastTimer)
})

// Switching role changes which field the toggles edit; drop a stale selection.
watch(role, () => (selected.value = new Set()))
</script>

<template>
  <main class="page">
    <DialerHeader
      :closed="closed"
      :lock-time="dialerState.editLockTime"
      v-bind="stats"
      @back="router.back()"
      @toggle-closed="toggleClosed"
    />

    <div class="content">
      <div class="toolbar">
        <label class="search general-search">
          <AppIcon name="search" :size="20" />
          <input v-model="query" type="text" placeholder="חיפוש כללי" />
        </label>

        <HoverTip v-if="isRamadView && !closed" text="מילוי כל הפוטנציאל לפי המלצת מש״ק">
          <button type="button" class="btn btn-soft copy-btn" @click="copyRecommendations">
            {{ copied ? 'הועתק' : 'העתק מש״ק' }}
            <AppIcon v-if="copied" name="check" :size="20" />
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M9 2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm0 1.6a.4.4 0 0 0-.4.4v12c0 .22.18.4.4.4h10a.4.4 0 0 0 .4-.4V4a.4.4 0 0 0-.4-.4H9ZM3 7h1.6v13c0 .22.18.4.4.4h11V22H5a2 2 0 0 1-2-2V7Z"
              />
            </svg>
          </button>
        </HoverTip>

        <div ref="columnsAnchor" class="pop-anchor">
          <HoverTip text="בחירה וסידור עמודות" :hidden="openPop === 'columns'">
            <button
              type="button"
              class="icon-btn"
              :class="{ pressed: openPop === 'columns' }"
              aria-label="בחירה וסידור עמודות"
              :aria-expanded="openPop === 'columns'"
              @click="togglePop('columns')"
            >
              <AppIcon name="columns" :size="20" />
            </button>
          </HoverTip>
          <ColumnsPopover
            v-if="openPop === 'columns'"
            :columns="columnsForPopover"
            @toggle="toggleColumn"
            @move="moveColumn"
          />
        </div>

        <div ref="filterAnchor" class="pop-anchor">
          <HoverTip text="סינון" :hidden="openPop === 'filter'">
            <button
              type="button"
              class="icon-btn"
              :class="{ pressed: openPop === 'filter' }"
              aria-label="סינון"
              :aria-expanded="openPop === 'filter'"
              @click="togglePop('filter')"
            >
              <AppIcon name="filter" :size="20" />
              <span v-if="activeFilters.length" class="dot" />
            </button>
          </HoverTip>
          <FilterPopover v-if="openPop === 'filter'" v-model="filters" :groups="filterGroups" />
        </div>

        <HoverTip v-if="!closed" :text="`עודכן לאחרונה בשעה ${dialerState.lastUpdated}`">
          <button type="button" class="icon-btn" aria-label="רענון" @click="refresh">
            <AppIcon name="refresh" :size="18" :class="{ spin: refreshing }" />
          </button>
        </HoverTip>

        <div class="segmented">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="table-box">
        <table class="table clickable dialer-table">
          <thead>
            <tr>
              <th v-if="!closed" class="check-col">
                <input type="checkbox" class="checkbox" :checked="allSelected" aria-label="בחירת הכל" @change="toggleAll" />
              </th>
              <th
                v-for="key in visibleColumns"
                :key="key"
                draggable="true"
                :class="[
                  `col-${key}`,
                  {
                    dragging: dragCol === key,
                    'drop-target': overCol === key && dragCol !== key,
                    sorted: sort?.key === key,
                  },
                ]"
                :aria-sort="sort?.key === key ? (sort.dir === 1 ? 'ascending' : 'descending') : undefined"
                title="לחצו למיון, גררו להזזת העמודה"
                @click="toggleSort(key)"
                @dragstart="onThDragStart($event, key)"
                @dragover="onThDragOver($event, key)"
                @dragleave="overCol === key && (overCol = null)"
                @drop.prevent="onThDrop(key)"
                @dragend="onThDragEnd"
              >
                <span class="th-inner">
                  <span>{{ columnLabels[key] }}</span>
                  <svg
                    class="sort-arrow"
                    :class="{ desc: sort?.key === key && sort.dir === -1 }"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M11.25 19V7.87l-4.72 4.72L5.47 11.5 12 5l6.53 6.5-1.06 1.09-4.72-4.72V19h-1.5Z" />
                  </svg>
                  <svg class="grip" width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
                    <circle cx="3.5" cy="3" r="1.3" />
                    <circle cx="8.5" cy="3" r="1.3" />
                    <circle cx="3.5" cy="7" r="1.3" />
                    <circle cx="8.5" cy="7" r="1.3" />
                    <circle cx="3.5" cy="11" r="1.3" />
                    <circle cx="8.5" cy="11" r="1.3" />
                  </svg>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in rows"
              :key="row.id"
              :class="{ selected: selected.has(row.id) }"
              @click="router.push('/malshab')"
            >
              <td v-if="!closed" class="check-col" @click.stop>
                <input
                  type="checkbox"
                  class="checkbox"
                  :checked="selected.has(row.id)"
                  :aria-label="`בחירת ${row.fullName}`"
                  @change="toggle(row)"
                />
              </td>
              <td v-for="key in visibleColumns" :key="key" :class="`col-${key}`">
                <template v-if="key === 'status'">
                  <span v-if="closed" class="status-pill" :class="row[decisionField]">
                    {{ decisionLabels[row[decisionField]] }}
                  </span>
                  <span v-else class="toggle-cell" @click.stop>
                    <CallToggle v-model="row[decisionField]" />
                  </span>
                </template>
                <span
                  v-else-if="key === 'recommendation'"
                  class="rec-icon"
                  :class="row.recommendation"
                  :title="`המלצת מש״ק: ${recommendationLabels[row.recommendation]}`"
                >
                  <AppIcon v-if="row.recommendation === 'approved'" name="call" :size="14" />
                  <AppIcon v-else-if="row.recommendation === 'rejected'" name="call-end" :size="14" />
                </span>
                <template v-else>{{ cellText(row, key) }}</template>
              </td>
            </tr>
            <tr v-if="!rows.length" class="empty">
              <td :colspan="visibleColumns.length + (closed ? 0 : 1)">לא נמצאו מלש״בים</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Transition name="bulk">
      <div v-if="selected.size && !closed" class="bulk-bar">
        <span class="bulk-count">{{ selected.size }} נבחרו</span>
        <button type="button" class="btn btn-primary" @click="setSelected('approved')">
          <AppIcon name="call" :size="14" />
          {{ isRamadView ? 'אישור שיחה' : 'המלצה לאשר' }}
        </button>
        <button type="button" class="btn btn-soft" @click="setSelected('rejected')">
          <AppIcon name="call-end" :size="16" />
          {{ isRamadView ? 'ביטול שיחה' : 'המלצה לא לאשר' }}
        </button>
        <button type="button" class="btn btn-soft" @click="setSelected('pending')">איפוס</button>
        <button type="button" class="bulk-close" aria-label="ניקוי בחירה" @click="selected = new Set()">
          <AppIcon name="close" :size="18" />
        </button>
      </div>
    </Transition>

    <Transition name="toast">
      <div v-if="toast" class="toast" :class="{ raised: selected.size && !closed }">
        {{ toast.msg }}
        <button v-if="toast.undo" type="button" class="toast-undo" @click="runUndo">ביטול</button>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.page {
  min-height: calc(100vh - 56px);
  background: #fff;
}
.content {
  padding: 30px;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.general-search {
  width: 240px;
  border-radius: 22px;
  padding: 0 15px;
}
.copy-btn {
  padding: 0 15px 0 20px;
  gap: 5px;
}
.pop-anchor {
  position: relative;
  display: inline-flex;
}
.icon-btn {
  position: relative;
  transition: background 0.15s;
}
.icon-btn:hover,
.icon-btn.pressed {
  background: #dce5ff;
}
.dot {
  position: absolute;
  top: 0;
  left: 1px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-primary);
  box-shadow: 0 0 0 1.5px #fff;
}
.spin {
  animation: spin 0.7s linear;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}
.segmented {
  margin-inline-start: auto;
  display: flex;
  height: 32px;
  border: 1px solid var(--c-border);
  border-radius: 22px;
  overflow: hidden;
  background: #fff;
}
.segmented button {
  min-width: 70px;
  padding: 0 20px;
  font-size: 14px;
  color: var(--c-muted);
  white-space: nowrap;
  border-inline-start: 1px solid var(--c-border);
}
.segmented button:first-child {
  border-inline-start: 0;
}
.segmented button.active {
  background: var(--c-primary-soft);
  color: var(--c-primary);
  font-weight: 500;
}

/* Table */
.table-box {
  border: 1px solid #ebf0ff;
  border-radius: 10px;
  overflow: auto;
}
.dialer-table th,
.dialer-table td {
  text-align: start;
  padding: 0 12px;
  white-space: nowrap;
}
.dialer-table td {
  color: var(--c-text);
}
.dialer-table th {
  position: relative;
  cursor: pointer;
  user-select: none;
}
.dialer-table th:hover {
  background: #eceef6;
}
.th-inner {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.sort-arrow,
.grip {
  opacity: 0;
  color: var(--c-muted-2);
  transition: opacity 0.15s, transform 0.15s;
}
.grip {
  cursor: grab;
}
.dialer-table th:hover .sort-arrow,
.dialer-table th:hover .grip {
  opacity: 0.8;
}
.dialer-table th.sorted .sort-arrow {
  opacity: 1;
  color: var(--c-primary);
}
.sort-arrow.desc {
  transform: rotate(180deg);
}
.dialer-table th.dragging {
  opacity: 0.4;
}
.dialer-table th.drop-target {
  box-shadow: inset 0 -2px 0 var(--c-primary);
  background: var(--c-primary-soft);
}
.dialer-table .col-status,
.dialer-table .col-recommendation {
  text-align: center;
}
.dialer-table th.col-status .th-inner,
.dialer-table th.col-recommendation .th-inner {
  justify-content: center;
}
.col-status {
  width: 138px;
}
.col-recommendation {
  width: 100px;
}
.toggle-cell {
  display: inline-flex;
}
.rec-icon {
  display: inline-flex;
  opacity: 0.5;
  vertical-align: middle;
}
.rec-icon.approved {
  color: var(--c-success);
}
.rec-icon.rejected {
  color: var(--c-danger);
}
.status-pill {
  display: inline-block;
  min-width: 92px;
  padding: 7px 20px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}
.status-pill.approved {
  background: #daf9ec;
  color: #06a561;
}
.status-pill.rejected {
  background: #ffe5e8;
  color: var(--c-danger);
}
.status-pill.pending {
  background: #e6e9f4;
  color: var(--c-muted-2);
}
.check-col {
  width: 48px;
}
.checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--c-primary);
  cursor: pointer;
  vertical-align: middle;
}
.dialer-table tbody tr.selected {
  background: var(--c-row-selected);
}
.empty td {
  color: var(--c-muted);
  height: 80px;
  text-align: center;
}

/* Bulk bar */
.bulk-bar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 40px;
  background: #fff;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.18);
  z-index: 50;
}
.bulk-count {
  font-weight: 500;
  padding-inline-end: 6px;
}
.bulk-close {
  display: flex;
  color: var(--c-muted);
}
.bulk-enter-active,
.bulk-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.bulk-enter-from,
.bulk-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

/* Toast */
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--c-text);
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  box-shadow: var(--shadow-popup);
  z-index: 60;
  transition: bottom 0.2s;
}
.toast.raised {
  bottom: 90px;
}
.toast-undo {
  color: #9db7ff;
  font-weight: 700;
}
.toast-undo:hover {
  text-decoration: underline;
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}
</style>
