<script setup lang="ts">
// A basket's main target as an expandable card. In the wizard ("יעדים לשיבוץ") the body edits
// the targets recruits can be placed into; on the summary/detail pages it's a read-only table.
import { computed } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from './DvIcon.vue'
import SearchSelect from './SearchSelect.vue'
import { findTarget, hasNum, newSubTarget, targetCatalog, targetLabel, type MainTarget } from '@/data/directives'

const props = defineProps<{ target: MainTarget; editable?: boolean; showErrors?: boolean }>()
const open = defineModel<boolean>('open', { default: false })

const info = computed(() => findTarget(props.target.targetCode))
const targetOptions = targetCatalog.map((t) => ({ value: t.code, label: targetLabel(t) }))
const professionOf = (code: string) => {
  const t = findTarget(code)
  return t ? `${t.professionCode} - ${t.profession}` : ''
}

function add() {
  props.target.subTargets.push(newSubTarget())
  open.value = true
}
function remove(i: number) {
  props.target.subTargets.splice(i, 1)
}
</script>

<template>
  <section class="mt" :class="{ open, editable }">
    <button type="button" class="head" :aria-expanded="open" @click="open = !open">
      <div class="title">
        <h3>
          {{ info?.name ?? 'יעד לא נבחר' }}
          <small>{{ target.targetCode }}</small>
        </h3>
        <p class="note" :title="target.notes">
          <AppIcon name="info" :size="14" />
          <span>{{ target.notes || 'אין הערות ליעד הראשי' }}</span>
        </p>
      </div>
      <div class="dv-stats">
        <div class="dv-stat">
          <span>מקצוע</span>
          <span><b>{{ info?.profession ?? '-' }}</b><span class="code">{{ info?.professionCode }}</span></span>
        </div>
        <div class="dv-stat">
          <span>סוג שיבוץ</span>
          <b>{{ target.placementType || '-' }}</b>
        </div>
        <div class="dv-stat">
          <span>יעד פינוי</span>
          <b>{{ target.evacTarget || '-' }}</b>
        </div>
        <div class="dv-stat">
          <span>מיוצבים</span>
          <b>{{ info?.stabilized ?? 0 }}</b>
        </div>
        <div class="dv-stat">
          <span>יעדים לשיבוץ</span>
          <b v-if="target.subTargets.length">{{ target.subTargets.length }}</b>
          <b v-else class="warn"><DvIcon name="warning" :size="15" />0</b>
        </div>
      </div>
      <AppIcon :name="open ? 'chevron-up' : 'chevron-down'" :size="22" class="chev" />
    </button>

    <div v-if="open" class="body">
      <!-- Editable (wizard) -->
      <template v-if="editable">
        <div class="dv-section-head">
          <h3>בחירת יעדים לשיבוץ</h3>
          <small>היעדים אליהם ניתן לשבץ את המתגייסים מהיום הנוכחי, בהתאם ליעד שאיתו הגיעו אל יום הגיוס.</small>
        </div>
        <div v-for="(s, i) in target.subTargets" :key="s.id" class="sub">
          <button type="button" class="dv-trash" aria-label="מחיקת יעד לשיבוץ" @click="remove(i)">
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
              <span class="dv-input readonly ro">{{ professionOf(s.targetCode) || 0 }}</span>
            </div>
            <label class="dv-field">
              <span class="dv-label"><span class="req">כמה ניתן לשבץ?</span></span>
              <input
                v-model.number="s.quantity"
                type="number"
                min="0"
                class="dv-input"
                placeholder="0"
                :class="{ invalid: showErrors && !hasNum(s.quantity) }"
              />
            </label>
            <label class="dv-field">
              <span class="dv-label">איכות</span>
              <input v-model="s.quality" class="dv-input" placeholder="טקסט חופשי" />
            </label>
            <label class="dv-field">
              <span class="dv-label">כשירות</span>
              <input v-model="s.qualification" class="dv-input" placeholder="טקסט חופשי" />
            </label>
            <label class="dv-field">
              <span class="dv-label">הערות</span>
              <input v-model="s.notes" class="dv-input" placeholder="טקסט חופשי" />
            </label>
          </div>
        </div>
        <button type="button" class="dv-add" @click="add">
          <AppIcon name="plus" :size="16" />
          הוספת יעד לשיבוץ
        </button>
      </template>

      <!-- Read-only (summary / detail) -->
      <template v-else>
        <table v-if="target.subTargets.length" class="dv-table">
          <thead>
            <tr>
              <th>יעדים לשיבוץ</th>
              <th>מקצוע</th>
              <th>ניתן לשבץ</th>
              <th>איכות</th>
              <th>כשירות</th>
              <th>הערות</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in target.subTargets" :key="s.id">
              <td>{{ findTarget(s.targetCode)?.name ?? s.targetCode }}</td>
              <td>
                {{ findTarget(s.targetCode)?.profession }}
                <span class="muted">{{ findTarget(s.targetCode)?.professionCode }}</span>
              </td>
              <td>{{ s.quantity ?? '-' }}</td>
              <td>{{ s.quality || '-' }}</td>
              <td>{{ s.qualification || '-' }}</td>
              <td class="notes">{{ s.notes || '-' }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="empty">
          <DvIcon name="warning" :size="15" />
          לא הוגדרו יעדים לשיבוץ עבור יעד זה
        </p>
      </template>
    </div>
  </section>
</template>

<style scoped>
.mt {
  background: #fff;
  border-radius: 8px;
}
.head {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  min-height: 86px;
  padding: 16px 30px;
  text-align: start;
}
.title {
  flex: 1;
  min-width: 0;
}
.title h3 {
  font-size: 24px;
  font-weight: 500;
  color: var(--c-primary-dark);
  letter-spacing: -0.48px;
}
.title small {
  margin-inline-start: 8px;
  font-size: 14px;
  font-weight: 400;
  color: var(--c-muted);
  letter-spacing: 0;
}
.note {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  font-size: 14px;
  color: var(--c-muted-2);
}
.note span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 360px;
}
.dv-stats .dv-stat {
  padding: 0 14px;
  color: var(--c-text);
}
.chev {
  color: var(--c-text);
}
.body {
  margin: 0 30px;
  padding: 24px 0 30px;
  border-top: 1px solid var(--c-divider);
}
.sub {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--c-divider);
}
.sub-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.ro {
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
}
.notes {
  max-width: 220px;
}
.empty {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--c-danger);
}
</style>
