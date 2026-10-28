<script setup lang="ts">
// A basket on the summary / detail page (design "רשימה עם תוויות רמה"): a white card whose header
// row carries a "סל N" label; when open, its main targets follow as indented rows.
// Which baskets and targets are open is decided by the parent.
import AppIcon from '@/components/AppIcon.vue'
import NoteLine from './NoteLine.vue'
import SummaryTargetRow from './SummaryTargetRow.vue'
import { computed } from 'vue'
import { basketStats, type Basket } from '@/data/directives'

const props = defineProps<{ basket: Basket; index: number; open: boolean; openTargets: string[]; canFix?: boolean }>()
const emit = defineEmits<{ toggle: []; toggleTarget: [id: string]; fix: [] }>()
const st = computed(() => basketStats(props.basket))
</script>

<template>
  <section class="sb" :class="{ open }" :data-basket="basket.id">
    <div
      class="head sum-grid"
      role="button"
      tabindex="0"
      :aria-expanded="open"
      @click="emit('toggle')"
      @keydown.enter.self="emit('toggle')"
    >
      <span class="level">סל {{ index + 1 }}</span>
      <div class="name">
        <h2>{{ basket.name }}</h2>
        <NoteLine v-if="basket.notes" :text="basket.notes" @click.stop />
      </div>
      <dl class="sum-stat"><dt>תוכניות</dt><dd>{{ st.plans }}</dd></dl>
      <dl class="sum-stat"><dt>צפי הגעה</dt><dd>{{ st.arrival }}<span class="pct">{{ basket.arrivalPct ?? 0 }}%</span></dd></dl>
      <dl class="sum-stat"><dt>צפי פינוי</dt><dd>{{ st.evac }}<span class="pct">{{ basket.evacPct ?? 0 }}%</span></dd></dl>
      <dl class="sum-stat"><dt>סך מיוצבים</dt><dd>{{ st.stabilized }}</dd></dl>
      <dl class="sum-stat"><dt>יעדים</dt><dd>{{ st.targets }}</dd></dl>
      <AppIcon :name="open ? 'chevron-up' : 'chevron-down'" :size="22" class="sum-chev" />
    </div>

    <div v-if="open" class="body">
      <SummaryTargetRow
        v-for="t in basket.targets"
        :key="t.id"
        :target="t"
        :open="openTargets.includes(t.id)"
        :fix-label="canFix ? 'מעבר לשלב יעדים לשיבוץ' : undefined"
        @toggle="emit('toggleTarget', t.id)"
        @fix="emit('fix')"
      />
      <p v-if="!basket.targets.length" class="empty">לא הוגדרו יעדים לסל זה</p>
    </div>
  </section>
</template>

<style scoped>
.sb {
  background: #fff;
  border: 1px solid var(--c-border-2);
  border-radius: 10px;
  overflow: hidden;
}
/* The basket header looks like the basket banner in "יעדים לשיבוץ": light blue, with the name,
   labels and numbers in the brand blue, so it reads apart from the white main-target rows. */
.head {
  padding-block: 14px;
  background: #e2eafd;
  cursor: pointer;
  outline: none;
}
.head:hover {
  background: #dae4fc;
}
.head:focus-visible {
  box-shadow: inset 0 0 0 2px var(--c-primary);
}
.sb.open {
  border-color: #c3d1f7;
}
.head :deep(.sum-stat) {
  border-inline-start-color: #c3d1f7;
}
.head :deep(.sum-stat dt),
.head :deep(.sum-stat dd),
.head :deep(.sum-stat dd .pct),
.head :deep(.sum-chev) {
  color: var(--c-brand);
}
.head :deep(.note-line) {
  color: var(--c-brand);
}
.level {
  justify-self: start;
  padding: 3px 10px;
  border-radius: 10px;
  background: #fff;
  font-size: 12px;
  font-weight: 700;
  color: var(--c-primary);
}
.name {
  min-width: 0;
  padding-inline-end: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}
h2 {
  max-width: 100%;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: var(--c-brand);
}
.empty {
  margin: 0;
  padding: 14px 18px;
  padding-inline-start: 114px;
  font-size: 13px;
  color: var(--c-muted-2);
}
</style>
