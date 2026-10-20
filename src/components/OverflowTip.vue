<script setup lang="ts">
// One tooltip for the whole app: hovering any text that is cut off with "…" shows its full text.
// It only appears when the text really is truncated. An element can supply its own tooltip text
// with data-tip, or opt out with data-no-tip (e.g. components that draw their own tooltip).
import { onBeforeUnmount, onMounted, ref } from 'vue'

const text = ref('')
const pos = ref({ x: 0, y: 0, below: true })
let current: HTMLElement | null = null

function truncatedEl(start: EventTarget | null): HTMLElement | null {
  let el = start instanceof HTMLElement ? start : null
  for (let i = 0; el && i < 4; i++, el = el.parentElement) {
    if (el.closest('[data-no-tip]')) return null
    const cs = getComputedStyle(el)
    if (cs.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1) return el
  }
  return null
}

// The page is zoomed (see main.css), so screen coordinates are divided back into page units.
const zoom = () => Number(getComputedStyle(document.documentElement).zoom) || 1

function show(el: HTMLElement) {
  const full = (el.dataset.tip ?? el.innerText).replace(/\s+/g, ' ').trim()
  if (!full) return
  const z = zoom()
  const r = el.getBoundingClientRect()
  const below = r.bottom + 60 < window.innerHeight
  pos.value = { x: (r.left + r.width / 2) / z, y: (below ? r.bottom + 8 : r.top - 8) / z, below }
  text.value = full
  current = el
}

function onOver(e: MouseEvent) {
  const el = truncatedEl(e.target)
  if (el === current) return
  if (el) show(el)
  else hide()
}
function hide() {
  current = null
  text.value = ''
}

onMounted(() => {
  document.addEventListener('mouseover', onOver)
  document.addEventListener('scroll', hide, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('mouseover', onOver)
  document.removeEventListener('scroll', hide, true)
})
</script>

<template>
  <div
    v-if="text"
    class="overflow-tip"
    :class="{ above: !pos.below }"
    :style="{ left: `${pos.x}px`, top: `${pos.y}px` }"
    role="tooltip"
  >
    {{ text }}
  </div>
</template>

<style scoped>
.overflow-tip {
  position: fixed;
  z-index: 100;
  max-width: 380px;
  padding: 7px 12px;
  border-radius: 6px;
  background: var(--c-text);
  color: #fff;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  text-align: start;
  white-space: normal;
  box-shadow: 0 8px 24px rgba(7, 25, 56, 0.2);
  transform: translateX(-50%);
  pointer-events: none;
}
.overflow-tip.above {
  transform: translate(-50%, -100%);
}
</style>
