<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <main class="placeholder">
    <h1>{{ route.meta.title }}</h1>
    <p>המסך הזה עדיין לא עוצב במוקאפ.</p>
    <RouterLink to="/dialer" class="btn btn-soft">למסך פוטנציאל לחייגן</RouterLink>
  </main>
</template>

<style scoped>
.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 120px 20px;
  color: var(--c-muted);
  text-decoration: none;
}
h1 {
  color: var(--c-text);
  font-size: 26px;
  font-weight: 600;
}
a {
  text-decoration: none;
  margin-top: 8px;
}
</style>
