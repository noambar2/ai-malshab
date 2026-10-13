<script setup lang="ts">
// The תוכניות / צפי הגעה / צפי פינוי / סך מיוצבים / יעדים numbers for a basket.
import { computed } from 'vue'
import { basketStats, type Basket } from '@/data/directives'

const props = defineProps<{ basket: Basket; tone?: 'plain' | 'blue' | 'inverse' }>()
const s = computed(() => basketStats(props.basket))
</script>

<template>
  <div class="dv-stats bs" :class="tone ?? 'plain'">
    <div class="dv-stat">
      <span>תוכניות</span>
      <b>{{ s.plans }}</b>
    </div>
    <div class="dv-stat">
      <span>צפי הגעה</span>
      <span><b>{{ s.arrival }}</b>&nbsp;&nbsp;<span class="pct">{{ basket.arrivalPct ?? 0 }}%</span></span>
    </div>
    <div class="dv-stat">
      <span>צפי פינוי</span>
      <span><b>{{ s.evac }}</b>&nbsp;&nbsp;<span class="pct">{{ basket.evacPct ?? 0 }}%</span></span>
    </div>
    <div class="dv-stat">
      <span>סך מיוצבים</span>
      <b>{{ s.stabilized }}</b>
    </div>
    <div class="dv-stat">
      <span>יעדים</span>
      <b>{{ s.targets }}</b>
    </div>
  </div>
</template>

<style scoped>
.bs .dv-stat {
  min-width: 100px;
  align-items: flex-start;
}
.bs .dv-stat:first-child {
  min-width: 120px;
}
.plain {
  color: var(--c-text);
}
.blue {
  color: var(--c-primary);
}
.blue b {
  color: var(--c-brand);
}
.blue .dv-stat + .dv-stat {
  border-color: #c3d1f7;
}
.inverse {
  color: #fff;
}
.inverse .dv-stat + .dv-stat {
  border-color: rgba(255, 255, 255, 0.35);
}
</style>
