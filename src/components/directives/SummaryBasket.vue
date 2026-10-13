<script setup lang="ts">
// A basket on the summary / detail page: collapsed white row, or expanded blue block with its main targets.
import { reactive } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import BasketStats from './BasketStats.vue'
import MainTargetCard from './MainTargetCard.vue'
import type { Basket } from '@/data/directives'

const props = defineProps<{ basket: Basket }>()
const open = defineModel<boolean>('open', { default: false })
const openMap = reactive<Record<string, boolean>>(
  Object.fromEntries(props.basket.targets.map((t, i) => [t.id, i === 0])),
)
</script>

<template>
  <section class="sb" :class="{ open }">
    <button type="button" class="head" :aria-expanded="open" @click="open = !open">
      <h2>{{ basket.name }}</h2>
      <BasketStats :basket="basket" :tone="open ? 'inverse' : 'plain'" />
      <AppIcon :name="open ? 'chevron-up' : 'chevron-down'" :size="22" class="chev" />
    </button>
    <div v-if="open" class="body">
      <MainTargetCard v-for="t in basket.targets" :key="t.id" v-model:open="openMap[t.id]" :target="t" />
      <p v-if="!basket.targets.length" class="empty">לא הוגדרו יעדים לסל זה</p>
    </div>
  </section>
</template>

<style scoped>
.sb {
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}
.sb.open {
  background: #e2eafd;
}
.head {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  min-height: 86px;
  padding: 0 30px;
  text-align: start;
}
.open .head {
  background: #2f6eff;
  color: #fff;
}
.head h2 {
  flex: 1;
  font-size: 24px;
  font-weight: 700;
  color: var(--c-primary-dark);
}
.open .head h2,
.open .chev {
  color: #fff;
}
.chev {
  color: var(--c-text);
}
.body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 30px;
}
.empty {
  font-size: 14px;
  color: var(--c-muted-2);
}
</style>
