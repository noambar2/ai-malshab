<script setup lang="ts">
// Grey tooltip with a bottom arrow, shown above its content on hover / keyboard focus.
defineProps<{ text: string; hidden?: boolean }>()
</script>

<template>
  <span class="tip-anchor" :class="{ suppressed: hidden }">
    <slot />
    <span class="tip" role="tooltip">{{ text }}</span>
  </span>
</template>

<style scoped>
.tip-anchor {
  position: relative;
  display: inline-flex;
}
.tip {
  position: absolute;
  bottom: calc(100% + 11px);
  left: 50%;
  transform: translate(-50%, 4px);
  min-width: 70px;
  padding: 5px 10px;
  border-radius: 4px;
  background: #eaeaea;
  color: #777;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  text-align: center;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s, transform 0.15s;
  z-index: 30;
}
.tip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -7px;
  border: 7px solid transparent;
  border-top-color: #eaeaea;
  border-bottom: 0;
}
.tip-anchor:not(.suppressed):hover .tip,
.tip-anchor:not(.suppressed):has(:focus-visible) .tip {
  opacity: 1;
  transform: translate(-50%, 0);
  transition-delay: 0.15s;
}
</style>
