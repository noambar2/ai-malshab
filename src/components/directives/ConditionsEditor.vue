<script setup lang="ts">
// The placement conditions of one placement target: each is a single pill of field | operator |
// value, joined by "וגם" (all must hold), with "תנאי חדש" adding another.
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from './DvIcon.vue'
import { conditionComplete, conditionFields, findField, newCondition, opsFor, type Condition } from '@/data/directives'

const props = defineProps<{ conditions: Condition[]; showErrors?: boolean }>()

// A list field (e.g. מגדר) only allows שווה / שונה, and its value comes from the list.
function onField(c: Condition) {
  if (c.op && !opsFor(c.field).some((o) => o.key === c.op)) c.op = ''
  const opts = findField(c.field)?.options
  if (opts && !opts.includes(c.value)) c.value = ''
}
function add() {
  props.conditions.push(newCondition())
}
function remove(i: number) {
  props.conditions.splice(i, 1)
}
</script>

<template>
  <div class="conds">
    <div v-for="(c, i) in conditions" :key="c.id" class="cond">
      <span class="join" :class="{ first: !i }">{{ i ? 'וגם' : 'אם' }}</span>
      <div class="pill" :class="{ invalid: showErrors && !conditionComplete(c) }">
        <select v-model="c.field" class="seg" :class="{ ph: !c.field }" aria-label="שדה" @change="onField(c)">
          <option value="" disabled>שדה</option>
          <option v-for="f in conditionFields" :key="f.key" :value="f.key">{{ f.label }}</option>
        </select>
        <select v-model="c.op" class="seg" :class="{ ph: !c.op }" aria-label="תנאי">
          <option value="" disabled>תנאי</option>
          <option v-for="o in opsFor(c.field)" :key="o.key" :value="o.key">{{ o.label }}</option>
        </select>
        <select
          v-if="findField(c.field)?.options"
          v-model="c.value"
          class="seg"
          :class="{ ph: !c.value }"
          aria-label="ערך"
        >
          <option value="" disabled>ערך</option>
          <option v-for="o in findField(c.field)?.options" :key="o" :value="o">{{ o }}</option>
        </select>
        <input v-else v-model="c.value" class="seg" inputmode="numeric" placeholder="ערך" aria-label="ערך" />
      </div>
      <button type="button" class="del" aria-label="מחיקת תנאי" title="מחיקת תנאי" @click="remove(i)">
        <DvIcon name="trash" :size="15" />
      </button>
    </div>

    <button type="button" class="add" @click="add">
      <AppIcon name="plus" :size="14" />
      {{ conditions.length ? 'תנאי נוסף' : 'הוספת תנאי' }}
    </button>
  </div>
</template>

<style scoped>
.conds {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}
.cond {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
/* "וגם" between conditions, as a small label in front of each pill. */
.join {
  flex-shrink: 0;
  width: 38px;
  padding: 2px 0;
  border-radius: 10px;
  background: #eef1f8;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  color: var(--c-muted-2);
}
.join.first {
  background: none;
}
.pill {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  height: 36px;
  background: #fff;
  border: 1px solid #e2e8f8;
  border-radius: 8px;
  overflow: hidden;
}
.pill:focus-within {
  border-color: var(--c-primary);
}
.pill.invalid {
  border-color: var(--c-danger);
}
.seg {
  min-width: 0;
  height: 100%;
  padding: 0 12px;
  border: 0;
  outline: none;
  background: transparent;
  font: inherit;
  font-size: 14px;
  color: #171c23;
}
.seg + .seg {
  border-inline-start: 1px solid #e2e8f8;
}
input.seg::placeholder,
.seg.ph {
  color: #a3a8bb;
}
select.seg {
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%23848a9e' d='M6.4 8.6 12 14.2l5.6-5.6 1.4 1.4-7 7-7-7 1.4-1.4Z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: left 10px center;
  padding-inline-end: 28px;
}
.del {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 50%;
  color: var(--c-muted-2);
}
.del:hover {
  background: rgba(255, 56, 60, 0.14);
  color: #ff383c;
}
.add {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-inline-start: 46px;
  padding: 2px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--c-primary);
}
.conds:not(:has(.cond)) .add {
  margin-inline-start: 0;
}
.add:hover {
  text-decoration: underline;
}
</style>
