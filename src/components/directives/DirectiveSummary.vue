<script setup lang="ts">
// Body of the "דף סיכום" page, shared by the wizard's last step and the read-only detail page:
// baskets (expandable), "יתר המיוצבים", anchor dates and guidelines (same order as the first step).
import { ref } from 'vue'
import SummaryBasket from './SummaryBasket.vue'
import SummaryTargetRow from './SummaryTargetRow.vue'
import AnchorDatesEditor from './AnchorDatesEditor.vue'
import GuidelinesEditor from './GuidelinesEditor.vue'
import { fmtRange, type Directive } from '@/data/directives'

const props = defineProps<{ d: Directive; editable?: boolean; canFix?: boolean }>()
// fix: go to the wizard step where a missing part is filled in (with the basket to focus).
const emit = defineEmits<{ editRest: []; fix: [stage: 'targets' | 'rest', basketId?: string] }>()

// Strict accordion: one basket open, and one target open inside it; opening another closes the
// current one. A basket opens with its first target showing. "יתר המיוצבים" works the same way.
const firstTarget = (id: string | null) => props.d.baskets.find((b) => b.id === id)?.targets[0]?.id ?? null
const openBasket = ref<string | null>(props.d.baskets[0]?.id ?? null)
const openTarget = ref<string | null>(firstTarget(openBasket.value))
const openRest = ref<string | null>(props.d.rest[0]?.id ?? null)

function toggleBasket(id: string) {
  openBasket.value = openBasket.value === id ? null : id
  openTarget.value = firstTarget(openBasket.value)
}
function toggleTarget(id: string) {
  openTarget.value = openTarget.value === id ? null : id
}
function toggleRest(id: string) {
  openRest.value = openRest.value === id ? null : id
}

</script>

<template>
  <div class="summary">
    <SummaryBasket
      v-for="(b, i) in d.baskets"
      :key="b.id"
      :basket="b"
      :index="i"
      :open="openBasket === b.id"
      :open-target="openTarget"
      :can-fix="canFix"
      @toggle="toggleBasket(b.id)"
      @toggle-target="toggleTarget"
      @fix="emit('fix', 'targets', b.id)"
    />
    <p v-if="!d.baskets.length" class="dv-card empty">לא הוגדרו סלים בדירקטיבה זו</p>

    <div class="dv-card extras">
      <!-- יתר המיוצבים -->
      <section>
        <div class="sec-head">
          <h3>יתר המיוצבים</h3>
          <button v-if="editable" type="button" class="dv-link" @click="emit('editRest')">עריכה</button>
        </div>
        <div v-if="d.rest.length" class="rest-list">
          <SummaryTargetRow
            v-for="t in d.rest"
            :key="t.id"
            :target="t"
            :open="openRest === t.id"
            :fix-label="canFix ? 'לעריכה בשלב יתר מיוצבים' : undefined"
            @toggle="toggleRest(t.id)"
            @fix="emit('fix', 'rest')"
          />
        </div>
        <p v-else class="none">לא הוגדרו מיוצבים נוספים</p>
      </section>

      <!-- תאריכי עוגן -->
      <section>
        <div class="dv-section-head">
          <h3>תאריכי עוגן</h3>
          <small>טווחי תאריכים קבועים לפי יחידה</small>
        </div>
        <AnchorDatesEditor v-if="editable" :anchors="d.anchors" add-label="הוספת תאריכים" compact />
        <ul v-else-if="d.anchors.length" class="anchors">
          <li v-for="a in d.anchors" :key="a.id">
            <span class="dv-label">כותרת</span>
            <b>{{ a.title }}</b>
            <span class="dv-label">טווח תאריכים</span>
            <b>{{ fmtRange(a) }}</b>
          </li>
        </ul>
        <p v-else class="none">לא הוגדרו תאריכי עוגן</p>
      </section>

      <!-- הערות והנחיות (from the first step) -->
      <section>
        <div class="dv-section-head">
          <h3>הערות והנחיות</h3>
          <small>דגשים, הנחיות והערות כלליות לדירקטיבה</small>
        </div>
        <GuidelinesEditor :items="d.guidelines" :editable="editable" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.summary {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.empty {
  color: var(--c-muted);
}
.extras {
  display: flex;
  flex-direction: column;
}
.extras > section {
  padding: 10px 0 40px;
}
.extras > section + section {
  border-top: 1px solid #e2e8f8;
  padding-top: 40px;
}
.sec-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.sec-head h3 {
  font-size: 16px;
  font-weight: 700;
}
/* Same list as the targets inside a basket. */
.rest-list {
  border: 1px solid var(--c-border-2);
  border-radius: 10px;
  overflow: hidden;
}
.none {
  font-size: 14px;
  color: var(--c-muted);
}
.anchors {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.anchors li {
  display: grid;
  grid-template-columns: auto 160px auto 1fr;
  align-items: center;
  gap: 10px;
  font-size: 16px;
}
</style>
