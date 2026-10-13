<script setup lang="ts">
// Grey "תחנה ... | אחראי/ת ... | date" line shown next to step titles.
import { fmtDate, type Directive } from '@/data/directives'

defineProps<{ d: Directive }>()
</script>

<template>
  <div class="dv-meta">
    <span>תחנה {{ d.station || '-' }}</span>
    <span>אחראי/ת {{ d.owner || '-' }}</span>
    <span>{{ d.date ? fmtDate(d.date, '/') : '-' }}</span>
  </div>
</template>
