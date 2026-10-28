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
        <header class="top">
          <DirectiveStatusBadge :status="directiveStatus(d)" />
          <span class="id">#{{ d.id }}</span>
          <span class="acts" @click.stop>
            <button v-if="editable" class="act" title="עריכה" aria-label="עריכה" @click="edit(d)">
              <DvIcon name="edit" :size="16" />
            </button>
            <button class="act" title="שכפול" aria-label="שכפול" @click="duplicate(d)">
              <DvIcon name="copy" :size="16" />
            </button>
          </span>
        </header>

        <!-- The directive's name leads; without one, the station takes its place. -->
        <div class="station">
          <h3>{{ d.name || d.station || 'ללא תחנה' }}</h3>
          <span v-if="d.name">{{ d.station || 'ללא תחנה' }} · {{ d.district || '-' }}</span>
          <span v-else>{{ d.district || '-' }}</span>
        </div>

        <div class="date">
          <span class="cal"><DvIcon name="calendar" :size="18" /></span>
          <span>
            <b>{{ d.date ? fmtDate(d.date) : '-' }}</b>
            <small>{{ relative(d) }}</small>
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

    <!-- Table -->
    <table v-else class="dv-table dtable">
      <thead>
        <tr>
          <th>סטטוס</th>
          <th>שם הדירקטיבה</th>
          <th>תחנה</th>
          <th>מתחם</th>
          <th>תאריך</th>
          <th>אחראי</th>
          <th>נערך לאחרונה</th>
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
          <td><DirectiveStatusBadge :status="directiveStatus(d)" /></td>
          <td class="name">
            <b>{{ d.name || '-' }}</b>
            <small>#{{ d.id }}</small>
          </td>
          <td>{{ d.station || '-' }}</td>
          <td class="muted-cell">{{ d.district || '-' }}</td>
          <td>
            <b class="dt">{{ d.date ? fmtDate(d.date) : '-' }}</b>
            <small class="rel" :class="{ now: isToday(d) }">{{ relative(d) }}</small>
          </td>
          <td>{{ d.owner || '-' }}</td>
          <td>
            {{ fmtDate(d.updatedAt) }}
            <small class="by">{{ d.updatedBy }}</small>
          </td>
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
  align-items: center;
  gap: 8px;
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
.station h3 {
  font-size: 17px;
  font-weight: 700;
  color: var(--c-brand);
}
.station span {
  font-size: 13px;
  color: var(--c-muted);
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
  font-size: 15px;
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
/* Fixed columns, so the future and past tables line up. */
.dtable {
  table-layout: fixed;
}
.dtable th:nth-child(1) { width: 120px; }
.dtable th:nth-child(2) { width: 22%; }
.dtable th:nth-child(5) { width: 110px; }
.dtable th:nth-child(6) { width: 110px; }
.dtable th:nth-child(7) { width: 120px; }
.dtable td {
  overflow: hidden;
  text-overflow: ellipsis;
}
.dtable tbody tr {
  cursor: pointer;
}
.dtable tbody tr:hover {
  background: #fafbff;
}
.dtable tbody tr:focus-visible {
  outline: 2px solid var(--c-primary);
  outline-offset: -2px;
}
.dtable tbody tr.past {
  color: var(--c-muted-2);
}
/* Today's row: tinted, with a blue bar on its start edge. */
.dtable tbody tr.today td {
  background: #eef3ff;
}
.dtable tbody tr.today td:first-child {
  box-shadow: inset -3px 0 0 var(--c-primary);
}
.dtable .name b {
  display: block;
  font-weight: 600;
  color: var(--c-brand);
}
.dtable small {
  display: block;
  font-size: 12px;
  color: var(--c-muted);
}
.dtable .dt {
  display: block;
  font-weight: 600;
}
.dtable .rel.now {
  font-weight: 700;
  color: var(--c-primary);
}
.muted-cell {
  color: var(--c-muted-2);
}
.acts-col {
  width: 80px;
}
.row-acts {
  white-space: nowrap;
  text-align: end;
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
