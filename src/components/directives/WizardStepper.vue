<script setup lang="ts">
// Top progress bar of the create-directive wizard. Visited steps are clickable.
import AppIcon from '@/components/AppIcon.vue'

defineProps<{ steps: string[]; current: number; reached: number }>()
const emit = defineEmits<{ go: [index: number] }>()
</script>

<template>
  <div class="stepper-band">
    <ol class="stepper">
      <template v-for="(s, i) in steps" :key="s">
        <li v-if="i > 0" class="line" :class="{ done: i <= current }" aria-hidden="true" />
        <li :class="{ done: i < current, current: i === current, reachable: i <= reached && i !== current }">
          <button type="button" class="step" :disabled="i > reached || i === current" @click="emit('go', i)">
            <span class="dot"><AppIcon v-if="i < current" name="check" :size="11" /></span>
            <span class="label">{{ s }}</span>
          </button>
        </li>
      </template>
    </ol>
  </div>
</template>

<style scoped>
.stepper-band {
  background: #fff;
  padding: 40px 20px 20px;
}
.stepper {
  list-style: none;
  display: flex;
  align-items: flex-start;
  max-width: 1260px;
  margin: 0 auto;
  padding: 0;
}
.line {
  flex: 1;
  height: 4px;
  margin: 6px -10px 0;
  border-radius: 2px;
  background: var(--c-step-idle);
}
.line.done {
  background: var(--c-primary);
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 105px;
  cursor: default;
}
.reachable .step {
  cursor: pointer;
}
.reachable .step:hover .label {
  color: var(--c-primary);
}
.step:disabled {
  color: inherit;
}
.dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--c-step-idle);
  color: #fff;
}
.done .dot,
.current .dot {
  background: var(--c-primary);
}
.label {
  min-height: 40px;
  font-size: 16px;
  font-weight: 700;
  color: var(--c-text);
  text-align: center;
  line-height: 1.35;
}
</style>
