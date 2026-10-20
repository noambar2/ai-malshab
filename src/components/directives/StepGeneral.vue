<script setup lang="ts">
// Wizard step 1 — "הגדרות כלליות": station & owner, placement data, anchor dates.
import { ref } from 'vue'
import SearchSelect from './SearchSelect.vue'
import MultiSelect from './MultiSelect.vue'
import DateInput from './DateInput.vue'
import AnchorDatesEditor from './AnchorDatesEditor.vue'
import GuidelinesEditor from './GuidelinesEditor.vue'
import TabOrderModal from './TabOrderModal.vue'
import {
  cohortOptions,
  districts,
  forecastOptions,
  owners,
  reasonOptions,
  stations,
  type Directive,
} from '@/data/directives'

defineProps<{ d: Directive; showErrors?: boolean }>()
const tabsOpen = ref(false)
</script>

<template>
  <div class="dv-title-row">
    <h1 class="dv-title">הגדרות כלליות</h1>
  </div>

  <div class="dv-card step">
    <section>
      <div class="dv-section-head">
        <h3>בחירת תחנה ואחראי</h3>
        <small>בחרו את התחנה שעבורה נבנית הדירקטיבה ואת האחראי/ת עליה</small>
      </div>
      <div class="grid4">
        <div class="dv-field">
          <span class="dv-label"><span class="req">מתחם</span></span>
          <SearchSelect v-model="d.district" :options="districts" :invalid="showErrors && !d.district" />
        </div>
        <div class="dv-field">
          <span class="dv-label"><span class="req">תחנה</span></span>
          <SearchSelect v-model="d.station" :options="stations" :invalid="showErrors && !d.station" />
        </div>
        <div class="dv-field">
          <span class="dv-label"><span class="req">אחראי תחנה</span></span>
          <SearchSelect v-model="d.owner" :options="owners" :invalid="showErrors && !d.owner" />
        </div>
        <div class="dv-field">
          <span class="dv-label"><span class="req">תאריך</span></span>
          <DateInput v-model="d.date" :invalid="showErrors && !d.date" />
        </div>
      </div>
      <button type="button" class="dv-link tabs-link" @click="tabsOpen = true">לחצו לשינוי סדר לשוניות תחנה</button>
    </section>

    <section>
      <div class="dv-section-head">
        <h3>נתוני שיבוץ</h3>
        <small>אוכלוסיית המלש״בים שהדירקטיבה חלה עליה</small>
      </div>
      <div class="grid3">
        <div class="dv-field">
          <span class="dv-label"><span class="req">סיבות</span></span>
          <MultiSelect
            v-model="d.reasons"
            :options="reasonOptions"
            placeholder="התחל/י להקליד לחיפוש סיבות..."
            :invalid="showErrors && !d.reasons.length"
          />
        </div>
        <div class="dv-field">
          <span class="dv-label"><span class="req">ניבויים</span></span>
          <MultiSelect
            v-model="d.forecasts"
            :options="forecastOptions"
            placeholder="התחל/י להקליד לחיפוש ניבויים..."
            :invalid="showErrors && !d.forecasts.length"
          />
        </div>
        <div class="dv-field">
          <span class="dv-label"><span class="req">עונת הצבה</span></span>
          <MultiSelect
            v-model="d.cohorts"
            :options="cohortOptions"
            placeholder="התחל/י להקליד לחיפוש עונת הצבה..."
            :invalid="showErrors && !d.cohorts.length"
          />
        </div>
      </div>
    </section>

    <section>
      <div class="dv-section-head">
        <h3>תאריכי עוגן</h3>
        <small>טווחי תאריכים קבועים לפי יחידה</small>
      </div>
      <AnchorDatesEditor :anchors="d.anchors" :show-errors="showErrors" />
    </section>

    <section>
      <div class="dv-section-head">
        <h3>הערות והנחיות</h3>
        <small>דגשים, הנחיות והערות כלליות לדירקטיבה</small>
      </div>
      <GuidelinesEditor :items="d.guidelines" editable />
    </section>
  </div>

  <TabOrderModal v-if="tabsOpen" :tabs="d.tabOrder" @close="tabsOpen = false" />
</template>

<style scoped>
.step {
  display: flex;
  flex-direction: column;
  gap: 50px;
  min-height: 734px;
}
.grid4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.grid3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: start;
}
.tabs-link {
  margin-top: 20px;
}
</style>
