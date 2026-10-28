<script setup lang="ts">
// Body of the "דף סיכום" page, shared by the wizard's last step and the read-only detail page:
// baskets (expandable), "יתר המיוצבים", anchor dates and guidelines (same order as the first step).
import { ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import SummaryBasket from './SummaryBasket.vue'
import SummaryTargetRow from './SummaryTargetRow.vue'
import AnchorDatesEditor from './AnchorDatesEditor.vue'
import GuidelinesEditor from './GuidelinesEditor.vue'
import { fmtRange, type Directive } from '@/data/directives'

const props = defineProps<{ d: Directive; editable?: boolean; canFix?: boolean }>()
// fix: go to the wizard step where a missing part is filled in (with the basket to focus).
const emit = defineEmits<{ editRest: []; fix: [stage: 'targets' | 'rest', basketId?: string] }>()

// Opening a basket (or a target) on its own closes the others, and a basket opens with its first
// target showing; closing one leaves the rest as they are. "פתיחת הכל" / "סגירת הכל" open or
// close every basket with all its targets (and separately, every "יתר המיוצבים" target).
const firstTarget = (id: string) => props.d.baskets.find((b) => b.id === id)?.targets[0]?.id
const openBaskets = ref<string[]>(props.d.baskets[0] ? [props.d.baskets[0].id] : [])
const openTargets = ref<string[]>(openBaskets.value.map(firstTarget).filter((x): x is string => !!x))
const openRests = ref<string[]>(props.d.rest[0] ? [props.d.rest[0].id] : [])

function toggleBasket(id: string) {
  if (openBaskets.value.includes(id)) {
    openBaskets.value = openBaskets.value.filter((x) => x !== id)
    return
  }
  openBaskets.value = [id]
  const first = firstTarget(id)
  openTargets.value = first ? [first] : []
}
function toggleTarget(id: string) {
  openTargets.value = openTargets.value.includes(id) ? openTargets.value.filter((x) => x !== id) : [id]
}
function toggleRest(id: string) {
  openRests.value = openRests.value.includes(id) ? openRests.value.filter((x) => x !== id) : [id]
}

function expandBaskets(open: boolean) {
  openBaskets.value = open ? props.d.baskets.map((b) => b.id) : []
  openTargets.value = open ? props.d.baskets.flatMap((b) => b.targets.map((t) => t.id)) : []
}
function expandRest(open: boolean) {
  openRests.value = open ? props.d.rest.map((t) => t.id) : []
}

</script>

<template>
  <div class="summary">
    <div v-if="d.baskets.length" class="bulk">
      <button type="button" class="dv-link bulk-btn" @click="expandBaskets(true)">
        <AppIcon name="unfold-more" :size="16" />
        פתיחת כל הסלים
      </button>
      <button type="button" class="dv-link bulk-btn" @click="expandBaskets(false)">
        <AppIcon name="unfold-less" :size="16" />
        סגירת כל הסלים
      </button>
    </div>
    <SummaryBasket
      v-for="(b, i) in d.baskets"
      :key="b.id"
      :basket="b"
      :index="i"
      :open="openBaskets.includes(b.id)"
      :open-targets="openTargets"
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
          <span class="sec-acts">
            <template v-if="d.rest.length">
              <button type="button" class="dv-link bulk-btn" @click="expandRest(true)">
                <AppIcon name="unfold-more" :size="16" />
                פתיחת הכל
              </button>
              <button type="button" class="dv-link bulk-btn" @click="expandRest(false)">
                <AppIcon name="unfold-less" :size="16" />
                סגירת הכל
              </button>
            </template>
            <button v-if="editable" type="button" class="dv-link" @click="emit('editRest')">עריכה</button>
          </span>
        </div>
        <div v-if="d.rest.length" class="rest-list">
          <SummaryTargetRow
            v-for="t in d.rest"
            :key="t.id"
            :target="t"
            :open="openRests.includes(t.id)"
            :fix-label="canFix ? 'מעבר לשלב יתר מיוצבים' : undefined"
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
/* Open / close every basket at once, at the far (left) end above the list. */
.bulk {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-bottom: -8px;
}
.sec-acts {
  display: flex;
  align-items: center;
  gap: 16px;
}
.bulk-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}
.bulk-btn:hover {
  text-decoration: underline;
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
