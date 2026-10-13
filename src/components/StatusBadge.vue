<script setup lang="ts">
import { summonsStatusLabel, type SummonsStatus } from '@/data/mock'

defineProps<{ status: SummonsStatus }>()
</script>

<template>
  <span class="badge" :class="status">{{ summonsStatusLabel[status] }}</span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 106px;
  height: 30px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
}
.open {
  background: #dbe5ff;
  color: var(--c-primary);
}
.required {
  background: #fff3c7;
  color: #c48a00;
}
.attended {
  background: #dcf5ea;
  color: var(--c-success);
}
.absent {
  background: #e6e8f0;
  color: var(--c-muted-2);
}
.cancelled {
  background: #ffe0e4;
  color: var(--c-danger);
}
</style>
