<script setup lang="ts">
// One basket in edit mode (wizard step "סלים"): basket numbers + its main targets.
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from './DvIcon.vue'
import MainTargetFields from './MainTargetFields.vue'
import TargetSummaryRow from './TargetSummaryRow.vue'
import { basketStats, hasNum, newMainTarget, type Basket } from '@/data/directives'

const props = defineProps<{ basket: Basket; index: number }>()
const emit = defineEmits<{ save: []; remove: [] }>()

const showErrors = ref(false)
const stats = computed(() => basketStats(props.basket))

const valid = computed(() => {
  const b = props.basket
  return (
    !!b.name.trim() &&
    hasNum(b.plans) &&
    !pct(b.arrivalPct) &&
    !pct(b.evacPct) &&
    b.targets.every((t) => t.targetCode && t.placementType)
  )
})

function save() {
  showErrors.value = true
  if (!valid.value) return
  editingTargets.value = []
  emit('save')
}
// Targets stay in view mode while the basket is edited; only the one whose pencil is pressed
// (and new or incomplete ones) shows its fields.
const targetValid = (t: Basket['targets'][number]) => !!t.targetCode && !!t.placementType
const editingTargets = ref<string[]>(props.basket.targets.filter((t) => !targetValid(t)).map((t) => t.id))
const rowErrors = ref<string[]>([])
function editTarget(id: string) {
  if (!editingTargets.value.includes(id)) editingTargets.value = [...editingTargets.value, id]
}
function doneTarget(t: Basket['targets'][number]) {
  if (!targetValid(t)) {
    rowErrors.value = [...rowErrors.value, t.id]
    return
  }
  editingTargets.value = editingTargets.value.filter((x) => x !== t.id)
  rowErrors.value = rowErrors.value.filter((x) => x !== t.id)
}
function addTarget() {
  const t = newMainTarget()
  props.basket.targets.push(t)
  editTarget(t.id)
}
function removeTarget(i: number) {
  props.basket.targets.splice(i, 1)
}
function pct(v: number | null) {
  return !hasNum(v) || v < 0 || v > 100
}
</script>

<template>
  <div class="dv-card editor">
    <span class="badge">סל מס׳ {{ index + 1 }}</span>
    <!-- Sits on the card's top edge, mirroring the badge, so it's reachable without scrolling. -->
    <div class="edge-acts">
      <button type="button" class="btn dv-btn-danger" @click="emit('remove')">
        <DvIcon name="trash" :size="14" />
        מחיקת סל
      </button>
      <button type="button" class="btn btn-primary" @click="save">
        <AppIcon name="check" :size="14" />
        שמירה וסגירה
      </button>
    </div>

    <div class="basket-row">
      <label class="dv-field">
        <span class="dv-label"><span class="req">שם הסל</span></span>
        <input
          v-model="basket.name"
          class="dv-input"
          placeholder="הקלידו את שם הסל..."
          :class="{ invalid: showErrors && !basket.name.trim() }"
        />
      </label>
      <label class="dv-field">
        <span class="dv-label">
          <span class="req">תוכניות</span>
          <span class="tip" title="מספר התוכניות (מלש״בים) הצפויות בסל"><AppIcon name="info" :size="14" /></span>
        </span>
        <input
          v-model.number="basket.plans"
          type="number"
          min="0"
          class="dv-input"
          placeholder="0"
          :class="{ invalid: showErrors && !hasNum(basket.plans) }"
        />
      </label>
      <div class="dv-field">
        <span class="dv-label"><span class="req">צפי הגעה</span></span>
        <div class="pct-pair">
          <input
            v-model.number="basket.arrivalPct"
            type="number"
            min="0"
            max="100"
            class="dv-input"
            placeholder="0%"
            :class="{ invalid: showErrors && pct(basket.arrivalPct) }"
          />
          <span class="dv-input readonly calc">{{ stats.arrival }}</span>
        </div>
      </div>
      <div class="dv-field">
        <span class="dv-label"><span class="req">צפי פינוי</span></span>
        <div class="pct-pair">
          <input
            v-model.number="basket.evacPct"
            type="number"
            min="0"
            max="100"
            class="dv-input"
            placeholder="0%"
            :class="{ invalid: showErrors && pct(basket.evacPct) }"
          />
          <span class="dv-input readonly calc">{{ stats.evac }}</span>
        </div>
      </div>
      <div class="dv-field">
        <span class="dv-label">
          סך מיוצבים
          <span class="tip" title="מחושב אוטומטית מסך המיוצבים ביעדים שנבחרו"><AppIcon name="info" :size="14" /></span>
        </span>
        <span class="dv-input readonly calc">{{ stats.stabilized }}</span>
      </div>
    </div>
    <label class="dv-field basket-notes">
      <span class="dv-label">הערה לסל</span>
      <input v-model="basket.notes" class="dv-input" placeholder="טקסט חופשי - הערה כללית על הסל" />
    </label>

    <div class="dv-section-head targets-head">
      <h3>בחירת יעדים</h3>
      <small>היעדים הראשיים של הסל - מקצוע ומיוצבים מתמלאים אוטומטית לפי היעד</small>
    </div>

    <div class="targets">
      <template v-for="(t, i) in basket.targets" :key="t.id">
        <div v-if="editingTargets.includes(t.id)" class="tedit">
          <MainTargetFields :target="t" :show-errors="showErrors || rowErrors.includes(t.id)">
            <button type="button" class="ok" title="שמירת היעד" aria-label="שמירת היעד" @click="doneTarget(t)">
              <AppIcon name="check" :size="18" />
            </button>
            <button type="button" class="dv-trash" aria-label="מחיקת יעד" @click="removeTarget(i)">
              <DvIcon name="trash" :size="18" />
            </button>
          </MainTargetFields>
        </div>
        <TargetSummaryRow v-else :target="t" @edit="editTarget(t.id)" @remove="removeTarget(i)" />
      </template>
    </div>

    <button type="button" class="dv-add add-target" @click="addTarget">
      <AppIcon name="plus" :size="16" />
      הוספת יעד
    </button>

    <p v-if="showErrors && !valid" class="err">יש למלא את כל שדות החובה המסומנים לפני השמירה</p>

  </div>
</template>

<style scoped>
.editor {
  position: relative;
  padding-top: 26px;
}
.badge {
  position: absolute;
  top: -12px;
  inset-inline-start: 20px;
  height: 24px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  border-radius: 12px;
  background: var(--c-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}
.basket-row {
  display: grid;
  grid-template-columns: 1fr repeat(4, 131px);
  gap: 10px;
}
.basket-notes {
  margin-top: 10px;
}
.pct-pair {
  display: flex;
}
.pct-pair input {
  flex: 1;
  min-width: 0;
}
.pct-pair .calc {
  flex: 0 0 39px;
  padding: 0;
  justify-content: center;
  border-inline-start: 0;
}
.calc {
  display: flex;
  align-items: center;
}
.targets-head {
  margin-top: 50px;
}
/* One list: view rows separated by hairlines; a row being edited sits on a light tint. */
.targets {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}
.targets > * + * {
  border-top: 1px solid var(--c-divider);
}
.tedit {
  padding: 14px 16px;
  margin-inline: -16px;
  background: #f7f9ff;
}
.ok {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--c-primary);
  color: #fff;
}
.ok:hover {
  background: var(--c-primary-dark);
}
.tip {
  display: flex;
  color: var(--c-muted);
  cursor: help;
}
.err {
  margin-top: 16px;
  font-size: 13px;
  color: var(--c-danger);
}
.edge-acts {
  position: absolute;
  top: -15px;
  inset-inline-end: 20px;
  display: flex;
  gap: 8px;
}
.edge-acts .btn {
  height: 30px;
  box-shadow: 0 2px 6px rgba(7, 25, 56, 0.1);
}
/* The danger button is a soft tint; give it a solid base so the card edge doesn't show through. */
.edge-acts .dv-btn-danger {
  background-color: #ffe8eb;
}
</style>
