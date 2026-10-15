<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import RichText from '@/assistant/RichText.vue'
import { smartSummary } from '@/assistant/answers'
import { assistantOpen } from '@/assistant/state'

const summary = computed(() => smartSummary())
// A short "thinking" beat before the summary appears, so it reads as generated.
const ready = ref(false)

onMounted(() => setTimeout(() => (ready.value = true), 700))
</script>

<template>
  <section class="smart">
    <header class="head">
      <span class="mark">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9L12 2.5Zm6.5 11 .9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z"
          />
        </svg>
      </span>
      <span class="titles">
        <h2>סיכום חכם</h2>
        <span class="sub">נוצר אוטומטית מנתוני התיק</span>
      </span>
    </header>

    <div class="flags">
      <span v-for="f in summary.flags" :key="f.text" class="flag" :class="f.tone">{{ f.text }}</span>
    </div>

    <div class="body">
      <div v-if="!ready" class="skeleton" aria-label="הסיכום נוצר">
        <span /><span /><span /><span />
      </div>
      <template v-else>
        <RichText :text="summary.text" class="text" />
        <p class="rec">
          <b>המלצה:</b>
          {{ summary.recommendation }}
        </p>
      </template>
    </div>

    <button class="ask" @click="assistantOpen = true">
      שאל/י את העוזר החכם
      <AppIcon name="arrow-left" :size="14" />
    </button>
  </section>
</template>

<style scoped>
.smart {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 14px;
  background:
    radial-gradient(circle at 0% 0%, rgba(77, 125, 255, 0.1), transparent 40%),
    linear-gradient(180deg, #f6f8ff 0%, #ffffff 100%);
  border: 1px solid #dbe4ff;
  box-shadow: 0 6px 24px -12px rgba(13, 45, 143, 0.25);
}
/* Thin gradient edge on the start side, echoing the assistant's mark. */
.smart::before {
  content: '';
  position: absolute;
  inset-block: 14px;
  inset-inline-start: -1px;
  width: 3px;
  border-radius: 3px;
  background: linear-gradient(180deg, #4d7dff, #0046fe 60%, #0d2d8f);
}
.head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(315deg, #0d2d8f 0%, #0046fe 55%, #4d7dff 100%);
  box-shadow: 0 6px 16px -6px rgba(0, 70, 254, 0.6);
}
h2 {
  font-size: 17px;
  font-weight: 700;
  color: var(--c-brand);
}
.titles {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}
.sub {
  font-size: 12px;
  color: var(--c-muted);
}
.flags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.flag {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.flag.red {
  background: #ffe0e4;
  color: var(--c-danger);
}
.flag.amber {
  background: #fff3c7;
  color: #a87400;
}
.flag.blue {
  background: #dbe5ff;
  color: var(--c-primary);
}
.ask {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  margin-top: auto;
  font-size: 13px;
  font-weight: 600;
  color: var(--c-primary);
}
.ask:hover {
  text-decoration: underline;
}
.body {
  min-height: 0;
}
.text {
  font-size: 14px;
  line-height: 1.7;
  color: var(--c-text);
  animation: rise 0.35s ease-out both;
}
.rec {
  margin-top: 8px;
  font-size: 14px;
  color: var(--c-muted-2);
  animation: rise 0.35s 0.1s ease-out both;
}
.rec b {
  color: var(--c-primary);
  font-weight: 700;
}
.skeleton {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 0;
}
.skeleton span {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #e9eefc 0%, #f6f8ff 50%, #e9eefc 100%);
  background-size: 200% 100%;
  animation: shimmer 1.1s linear infinite;
}
.skeleton span:nth-child(2) {
  width: 92%;
}
.skeleton span:nth-child(3) {
  width: 60%;
}
@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
}
</style>
