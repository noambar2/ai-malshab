<script setup lang="ts">
// One "יתר מיוצבים" main target in edit mode: its fields plus the targets recruits can be
// placed into, in a single card (Figma "יתר מיוצבים").
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from './DvIcon.vue'
import SearchSelect from './SearchSelect.vue'
import {
  findTarget,
  hasNum,
  newSubTarget,
  placementTypes,
  restTargetValid,
  targetCatalog,
  targetLabel,
  type MainTarget,
} from '@/data/directives'

const props = defineProps<{ target: MainTarget; index: number }>()
const emit = defineEmits<{ save: []; remove: [] }>()

const showErrors = ref(false)
const targetOptions = targetCatalog.map((t) => ({ value: t.code, label: targetLabel(t) }))
const info = computed(() => findTarget(props.target.targetCode))
const professionOf = (code: string) => {
  const t = findTarget(code)
  return t ? `${t.professionCode} - ${t.profession}` : '0'
}

function save() {
  showErrors.value = true
  if (restTargetValid(props.target)) emit('save')
}
function addSub() {
  props.target.subTargets.push(newSubTarget())
}
function removeSub(i: number) {
  props.target.subTargets.splice(i, 1)
}
const missing = (v: unknown) => showErrors.value && (typeof v === 'string' ? !v.trim() : !hasNum(v as number | null))
</script>

<template>
  <div class="dv-card editor">
    <span class="badge">יעד מס׳ {{ index + 1 }}</span>

    <div class="main-row">
      <div class="dv-field">
        <span class="dv-label"><span class="req">יעד</span></span>
        <SearchSelect
          v-model="target.targetCode"
          :options="targetOptions"
          placeholder="התחילו להקליד שם או מזהה יעד..."
          :invalid="showErrors && !target.targetCode"
        />
      </div>
      <div class="dv-field">
        <span class="dv-label">מקצוע</span>
        <span class="dv-input readonly calc ellipsis" :title="info?.profession">{{ professionOf(target.targetCode) }}</span>
      </div>
      <div class="dv-field">
        <span class="dv-label">מיוצבים</span>
        <span class="dv-input readonly calc">{{ info?.stabilized ?? 0 }}</span>
      </div>
      <label class="dv-field">
        <span class="dv-label"><span class="req">סוג שיבוץ</span></span>
        <select
          v-model="target.placementType"
          class="dv-input"
          :class="{ placeholder: !target.placementType, invalid: showErrors && !target.placementType }"
        >
          <option value="" disabled>לחצו לבחירה</option>
          <option v-for="p in placementTypes" :key="p" :value="p">{{ p }}</option>
        </select>
      </label>
      <label class="dv-field">
        <span class="dv-label"><span class="req">יעד פינוי</span></span>
        <input v-model="target.evacTarget" class="dv-input" :class="{ invalid: missing(target.evacTarget) }" placeholder="טקסט חופשי" />
      </label>
    </div>
    <label class="dv-field notes">
      <span class="dv-label">הערות</span>
      <input v-model="target.notes" class="dv-input" placeholder="טקסט חופשי" />
    </label>

    <div class="dv-section-head subs-head">
      <h3>בחירת יעדים לשיבוץ</h3>
      <small>היעדים אליהם ניתן לשבץ את המתגייסים מהיום הנוכחי, בהתאם ליעד שאיתו הגיעו אל יום הגיוס.</small>
    </div>

    <div v-for="(s, i) in target.subTargets" :key="s.id" class="sub">
      <button type="button" class="dv-trash" aria-label="מחיקת יעד לשיבוץ" @click="removeSub(i)">
        <DvIcon name="trash" :size="18" />
      </button>
      <div class="sub-grid">
        <div class="dv-field">
          <span class="dv-label"><span class="req">יעד</span></span>
          <SearchSelect
            v-model="s.targetCode"
            :options="targetOptions"
            placeholder="התחילו להקליד שם או מזהה יעד..."
            :invalid="showErrors && !s.targetCode"
          />
        </div>
        <div class="dv-field">
          <span class="dv-label">מקצוע</span>
          <span class="dv-input readonly calc ellipsis">{{ professionOf(s.targetCode) }}</span>
        </div>
        <label class="dv-field">
          <span class="dv-label"><span class="req">כמה ניתן לשבץ?</span></span>
          <input
            v-model.number="s.quantity"
            type="number"
            min="0"
            class="dv-input"
            placeholder="0"
            :class="{ invalid: missing(s.quantity) }"
          />
        </label>
        <label class="dv-field">
          <span class="dv-label"><span class="req">איכות</span></span>
          <input v-model="s.quality" class="dv-input" :class="{ invalid: missing(s.quality) }" placeholder="טקסט חופשי" />
        </label>
        <label class="dv-field">
          <span class="dv-label"><span class="req">כשירות</span></span>
          <input v-model="s.qualification" class="dv-input" :class="{ invalid: missing(s.qualification) }" placeholder="טקסט חופשי" />
        </label>
        <label class="dv-field">
          <span class="dv-label"><span class="req">הערות</span></span>
          <input v-model="s.notes" class="dv-input" :class="{ invalid: missing(s.notes) }" placeholder="טקסט חופשי" />
        </label>
      </div>
    </div>

    <button type="button" class="dv-add add-sub" @click="addSub">
      <AppIcon name="plus" :size="16" />
      הוספת יעד לשיבוץ
    </button>

    <p v-if="showErrors && !restTargetValid(target)" class="err">יש למלא את כל שדות החובה המסומנים לפני השמירה</p>

    <div class="actions">
      <button type="button" class="btn dv-btn-danger" @click="emit('remove')">
        <DvIcon name="trash" :size="14" />
        מחיקת יעד
      </button>
      <button type="button" class="btn btn-soft" @click="save">
        <AppIcon name="check" :size="14" />
        שמירה וסגירה
      </button>
    </div>
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
/* Figma: the target field is wider, followed by four equal fields. */
.main-row {
  display: grid;
  grid-template-columns: 278px repeat(4, minmax(0, 1fr));
  gap: 10px 20px;
}
.notes {
  margin-top: 10px;
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
.subs-head {
  margin-top: 40px;
}
.sub {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
}
.sub .dv-trash {
  flex-shrink: 0;
  margin-top: 21px;
}
.sub-grid {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.add-sub {
  align-self: flex-start;
}
.err {
  margin-top: 16px;
  font-size: 13px;
  color: var(--c-danger);
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 40px;
}
</style>
