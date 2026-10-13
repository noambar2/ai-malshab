<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import { dialerRows, editLockTime, lastUpdated, type DialerRow } from '@/data/mock'

const router = useRouter()

const tabs = [
  { key: 'all', label: 'כל החייגנים' },
  { key: 'before12', label: 'לפני הכרזת צו 12' },
  { key: 'after12', label: 'אחרי הכרזת צו 12' },
  { key: 'draftDodgers', label: 'משתמטים' },
] as const

const activeTab = ref<(typeof tabs)[number]['key']>('all')
const query = ref('')
const selected = ref(new Set<string>())
const sentIds = ref(new Set<string>())
const toast = ref('')

const rows = computed(() =>
  dialerRows.filter((r) => {
    if (activeTab.value !== 'all' && r.stageGroup !== activeTab.value) return false
    const q = query.value.trim()
    if (!q) return true
    return [r.fullName, r.idNumber, r.office, r.track].some((v) => v.includes(q))
  }),
)

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

function showToast(msg: string) {
  toast.value = msg
  setTimeout(() => (toast.value = ''), 2500)
}

function confirmSend() {
  const count = selected.value.size
  sentIds.value = new Set([...sentIds.value, ...selected.value])
  selected.value = new Set()
  showToast(`${count} מלש״בים נשלחו לחייגן`)
}

function cancelSend() {
  selected.value = new Set()
  showToast('השליחה בוטלה')
}
</script>

<template>
  <main class="page">
    <div class="title-row">
      <h1>פוטנציאל לחייגן</h1>
      <button class="icon-btn refresh" title="רענון">
        <AppIcon name="refresh" :size="18" />
      </button>
      <span class="meta">עודכן לאחרונה בשעה {{ lastUpdated }}</span>
      <span class="meta lock">העריכה תיסגר בשעה {{ editLockTime }}</span>
    </div>

    <section class="card panel">
      <div class="toolbar">
        <label class="search general-search">
          <AppIcon name="search" :size="18" />
          <input v-model="query" type="text" placeholder="חיפוש כללי" />
        </label>
        <div class="segmented">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
        <button class="icon-btn" title="עמודות"><AppIcon name="columns" :size="18" /></button>
        <button class="icon-btn" title="סינון"><AppIcon name="filter" :size="18" /></button>

        <div class="send-actions">
          <button
            class="btn"
            :class="selected.size ? 'btn-soft' : 'btn-idle'"
            :disabled="!selected.size"
            @click="cancelSend"
          >
            <AppIcon name="call-end" :size="16" />
            ביטול שליחה
          </button>
          <button
            class="btn"
            :class="selected.size ? 'btn-primary' : 'btn-idle'"
            :disabled="!selected.size"
            @click="confirmSend"
          >
            <AppIcon name="call" :size="14" />
            אישור שליחה
          </button>
        </div>
      </div>

      <div class="table-wrap">
        <table class="table clickable">
          <thead>
            <tr>
              <th class="check-col">
                <input type="checkbox" class="checkbox" :checked="allSelected" @change="toggleAll" />
              </th>
              <th>סטטוס</th>
              <th>תעודת זהות</th>
              <th>שם מלא</th>
              <th>מגדר</th>
              <th>גיל</th>
              <th>תאריך לידה</th>
              <th>שלב בתהליך</th>
              <th>טווח מועמד</th>
              <th>לשכה</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in rows"
              :key="row.id"
              :class="{ selected: selected.has(row.id) }"
              @click="router.push('/malshab')"
            >
              <td class="check-col" @click.stop>
                <input
                  type="checkbox"
                  class="checkbox"
                  :checked="selected.has(row.id)"
                  @change="toggle(row)"
                />
              </td>
              <td>
                <span
                  class="call-status"
                  :class="sentIds.has(row.id) || row.callStatus === 'answered' ? 'answered' : 'missed'"
                >
                  <AppIcon
                    :name="sentIds.has(row.id) || row.callStatus === 'answered' ? 'call' : 'call-end'"
                    :size="12"
                  />
                </span>
              </td>
              <td>{{ row.idNumber }}</td>
              <td>{{ row.fullName }}</td>
              <td>{{ row.gender }}</td>
              <td>{{ row.age }}</td>
              <td>{{ row.birthDate }}</td>
              <td>{{ row.stage }}</td>
              <td>{{ row.track }}</td>
              <td>{{ row.office }}</td>
            </tr>
            <tr v-if="!rows.length" class="empty">
              <td colspan="10">לא נמצאו מלש״בים</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <Transition name="toast">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </Transition>
  </main>
</template>

<style scoped>
.page {
  padding: 30px;
  max-width: 1280px;
  margin: 0 auto;
}
.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
h1 {
  font-size: 24px;
  font-weight: 500;
  color: var(--c-primary-dark);
}
.meta {
  font-size: 12px;
  color: var(--c-muted);
}
.lock {
  margin-inline-start: auto;
}
.panel {
  padding: 30px;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.general-search {
  width: 240px;
}
.segmented {
  display: flex;
  height: 32px;
  border: 1px solid var(--c-border);
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
}
.segmented button {
  min-width: 100px;
  padding: 0 20px;
  font-size: 14px;
  color: var(--c-muted);
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
.send-actions {
  margin-inline-start: auto;
  display: flex;
  gap: 10px;
}
.btn-idle:disabled {
  background: #eff1f4;
  color: var(--c-muted);
}
.check-col {
  width: 48px;
}
.checkbox {
  width: 20px;
  height: 20px;
  accent-color: var(--c-primary);
  cursor: pointer;
  vertical-align: middle;
}
.table td {
  color: var(--c-text);
}
.table tbody tr.selected {
  background: var(--c-row-selected);
}
.call-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: #fff;
  vertical-align: middle;
}
.call-status.missed {
  background: var(--c-danger);
}
.call-status.answered {
  background: var(--c-success);
}
.empty td {
  color: var(--c-muted);
  height: 80px;
}
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--c-text);
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  box-shadow: var(--shadow-popup);
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
