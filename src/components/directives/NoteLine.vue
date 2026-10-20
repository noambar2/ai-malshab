<script setup lang="ts">
// A one-line note under a title: cut off with "…" when it doesn't fit, and the full text in a
// tooltip on hover or keyboard focus (only when it was actually cut off).
import { ref } from 'vue'

defineProps<{ text: string; inverse?: boolean }>()

const line = ref<HTMLElement>()
const truncated = ref(false)
const show = ref(false)

function open() {
  const el = line.value
  truncated.value = !!el && el.scrollWidth > el.clientWidth + 1
  show.value = truncated.value
}
</script>

<template>
  <span
    class="note-line"
    :class="{ inverse }"
    :tabindex="0"
    @mouseenter="open"
    @mouseleave="show = false"
    @focus="open"
    @blur="show = false"
  >
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 1.6a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8ZM11.2 10.5h1.6V17h-1.6v-6.5Zm.8-3.3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
      />
    </svg>
    <span ref="line" class="text">{{ text }}</span>
    <span v-if="show" class="tip" role="tooltip">{{ text }}</span>
  </span>
</template>

<style scoped>
.note-line {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  max-width: 100%;
  font-size: 13px;
  color: var(--c-muted-2);
  outline: none;
}
.note-line svg {
  flex-shrink: 0;
}
.note-line.inverse {
  color: rgba(255, 255, 255, 0.85);
}
.text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.note-line:focus-visible .text {
  text-decoration: underline;
}
.tip {
  position: absolute;
  top: calc(100% + 8px);
  inset-inline-start: 0;
  z-index: 20;
  width: max-content;
  max-width: 380px;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--c-text);
  color: #fff;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.55;
  white-space: normal;
  text-align: start;
  box-shadow: 0 8px 24px rgba(7, 25, 56, 0.2);
  pointer-events: none;
}
.tip::before {
  content: '';
  position: absolute;
  bottom: 100%;
  inset-inline-start: 14px;
  border: 6px solid transparent;
  border-bottom-color: var(--c-text);
}
</style>
