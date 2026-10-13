<script setup lang="ts">
// Directives main page. Figma ("עמוד ראשי") only gives the frame — the "דירקטיבות עתידיות" title with
// "דירקטיבה חדשה" / "שכפול דירקטיבת עבר" buttons, an empty card, and a "דירקטיבות עבר" title.
// The tables, search and filters inside are filled in here in the same visual language.
import '@/components/directives/directives.css'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from '@/components/directives/DvIcon.vue'
import DirectivesTable from '@/components/directives/DirectivesTable.vue'
import DuplicateModal from '@/components/directives/DuplicateModal.vue'
import { directivesState, directiveStatus, isPast, stations, type Directive } from '@/data/directives'

const router = useRouter()

const query = ref('')
const station = ref('')
const status = ref<'all' | 'draft' | 'scheduled'>('all')
const dupOpen = ref(false)

function matches(d: Directive) {
  const q = query.value.trim()
  if (station.value && d.station !== station.value) return false
  if (!q) return true
  return [d.id, d.station, d.owner, d.district, ...d.cohorts, ...d.baskets.map((b) => b.name)].some((s) =>
    s.includes(q),
  )
}

const future = computed(() =>
  directivesState.list
    .filter((d) => !isPast(d) && matches(d))
    .filter((d) => status.value === 'all' || directiveStatus(d) === status.value || (status.value === 'scheduled' && directiveStatus(d) === 'active'))
    .sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999')),
)
const past = computed(() =>
  directivesState.list.filter((d) => isPast(d) && matches(d)).sort((a, b) => b.date.localeCompare(a.date)),
)
const counts = computed(() => {
  const all = directivesState.list.filter((d) => !isPast(d))
  return {
    all: all.length,
    draft: all.filter((d) => d.draft).length,
    scheduled: all.filter((d) => !d.draft).length,
  }
})

function duplicate(id: string) {
  dupOpen.value = false
  router.push({ path: '/directives/new', query: { from: id } })
}
</script>

<template>
  <main class="dv-page">
    <div class="dv-title-row">
      <h1 class="dv-title">דירקטיבות עתידיות</h1>
      <div class="head-actions">
        <button class="btn btn-soft" @click="dupOpen = true">
          <DvIcon name="copy" :size="16" />
          שכפול דירקטיבת עבר
        </button>
        <RouterLink to="/directives/new" class="btn btn-primary">
          <AppIcon name="plus" :size="16" />
          דירקטיבה חדשה
        </RouterLink>
      </div>
    </div>

    <section class="dv-card list-card">
      <div class="toolbar">
        <div class="seg" role="tablist">
          <button :class="{ on: status === 'all' }" @click="status = 'all'">הכל ({{ counts.all }})</button>
          <button :class="{ on: status === 'scheduled' }" @click="status = 'scheduled'">
            מתוכננות ({{ counts.scheduled }})
          </button>
          <button :class="{ on: status === 'draft' }" @click="status = 'draft'">טיוטות ({{ counts.draft }})</button>
        </div>
        <div class="filters">
          <select v-model="station" class="dv-input station" :class="{ placeholder: !station }">
            <option value="">כל התחנות</option>
            <option v-for="s in stations" :key="s" :value="s">{{ s }}</option>
          </select>
          <label class="search">
            <AppIcon name="search" :size="18" />
            <input v-model="query" placeholder="חיפוש לפי מספר, תחנה, אחראי או סל" />
          </label>
        </div>
      </div>
      <DirectivesTable
        :rows="future"
        editable
        :empty="query || station ? 'לא נמצאו דירקטיבות עתידיות התואמות לחיפוש' : 'אין דירקטיבות עתידיות. לחצו על ״דירקטיבה חדשה״ כדי ליצור אחת.'"
      />
    </section>

    <div class="dv-title-row past-title">
      <h1 class="dv-title">דירקטיבות עבר</h1>
      <span class="count">{{ past.length }} דירקטיבות</span>
    </div>
    <section class="dv-card list-card">
      <DirectivesTable :rows="past" empty="לא נמצאו דירקטיבות עבר" />
    </section>

    <DuplicateModal v-if="dupOpen" @close="dupOpen = false" @pick="duplicate" />
  </main>
</template>

<style scoped>
.head-actions {
  display: flex;
  gap: 10px;
  margin-inline-start: auto;
}
.head-actions .btn {
  text-decoration: none;
}
.list-card {
  padding: 20px;
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}
.filters {
  display: flex;
  gap: 10px;
}
.filters .search {
  width: 300px;
}
.station {
  width: 220px;
  height: 32px;
  border-radius: 16px;
  font-size: 14px;
  background-color: #f5f8fb;
  border-color: #f5f8fb;
}
.seg {
  display: flex;
  gap: 6px;
}
.seg button {
  height: 32px;
  padding: 0 16px;
  border-radius: 16px;
  font-size: 13px;
  color: var(--c-text-2);
}
.seg button.on {
  background: var(--c-primary-soft);
  color: var(--c-primary);
  font-weight: 600;
}
.past-title {
  margin-top: 40px;
}
.count {
  font-size: 14px;
  color: var(--c-muted);
}
</style>
