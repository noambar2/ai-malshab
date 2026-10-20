<script setup lang="ts">
// Top progress of the create-directive wizard: "שלב 2 מתוך 4" over four bar segments, each
// with its step name underneath. Done steps show a check; steps already reached are clickable.
import AppIcon from '@/components/AppIcon.vue'

const props = defineProps<{ steps: string[]; current: number; reached: number }>()
const emit = defineEmits<{ go: [index: number] }>()

function go(i: number) {
  if (i <= props.reached && i !== props.current) emit('go', i)
}
</script>

<template>
  <nav class="stepper-band" aria-label="שלבי יצירת הדירקטיבה">
    <div class="inner">
      <p class="count">שלב {{ current + 1 }} מתוך {{ steps.length }}</p>
      <ol class="steps">
        <li
          v-for="(s, i) in steps"
          :key="s"
          :class="{ done: i < current, current: i === current, reachable: i <= reached && i !== current }"
        >
          <button
            type="button"
            class="step"
            :disabled="i > reached || i === current"
            :aria-current="i === current ? 'step' : undefined"
            @click="go(i)"
          >
            <span class="bar" aria-hidden="true" />
            <span class="label">
              <AppIcon v-if="i < current" name="check" :size="14" class="check" />
              {{ s }}
            </span>
          </button>
        </li>
      </ol>
    </div>
  </nav>
</template>

<style scoped>
/* Stays pinned under the navbar (56px) while the step scrolls, like the navbar itself. */
.stepper-band {
  position: sticky;
  top: 56px;
  z-index: 15;
  background: #fff;
  border-bottom: 1px solid var(--c-divider);
}
.inner {
  max-width: 1300px;
  margin: 0 auto;
  padding: 10px 60px 12px;
}
.count {
  margin: 0 0 6px;
  font-size: 12px;
  color: var(--c-muted);
}
.steps {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  margin: 0;
  padding: 0;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
  width: 100%;
  text-align: start;
  cursor: default;
}
.reachable .step {
  cursor: pointer;
}
.step:disabled {
  color: inherit;
}
.bar {
  height: 4px;
  border-radius: 2px;
  background: var(--c-step-idle);
  transition: background 0.15s;
}
.done .bar,
.current .bar {
  background: var(--c-primary);
}
.reachable .step:hover .bar {
  background: #3d6fff;
}
.label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--c-muted-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.check {
  flex-shrink: 0;
  color: var(--c-primary);
}
.done .label {
  color: var(--c-text);
}
.current .label {
  font-weight: 700;
  color: var(--c-primary);
}
.reachable .step:hover .label {
  color: var(--c-primary);
}
.step:not(:disabled):focus-visible {
  outline: 2px solid var(--c-primary);
  outline-offset: 3px;
  border-radius: 2px;
}
</style>
