<script setup lang="ts">
// Multi-value dropdown: selected values show as removable chips inside the field,
// typing filters the option list ("התחל/י להקליד לחיפוש ...").
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'

const props = defineProps<{ options: string[]; placeholder?: string; invalid?: boolean }>()
const model = defineModel<string[]>({ default: () => [] })

const root = ref<HTMLElement | null>(null)
const input = ref<HTMLInputElement | null>(null)
const open = ref(false)
const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim()
  return q ? props.options.filter((o) => o.includes(q)) : props.options
})

function toggleValue(o: string) {
  model.value = model.value.includes(o) ? model.value.filter((v) => v !== o) : [...model.value, o]
  query.value = ''
  input.value?.focus()
}
function remove(o: string) {
  model.value = model.value.filter((v) => v !== o)
}
function openMenu() {
  open.value = true
  nextTick(() => input.value?.focus())
}
function onBackspace() {
  if (!query.value && model.value.length) model.value = model.value.slice(0, -1)
}
function onDoc(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    open.value = false
    query.value = ''
  }
}
onMounted(() => document.addEventListener('mousedown', onDoc))
onBeforeUnmount(() => document.removeEventListener('mousedown', onDoc))
</script>

<template>
  <div ref="root" class="ms">
    <div class="dv-input box" :class="{ invalid, open }" @click="openMenu">
      <div class="chips">
        <span v-for="v in model" :key="v" class="chip">
          {{ v }}
          <button type="button" class="x" :aria-label="`הסרת ${v}`" @click.stop="remove(v)">
            <AppIcon name="close" :size="12" />
          </button>
        </span>
        <input
          ref="input"
          v-model="query"
          class="q"
          :placeholder="model.length ? '' : placeholder"
          @focus="open = true"
          @keydown.backspace="onBackspace"
          @keydown.esc="open = false"
          @keydown.enter.prevent="filtered[0] && toggleValue(filtered[0])"
        />
      </div>
      <button type="button" class="chev" tabindex="-1" @click.stop="open = !open">
        <AppIcon name="chevron-down" :size="20" />
      </button>
    </div>
    <ul v-if="open" class="menu">
      <li v-for="o in filtered" :key="o">
        <button type="button" :class="{ active: model.includes(o) }" @mousedown.prevent @click="toggleValue(o)">
          <span class="check"><AppIcon v-if="model.includes(o)" name="check" :size="14" /></span>
          {{ o }}
        </button>
      </li>
      <li v-if="!filtered.length" class="empty">לא נמצאו תוצאות</li>
    </ul>
  </div>
</template>

<style scoped>
.ms {
  position: relative;
  min-width: 0;
}
.box {
  display: flex;
  align-items: center;
  gap: 10px;
  height: auto;
  min-height: 42px;
  padding: 5px 12px 5px 8px;
  cursor: text;
}
.chips {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 5px 10px;
  min-width: 0;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 15px 0 5px;
  border: 1px solid #e2e8f8;
  border-radius: 2px;
  font-size: 14px;
  color: #171c23;
  white-space: nowrap;
}
.x {
  display: flex;
  color: #8f94aa;
  padding: 3px;
}
.x:hover {
  color: var(--c-danger);
}
.q {
  flex: 1;
  min-width: 80px;
  height: 28px;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 16px;
}
.q::placeholder {
  color: #a3a8bb;
}
.chev {
  display: flex;
  color: var(--c-text);
}
.open .chev {
  transform: rotate(180deg);
}
.menu {
  position: absolute;
  z-index: 30;
  top: calc(100% + 4px);
  inset-inline: 0;
  max-height: 260px;
  overflow: auto;
  list-style: none;
  padding: 6px;
  background: #fff;
  border: 1px solid #e2e8f8;
  border-radius: 6px;
  box-shadow: 0 6px 20px rgba(7, 25, 56, 0.12);
}
.menu button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  text-align: start;
  font-size: 14px;
  border-radius: 4px;
}
.menu button:hover {
  background: #f5f8fb;
}
.check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1px solid var(--c-border);
  border-radius: 3px;
  color: #fff;
}
.menu button.active .check {
  background: var(--c-primary);
  border-color: var(--c-primary);
}
.empty {
  padding: 9px 10px;
  font-size: 14px;
  color: var(--c-muted);
}
</style>
