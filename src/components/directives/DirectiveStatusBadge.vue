<script setup lang="ts">
import { directiveStatusLabel, type DirectiveStatus } from '@/data/directives'

defineProps<{ status: DirectiveStatus }>()
</script>

<template>
  <span class="badge" :class="status">{{ directiveStatusLabel[status] }}</span>
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
</style>
