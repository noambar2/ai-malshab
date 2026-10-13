<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import TasksTable from '@/components/dodgers/TasksTable.vue'
import { dodgersKpis as k, dodgersState, pullTask } from '@/data/dodgers'
import { role } from '@/stores/role'

const router = useRouter()
const sectionOpen = ref(true)
const toast = ref('')

const kpis = computed(() => {
  if (role.value === 'pakad') {
    return [
      { label: 'משימות בטיפולי', value: k.mine },
      { label: 'בטיפול מש״ק', value: k.withMashak },
      { label: 'בטיפול רמ״ד', value: k.withRamad },
      { label: 'הוכרזו השתמטות', value: k.declaredDodgers },
      { label: 'הוכרזו צו 12', value: k.declaredTzav12 },
    ]
  }
  return [
    { label: 'משימות בטיפולי', value: k.mine },
    { label: 'משימות חדשות', value: k.newTasks },
    { label: 'הוחזרו לתיקון', value: k.returned },
    { label: role.value === 'ramad' ? 'בטיפול מש״ק' : 'בטיפול רמ״ד', value: k.withRamad },
  ]
})

// Second table: the רמ״ד sees the מש״ק queue, the פוקד sees the רמ״ד queue.
const othersLabel = computed(() =>
  role.value === 'ramad' ? 'מש״ק' : role.value === 'pakad' ? 'רמ״ד' : null,
)

// Semicircle gauge: arc length is π·r.
const R = 52
const arc = Math.PI * R
const filled = computed(() => (k.completed / k.completedOf) * arc)

function onPull(id: string) {
  pullTask(id)
  toast.value = 'המשימה הועברה לטיפולך'
  setTimeout(() => (toast.value = ''), 2500)
}
</script>

<template>
  <main class="page">
    <h1>משתמטים וצו 12</h1>

    <div class="kpis" :class="role">
      <div v-if="role !== 'pakad'" class="card kpi dialer">
        <div class="dialer-head">
          <span class="label">פוטנציאל לחייגן</span>
          <button class="icon-btn" title="למסך פוטנציאל לחייגן" @click="router.push('/dialer')">
            <AppIcon name="arrow-left" :size="18" />
          </button>
        </div>
        <strong class="pct">
          {{ k.dialerApprovedPct }}%<template v-if="role === 'ramad'"> שיחות שאושרו</template>
        </strong>
        <div class="bar"><span :style="{ width: k.dialerApprovedPct + '%' }" /></div>
      </div>

      <div v-for="item in kpis" :key="item.label" class="card kpi">
        <span class="label">{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </div>

      <div class="card kpi gauge-card">
        <div>
          <span class="label">משימות שהושלמו</span>
          <span v-if="role !== 'pakad'" class="delta">
            <b>↑{{ k.completedSinceYesterday }}</b> מאתמול
          </span>
        </div>
        <div class="gauge">
          <svg viewBox="0 0 124 68" width="124" height="68">
            <path :d="`M10 62 A${R} ${R} 0 0 1 114 62`" class="track" />
            <path
              :d="`M10 62 A${R} ${R} 0 0 1 114 62`"
              class="fill"
              :stroke-dasharray="`${filled} ${arc}`"
            />
          </svg>
          <span class="gauge-value"><b>{{ k.completed }}</b> / {{ k.completedOf }}</span>
        </div>
      </div>
    </div>

    <button class="section-title" @click="sectionOpen = !sectionOpen">
      {{ role === 'mashak' ? 'הכרזת מעמד' : 'משימות הכרזת מעמד' }}
      <AppIcon :name="sectionOpen ? 'chevron-up' : 'chevron-down'" :size="22" />
    </button>

    <section v-if="sectionOpen" class="card panel">
      <TasksTable title="משימות לטיפולי" :tasks="dodgersState.mine" />
      <TasksTable
        v-if="othersLabel"
        class="others"
        :title="`משימות ${othersLabel}`"
        :handler-label="`${othersLabel} מטפל`"
        :tasks="dodgersState.others"
        @pull="onPull"
      />
    </section>

    <Transition name="toast">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </Transition>
  </main>
</template>

<style scoped>
.page {
  padding: 30px;
  max-width: 1280px;
  margin: 0 auto;
}
h1 {
  font-size: 24px;
  font-weight: 500;
  color: var(--c-primary-dark);
  margin-bottom: 20px;
}
.kpis {
  display: grid;
  grid-template-columns: 280px repeat(4, 1fr) 280px;
  gap: 20px;
  margin-bottom: 30px;
}
.kpis.pakad {
  grid-template-columns: repeat(5, 1fr) 280px;
}
.kpi {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  height: 116px;
  padding: 20px;
}
.kpis.pakad .kpi {
  height: 104px;
}
.kpi .label {
  white-space: nowrap;
  font-size: 14px;
  color: var(--c-text);
}
.kpi strong {
  font-size: 22px;
  font-weight: 700;
}
.dialer {
  align-items: stretch;
  gap: 8px;
}
.dialer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pct {
  font-size: 18px !important;
}
.bar {
  height: 8px;
  border-radius: 4px;
  background: #f0f2f7;
  overflow: hidden;
}
.bar span {
  display: block;
  height: 100%;
  border-radius: 4px;
  background: #10b795;
}
.gauge-card {
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
}
.gauge-card > div:first-child {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 0;
}
.delta {
  font-size: 12px;
  color: var(--c-text);
}
.delta b {
  color: #10b795;
  margin-inline-end: 4px;
}
.gauge {
  position: relative;
  align-self: center;
}
.track,
.fill {
  fill: none;
  stroke-width: 14;
  stroke-linecap: round;
}
.track {
  stroke: #f0f2f7;
}
.fill {
  stroke: #10b795;
  transition: stroke-dasharray 0.6s;
}
.gauge-value {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 14px;
  direction: ltr;
}
.gauge-value b {
  font-size: 22px;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 500;
  color: var(--c-primary-dark);
  margin-bottom: 20px;
}
.panel {
  padding: 30px;
}
.others {
  margin-top: 36px;
}
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--c-text);
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
</style>
