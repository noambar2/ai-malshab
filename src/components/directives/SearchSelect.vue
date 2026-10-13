<script setup lang="ts">
// Single-value dropdown with type-to-search ("לחצו לחיפוש ובחירה").
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'

export interface Option {
  value: string
  label: string
}

const props = defineProps<{
  options: (Option | string)[]
  placeholder?: string
  invalid?: boolean
}>()
const model = defineModel<string>({ default: '' })

const root = ref<HTMLElement | null>(null)
const open = ref(false)
const query = ref('')
const qEl = ref<HTMLInputElement | null>(null)

const opts = computed<Option[]>(() =>
  props.options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o)),
)
const selected = computed(() => opts.value.find((o) => o.value === model.value))
const filtered = computed(() => {
  const q = query.value.trim()
  return q ? opts.value.filter((o) => o.label.includes(q)) : opts.value
})

function toggle() {
  open.value = !open.value
  query.value = ''
  if (open.value) nextTick(() => qEl.value?.focus())
}
function pick(o: Option) {
  model.value = o.value
  open.value = false
  query.value = ''
}
function onDoc(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('mousedown', onDoc))
onBeforeUnmount(() => document.removeEventListener('mousedown', onDoc))
</script>

<template>
  <div ref="root" class="ss">
    <div class="dv-input box" :class="{ invalid, open }" @click="!open && toggle()">
      <input
        v-if="open"
        ref="qEl"
        v-model="query"
        class="q"
        :placeholder="selected?.label ?? placeholder ?? 'לחצו לחיפוש ובחירה'"
        @keydown.esc="open = false"
        @keydown.enter.prevent="filtered[0] && pick(filtered[0])"
      />
      <span v-else class="val" :class="{ ph: !selected }">{{ selected?.label ?? placeholder ?? 'לחצו לחיפוש ובחירה' }}</span>
      <button type="button" class="chev" tabindex="-1" @click.stop="toggle">
        <AppIcon name="chevron-down" :size="20" />
      </button>
    </div>
    <ul v-if="open" class="menu">
      <li v-for="o in filtered" :key="o.value">
        <button type="button" :class="{ active: o.value === model }" @click="pick(o)">{{ o.label }}</button>
      </li>
      <li v-if="!filtered.length" class="empty">לא נמצאו תוצאות</li>
    </ul>
  </div>
</template>

<style scoped>
.ss {
  position: relative;
  min-width: 0;
}
.box {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding-inline-end: 8px;
}
.val,
.q {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.q {
  border: 0;
  outline: none;
  background: transparent;
  font-size: 16px;
}
.q::placeholder,
.ph {
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
  display: block;
  width: 100%;
  padding: 9px 10px;
  text-align: start;
  font-size: 14px;
  border-radius: 4px;
}
.menu button:hover {
  background: #f5f8fb;
}
.menu button.active {
  color: var(--c-primary);
  font-weight: 600;
  background: var(--c-primary-soft);
}
.empty {
  padding: 9px 10px;
  font-size: 14px;
  color: var(--c-muted);
}
</style>
