<script setup lang="ts">
// A basket on the summary / detail page: collapsed white row, or expanded blue block with its main targets.
import { reactive } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import BasketStats from './BasketStats.vue'
import MainTargetCard from './MainTargetCard.vue'
import NoteLine from './NoteLine.vue'
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
      <div class="name">
        <h2 :title="basket.name">{{ basket.name }}</h2>
        <NoteLine v-if="basket.notes" :text="basket.notes" :inverse="open" @click.stop />
      </div>
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
.name {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.head h2 {
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 24px;
  font-weight: 700;
  color: var(--c-primary-dark);
}
.chev {
  flex-shrink: 0;
  color: var(--c-text);
}
.open .head h2,
.open .chev {
  color: #fff;
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
