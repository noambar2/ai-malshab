<script setup lang="ts">
// "סדר לשוניות תחנה" grid, shown inline on the first wizard step — drag the pills (or use the
// arrow keys) to reorder the station tabs. Edits the array in place.
import { computed, ref } from 'vue'
import DvIcon from './DvIcon.vue'

const props = defineProps<{ tabs: string[] }>()

const dragging = ref<number | null>(null)
const rows = computed(() => Math.ceil(props.tabs.length / 3))

function onDragStart(i: number, e: DragEvent) {
  dragging.value = i
  e.dataTransfer?.setData('text/plain', String(i))
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}
function onDragEnter(i: number) {
  const from = dragging.value
  if (from === null || from === i) return
  const [item] = props.tabs.splice(from, 1)
  if (item !== undefined) props.tabs.splice(i, 0, item)
  dragging.value = i
}
function move(i: number, delta: number) {
  const j = i + delta
  if (j < 0 || j >= props.tabs.length) return
  const [item] = props.tabs.splice(i, 1)
  if (item !== undefined) props.tabs.splice(j, 0, item)
}
</script>

<template>
      <ol class="grid" :style="{ gridTemplateRows: `repeat(${rows}, auto)` }">
        <!-- Slots are keyed by position, so the numbers stay put and only the pills move. -->
        <li
          v-for="(t, i) in tabs"
          :key="i"
          @dragenter.prevent="onDragEnter(i)"
          @dragover.prevent
        >
          <span class="num">{{ i + 1 }}</span>
          <span
            class="pill"
            :class="{ dragging: dragging === i }"
            tabindex="0"
            draggable="true"
            @dragstart="onDragStart(i, $event)"
            @dragend="dragging = null"
            @keydown.up.prevent="move(i, -1)"
            @keydown.down.prevent="move(i, 1)"
          >
            {{ t }}
            <DvIcon name="drag" :size="18" class="handle" />
          </span>
        </li>
      </ol>
</template>

<style scoped>
.grid {
  list-style: none;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px 20px;
  margin: 0;
  padding: 0;
}
li {
  display: flex;
  align-items: center;
  gap: 10px;
}
.num {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f5f6fa;
  font-size: 16px;
  color: var(--c-muted);
}
.pill {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 20px;
  border: 1px solid #e2e8f8;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  background: #fff;
  cursor: grab;
  user-select: none;
  outline: none;
}
.pill:focus-visible {
  border-color: var(--c-primary);
}
.handle {
  color: #a3a8bb;
}
.pill.dragging {
  border: 1px dashed var(--c-primary);
  background: var(--c-primary-soft);
  color: var(--c-primary);
}
</style>
