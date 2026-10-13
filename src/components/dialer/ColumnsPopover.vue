<script setup lang="ts">
import { ref } from 'vue'

// "בחירה וסידור עמודות": tick to show / hide a column, drag the handle to reorder.
defineProps<{ columns: { key: string; label: string; visible: boolean }[] }>()
const emit = defineEmits<{ toggle: [key: string]; move: [from: string, to: string] }>()

const dragKey = ref<string | null>(null)
const overKey = ref<string | null>(null)

function onDragStart(e: DragEvent, key: string) {
  dragKey.value = key
  e.dataTransfer?.setData('text/plain', key)
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}
function onDragOver(e: DragEvent, key: string) {
  if (!dragKey.value) return
  e.preventDefault()
  overKey.value = key
}
function onDrop(key: string) {
  if (dragKey.value && dragKey.value !== key) emit('move', dragKey.value, key)
  dragKey.value = overKey.value = null
}
function onDragEnd() {
  dragKey.value = overKey.value = null
}
</script>

<template>
  <div class="popover" role="dialog" aria-label="בחירה וסידור עמודות">
    <div class="pop-head">בחירה וסידור עמודות</div>
    <ul>
      <li
        v-for="col in columns"
        :key="col.key"
        draggable="true"
        :class="{ dragging: dragKey === col.key, over: overKey === col.key && dragKey !== col.key }"
        @dragstart="onDragStart($event, col.key)"
        @dragover="onDragOver($event, col.key)"
        @dragleave="overKey === col.key && (overKey = null)"
        @drop.prevent="onDrop(col.key)"
        @dragend="onDragEnd"
      >
        <label>
          <input type="checkbox" :checked="col.visible" @change="emit('toggle', col.key)" />
          <span>{{ col.label }}</span>
        </label>
        <span class="grip" title="גררו לשינוי הסדר" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="2" y="5" width="12" height="1.5" rx=".75" />
            <rect x="2" y="9.5" width="12" height="1.5" rx=".75" />
          </svg>
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.popover {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  width: 190px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
  z-index: 40;
  text-align: start;
}
.pop-head {
  padding: 10px 12px;
  border-bottom: 1px solid #ebf0ff;
  font-size: 12px;
  font-weight: 500;
  color: var(--c-text);
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 7px 12px;
  border-bottom: 1px solid #ebf0ff;
  background: #fff;
  transition: background 0.1s;
}
li:last-child {
  border-bottom: 0;
}
li:hover {
  background: #f9f9fe;
}
li.dragging {
  opacity: 0.4;
}
li.over {
  box-shadow: inset 0 2px 0 var(--c-primary);
}
label {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  font-size: 14px;
  color: var(--c-text);
  cursor: pointer;
}
input {
  width: 18px;
  height: 18px;
  accent-color: var(--c-primary);
  cursor: pointer;
}
.grip {
  display: flex;
  color: #c3c7d4;
  cursor: grab;
}
li:hover .grip {
  color: var(--c-muted);
}
</style>
