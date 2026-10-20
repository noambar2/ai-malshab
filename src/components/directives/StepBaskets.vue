<script setup lang="ts">
// Wizard step 2a — "הגדרת סלים": baskets and their main targets. Baskets being edited are
// tracked by id in `editing`; saved baskets collapse into an accordion whose header shows the
// basket's name, note and numbers, and whose body lists its main targets.
import { reactive } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import DvIcon from './DvIcon.vue'
import BasketEditor from './BasketEditor.vue'
import BasketStats from './BasketStats.vue'
import MainTargetCard from './MainTargetCard.vue'
import MetaLine from './MetaLine.vue'
import NoteLine from './NoteLine.vue'
import { newBasket, type Directive } from '@/data/directives'

const props = defineProps<{ d: Directive; error?: string }>()
const editing = defineModel<string[]>('editing', { default: () => [] })

const expanded = reactive<Record<string, boolean>>({})

function add() {
  const b = newBasket()
  props.d.baskets.push(b)
  editing.value = [...editing.value, b.id]
}
function close(id: string) {
  editing.value = editing.value.filter((x) => x !== id)
}
function edit(id: string) {
  if (!editing.value.includes(id)) editing.value = [...editing.value, id]
}
function remove(i: number) {
  const [b] = props.d.baskets.splice(i, 1)
  if (b) close(b.id)
}
</script>

<template>
  <div class="dv-title-row">
    <h1 class="dv-title">הגדרת סלים</h1>
    <MetaLine :d="d" />
  </div>

  <div class="list">
    <template v-for="(b, i) in d.baskets" :key="b.id">
      <BasketEditor v-if="editing.includes(b.id)" :basket="b" :index="i" @save="close(b.id)" @remove="remove(i)" />
      <section v-else class="dv-card saved" :class="{ open: expanded[b.id] }">
        <span class="badge">סל מס׳ {{ i + 1 }}</span>
        <div
          class="head"
          role="button"
          tabindex="0"
          :aria-expanded="!!expanded[b.id]"
          @click="expanded[b.id] = !expanded[b.id]"
          @keydown.enter.self="expanded[b.id] = !expanded[b.id]"
        >
          <div class="name">
            <h2>{{ b.name }}</h2>
            <NoteLine v-if="b.notes" :text="b.notes" @click.stop />
          </div>
          <BasketStats :basket="b" />
          <AppIcon :name="expanded[b.id] ? 'chevron-up' : 'chevron-down'" :size="22" class="chev" />
        </div>

        <div v-if="expanded[b.id]" class="body">
          <!-- Placement targets are set in the next step, so the targets here are summary rows only. -->
          <MainTargetCard v-for="t in b.targets" :key="t.id" :target="t" summary-only />
          <p v-if="!b.targets.length" class="empty">לא הוגדרו יעדים לסל זה</p>
          <div class="actions">
            <button type="button" class="btn btn-soft" @click="edit(b.id)">
              <DvIcon name="edit" :size="14" />
              עריכת הסל
            </button>
          </div>
        </div>
      </section>
    </template>

    <p v-if="error" class="err">{{ error }}</p>

    <button type="button" class="dv-add wide" @click="add">
      <AppIcon name="plus" :size="16" />
      הוספת סל חדש
    </button>
  </div>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.saved {
  position: relative;
  padding: 0;
}
.badge {
  position: absolute;
  top: -12px;
  inset-inline-start: 20px;
  z-index: 1;
  height: 24px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  border-radius: 12px;
  background: var(--c-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}
.head {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 26px 30px 24px;
  cursor: pointer;
  border-radius: inherit;
  outline: none;
}
.head:hover {
  background: #fafbff;
}
.head:focus-visible {
  box-shadow: inset 0 0 0 2px var(--c-primary);
}
/* The name column takes the free space, so a long note truncates instead of pushing the numbers. */
.name {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.name h2 {
  font-size: 24px;
  font-weight: 500;
  color: var(--c-primary-dark);
}
.chev {
  flex-shrink: 0;
  color: var(--c-text);
}
.body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 30px 24px;
  border-top: 1px solid var(--c-divider);
  padding-top: 20px;
}
.empty {
  font-size: 14px;
  color: var(--c-muted-2);
}
.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.err {
  margin-top: -14px;
  font-size: 13px;
  color: var(--c-danger);
}
</style>
