<script setup lang="ts">
// Body of the "דף סיכום" page, shared by the wizard's last step and the read-only detail page:
// baskets (expandable), "יתר המיוצבים", guidelines and anchor dates.
import { reactive } from 'vue'
import SummaryBasket from './SummaryBasket.vue'
import MainTargetCard from './MainTargetCard.vue'
import AnchorDatesEditor from './AnchorDatesEditor.vue'
import GuidelinesEditor from './GuidelinesEditor.vue'
import { fmtRange, type Directive } from '@/data/directives'

const props = defineProps<{ d: Directive; editable?: boolean }>()
const emit = defineEmits<{ editRest: [] }>()

const restOpen = reactive<Record<string, boolean>>({})
const openMap = reactive<Record<string, boolean>>(
  Object.fromEntries(props.d.baskets.map((b, i) => [b.id, i === 0])),
)

</script>

<template>
  <div class="summary">
    <SummaryBasket v-for="b in d.baskets" :key="b.id" v-model:open="openMap[b.id]" :basket="b" />
    <p v-if="!d.baskets.length" class="dv-card empty">לא הוגדרו סלים בדירקטיבה זו</p>

    <div class="dv-card extras">
      <!-- יתר המיוצבים -->
      <section>
        <div class="sec-head">
          <h3>יתר המיוצבים</h3>
          <button v-if="editable" type="button" class="dv-link" @click="emit('editRest')">עריכה</button>
        </div>
        <div v-if="d.rest.length" class="rest-list">
          <MainTargetCard v-for="t in d.rest" :key="t.id" v-model:open="restOpen[t.id]" :target="t" />
        </div>
        <p v-else class="none">לא הוגדרו מיוצבים נוספים</p>
      </section>

      <!-- הערות והנחיות (from the first step) -->
      <section>
        <div class="dv-section-head">
          <h3>הערות והנחיות</h3>
          <small>דגשים, הנחיות והערות כלליות לדירקטיבה</small>
        </div>
        <GuidelinesEditor :items="d.guidelines" :editable="editable" />
      </section>

      <!-- תאריכי עוגן -->
      <section>
        <div class="dv-section-head">
          <h3>תאריכי עוגן</h3>
          <small>טווחי תאריכים קבועים לפי יחידה</small>
        </div>
        <AnchorDatesEditor v-if="editable" :anchors="d.anchors" add-label="הוספת תאריכים" />
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
.rest-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
