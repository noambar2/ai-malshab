<script setup lang="ts">
// Body of the "דף סיכום" page, shared by the wizard's last step and the read-only detail page:
// baskets (expandable), "יתר המיוצבים", notes thread and anchor dates.
import { reactive, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from './DvIcon.vue'
import SummaryBasket from './SummaryBasket.vue'
import AnchorDatesEditor from './AnchorDatesEditor.vue'
import { findTarget, fmtRange, uid, type Directive } from '@/data/directives'

const props = defineProps<{ d: Directive; editable?: boolean }>()
const emit = defineEmits<{ editRest: [] }>()

const openMap = reactive<Record<string, boolean>>(
  Object.fromEntries(props.d.baskets.map((b, i) => [b.id, i === 0])),
)

// --- notes ---
const draftNote = ref('')
const menuFor = ref<string | null>(null)
function addNote() {
  const text = draftNote.value.trim()
  if (!text) return
  props.d.notes.push({ id: uid('n'), author: 'ליה לנד', authorId: 'l1234567', text })
  draftNote.value = ''
}
function removeNote(id: string) {
  const i = props.d.notes.findIndex((n) => n.id === id)
  if (i >= 0) props.d.notes.splice(i, 1)
  menuFor.value = null
}
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
        <table v-if="d.rest.length" class="dv-table rest">
          <thead>
            <tr>
              <th>יעד</th>
              <th>כמות מיוצבים</th>
              <th>התראיינו</th>
              <th>הערות לפי יעד</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in d.rest" :key="r.id">
              <td>{{ findTarget(r.targetCode)?.name ?? '-' }} <span class="code">{{ findTarget(r.targetCode)?.professionCode }}</span></td>
              <td>{{ r.count ?? '-' }}</td>
              <td>{{ r.interviewed || '-' }}</td>
              <td class="notes">{{ r.notes || '-' }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="none">לא הוגדרו מיוצבים נוספים</p>
      </section>

      <!-- הערות -->
      <section>
        <h3 class="sec-title">הערות</h3>
        <ul v-if="d.notes.length" class="notes-list">
          <li v-for="n in d.notes" :key="n.id" class="note">
            <div>
              <b>{{ n.author }} {{ n.authorId }} :</b>
              <p>{{ n.text }}</p>
            </div>
            <div class="kebab-wrap">
              <button type="button" class="kebab" aria-label="אפשרויות" @click="menuFor = menuFor === n.id ? null : n.id">
                <DvIcon name="more" :size="18" />
              </button>
              <div v-if="menuFor === n.id" class="menu">
                <button type="button" @click="removeNote(n.id)">
                  <DvIcon name="trash" :size="14" />
                  מחיקת הערה
                </button>
              </div>
            </div>
          </li>
        </ul>
        <p v-else class="none">אין הערות עדיין</p>
        <form class="add-note" @submit.prevent="addNote">
          <input v-model="draftNote" class="dv-input" placeholder="הערה חדשה..." />
          <button type="submit" class="btn btn-soft" :disabled="!draftNote.trim()">
            <AppIcon name="plus" :size="14" />
            הוספת הערה
          </button>
        </form>
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
.sec-head h3,
.sec-title {
  font-size: 16px;
  font-weight: 700;
}
.sec-title {
  margin-bottom: 16px;
}
.rest td {
  height: 62px;
  font-size: 16px;
}
.code {
  margin-inline-start: 4px;
}
.notes {
  max-width: 280px;
  font-size: 14px;
}
.none {
  font-size: 14px;
  color: var(--c-muted);
}
.notes-list {
  list-style: none;
  padding: 0 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 260px;
  overflow: auto;
}
.note {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 4px;
  background: #f0f1f4;
  font-size: 14px;
}
.note b {
  font-weight: 700;
}
.note p {
  margin-top: 4px;
  line-height: 1.5;
}
.kebab-wrap {
  position: relative;
}
.kebab {
  color: var(--c-muted);
}
.menu {
  position: absolute;
  inset-inline-end: 0;
  top: 22px;
  z-index: 10;
  padding: 4px;
  background: #fff;
  border: 1px solid #e2e8f8;
  border-radius: 6px;
  box-shadow: 0 6px 20px rgba(7, 25, 56, 0.12);
}
.menu button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 13px;
  color: var(--c-danger);
  white-space: nowrap;
}
.add-note {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.add-note .btn {
  height: 42px;
  border-radius: 4px;
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
