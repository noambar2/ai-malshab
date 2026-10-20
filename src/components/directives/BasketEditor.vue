<script setup lang="ts">
// One basket in edit mode (wizard step "סלים"): basket numbers + its main targets.
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from './DvIcon.vue'
import SearchSelect from './SearchSelect.vue'
import {
  basketStats,
  findTarget,
  hasNum,
  newMainTarget,
  placementTypes,
  targetCatalog,
  targetLabel,
  type Basket,
} from '@/data/directives'

const props = defineProps<{ basket: Basket; index: number }>()
const emit = defineEmits<{ save: []; remove: [] }>()

const showErrors = ref(false)
const stats = computed(() => basketStats(props.basket))
const targetOptions = targetCatalog.map((t) => ({ value: t.code, label: targetLabel(t) }))

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
  if (valid.value) emit('save')
}
function addTarget() {
  props.basket.targets.push(newMainTarget())
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

    <div v-for="(t, i) in basket.targets" :key="t.id" class="target-row">
      <div class="dv-field">
        <span class="dv-label"><span class="req">יעד</span></span>
        <SearchSelect
          v-model="t.targetCode"
          :options="targetOptions"
          placeholder="התחילו להקליד שם או מזהה יעד..."
          :invalid="showErrors && !t.targetCode"
        />
      </div>
      <div class="dv-field">
        <span class="dv-label">מקצוע</span>
        <span class="dv-input readonly calc ellipsis" :title="findTarget(t.targetCode)?.profession">
          {{ findTarget(t.targetCode) ? `${findTarget(t.targetCode)!.professionCode} - ${findTarget(t.targetCode)!.profession}` : 0 }}
        </span>
      </div>
      <div class="dv-field">
        <span class="dv-label">מיוצבים</span>
        <span class="dv-input readonly calc">{{ findTarget(t.targetCode)?.stabilized ?? 0 }}</span>
      </div>
      <label class="dv-field">
        <span class="dv-label"><span class="req">סוג שיבוץ</span></span>
        <select
          v-model="t.placementType"
          class="dv-input"
          :class="{ placeholder: !t.placementType, invalid: showErrors && !t.placementType }"
        >
          <option value="" disabled>לחצו לבחירה</option>
          <option v-for="p in placementTypes" :key="p" :value="p">{{ p }}</option>
        </select>
      </label>
      <label class="dv-field">
        <span class="dv-label">יעד פינוי</span>
        <input v-model="t.evacTarget" class="dv-input" placeholder="טקסט חופשי" />
      </label>
      <label class="dv-field">
        <span class="dv-label">הערות</span>
        <input v-model="t.notes" class="dv-input" placeholder="טקסט חופשי" />
      </label>
      <button type="button" class="dv-trash" aria-label="מחיקת יעד" @click="removeTarget(i)">
        <DvIcon name="trash" :size="18" />
      </button>
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
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  line-height: 40px;
}
.targets-head {
  margin-top: 50px;
}
.target-row {
  display: grid;
  grid-template-columns: 278px repeat(5, 1fr) 36px;
  align-items: end;
  gap: 20px;
  margin-bottom: 20px;
}
.target-row .dv-field:first-child {
  margin-inline-end: -10px;
}
.target-row .dv-trash {
  margin-bottom: 3px;
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
