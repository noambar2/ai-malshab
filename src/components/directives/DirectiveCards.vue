<script setup lang="ts">
// Directives on the main page, as a grid of cards or as table rows. Clicking one opens it.
// Today's directive stands out in both.
import { useRouter } from 'vue-router'
import DvIcon from './DvIcon.vue'
import DirectiveStatusBadge from './DirectiveStatusBadge.vue'
import { TODAY, directiveStatus, fmtDate, type Directive } from '@/data/directives'

withDefaults(defineProps<{ rows: Directive[]; empty: string; editable?: boolean; past?: boolean; view?: 'cards' | 'table' }>(), {
  view: 'cards',
})
const router = useRouter()

const DAY = 24 * 60 * 60 * 1000

function relative(d: Directive) {
  if (!d.date) return 'טרם נקבע תאריך'
  const days = Math.round((new Date(d.date).getTime() - new Date(TODAY).getTime()) / DAY)
  if (days === 0) return 'היום'
  if (days === 1) return 'מחר'
  if (days > 0) return `בעוד ${days} ימים`
  if (days === -1) return 'אתמול'
  return `לפני ${-days} ימים`
}
const isToday = (d: Directive) => d.date === TODAY

const open = (d: Directive) => router.push(`/directives/${d.id}`)
const edit = (d: Directive) => router.push({ path: '/directives/new', query: { edit: d.id } })
const duplicate = (d: Directive) => router.push({ path: '/directives/new', query: { from: d.id } })

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
</script>

<template>
  <template v-if="rows.length">
    <!-- Cards -->
    <div v-if="view === 'cards'" class="grid">
      <article
        v-for="d in rows"
        :key="d.id"
        class="dcard"
        :class="{ past, draft: d.draft, today: isToday(d) }"
        tabindex="0"
        @click="open(d)"
        @keydown.enter="open(d)"
      >
        <span v-if="isToday(d)" class="today-tag">היום</span>
        <!-- Name and date lead; status, number and station follow in smaller type. -->
        <header class="top">
          <h3 class="name">{{ d.name || d.station || 'ללא שם' }}</h3>
          <span class="acts" @click.stop>
            <button v-if="editable" class="act" title="עריכה" aria-label="עריכה" @click="edit(d)">
              <DvIcon name="edit" :size="16" />
            </button>
            <button class="act" title="שכפול" aria-label="שכפול" @click="duplicate(d)">
              <DvIcon name="copy" :size="16" />
            </button>
          </span>
        </header>

        <div class="date">
          <span class="cal"><DvIcon name="calendar" :size="18" /></span>
          <span>
            <b>{{ d.date ? fmtDate(d.date) : '-' }}</b>
            <small>{{ relative(d) }}</small>
          </span>
        </div>

        <div class="station">
          <span>{{ d.station || 'ללא תחנה' }} · {{ d.district || '-' }}</span>
          <span class="meta">
            <DirectiveStatusBadge :status="directiveStatus(d)" subtle />
            <span class="id">#{{ d.id }}</span>
          </span>
        </div>

        <footer class="foot">
          <span class="owner" title="אחראי תחנה">
            <span class="avatar">{{ d.owner ? initials(d.owner) : '?' }}</span>
            {{ d.owner || 'ללא אחראי' }}
          </span>
          <span class="updated">נערך {{ fmtDate(d.updatedAt) }} · {{ d.updatedBy }}</span>
        </footer>
      </article>
    </div>

    <!-- Table: the same look as the tables in the recruit profile (.table in main.css). -->
    <div v-else class="table-wrap">
      <table class="table clickable dtable">
        <thead>
          <tr>
            <th>שם הדירקטיבה</th>
            <th>תאריך</th>
            <th>תחנה</th>
            <th>מתחם</th>
            <th>אחראי</th>
            <th>נערך לאחרונה</th>
            <th>סטטוס</th>
            <th class="acts-col"><span class="sr-only">פעולות</span></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="d in rows"
            :key="d.id"
            :class="{ past, today: isToday(d) }"
            tabindex="0"
            @click="open(d)"
            @keydown.enter="open(d)"
          >
            <td class="name">
              <span class="l1">{{ d.name || '-' }}</span>
              <small>#{{ d.id }}</small>
            </td>
            <td>
              <span class="l1">{{ d.date ? fmtDate(d.date) : '-' }}</span>
              <small :class="{ now: isToday(d) }">{{ relative(d) }}</small>
            </td>
            <td>{{ d.station || '-' }}</td>
            <td>{{ d.district || '-' }}</td>
            <td>{{ d.owner || '-' }}</td>
            <td>
              <span class="l1">{{ fmtDate(d.updatedAt) }}</span>
              <small>ע״י {{ d.updatedBy }}</small>
            </td>
            <td><DirectiveStatusBadge :status="directiveStatus(d)" /></td>
            <td class="row-acts" @click.stop>
              <button v-if="editable" class="act" title="עריכה" aria-label="עריכה" @click="edit(d)">
                <DvIcon name="edit" :size="16" />
              </button>
              <button class="act" title="שכפול" aria-label="שכפול" @click="duplicate(d)">
                <DvIcon name="copy" :size="16" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  <p v-else class="none">{{ empty }}</p>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 16px;
}
.dcard {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--c-border-2);
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}
.dcard:hover,
.dcard:focus-visible {
  outline: none;
  border-color: #b9c9ff;
  box-shadow: 0 8px 24px rgba(13, 45, 143, 0.1);
  transform: translateY(-2px);
}
.dcard {
  position: relative;
}
/* Today's directive: a blue frame, a soft tint and a "היום" tag on the corner. */
.dcard.today {
  border: 2px solid var(--c-primary);
  background: linear-gradient(180deg, #f1f5ff 0%, #fff 60%);
  box-shadow: 0 6px 20px rgba(0, 70, 254, 0.12);
}
.today-tag {
  position: absolute;
  top: -11px;
  inset-inline-start: 16px;
  padding: 2px 10px;
  border-radius: 10px;
  background: var(--c-primary);
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}
.dcard.draft {
  border-style: dashed;
}
.dcard.past {
  background: #fbfbfd;
}
.top {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.top .name {
  flex: 1;
  min-width: 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--c-brand);
}
.id {
  font-size: 13px;
  color: var(--c-muted);
}
.acts {
  display: flex;
  margin-inline-start: auto;
}
.act {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: var(--c-primary);
  opacity: 0.7;
}
.act:hover {
  opacity: 1;
  background: var(--c-primary-soft);
}
.station {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: var(--c-muted-2);
}
.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.date {
  display: flex;
  align-items: center;
  gap: 10px;
}
.cal {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--c-primary-soft);
  color: var(--c-primary);
}
.past .cal {
  background: #eff1f4;
  color: var(--c-muted-2);
}
.date b {
  display: block;
  font-size: 17px;
  font-weight: 700;
}
.date small {
  font-size: 12px;
  color: var(--c-muted);
}
.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  font-size: 13px;
}
.owner {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--c-primary-soft);
  color: var(--c-primary);
  font-size: 11px;
  font-weight: 700;
}
.updated {
  font-size: 12px;
  color: var(--c-muted);
}
/* Fixed columns, so the future and past tables line up; long values end in "…". */
.dtable {
  table-layout: fixed;
  /* A notch under the profile tables' 16px, so a directive's long station and compound fit. */
  font-size: 14px;
}
.dtable th:nth-child(1) { width: 20%; }
.dtable th:nth-child(2) { width: 11%; }
.dtable th:nth-child(3) { width: 14%; }
.dtable th:nth-child(4) { width: 17%; }
.dtable th:nth-child(5) { width: 10%; }
.dtable th:nth-child(6) { width: 13%; }
.dtable th:nth-child(7) { width: 9%; }
.dtable th.acts-col { width: 84px; }
/* All columns aligned to the right; name, date and last edit carry a second, smaller line. */
.dtable th,
.dtable td {
  text-align: start;
}
.dtable td {
  height: auto;
  padding-block: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dtable .l1 {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dtable tbody tr + tr td {
  border-top: 1px solid var(--c-divider);
}
.dtable tbody tr:focus-visible {
  outline: 2px solid var(--c-primary);
  outline-offset: -2px;
}
.dtable tbody tr.past td {
  color: var(--c-muted-2);
}
/* Today's row: tinted, with a blue bar on its start edge. */
.dtable tbody tr.today td {
  background: #eef3ff;
}
.dtable tbody tr.today td:first-child {
  box-shadow: inset -3px 0 0 var(--c-primary);
}
.dtable .name {
  font-size: 14px;
  font-weight: 600;
  color: var(--c-brand);
}
.dtable small {
  display: block;
  font-size: 12px;
  font-weight: 400;
  color: var(--c-muted);
}
.dtable small.now {
  font-weight: 700;
  color: var(--c-primary);
}
.row-acts {
  white-space: nowrap;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
.none {
  padding: 40px 0;
  text-align: center;
  color: var(--c-muted);
}
</style>
