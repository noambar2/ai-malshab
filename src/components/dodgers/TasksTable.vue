<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import { taskStatusLabel, type DodgerTask } from '@/data/dodgers'

const props = defineProps<{
  title: string
  tasks: DodgerTask[]
  // When set, the last columns show who handles the task and a pull button instead of the status.
  handlerLabel?: string
}>()
const emit = defineEmits<{ pull: [id: string] }>()

const router = useRouter()
const open = ref(true)
const query = ref('')
const spinning = ref(false)

const rows = computed(() => {
  const q = query.value.trim()
  if (!q) return props.tasks
  return props.tasks.filter((t) =>
    [t.fullName, t.candidateId, t.idNumber, t.statusReason, t.handler ?? ''].some((v) => v.includes(q)),
  )
})

function refresh() {
  spinning.value = true
  setTimeout(() => (spinning.value = false), 600)
}
</script>

<template>
  <div class="tasks">
    <div class="head">
      <button class="title" @click="open = !open">
        {{ title }} ({{ tasks.length }})
        <AppIcon :name="open ? 'chevron-up' : 'chevron-down'" :size="18" />
      </button>
      <div class="tools">
        <button class="icon-btn" :class="{ spin: spinning }" title="רענון" @click="refresh">
          <AppIcon name="refresh" :size="18" />
        </button>
        <button class="icon-btn" title="עמודות"><AppIcon name="columns" :size="18" /></button>
        <button class="icon-btn" title="סינון"><AppIcon name="filter" :size="18" /></button>
        <label class="search">
          <AppIcon name="search" :size="18" />
          <input v-model="query" placeholder="חיפוש כללי" />
        </label>
      </div>
    </div>

    <div v-if="open" class="table-wrap">
      <table class="table clickable">
        <thead>
          <tr>
            <th>מזהה מועמד</th>
            <th>שם מלא</th>
            <th>תעודת זהות</th>
            <th>מגדר</th>
            <th>תת סוג</th>
            <th>סיבת סטטוס</th>
            <th>סוג הכרזה</th>
            <th v-if="handlerLabel">{{ handlerLabel }}</th>
            <th>{{ handlerLabel ? '' : 'סטטוס משימה' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in rows" :key="t.id" @click="router.push(`/dodgers/task/${t.id}`)">
            <td>{{ t.candidateId }}</td>
            <td>{{ t.fullName }}</td>
            <td>{{ t.idNumber }}</td>
            <td>{{ t.gender }}</td>
            <td><span class="code">{{ t.subTypeCode }}</span> {{ t.subType }}</td>
            <td><span class="code">{{ t.statusReasonCode }}</span> {{ t.statusReason }}</td>
            <td>{{ t.declarationType }}</td>
            <td v-if="handlerLabel">{{ t.handler }}</td>
            <td>
              <button v-if="handlerLabel" class="btn btn-soft pull" @click.stop="emit('pull', t.id)">
                משיכה אליי
              </button>
              <span v-else class="status" :class="t.status">{{ taskStatusLabel[t.status] }}</span>
            </td>
          </tr>
          <tr v-if="!rows.length" class="empty">
            <td :colspan="handlerLabel ? 9 : 8">לא נמצאו משימות</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  color: var(--c-muted);
}
.tools {
  display: flex;
  align-items: center;
  gap: 10px;
}
.tools .search {
  width: 240px;
}
.spin :deep(svg) {
  animation: spin 0.6s linear;
}
@keyframes spin {
  to {
    transform: rotate(-360deg);
  }
}
.table td {
  white-space: nowrap;
}
.code {
  color: var(--c-muted);
  font-weight: 400;
}
.status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 110px;
  height: 30px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
}
.status.new {
  background: #e6e8f0;
  color: var(--c-muted-2);
}
.status.returned {
  background: #ffe0e4;
  color: var(--c-danger);
}
.status.overdue {
  background: #fff3c7;
  color: #c48a00;
}
.pull {
  height: 30px;
  min-width: 100px;
}
.empty td {
  height: 70px;
  color: var(--c-muted);
}
</style>
