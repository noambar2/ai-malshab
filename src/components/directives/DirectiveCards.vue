<script setup lang="ts">
// Directives on the main page as a grid of cards. Clicking a card opens the directive.
import { useRouter } from 'vue-router'
import DvIcon from './DvIcon.vue'
import DirectiveStatusBadge from './DirectiveStatusBadge.vue'
import { TODAY, directiveStatus, directiveTotals, fmtDate, type Directive } from '@/data/directives'

defineProps<{ rows: Directive[]; empty: string; editable?: boolean; past?: boolean }>()
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

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
</script>

<template>
  <div v-if="rows.length" class="grid">
    <article
      v-for="d in rows"
      :key="d.id"
      class="dcard"
      :class="{ past, draft: d.draft }"
      tabindex="0"
      @click="router.push(`/directives/${d.id}`)"
      @keydown.enter="router.push(`/directives/${d.id}`)"
    >
      <header class="top">
        <DirectiveStatusBadge :status="directiveStatus(d)" />
        <span class="id">#{{ d.id }}</span>
        <span class="acts" @click.stop>
          <button
            v-if="editable"
            class="act"
            title="עריכה"
            aria-label="עריכה"
            @click="router.push({ path: '/directives/new', query: { edit: d.id } })"
          >
            <DvIcon name="edit" :size="16" />
          </button>
          <button
            class="act"
            title="שכפול"
            aria-label="שכפול"
            @click="router.push({ path: '/directives/new', query: { from: d.id } })"
          >
            <DvIcon name="copy" :size="16" />
          </button>
        </span>
      </header>

      <div class="station">
        <h3>{{ d.station || 'ללא תחנה' }}</h3>
        <span>{{ d.district || '-' }}</span>
      </div>

      <div class="date">
        <span class="cal"><DvIcon name="calendar" :size="18" /></span>
        <span>
          <b>{{ d.date ? fmtDate(d.date) : '-' }}</b>
          <small>{{ relative(d) }}</small>
        </span>
      </div>

      <dl class="stats">
        <div>
          <dt>סלים</dt>
          <dd>{{ directiveTotals(d).baskets }}</dd>
        </div>
        <div>
          <dt>יעדים</dt>
          <dd>{{ directiveTotals(d).targets }}</dd>
        </div>
        <div>
          <dt>תוכניות</dt>
          <dd>{{ directiveTotals(d).plans }}</dd>
        </div>
      </dl>

      <div v-if="d.cohorts.length" class="chips">
        <span v-for="c in d.cohorts.slice(0, 3)" :key="c" class="chip">{{ c }}</span>
        <span v-if="d.cohorts.length > 3" class="chip more">+{{ d.cohorts.length - 3 }}</span>
      </div>

      <footer class="foot">
        <span class="owner">
          <span class="avatar">{{ d.owner ? initials(d.owner) : '?' }}</span>
          {{ d.owner || 'ללא אחראי' }}
        </span>
        <span class="updated">עודכן {{ fmtDate(d.updatedAt) }}</span>
      </footer>
    </article>
  </div>
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
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 10px 0;
  border-block: 1px solid var(--c-divider);
  text-align: center;
}
.stats div + div {
  border-inline-start: 1px solid var(--c-divider);
}
.stats dt {
  font-size: 12px;
  color: var(--c-muted);
}
.stats dd {
  font-size: 18px;
  font-weight: 700;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chip {
  padding: 3px 10px;
  border-radius: 12px;
  background: #f5f6fa;
  font-size: 12px;
  color: var(--c-muted-2);
}
.chip.more {
  color: var(--c-primary);
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
.none {
  padding: 40px 0;
  text-align: center;
  color: var(--c-muted);
}
</style>
