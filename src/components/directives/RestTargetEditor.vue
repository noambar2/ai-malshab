<script setup lang="ts">
// One "יתר מיוצבים" main target in edit mode: its fields plus the targets recruits can be
// placed into, in a single card (Figma "יתר מיוצבים").
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from './DvIcon.vue'
import SearchSelect from './SearchSelect.vue'
import SubTargetsEditor from './SubTargetsEditor.vue'
import {
  findTarget,
  hasNum,
  placementTypes,
  restTargetValid,
  targetCatalog,
  targetLabel,
  type MainTarget,
} from '@/data/directives'

const props = defineProps<{ target: MainTarget }>()
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
const missing = (v: unknown) => showErrors.value && (typeof v === 'string' ? !v.trim() : !hasNum(v as number | null))
</script>

<template>
  <div class="dv-card editor">
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

    <SubTargetsEditor :sub-targets="target.subTargets" strict :show-errors="showErrors" />

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
  line-height: 34px;
}
.subs-head {
  margin-top: 24px;
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
  margin-top: 24px;
}
</style>
