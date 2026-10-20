<script setup lang="ts">
import NavBar from './components/NavBar.vue'
</script>

<template>
  <NavBar />
  <!-- Keyed by the full address, so a page that only changes its params or query
       (e.g. new directive → ?edit=1042, or one task → another) is rebuilt with fresh data. -->
  <RouterView :key="$route.fullPath" />
</template>
