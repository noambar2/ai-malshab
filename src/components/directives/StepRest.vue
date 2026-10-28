<script setup lang="ts">
// Wizard step 3 — "יתר מיוצבים": main targets outside the baskets, each with the targets its
// recruits can be placed into (Figma "יתר מיוצבים"). Targets being edited show the editor;
// saved ones are the same card as a basket's main target, opening into a read-only view.
import { reactive, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import MainTargetCard from './MainTargetCard.vue'
import RestTargetEditor from './RestTargetEditor.vue'
import MetaLine from './MetaLine.vue'
import { newMainTarget, restTargetValid, type Directive } from '@/data/directives'

const props = defineProps<{ d: Directive }>()

// New or invalid targets start open; complete ones start collapsed.
const editing = ref<string[]>(props.d.rest.filter((t) => !restTargetValid(t)).map((t) => t.id))
const openMap = reactive<Record<string, boolean>>({})

function add() {
  const t = { ...newMainTarget(), placementType: 'שוחררים' }
  props.d.rest.push(t)
  editing.value = [...editing.value, t.id]
}
function close(id: string) {
  editing.value = editing.value.filter((x) => x !== id)
  openMap[id] = false
}
function open(id: string) {
  if (!editing.value.includes(id)) editing.value = [...editing.value, id]
}
function remove(i: number) {
  const [t] = props.d.rest.splice(i, 1)
  if (t) close(t.id)
}
</script>

<template>
  <div class="dv-title-row">
    <h1 class="dv-title">יתר מיוצבים</h1>
    <MetaLine :d="d" />
  </div>

  <div class="list">
    <template v-for="(t, i) in d.rest" :key="t.id">
      <RestTargetEditor v-if="editing.includes(t.id)" :target="t" @save="close(t.id)" @remove="remove(i)" />
      <MainTargetCard
        v-else
        v-model:open="openMap[t.id]"
        :target="t"
        editable
        external-edit
        row-actions
        @edit="open(t.id)"
        @remove="remove(i)"
      />
    </template>

    <p v-if="!d.rest.length" class="none">לא הוגדרו מיוצבים נוספים. הוסיפו יעד ראשי אם יש מיוצבים שאינם משויכים לאף סל.</p>

    <button type="button" class="dv-add wide" @click="add">
      <AppIcon name="plus" :size="16" />
      הוספת יעד ראשי
    </button>
  </div>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.none {
  margin: 0;
  padding: 24px;
  border-radius: 10px;
  background: var(--c-surface);
  text-align: center;
  font-size: 14px;
  color: var(--c-muted);
}
</style>
