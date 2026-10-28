<script setup lang="ts">
// Read-only view of an existing directive. Not in Figma — built from the "דף סיכום" layout,
// plus a header with actions and a "הגדרות כלליות" card (which the summary page doesn't show).
import '@/components/directives/directives.css'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from '@/components/directives/DvIcon.vue'
import DirectiveSummary from '@/components/directives/DirectiveSummary.vue'
import TabOrderGrid from '@/components/directives/TabOrderGrid.vue'
import DirectiveStatusBadge from '@/components/directives/DirectiveStatusBadge.vue'
import MetaLine from '@/components/directives/MetaLine.vue'
import { directiveStatus, directiveTotals, fmtDate, getDirective, isPast } from '@/data/directives'

const route = useRoute()
const router = useRouter()

const d = computed(() => getDirective(String(route.params.id)))
const totals = computed(() => (d.value ? directiveTotals(d.value) : null))
const tabsOpen = ref(false)

function edit() {
  if (d.value) router.push({ path: '/directives/new', query: { edit: d.value.id } })
}
function fix(step: 'targets' | 'rest', basket?: string) {
  if (d.value) router.push({ path: '/directives/new', query: { edit: d.value.id, step, ...(basket ? { basket } : {}) } })
}
function duplicate() {
  if (d.value) router.push({ path: '/directives/new', query: { from: d.value.id } })
}
</script>

<template>
  <main v-if="d" class="dv-page">
    <RouterLink to="/directives" class="back">
      <AppIcon name="chevron-right" :size="18" />
      חזרה לדירקטיבות
    </RouterLink>

    <div class="dv-title-row head">
      <h1 class="dv-title">{{ d.name || 'דירקטיבה' }} <span class="hid">#{{ d.id }}</span></h1>
      <DirectiveStatusBadge :status="directiveStatus(d)" />
      <div class="actions">
        <button class="btn btn-soft" @click="duplicate">
          <DvIcon name="copy" :size="16" />
          שכפול
        </button>
        <button v-if="!isPast(d)" class="btn btn-primary" @click="edit">
          <DvIcon name="edit" :size="16" />
          עריכה
        </button>
      </div>
    </div>
    <div class="sub">
      <MetaLine :d="d" />
      <span class="updated">עודכן {{ fmtDate(d.updatedAt) }} · נוצר ע״י {{ d.createdBy }}</span>
    </div>

    <p v-if="d.draft" class="notice">
      <AppIcon name="info" :size="16" />
      דירקטיבה זו שמורה כטיוטה ועדיין לא פורסמה לתחנה. לחצו ״עריכה״ כדי להשלים אותה.
    </p>
    <p v-else-if="isPast(d)" class="notice past">
      <AppIcon name="info" :size="16" />
      דירקטיבת עבר - לא ניתן לערוך. ניתן לשכפל אותה כבסיס לדירקטיבה חדשה.
    </p>

    <!-- General settings -->
    <section class="dv-card general">
      <div class="g-head">
        <div class="kpis">
          <span><b>{{ totals?.baskets }}</b> סלים</span>
          <span><b>{{ totals?.targets }}</b> יעדים ראשיים</span>
          <span><b>{{ totals?.plans }}</b> תוכניות</span>
        </div>
      </div>
      <dl class="grid4">
        <div>
          <dt>שם דירקטיבה</dt>
          <dd>{{ d.name || '-' }}</dd>
        </div>
        <div>
          <dt>מתחם</dt>
          <dd>{{ d.district || '-' }}</dd>
        </div>
        <div>
          <dt>תחנה</dt>
          <dd>{{ d.station || '-' }}</dd>
        </div>
        <div>
          <dt>אחראי תחנה</dt>
          <dd>{{ d.owner || '-' }}</dd>
        </div>
        <div>
          <dt>תאריך</dt>
          <dd>{{ d.date ? fmtDate(d.date) : '-' }}</dd>
        </div>
      </dl>
      <dl class="grid3">
        <div>
          <dt>סיבות</dt>
          <dd class="dv-chips">
            <span v-for="v in d.reasons" :key="v" class="dv-chip">{{ v }}</span>
          </dd>
        </div>
        <div>
          <dt>ניבויים</dt>
          <dd class="dv-chips">
            <span v-for="v in d.forecasts" :key="v" class="dv-chip">{{ v }}</span>
          </dd>
        </div>
        <div>
          <dt>עונת הצבה</dt>
          <dd class="dv-chips">
            <span v-for="v in d.cohorts" :key="v" class="dv-chip">{{ v }}</span>
          </dd>
        </div>
      </dl>
      <!-- Same collapsible section as on the edit screen, without dragging. -->
      <div class="tabs-section">
        <button type="button" class="dv-section-head toggle" :aria-expanded="tabsOpen" @click="tabsOpen = !tabsOpen">
          <h3>סדר לשוניות תחנה</h3>
          <AppIcon :name="tabsOpen ? 'chevron-up' : 'chevron-down'" :size="20" class="chev" />
          <small v-if="tabsOpen">הסדר שבו יוצגו הלשוניות בתחנה</small>
        </button>
        <TabOrderGrid v-if="tabsOpen" :tabs="d.tabOrder" readonly />
      </div>
    </section>

    <h2 class="section-title">סלים ויעדים</h2>
    <DirectiveSummary :key="d.id" :d="d" :can-fix="!isPast(d)" @fix="fix" />
  </main>

  <main v-else class="dv-page missing">
    <h1 class="dv-title">הדירקטיבה לא נמצאה</h1>
    <p>ייתכן שהקישור שגוי או שהדירקטיבה נמחקה.</p>
    <RouterLink to="/directives" class="btn btn-soft">חזרה לדירקטיבות</RouterLink>
  </main>
</template>

<style scoped>
.back {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 14px;
  font-size: 13px;
  color: var(--c-primary);
  text-decoration: none;
}
.head {
  margin-bottom: 8px;
}
.actions {
  display: flex;
  gap: 10px;
  margin-inline-start: auto;
}
.sub {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.sub .dv-meta {
  margin-inline-start: 0;
}
.updated {
  font-size: 13px;
  color: var(--c-muted);
}
.notice {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #fff3c7;
  color: #8a6100;
  font-size: 14px;
}
.notice.past {
  background: var(--c-header-bg);
  color: var(--c-brand);
}
.general {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
.g-head {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  align-self: stretch;
}
.kpis {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: var(--c-muted-2);
}
.kpis b {
  font-size: 18px;
  color: var(--c-brand);
  margin-inline-end: 4px;
}
dl {
  display: grid;
  gap: 20px;
  align-self: stretch;
}
.grid4 {
  grid-template-columns: repeat(5, 1fr);
}
.hid {
  font-size: 18px;
  font-weight: 400;
  color: var(--c-muted);
}
.grid3 {
  grid-template-columns: repeat(3, 1fr);
}
dt {
  margin-bottom: 6px;
  font-size: 14px;
  color: #6d6e8d;
}
dd {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}
.tabs-section {
  align-self: stretch;
  margin-top: 6px;
}
/* The section title doubles as the open/close control (as on the first wizard step). */
.toggle {
  width: 100%;
  padding: 0;
  text-align: start;
  cursor: pointer;
}
.toggle[aria-expanded='false'] {
  margin-bottom: 0;
}
.toggle .chev {
  align-self: center;
  margin-inline-start: -4px;
  color: var(--c-text);
}
.toggle:hover h3 {
  color: var(--c-primary);
}
.section-title {
  margin: 36px 0 16px;
  font-size: 20px;
  font-weight: 500;
  color: var(--c-primary-dark);
}
.missing {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}
.missing p {
  color: var(--c-muted);
}
.missing .btn {
  text-decoration: none;
}
</style>
