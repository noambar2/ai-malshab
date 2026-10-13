<script setup lang="ts">
import { computed } from 'vue'
import { malshab } from '@/data/mock'
import { isFavorite, toggleFavorite } from '@/stores/people'

const fav = computed(() => isFavorite(malshab.idNumber))

const s = malshab.summary
</script>

<template>
  <section class="header">
    <div class="identity">
      <div class="name-row">
        <h1>{{ malshab.fullName }}</h1>
        <button
          class="fav"
          :class="{ on: fav }"
          :aria-pressed="fav"
          @click="toggleFavorite(malshab.idNumber)"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />
          </svg>
          {{ fav ? 'במועדפים' : 'הוספה למועדפים' }}
        </button>
      </div>
      <div class="ids">
        <span><span class="k">מ.א</span> {{ malshab.personalNumber }}</span>
        <span class="sep" />
        <span><span class="k">ת.ז</span> {{ malshab.idNumber }}</span>
      </div>
    </div>
    <dl class="stats">
      <div>
        <dt>פרופיל</dt>
        <dd>{{ s.profile }}</dd>
      </div>
      <div>
        <dt>דפ״ר</dt>
        <dd>{{ s.dapar }}</dd>
      </div>
      <div>
        <dt>סטטוס</dt>
        <dd>{{ s.status }}</dd>
      </div>
      <div>
        <dt>סיבת הסטטוס</dt>
        <dd>{{ s.statusReason }} <small>{{ s.statusReasonCode }}</small></dd>
      </div>
      <div>
        <dt>טווח מועמד</dt>
        <dd>{{ s.track }}</dd>
      </div>
      <div>
        <dt>תאריך גיוס</dt>
        <dd>{{ s.draftDate }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.header {
  position: sticky;
  top: 56px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 86px;
  padding: 0 30px;
  background: var(--c-header-bg);
  color: var(--c-brand);
}
h1 {
  font-size: 24px;
  font-weight: 700;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.fav {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid #c9d6ff;
  font-size: 12px;
  font-weight: 600;
  color: var(--c-brand);
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linejoin: round;
  transition: background 0.15s, border-color 0.15s;
}
.fav:hover {
  background: #fff;
}
.fav.on {
  background: #fff8e1;
  border-color: #ffd66b;
  color: #9a6b00;
}
.fav.on svg {
  fill: #ffc21a;
  stroke: #ffc21a;
}
.ids {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 4px;
  font-size: 16px;
}
.k {
  margin-inline-end: 6px;
}
.sep {
  width: 1px;
  height: 22px;
  background: #b9c6ea;
}
.stats {
  display: flex;
}
.stats > div {
  padding: 0 20px;
  text-align: end;
}
.stats > div + div {
  border-inline-start: 1px solid #b9c6ea;
}
dt {
  font-size: 14px;
  margin-bottom: 4px;
}
dd {
  font-size: 18px;
  font-weight: 700;
}
dd small {
  font-size: 12px;
  font-weight: 400;
  margin-inline-start: 6px;
}
</style>
