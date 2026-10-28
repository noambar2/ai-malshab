<script setup lang="ts">
// A main target on the summary / detail page (design "רשימה עם תוויות רמה"): one indented row
// with a "יעד ראשי" label, and when open its placement targets as a table one level further in.
import { computed } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from './DvIcon.vue'
import ConditionChips from './ConditionChips.vue'
import NoteLine from './NoteLine.vue'
import { findTarget, type MainTarget } from '@/data/directives'

const props = defineProps<{
  target: MainTarget
  open: boolean
  // When set, an empty target links back to the wizard step where its placement targets are set.
  fixLabel?: string
}>()
const emit = defineEmits<{ toggle: []; fix: [] }>()

const info = computed(() => findTarget(props.target.targetCode))
</script>

<template>
  <div class="tr" :class="{ open }">
    <div
      class="row sum-grid"
      role="button"
      tabindex="0"
      :aria-expanded="open"
      @click="emit('toggle')"
      @keydown.enter.self="emit('toggle')"
    >
      <span class="level">יעד ראשי</span>
      <div class="name">
        <h4>
          <span class="nm">{{ info?.name ?? 'יעד לא נבחר' }}</span>
          <small>{{ target.targetCode }}</small>
        </h4>
        <NoteLine v-if="target.notes" :text="target.notes" @click.stop />
      </div>
      <dl class="sum-stat">
        <dt>מקצוע</dt>
        <dd :data-tip="info ? `${info.profession} ${info.professionCode}` : undefined">{{ info?.profession ?? '-' }}<span class="code">{{ info?.professionCode }}</span></dd>
      </dl>
      <dl class="sum-stat"><dt>סוג שיבוץ</dt><dd>{{ target.placementType || '-' }}</dd></dl>
      <dl class="sum-stat"><dt>יעד פינוי</dt><dd>{{ target.evacTarget || '-' }}</dd></dl>
      <dl class="sum-stat"><dt>מיוצבים</dt><dd>{{ info?.stabilized ?? 0 }}</dd></dl>
      <dl class="sum-stat">
        <dt>יעדים לשיבוץ</dt>
        <dd v-if="target.subTargets.length">{{ target.subTargets.length }}</dd>
        <dd v-else class="warn"><DvIcon name="warning" :size="13" />0</dd>
      </dl>
      <AppIcon :name="open ? 'chevron-up' : 'chevron-down'" :size="20" class="sum-chev" />
    </div>

    <div v-if="open" class="subs sum-grid">
      <table v-if="target.subTargets.length" class="dv-table subs-table sum-span">
        <thead>
          <tr>
            <th>יעד לשיבוץ</th>
            <th>מקצוע</th>
            <th>ניתן לשבץ</th>
            <th>תנאים</th>
            <th>הערות</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in target.subTargets" :key="s.id">
            <td>{{ findTarget(s.targetCode)?.name ?? s.targetCode }}</td>
            <td>
              {{ findTarget(s.targetCode)?.profession }}
              <span class="code">{{ findTarget(s.targetCode)?.professionCode }}</span>
            </td>
            <td>{{ s.quantity ?? '-' }}</td>
            <td><ConditionChips :conditions="s.conditions" /></td>
            <td>{{ s.notes || '-' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty sum-span">
        <DvIcon name="warning" :size="14" />
        לא הוגדרו יעדים לשיבוץ עבור יעד זה
        <button v-if="fixLabel" type="button" class="fix" @click="emit('fix')">
          {{ fixLabel }}
          <AppIcon name="arrow-left" :size="14" />
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.tr + .tr {
  border-top: 1px solid var(--c-divider);
}
/* Only the open target's contents (its placement targets) are tinted; the row stays white. */
.tr.open .subs {
  background: #f4f7ff;
  /* Same space above and below the contents. */
  padding-block: 10px;
}
.tr.open .subs .dv-table th {
  border-bottom-color: #dfe6f8;
}
.tr.open .subs .dv-table td {
  border-bottom-color: #e6ecfa;
}
/* Same grid as the basket header; the hierarchy shows in the label, indented one step in. */
.row {
  cursor: pointer;
  outline: none;
}
.row:hover {
  background: #fafbff;
}
.row:focus-visible {
  box-shadow: inset 0 0 0 2px var(--c-primary);
}
.level {
  justify-self: start;
  margin-inline-start: 20px;
  padding: 2px 8px;
  border-radius: 10px;
  background: #f1f3f8;
  font-size: 11px;
  font-weight: 600;
  color: var(--c-muted-2);
}
.name {
  min-width: 0;
  padding-inline-end: 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
h4 {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--c-text);
}
.nm {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
h4 small {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 400;
  color: var(--c-muted);
}
.subs .code {
  font-size: 11px;
  color: var(--c-muted);
}
.warn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: var(--c-danger);
}
/* Level 3: the placement targets, from the name column to the chevron. */
.subs {
  padding-top: 0;
}
.subs .dv-table {
  font-size: 13px;
}
.subs .dv-table td {
  padding: 8px 12px;
}
.fix {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  /* Pushed to the far (left) end of the row, away from the message. */
  margin-inline-start: auto;
  padding: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--c-primary);
}
.fix:hover {
  text-decoration: underline;
}
.empty {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 6px 0;
  font-size: 13px;
  color: var(--c-danger);
}
</style>
