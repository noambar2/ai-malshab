<script setup lang="ts">
// The placement targets of a main target while it's being edited: each saved one is a plain
// table row (with edit / delete), and only the row being edited or added shows its fields.
import { ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from './DvIcon.vue'
import SearchSelect from './SearchSelect.vue'
import { findTarget, hasNum, newSubTarget, targetCatalog, targetLabel, type SubTarget } from '@/data/directives'

const props = defineProps<{
  subTargets: SubTarget[]
  // "יתר מיוצבים": איכות, כשירות and הערות are required too.
  strict?: boolean
  showErrors?: boolean
}>()

const targetOptions = targetCatalog.map((t) => ({ value: t.code, label: targetLabel(t) }))
const professionOf = (code: string) => {
  const t = findTarget(code)
  return t ? `${t.professionCode} - ${t.profession}` : ''
}

const valid = (s: SubTarget) =>
  !!s.targetCode &&
  hasNum(s.quantity) &&
  (!props.strict || (!!s.quality.trim() && !!s.qualification.trim() && !!s.notes.trim()))

// Incomplete rows start open for editing; rows whose ✓ was pressed while incomplete show errors.
const editing = ref<string[]>(props.subTargets.filter((s) => !valid(s)).map((s) => s.id))
const tried = ref<string[]>([])
const err = (s: SubTarget) => !!props.showErrors || tried.value.includes(s.id)
const missing = (s: SubTarget, v: unknown) =>
  err(s) && (typeof v === 'string' ? !v.trim() : !hasNum(v as number | null))

function edit(s: SubTarget) {
  if (!editing.value.includes(s.id)) editing.value = [...editing.value, s.id]
}
function save(s: SubTarget) {
  if (!valid(s)) {
    tried.value = [...tried.value, s.id]
    return
  }
  editing.value = editing.value.filter((x) => x !== s.id)
  tried.value = tried.value.filter((x) => x !== s.id)
}
function add() {
  const s = newSubTarget()
  props.subTargets.push(s)
  edit(s)
}
function remove(i: number) {
  props.subTargets.splice(i, 1)
}
</script>

<template>
  <table v-if="subTargets.length" class="dv-table subs">
    <thead>
      <tr>
        <th>יעד לשיבוץ</th>
        <th>מקצוע</th>
        <th>ניתן לשבץ</th>
        <th>איכות</th>
        <th>כשירות</th>
        <th>הערות</th>
        <th class="acts-col"><span class="sr-only">פעולות</span></th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(s, i) in subTargets" :key="s.id">
        <tr v-if="editing.includes(s.id)" class="editing">
          <td colspan="7">
            <div class="form">
              <div class="grid">
                <div class="dv-field">
                  <span class="dv-label"><span class="req">יעד</span></span>
                  <SearchSelect
                    v-model="s.targetCode"
                    :options="targetOptions"
                    placeholder="התחילו להקליד שם או מזהה יעד..."
                    :invalid="err(s) && !s.targetCode"
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
                    :class="{ invalid: missing(s, s.quantity) }"
                  />
                </label>
                <label class="dv-field">
                  <span class="dv-label"><span :class="{ req: strict }">איכות</span></span>
                  <input v-model="s.quality" class="dv-input" :class="{ invalid: strict && missing(s, s.quality) }" placeholder="טקסט חופשי" />
                </label>
                <label class="dv-field">
                  <span class="dv-label"><span :class="{ req: strict }">כשירות</span></span>
                  <input
                    v-model="s.qualification"
                    class="dv-input"
                    :class="{ invalid: strict && missing(s, s.qualification) }"
                    placeholder="טקסט חופשי"
                  />
                </label>
                <label class="dv-field">
                  <span class="dv-label"><span :class="{ req: strict }">הערות</span></span>
                  <input v-model="s.notes" class="dv-input" :class="{ invalid: strict && missing(s, s.notes) }" placeholder="טקסט חופשי" />
                </label>
              </div>
              <div class="form-acts">
                <button type="button" class="ico ok" aria-label="שמירת יעד לשיבוץ" title="שמירה" @click="save(s)">
                  <AppIcon name="check" :size="18" />
                </button>
                <button type="button" class="ico del" aria-label="מחיקת יעד לשיבוץ" title="מחיקה" @click="remove(i)">
                  <DvIcon name="trash" :size="16" />
                </button>
              </div>
            </div>
          </td>
        </tr>
        <tr v-else>
          <td>{{ findTarget(s.targetCode)?.name ?? s.targetCode }}</td>
          <td>
            {{ findTarget(s.targetCode)?.profession }}
            <span class="muted">{{ findTarget(s.targetCode)?.professionCode }}</span>
          </td>
          <td>{{ s.quantity ?? '-' }}</td>
          <td>{{ s.quality || '-' }}</td>
          <td>{{ s.qualification || '-' }}</td>
          <td class="notes">{{ s.notes || '-' }}</td>
          <td class="acts">
            <button type="button" class="ico" aria-label="עריכת יעד לשיבוץ" title="עריכה" @click="edit(s)">
              <DvIcon name="edit" :size="15" />
            </button>
            <button type="button" class="ico del" aria-label="מחיקת יעד לשיבוץ" title="מחיקה" @click="remove(i)">
              <DvIcon name="trash" :size="15" />
            </button>
          </td>
        </tr>
      </template>
    </tbody>
  </table>

  <button type="button" class="dv-add add" @click="add">
    <AppIcon name="plus" :size="16" />
    הוספת יעד לשיבוץ
  </button>
</template>

<style scoped>
.subs td {
  padding: 8px 12px;
}
.notes {
  max-width: 220px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.acts-col {
  width: 76px;
}
.acts {
  white-space: nowrap;
  text-align: end;
}
.acts .ico + .ico {
  margin-inline-start: 4px;
}
.ico {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border-radius: 50%;
  color: var(--c-muted-2);
}
.ico:hover {
  background: var(--c-primary-soft);
  color: var(--c-primary);
}
.ico.del:hover {
  background: rgba(255, 56, 60, 0.14);
  color: #ff383c;
}
.ico.ok {
  background: var(--c-primary);
  color: #fff;
}
.ico.ok:hover {
  background: var(--c-primary-dark);
  color: #fff;
}
/* The row being edited: its fields on a light tint, with ✓ / delete beside them. */
.editing td {
  padding: 12px;
  background: #f7f9ff;
}
.form {
  display: flex;
  align-items: center;
  gap: 12px;
}
.grid {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px 10px;
}
.form-acts {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ro {
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
}
.add {
  align-self: flex-start;
  margin-top: 14px;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
</style>
