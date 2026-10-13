<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import AppIcon from './AppIcon.vue'

const route = useRoute()
const router = useRouter()

const links = [
  { to: '/home', label: 'דף הבית' },
  { to: '/malshab', label: 'פרטי מלש״ב' },
  { to: '/dialer', label: 'משתמטים' },
  { to: '/directives', label: 'דירקטיבות' },
]

function onSearch() {
  router.push('/malshab')
}

function print() {
  window.print()
}
</script>

<template>
  <header class="navbar">
    <RouterLink to="/dialer" class="logo">מלש״ביה</RouterLink>
    <nav class="links">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="link"
        :class="{ active: route.path === link.to }"
      >
        {{ link.label }}
      </RouterLink>
    </nav>
    <div class="actions">
      <form class="search nav-search" @submit.prevent="onSearch">
        <AppIcon name="search" :size="18" />
        <input type="text" placeholder="חיפוש מלש״ב" />
      </form>
      <button v-if="route.path === '/malshab'" class="btn btn-soft print" @click="print">
        <AppIcon name="print" :size="16" />
        הדפסה
      </button>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 48px;
  height: 56px;
  padding: 0 20px;
  background: var(--c-surface);
}
.logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--c-brand);
  text-decoration: none;
}
.links {
  display: flex;
  gap: 8px;
}
.link {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: var(--c-primary-dark);
  text-decoration: none;
  transition: background 0.15s;
}
.link:hover {
  background: #f5f8fb;
}
.link.active {
  background: var(--c-primary-soft);
  color: var(--c-primary);
}
.actions {
  margin-inline-start: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}
.nav-search {
  width: 240px;
}
.print {
  height: 32px;
}
</style>
