<script setup lang="ts">
// "הערות והנחיות": general notes on the directive, each a title + free text.
// Edits the array in place. Used on the first wizard step and on the summary page.
import { nextTick, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from './DvIcon.vue'
import { uid, type Guideline } from '@/data/directives'

const props = defineProps<{ items: Guideline[]; editable?: boolean }>()

// One note is edited at a time; 'new' is the add form.
const editing = ref<string | null>(null)
const title = ref('')
const text = ref('')
const showErrors = ref(false)
const confirmDelete = ref<string | null>(null)
const root = ref<HTMLElement>()

// Focus the title field of whichever form just opened (only one is open at a time).
function focusTitle() {
  nextTick(() => root.value?.querySelector<HTMLInputElement>('form input')?.focus())
}

function startAdd() {
  editing.value = 'new'
  title.value = ''
  text.value = ''
  showErrors.value = false
  confirmDelete.value = null
  focusTitle()
}

function startEdit(g: Guideline) {
  editing.value = g.id
  title.value = g.title
  text.value = g.text
  showErrors.value = false
  confirmDelete.value = null
  focusTitle()
}

function cancel() {
  editing.value = null
  showErrors.value = false
}

function save() {
  if (!title.value.trim() || !text.value.trim()) {
    showErrors.value = true
    return
  }
  const value = { title: title.value.trim(), text: text.value.trim() }
  if (editing.value === 'new') {
    props.items.push({ id: uid('g'), ...value })
  } else {
    const g = props.items.find((x) => x.id === editing.value)
    if (g) Object.assign(g, value)
  }
  editing.value = null
}

function remove(id: string) {
  const i = props.items.findIndex((x) => x.id === id)
  if (i >= 0) props.items.splice(i, 1)
  confirmDelete.value = null
}
</script>

<template>
  <div ref="root" class="guidelines">
    <ul v-if="items.length" class="list">
      <li v-for="g in items" :key="g.id" class="item" :class="{ editing: editing === g.id }">
        <!-- Edit form, in place of the note -->
        <form v-if="editing === g.id" class="form" @submit.prevent="save">
          <label class="field">
            <span class="dv-label">כותרת *</span>
            <input
              v-model="title"
              class="dv-input"
              :class="{ invalid: showErrors && !title.trim() }"
              maxlength="60"
              placeholder="לדוגמה: הנחיות ליום הגיוס"
            />
          </label>
          <label class="field">
            <span class="dv-label">טקסט *</span>
            <textarea
              v-model="text"
              class="dv-input area"
              :class="{ invalid: showErrors && !text.trim() }"
              rows="3"
              placeholder="ההנחיות, הדגשים או ההערה"
            />
          </label>
          <p v-if="showErrors" class="error" role="alert">יש למלא כותרת וטקסט להערה</p>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">שמירה</button>
            <button type="button" class="btn btn-soft" @click="cancel">ביטול</button>
          </div>
        </form>

        <!-- The note -->
        <template v-else>
          <div class="content">
            <h4>{{ g.title }}</h4>
            <p>{{ g.text }}</p>
          </div>
          <div v-if="editable" class="acts">
            <template v-if="confirmDelete === g.id">
              <span class="confirm-q">למחוק את ההערה?</span>
              <button type="button" class="btn btn-danger sm" @click="remove(g.id)">מחיקה</button>
              <button type="button" class="btn btn-soft sm" @click="confirmDelete = null">ביטול</button>
            </template>
            <template v-else>
              <button type="button" class="act" title="עריכה" aria-label="עריכת ההערה" @click="startEdit(g)">
                <DvIcon name="edit" :size="16" />
              </button>
              <button type="button" class="act del" title="מחיקה" aria-label="מחיקת ההערה" @click="confirmDelete = g.id">
                <DvIcon name="trash" :size="16" />
              </button>
            </template>
          </div>
        </template>
      </li>
    </ul>
    <p v-else-if="editing !== 'new'" class="none">
      {{ editable ? 'עדיין לא נוספו הערות. אפשר להוסיף דגשים או הנחיות כלליות לדירקטיבה.' : 'לא נוספו הערות והנחיות' }}
    </p>

    <!-- Add form -->
    <form v-if="editing === 'new'" class="item editing form" @submit.prevent="save">
      <label class="field">
        <span class="dv-label">כותרת *</span>
        <input
          v-model="title"
          class="dv-input"
          :class="{ invalid: showErrors && !title.trim() }"
          maxlength="60"
          placeholder="לדוגמה: הנחיות ליום הגיוס"
        />
      </label>
      <label class="field">
        <span class="dv-label">טקסט *</span>
        <textarea
          v-model="text"
          class="dv-input area"
          :class="{ invalid: showErrors && !text.trim() }"
          rows="3"
          placeholder="ההנחיות, הדגשים או ההערה"
        />
      </label>
      <p v-if="showErrors" class="error" role="alert">יש למלא כותרת וטקסט להערה</p>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">הוספה</button>
        <button type="button" class="btn btn-soft" @click="cancel">ביטול</button>
      </div>
    </form>
    <button v-else-if="editable" type="button" class="btn btn-soft add" @click="startAdd">
      <AppIcon name="plus" :size="14" />
      הוספת הערה
    </button>
  </div>
</template>

<style scoped>
.guidelines {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 14px 18px;
  border: 1px solid var(--c-border-2);
  border-radius: 10px;
  background: #fff;
}
.item.editing {
  border-color: #b9c9ff;
  background: #f8faff;
}
.content {
  flex: 1;
  min-width: 0;
}
h4 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 700;
  color: var(--c-brand);
}
.content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--c-text);
  white-space: pre-line;
}
.acts {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.act {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: var(--c-primary);
}
.act:hover {
  background: var(--c-primary-soft);
}
.act.del {
  color: var(--c-muted-2);
}
.act.del:hover {
  background: #ffe8eb;
  color: var(--c-danger);
}
.confirm-q {
  font-size: 13px;
  color: var(--c-text);
  margin-inline-end: 4px;
}
.btn.sm {
  height: 28px;
  padding: 0 12px;
}
.btn-danger {
  background: var(--c-danger);
  color: #fff;
}
.form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 640px;
}
.area {
  height: auto;
  min-height: 76px;
  padding-block: 10px;
  line-height: 1.6;
  resize: vertical;
  font: inherit;
}
.invalid {
  border-color: var(--c-danger) !important;
}
.error {
  margin: 0;
  font-size: 13px;
  color: var(--c-danger);
}
.form-actions {
  display: flex;
  gap: 8px;
}
.add {
  align-self: flex-start;
}
.none {
  margin: 0;
  font-size: 14px;
  color: var(--c-muted);
}
</style>
