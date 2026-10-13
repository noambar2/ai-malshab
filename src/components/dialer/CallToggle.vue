<script setup lang="ts">
import type { CallDecision } from '@/data/mock'

// Three-state call switch from the design: grey (undecided, knob centred),
// green (approved, knob on the right) and red (rejected, knob on the left).
// Clicking a side picks that decision; clicking the side that is already on resets it.
const props = defineProps<{ modelValue: CallDecision; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [CallDecision] }>()

const labels: Record<CallDecision, string> = {
  approved: 'אושרה',
  rejected: 'לא אושרה',
  pending: 'לא הוחלט',
}

function onClick(e: MouseEvent) {
  if (props.disabled) return
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const pick: CallDecision = e.clientX - rect.left > rect.width / 2 ? 'approved' : 'rejected'
  emit('update:modelValue', props.modelValue === pick ? 'pending' : pick)
}

function onKey(e: KeyboardEvent) {
  if (props.disabled) return
  // RTL: the "approve" side is on the right.
  if (e.key === 'ArrowRight') emit('update:modelValue', props.modelValue === 'rejected' ? 'pending' : 'approved')
  else if (e.key === 'ArrowLeft') emit('update:modelValue', props.modelValue === 'approved' ? 'pending' : 'rejected')
  else return
  e.preventDefault()
}
</script>

<template>
  <button
    type="button"
    class="call-toggle"
    :class="modelValue"
    role="switch"
    :aria-checked="modelValue === 'approved' ? 'true' : modelValue === 'rejected' ? 'false' : 'mixed'"
    :aria-label="`אישור שיחה: ${labels[modelValue]}`"
    :title="labels[modelValue]"
    :disabled="disabled"
    @click.stop="onClick"
    @keydown="onKey"
  >
    <span class="knob">
      <svg v-if="modelValue !== 'pending'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          v-if="modelValue === 'approved'"
          d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z"
        />
        <path
          v-else
          d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85a.99.99 0 0 1-.7.28.97.97 0 0 1-.7-.29L.29 13.08A.96.96 0 0 1 0 12.37c0-.28.11-.53.29-.71A16.9 16.9 0 0 1 12 7c4.54 0 8.66 1.78 11.71 4.67.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48a.99.99 0 0 1-.7.29c-.27 0-.52-.11-.7-.28a11.27 11.27 0 0 0-2.67-1.85.99.99 0 0 1-.56-.9v-3.1A15.2 15.2 0 0 0 12 9Z"
        />
      </svg>
    </span>
  </button>
</template>

<style scoped>
.call-toggle {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 20px;
  border-radius: 100px;
  background: #d8d8d8;
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.15);
  vertical-align: middle;
  transition: background 0.2s;
}
.call-toggle.approved {
  background: #2dcc88;
}
.call-toggle.rejected {
  background: #ff4a60;
}
.call-toggle:focus-visible {
  outline: 2px solid var(--c-primary);
  outline-offset: 2px;
}
.call-toggle:disabled {
  cursor: default;
}
.knob {
  position: absolute;
  top: 50%;
  left: 22px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff;
  filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.25));
  transform: translateY(-50%);
  transition: left 0.2s;
}
.approved .knob {
  left: 42px;
  color: #2dcc88;
}
.rejected .knob {
  left: 2px;
  color: #ff4a60;
}
</style>
