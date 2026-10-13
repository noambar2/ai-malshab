<script setup lang="ts">
// Wizard step 3 — "יתר מיוצבים": stabilized recruits outside the baskets, per target.
// (Not drawn in Figma as its own screen; built from the "יתר המיוצבים" table of the summary page.)
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from './DvIcon.vue'
import SearchSelect from './SearchSelect.vue'
import MetaLine from './MetaLine.vue'
import { hasNum, newRestRow, targetCatalog, targetLabel, type Directive } from '@/data/directives'

const props = defineProps<{ d: Directive; showErrors?: boolean }>()
const targetOptions = targetCatalog.map((t) => ({ value: t.code, label: targetLabel(t) }))

function add() {
  props.d.rest.push(newRestRow())
}
function remove(i: number) {
  props.d.rest.splice(i, 1)
}
</script>

<template>
  <div class="dv-title-row">
    <h1 class="dv-title">יתר מיוצבים</h1>
    <MetaLine :d="d" />
  </div>

  <div class="dv-card">
    <div class="dv-section-head">
      <h3>יתר המיוצבים</h3>
      <small>מיוצבים שאינם משויכים לאף סל - כמות לפי יעד, כמה כבר התראיינו והערות לשיבוץ</small>
    </div>

    <div v-if="d.rest.length" class="rows">
      <div v-for="(r, i) in d.rest" :key="r.id" class="row">
        <div class="dv-field">
          <span class="dv-label"><span class="req">יעד</span></span>
          <SearchSelect
            v-model="r.targetCode"
            :options="targetOptions"
            placeholder="התחילו להקליד שם או מזהה יעד..."
            :invalid="showErrors && !r.targetCode"
          />
        </div>
        <label class="dv-field">
          <span class="dv-label"><span class="req">כמות מיוצבים</span></span>
          <input
            v-model.number="r.count"
            type="number"
            min="0"
            class="dv-input"
            placeholder="0"
            :class="{ invalid: showErrors && !hasNum(r.count) }"
          />
        </label>
        <label class="dv-field">
          <span class="dv-label">התראיינו</span>
          <input v-model="r.interviewed" class="dv-input" placeholder="לדוגמא 8/20" />
        </label>
        <label class="dv-field">
          <span class="dv-label">הערות לפי יעד</span>
          <input v-model="r.notes" class="dv-input" placeholder="טקסט חופשי" />
        </label>
        <button type="button" class="dv-trash" aria-label="מחיקת שורה" @click="remove(i)">
          <DvIcon name="trash" :size="18" />
        </button>
      </div>
    </div>
    <p v-else class="empty">לא הוגדרו מיוצבים נוספים. ניתן להמשיך לשלב הבא או להוסיף יעד.</p>

    <button type="button" class="dv-add" @click="add">
      <AppIcon name="plus" :size="16" />
      הוספת יעד
    </button>
  </div>
</template>

<style scoped>
.dv-card {
  min-height: 500px;
}
.rows {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}
.row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 2fr 36px;
  align-items: end;
  gap: 20px;
}
.row .dv-trash {
  margin-bottom: 3px;
}
.empty {
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--c-muted);
}
</style>
