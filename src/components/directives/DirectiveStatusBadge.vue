<script setup lang="ts">
import { directiveStatusLabel, type DirectiveStatus } from '@/data/directives'

// subtle: a small colored dot and text, for lists where the name and date should lead.
defineProps<{ status: DirectiveStatus; subtle?: boolean }>()
</script>

<template>
  <span class="badge" :class="[status, { subtle }]">{{ directiveStatusLabel[status] }}</span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 96px;
  height: 28px;
  padding: 0 12px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
.draft {
  background: #fff3c7;
  color: #c48a00;
}
.scheduled {
  background: #dbe5ff;
  color: var(--c-primary);
}
.active {
  background: #dcf5ea;
  color: var(--c-success);
}
.done {
  background: #e6e8f0;
  color: var(--c-muted-2);
}
.badge.subtle {
  gap: 5px;
  min-width: 0;
  height: auto;
  padding: 0;
  background: none;
  font-weight: 500;
}
.badge.subtle::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}
.badge.subtle.done {
  color: var(--c-muted);
}
</style>
