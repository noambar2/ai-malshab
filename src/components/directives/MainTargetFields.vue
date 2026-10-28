<script setup lang="ts">
// The fields of one basket main target (יעד, מקצוע, מיוצבים, סוג שיבוץ, יעד פינוי, הערות), shared by
// the basket editor and the single-target edit on a saved basket. The slot is the row's last
// column (a delete button, or save / cancel).
import SearchSelect from './SearchSelect.vue'
import { findTarget, placementTypes, targetCatalog, targetLabel, type MainTarget } from '@/data/directives'

defineProps<{ target: MainTarget; showErrors?: boolean }>()
const targetOptions = targetCatalog.map((t) => ({ value: t.code, label: targetLabel(t) }))
</script>

<template>
  <div class="target-row">
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
      <span class="dv-input readonly ellipsis" :title="findTarget(target.targetCode)?.profession">
        {{ findTarget(target.targetCode) ? `${findTarget(target.targetCode)!.professionCode} - ${findTarget(target.targetCode)!.profession}` : 0 }}
      </span>
    </div>
    <div class="dv-field">
      <span class="dv-label">מיוצבים</span>
      <span class="dv-input readonly calc">{{ findTarget(target.targetCode)?.stabilized ?? 0 }}</span>
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
      <span class="dv-label">יעד פינוי</span>
      <input v-model="target.evacTarget" class="dv-input" placeholder="טקסט חופשי" />
    </label>
    <label class="dv-field">
      <span class="dv-label">הערות</span>
      <input v-model="target.notes" class="dv-input" placeholder="טקסט חופשי" />
    </label>
    <div class="end"><slot /></div>
  </div>
</template>

<style scoped>
.target-row {
  display: grid;
  grid-template-columns: 278px repeat(5, minmax(0, 1fr)) auto;
  align-items: end;
  gap: 20px;
}
.target-row .dv-field:first-child {
  margin-inline-end: -10px;
}
.calc {
  display: flex;
  align-items: center;
}
.ellipsis {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 34px;
}
.end {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
}
</style>
