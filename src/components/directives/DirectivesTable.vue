<script setup lang="ts">
// Table of directives on the main page. Row click opens the directive.
import { useRouter } from 'vue-router'
import DvIcon from './DvIcon.vue'
import DirectiveStatusBadge from './DirectiveStatusBadge.vue'
import { directiveStatus, directiveTotals, fmtDate, type Directive } from '@/data/directives'

defineProps<{ rows: Directive[]; empty: string; editable?: boolean }>()
const router = useRouter()

const cohortsText = (d: Directive) =>
  d.cohorts.length > 2 ? `${d.cohorts.slice(0, 2).join(', ')} +${d.cohorts.length - 2}` : d.cohorts.join(', ') || '-'
</script>

<template>
  <div class="table-wrap">
    <table class="table clickable dt">
      <thead>
        <tr>
          <th>מס׳</th>
          <th class="start">תחנה</th>
          <th>אחראי/ת</th>
          <th>תאריך ביצוע</th>
          <th>עונות הצבה</th>
          <th>סלים</th>
          <th>יעדים</th>
          <th>תוכניות</th>
          <th>סטטוס</th>
          <th>עודכן</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in rows" :key="d.id" @click="router.push(`/directives/${d.id}`)">
          <td class="muted">{{ d.id }}</td>
          <td class="start">
            <b>{{ d.station || 'ללא תחנה' }}</b>
            <small>{{ d.district }}</small>
          </td>
          <td>{{ d.owner || '-' }}</td>
          <td>{{ d.date ? fmtDate(d.date) : '-' }}</td>
          <td class="cohorts" :title="d.cohorts.join(', ')">{{ cohortsText(d) }}</td>
          <td>{{ directiveTotals(d).baskets }}</td>
          <td>{{ directiveTotals(d).targets }}</td>
          <td>{{ directiveTotals(d).plans }}</td>
          <td><DirectiveStatusBadge :status="directiveStatus(d)" /></td>
          <td class="muted">{{ fmtDate(d.updatedAt) }}</td>
          <td class="actions" @click.stop>
            <button
              v-if="editable"
              class="act"
              title="עריכה"
              aria-label="עריכה"
              @click="router.push({ path: '/directives/new', query: { edit: d.id } })"
            >
              <DvIcon name="edit" :size="17" />
            </button>
            <button
              class="act"
              title="שכפול"
              aria-label="שכפול"
              @click="router.push({ path: '/directives/new', query: { from: d.id } })"
            >
              <DvIcon name="copy" :size="17" />
            </button>
          </td>
        </tr>
        <tr v-if="!rows.length" class="none-row">
          <td colspan="11" class="none">{{ empty }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.dt td {
  height: 58px;
  font-size: 14px;
  font-weight: 400;
}
.dt .start {
  text-align: start;
}
.dt td.start b {
  display: block;
  font-weight: 600;
}
.dt td.start small {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  color: var(--c-muted);
}
.muted {
  color: var(--c-muted);
}
.cohorts {
  max-width: 180px;
  white-space: nowrap;
}
.actions {
  white-space: nowrap;
}
.act {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: var(--c-primary);
}
.act:hover {
  background: var(--c-primary-soft);
}
.none-row {
  cursor: default !important;
}
.none-row:hover {
  background: transparent !important;
}
.none {
  height: 120px !important;
  color: var(--c-muted);
}
</style>
