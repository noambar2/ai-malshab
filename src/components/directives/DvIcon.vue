<script setup lang="ts">
// Extra icons the directives screens need that AppIcon doesn't have (kept local to avoid editing shared files).
const paths = {
  trash:
    'M9 3h6l1 1.5h4V6H4V4.5h4L9 3Zm-3 4.5h12l-.9 12.1A1.5 1.5 0 0 1 15.6 21H8.4a1.5 1.5 0 0 1-1.5-1.4L6 7.5Zm1.6 1.5.8 10.5h7.2l.8-10.5H7.6Zm2.2 1.5h1.4v7.5H9.8v-7.5Zm3 0h1.4v7.5h-1.4v-7.5Z',
  calendar:
    'M7 2h1.5v2h7V2H17v2h1.5A2.5 2.5 0 0 1 21 6.5v12a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-12A2.5 2.5 0 0 1 5.5 4H7V2Zm-1.5 3.5a1 1 0 0 0-1 1V9h15V6.5a1 1 0 0 0-1-1h-13Zm-1 5v8a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-8h-15ZM7 12.5h4V14H7v-1.5Zm0 3h7V17H7v-1.5Z',
  drag: 'M5 9h14v1.5H5V9Zm0 4.5h14V15H5v-1.5Z',
  warning: 'M12 2.5 23 21.5H1L12 2.5Zm-1 7v6h2v-6h-2Zm0 7.5v2h2v-2h-2Z',
  more: 'M12 4a1.6 1.6 0 1 1 0 3.2A1.6 1.6 0 0 1 12 4Zm0 6.4a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Zm0 6.4a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Z',
  copy: 'M8 3h11a2 2 0 0 1 2 2v11h-1.6V5a.4.4 0 0 0-.4-.4H8V3Zm-3 4h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm0 1.6a.4.4 0 0 0-.4.4v10c0 .22.18.4.4.4h10a.4.4 0 0 0 .4-.4V9a.4.4 0 0 0-.4-.4H5Z',
  edit: 'M15.6 3.6a2 2 0 0 1 2.8 0l2 2a2 2 0 0 1 0 2.8L9.2 19.6 3 21l1.4-6.2L15.6 3.6Zm1.7 1.1a.4.4 0 0 0-.6 0L14.9 6.5l2.6 2.6 1.8-1.8a.4.4 0 0 0 0-.6l-2-2Zm-.9 5.5-2.6-2.6-7.8 7.8-.8 3.4 3.4-.8 7.8-7.8Z',
  doc: 'M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm0 1.6a.4.4 0 0 0-.4.4v16c0 .22.18.4.4.4h12a.4.4 0 0 0 .4-.4V9h-5V3.6H6Zm8.6 1.1V7.4h2.7l-2.7-2.7ZM8 12h8v1.5H8V12Zm0 3.5h8V17H8v-1.5Z',
  grid: 'M4 4h7v7H4V4Zm1.6 1.6v3.8h3.8V5.6H5.6ZM13 4h7v7h-7V4Zm1.6 1.6v3.8h3.8V5.6h-3.8ZM4 13h7v7H4v-7Zm1.6 1.6v3.8h3.8v-3.8H5.6ZM13 13h7v7h-7v-7Zm1.6 1.6v3.8h3.8v-3.8h-3.8Z',
  list: 'M4 5h16v1.8H4V5Zm0 6.1h16v1.8H4v-1.8Zm0 6.1h16V19H4v-1.8Z',
} as const

export type DvIconName = keyof typeof paths

defineProps<{ name: DvIconName; size?: number }>()
</script>

<template>
  <svg :width="size ?? 18" :height="size ?? 18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="dv-icon">
    <path :d="paths[name]" fill-rule="evenodd" />
  </svg>
</template>

<style scoped>
.dv-icon {
  flex-shrink: 0;
  display: block;
}
</style>
