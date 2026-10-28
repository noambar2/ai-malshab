<script setup lang="ts">
// Directives main page. Figma ("עמוד ראשי") only gives the frame — the "דירקטיבות עתידיות" title with
// "דירקטיבה חדשה" / "שכפול דירקטיבת עבר" buttons, an empty card, and a "דירקטיבות עבר" title.
// The cards, search and filters inside are filled in here in the same visual language.
import '@/components/directives/directives.css'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from '@/components/directives/DvIcon.vue'
import DirectiveCards from '@/components/directives/DirectiveCards.vue'
import DuplicateModal from '@/components/directives/DuplicateModal.vue'
import { directivesState, directiveStatus, isPast, stations, type Directive } from '@/data/directives'

const router = useRouter()

const query = ref('')
const station = ref('')
const status = ref<'all' | 'draft' | 'scheduled'>('all')
const dupOpen = ref(false)

// Cards or table rows; remembered per browser (a convenience, so it may come back empty).
const VIEW_KEY = 'directives-view'
function savedView(): 'cards' | 'table' {
  try {
    return localStorage.getItem(VIEW_KEY) === 'table' ? 'table' : 'cards'
  } catch {
    return 'cards'
  }
}
const view = ref<'cards' | 'table'>(savedView())
function setView(v: 'cards' | 'table') {
  view.value = v
  try {
    localStorage.setItem(VIEW_KEY, v)
  } catch {
    /* storage unavailable: the choice just isn't remembered */
  }
}

function matches(d: Directive) {
  const q = query.value.trim()
  if (station.value && d.station !== station.value) return false
  if (!q) return true
  return [d.name, d.id, d.station, d.owner, d.district, ...d.cohorts, ...d.baskets.map((b) => b.name)].some((s) =>
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
            <input v-model="query" placeholder="חיפוש לפי שם, מספר, תחנה, אחראי או סל" />
          </label>
          <div class="view-toggle" role="group" aria-label="תצוגה">
            <button :class="{ on: view === 'cards' }" title="תצוגת כרטיסיות" aria-label="תצוגת כרטיסיות" :aria-pressed="view === 'cards'" @click="setView('cards')">
              <DvIcon name="grid" :size="18" />
            </button>
            <button :class="{ on: view === 'table' }" title="תצוגת טבלה" aria-label="תצוגת טבלה" :aria-pressed="view === 'table'" @click="setView('table')">
              <DvIcon name="list" :size="18" />
            </button>
          </div>
        </div>
      </div>
      <DirectiveCards
        :rows="future"
        :view="view"
        editable
        :empty="query || station ? 'לא נמצאו דירקטיבות עתידיות התואמות לחיפוש' : 'אין דירקטיבות עתידיות. לחצו על ״דירקטיבה חדשה״ כדי ליצור אחת.'"
      />
    </section>

    <div class="dv-title-row past-title">
      <h1 class="dv-title">דירקטיבות עבר</h1>
      <span class="count">{{ past.length }} דירקטיבות</span>
    </div>
    <section class="dv-card list-card">
      <DirectiveCards :rows="past" :view="view" past empty="לא נמצאו דירקטיבות עבר" />
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
.view-toggle {
  display: flex;
  padding: 2px;
  border-radius: 16px;
  background: #f5f8fb;
}
.view-toggle button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 28px;
  padding: 0;
  border-radius: 14px;
  color: var(--c-muted-2);
}
.view-toggle button.on {
  background: #fff;
  color: var(--c-primary);
  box-shadow: 0 1px 3px rgba(7, 25, 56, 0.12);
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
