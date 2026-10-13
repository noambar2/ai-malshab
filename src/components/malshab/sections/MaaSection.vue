<script setup lang="ts">
import { maaComputerScores, maaGeneral, maaNotes, maaZoomScores } from '@/data/sectionsB'

defineOptions({ inheritAttrs: false })

const groups = [
  { title: 'כללי', fields: maaGeneral },
  { title: 'ציוני זום', fields: maaZoomScores },
  { title: 'ציוני מבחני מחשב', fields: maaComputerScores },
]
</script>

<template>
  <div class="maa">
    <section v-for="g in groups" :key="g.title" class="group">
      <h3 class="group-title">{{ g.title }}</h3>
      <div class="row">
        <div v-for="f in g.fields" :key="f.label" class="field">
          <span class="label">{{ f.label }}</span>
          <span v-if="f.pill" class="pill">{{ f.pill }}</span>
          <span v-else class="value-line">
            <svg v-if="f.icon === 'error'" class="ic" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="7" fill="var(--c-danger)" />
              <rect x="7.2" y="3.8" width="1.6" height="5.4" rx="0.8" fill="#fff" />
              <circle cx="8" cy="11.4" r="0.95" fill="#fff" />
            </svg>
            <svg v-else-if="f.icon === 'warning'" class="ic" width="18" height="15" viewBox="0 0 18 15" aria-hidden="true">
              <path d="M9 1.5 16.8 14H1.2L9 1.5Z" fill="#f5a623" stroke="#f5a623" stroke-width="2" stroke-linejoin="round" />
              <rect x="8.2" y="4.2" width="1.6" height="5" rx="0.8" fill="#fff" />
              <circle cx="9" cy="11.5" r="0.95" fill="#fff" />
            </svg>
            <span v-if="f.value" class="value">{{ f.value }}</span>
            <span v-if="f.note" class="note">{{ f.note }}</span>
          </span>
        </div>
      </div>
    </section>

    <div class="opinions">
      <div v-for="o in maaNotes" :key="o.title" class="opinion">
        <h4>{{ o.title }}</h4>
        <p>{{ o.text }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.maa {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-top: 10px;
}
.group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.group-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--c-text);
  opacity: 0.5;
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px 40px;
}
.field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  width: 130px;
}
.label {
  font-size: 14px;
  color: var(--c-primary-dark);
  white-space: nowrap;
}
.value-line {
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}
.value {
  font-size: 16px;
  font-weight: 700;
  color: var(--c-text);
}
.note {
  font-size: 14px;
  color: var(--c-primary-dark);
  opacity: 0.5;
}
.ic {
  flex-shrink: 0;
}
.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 85px;
  margin-top: -4px;
  padding: 7px 20px;
  border-radius: var(--radius-pill);
  background: #fde7ea;
  color: #f0142f;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
.opinions {
  display: grid;
  grid-template-columns: repeat(2, minmax(110px, 500px));
  gap: 40px;
}
.opinion h4 {
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: 700;
  color: var(--c-text);
}
.opinion p {
  font-size: 14px;
  color: var(--c-text-2);
}
</style>
