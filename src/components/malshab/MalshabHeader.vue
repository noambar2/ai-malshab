<script setup lang="ts">
import { malshab } from '@/data/mock'

const s = malshab.summary
</script>

<template>
  <section class="header">
    <div class="identity">
      <h1>{{ malshab.fullName }}</h1>
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
