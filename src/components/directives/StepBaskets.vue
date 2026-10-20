<script setup lang="ts">
// Wizard step 2a — "הגדרת סלים": baskets and their main targets. Baskets being edited are
// tracked by id in `editing`; saved baskets collapse into a summary card.
import AppIcon from '@/components/AppIcon.vue'
import BasketEditor from './BasketEditor.vue'
import BasketStats from './BasketStats.vue'
import MetaLine from './MetaLine.vue'
import { newBasket, type Directive } from '@/data/directives'

const props = defineProps<{ d: Directive; error?: string }>()
const editing = defineModel<string[]>('editing', { default: () => [] })

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
      <div v-else class="dv-card collapsed">
        <span class="badge">סל מס׳ {{ i + 1 }}</span>
        <div class="name">
          <h2>{{ b.name }}</h2>
          <p v-if="b.notes" class="bnote" :title="b.notes"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 1.6a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8ZM11.2 10.5h1.6V17h-1.6v-6.5Zm.8-3.3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/></svg><span>{{ b.notes }}</span></p>
          <button type="button" class="dv-link" @click="edit(b.id)">לחצו לצפייה ועריכה</button>
        </div>
        <BasketStats :basket="b" />
      </div>
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
.collapsed {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 26px 30px 24px;
}
.badge {
  position: absolute;
  top: -12px;
  inset-inline-start: 20px;
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
.name {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.bnote {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 2px 0 4px;
  max-width: 420px;
  font-size: 13px;
  color: var(--c-muted-2);
}
.bnote span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.name h2 {
  font-size: 24px;
  font-weight: 500;
  color: var(--c-primary-dark);
}
.name .dv-link {
  font-size: 14px;
}
.err {
  margin-top: -14px;
  font-size: 13px;
  color: var(--c-danger);
}
</style>
