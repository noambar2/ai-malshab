<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{ text?: string }>(), { text: 'לא קיים מידע' })
</script>

<template>
  <div class="empty">
    <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
      <path
        d="M24 14a4 4 0 0 1 4-4h28l18 18v56a4 4 0 0 1-4 4H28a4 4 0 0 1-4-4V14Z"
        fill="#fff"
        stroke="#1b2a6b"
        stroke-width="3.5"
        stroke-linejoin="round"
      />
      <path d="M56 10v14a4 4 0 0 0 4 4h14" fill="none" stroke="#1b2a6b" stroke-width="3.5" stroke-linejoin="round" />
      <rect x="33" y="30" width="18" height="4" rx="2" fill="#f15a4a" />
      <rect x="33" y="40" width="26" height="4" rx="2" fill="#f15a4a" />
      <rect x="33" y="50" width="16" height="4" rx="2" fill="#f7a8a0" />
      <rect x="33" y="60" width="14" height="4" rx="2" fill="#f7a8a0" />
      <rect x="33" y="70" width="16" height="7" rx="1.5" fill="#fbbf3c" />
      <path d="m75 75 11 11" stroke="#1b2a6b" stroke-width="5" stroke-linecap="round" />
      <circle cx="64" cy="64" r="15" fill="#6fd0d8" stroke="#1b2a6b" stroke-width="3.5" />
      <path d="m59 59 10 10m0-10-10 10" stroke="#fff" stroke-width="3.5" stroke-linecap="round" />
    </svg>
    <p>{{ text }}</p>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
}
p {
  font-size: 16px;
  font-weight: 600;
  color: var(--c-text);
}
</style>
