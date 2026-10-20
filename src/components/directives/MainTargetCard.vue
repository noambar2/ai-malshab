<script setup lang="ts">
// A basket's main target as an expandable card. In the wizard ("יעדים לשיבוץ") the body edits
// the targets recruits can be placed into; on the summary/detail pages it's a read-only table.
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from './DvIcon.vue'
import SearchSelect from './SearchSelect.vue'
import { findTarget, hasNum, newSubTarget, targetCatalog, targetLabel, type MainTarget } from '@/data/directives'

const props = defineProps<{
  target: MainTarget
  editable?: boolean
  showErrors?: boolean
  // Header only: no expand and no placement-targets count (used before that step is reached).
  summaryOnly?: boolean
  // "יתר מיוצבים": the whole target is edited in a separate editor, so the view's edit button
  // asks the parent to switch to it instead of editing the placement targets in place.
  externalEdit?: boolean
}>()
const emit = defineEmits<{ edit: [] }>()
const open = defineModel<boolean>('open', { default: false })

const info = computed(() => findTarget(props.target.targetCode))
const targetOptions = targetCatalog.map((t) => ({ value: t.code, label: targetLabel(t) }))
const professionOf = (code: string) => {
  const t = findTarget(code)
  return t ? `${t.professionCode} - ${t.profession}` : ''
}

// In the wizard the placement targets have a view mode (read-only table) and an edit mode
// (fields), like a basket. Incomplete targets start in edit mode.
const subsValid = computed(() => props.target.subTargets.every((s) => !!s.targetCode && hasNum(s.quantity)))
const editing = ref(!!props.editable && !props.externalEdit && !subsValid.value)
const localErrors = ref(false)
const errors = computed(() => !!props.showErrors || localErrors.value)

function startEdit() {
  if (props.externalEdit) return emit('edit')
  editing.value = true
  open.value = true
}
function saveClose() {
  localErrors.value = true
  if (!subsValid.value) return
  editing.value = false
  localErrors.value = false
}
function add() {
  if (props.externalEdit) return emit('edit')
  props.target.subTargets.push(newSubTarget())
  editing.value = true
  open.value = true
}
function toggle() {
  if (!props.summaryOnly) open.value = !open.value
}
function remove(i: number) {
  props.target.subTargets.splice(i, 1)
}
</script>

<template>
  <section class="mt" :class="{ open, editable, compact: summaryOnly }">
    <div
      class="head bk-grid"
      :class="{ static: summaryOnly }"
      :role="summaryOnly ? undefined : 'button'"
      :tabindex="summaryOnly ? undefined : 0"
      :aria-expanded="summaryOnly ? undefined : open"
      @click="toggle"
      @keydown.enter.self="toggle"
    >
      <div class="title">
        <h3>
          <span class="nm">{{ info?.name ?? 'יעד לא נבחר' }}</span>
          <small>{{ target.targetCode }}</small>
        </h3>
        <p class="note">
          <AppIcon name="info" :size="14" />
          <span>{{ target.notes || 'אין הערות ליעד הראשי' }}</span>
        </p>
      </div>
      <!-- Same grid as the basket step: מקצוע spans two number columns, and the placement-targets
           count takes the column the basket uses for its edit / delete icons. -->
      <dl class="sum-stat wide">
        <dt>מקצוע</dt>
        <dd :data-tip="info ? `${info.profession} ${info.professionCode}` : undefined">
          {{ info?.profession ?? '-' }}<span class="code">{{ info?.professionCode }}</span>
        </dd>
      </dl>
      <dl class="sum-stat"><dt>סוג שיבוץ</dt><dd>{{ target.placementType || '-' }}</dd></dl>
      <dl class="sum-stat"><dt>יעד פינוי</dt><dd>{{ target.evacTarget || '-' }}</dd></dl>
      <dl class="sum-stat"><dt>מיוצבים</dt><dd>{{ info?.stabilized ?? 0 }}</dd></dl>
      <dl v-if="!summaryOnly" class="sum-stat">
        <dt>יעדים לשיבוץ</dt>
        <dd v-if="target.subTargets.length">{{ target.subTargets.length }}</dd>
        <dd v-else class="warn"><DvIcon name="warning" :size="13" />0</dd>
      </dl>
      <AppIcon v-if="!summaryOnly" :name="open ? 'chevron-up' : 'chevron-down'" :size="22" class="chev sum-chev" />
    </div>

    <div v-if="open && !summaryOnly" class="body">
      <!-- Edit mode (wizard) -->
      <template v-if="editable && editing">
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
                :invalid="errors && !s.targetCode"
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
                :class="{ invalid: errors && !hasNum(s.quantity) }"
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
        <p v-if="localErrors && !subsValid" class="err">יש לבחור יעד ולמלא "כמה ניתן לשבץ" בכל יעד לשיבוץ</p>
        <div class="edit-actions">
          <button type="button" class="dv-add" @click="add">
            <AppIcon name="plus" :size="16" />
            הוספת יעד לשיבוץ
          </button>
          <button type="button" class="btn btn-primary save" @click="saveClose">
            <AppIcon name="check" :size="14" />
            שמירה וסגירה
          </button>
        </div>
      </template>

      <!-- View mode: read-only table (also the summary / detail pages) -->
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
        <div v-if="editable && target.subTargets.length" class="view-actions">
          <button type="button" class="btn btn-soft" @click="startEdit">
            <DvIcon name="edit" :size="14" />
            {{ externalEdit ? 'עריכת יעד' : 'עריכת יעדים לשיבוץ' }}
          </button>
        </div>
        <div v-if="!target.subTargets.length" class="empty-row">
          <p class="empty">
            <DvIcon name="warning" :size="15" />
            לא הוגדרו יעדים לשיבוץ עבור יעד זה
          </p>
          <button v-if="editable" type="button" class="dv-add" @click="add">
            <AppIcon name="plus" :size="16" />
            הוספת יעד לשיבוץ
          </button>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.mt {
  background: #fff;
  border-radius: 8px;
}
/* Layout comes from the shared .bk-grid (directives.css). */
.head {
  width: 100%;
  min-height: 86px;
  padding: 16px 30px;
  text-align: start;
}
.head {
  cursor: pointer;
}
.head.static {
  cursor: default;
}
.head:focus-visible {
  outline: 2px solid var(--c-primary);
  outline-offset: -2px;
  border-radius: 8px;
}
.edit-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.edit-actions .save {
  height: 32px;
}
.view-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
.empty-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.err {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--c-danger);
}
.title {
  min-width: 0;
  padding-inline-end: 16px;
}
.title h3 {
  display: flex;
  align-items: baseline;
  min-width: 0;
  /* Same size as the basket name in the basket step. */
  font-size: 20px;
  font-weight: 500;
  color: var(--c-primary-dark);
}
/* One line: a long name is cut off with "…" (full name on hover) instead of wrapping word by word. */
.title .nm {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.title small {
  flex-shrink: 0;
  margin-inline-start: 8px;
  font-size: 14px;
  font-weight: 400;
  color: var(--c-muted);
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
  padding-bottom: 14px;
  margin-bottom: 14px;
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
/* Compact summary row (basket step): one tight line per target instead of a full card. */
.compact .head {
  min-height: 0;
  padding: 10px 0;
  gap: 16px;
}
.compact .title h3 {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0;
}
.compact .title small {
  font-size: 12px;
}
.compact .note {
  margin-top: 2px;
  font-size: 12px;
}
.compact .dv-stats .dv-stat {
  padding: 0 12px;
  gap: 2px;
  font-size: 12px;
}
.compact .dv-stat b {
  font-size: 14px;
}
.compact .dv-stat .code {
  font-size: 12px;
}
</style>
