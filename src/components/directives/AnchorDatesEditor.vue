<script setup lang="ts">
// "תאריכי עוגן" — rows of title + date range, add/remove. Mutates the given array in place.
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from './DvIcon.vue'
import DateRangeInput from './DateRangeInput.vue'
import { anchorTitles, newAnchor, type AnchorDate } from '@/data/directives'

const props = defineProps<{
  anchors: AnchorDate[]
  showErrors?: boolean
  addLabel?: string
  // Smaller fields, to sit with the denser content of the summary page.
  compact?: boolean
}>()

function add() {
  props.anchors.push(newAnchor())
}
function remove(i: number) {
  props.anchors.splice(i, 1)
}
</script>

<template>
  <div class="anchors" :class="{ compact }">
    <div v-for="(a, i) in anchors" :key="a.id" class="row">
      <label class="dv-field title">
        <span class="dv-label"><span class="req">כותרת</span></span>
        <input
          v-model="a.title"
          class="dv-input"
          list="dv-anchor-titles"
          placeholder="הקלד/י כותרת"
          :class="{ invalid: showErrors && !a.title }"
        />
      </label>
      <div class="dv-field range">
        <span class="dv-label"><span class="req">טווח תאריכים</span></span>
        <DateRangeInput v-model:from="a.from" v-model:to="a.to" :invalid="showErrors && (!a.from || !a.to)" />
      </div>
      <button type="button" class="dv-trash" aria-label="מחיקת תאריך עוגן" @click="remove(i)">
        <DvIcon name="trash" :size="18" />
      </button>
    </div>
    <datalist id="dv-anchor-titles">
      <option v-for="t in anchorTitles" :key="t" :value="t" />
    </datalist>
    <!-- Same button as "הוספת הערה" in the guidelines section. -->
    <button type="button" class="btn btn-soft add" @click="add">
      <AppIcon name="plus" :size="14" />
      {{ addLabel ?? 'הוספת תאריכי עוגן' }}
    </button>
  </div>
</template>

<style scoped>
.add {
  align-self: flex-start;
}
.anchors {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}
.row {
  display: flex;
  align-items: flex-end;
  gap: 20px;
}
.row .dv-trash {
  margin-bottom: 3px;
}
.title {
  width: 209px;
}
.range {
  width: 267px;
}
.compact {
  gap: 10px;
}
.compact .row {
  gap: 12px;
}
.compact :deep(.dv-input) {
  height: 34px;
  font-size: 14px;
}
.compact :deep(.dv-label) {
  font-size: 12px;
}
.compact .dv-trash {
  width: 30px;
  height: 30px;
  margin-bottom: 2px;
}
.compact .title {
  width: 180px;
}
.compact .range {
  width: 240px;
}
</style>
