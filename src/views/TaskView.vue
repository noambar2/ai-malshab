<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import TaskHeader from '@/components/task/TaskHeader.vue'
import TaskDetails from '@/components/task/TaskDetails.vue'
import BigSection from '@/components/task/BigSection.vue'
import PrintoutTable from '@/components/task/PrintoutTable.vue'
import ProcessHistory from '@/components/task/ProcessHistory.vue'
import TaskActions, { type TaskAction } from '@/components/task/TaskActions.vue'
import ProcessFooter from '@/components/task/ProcessFooter.vue'
import { findTask, isMyTask, pullTask } from '@/data/dodgers'
import { currentUser, getProcess, nextStage, nowStamp, printoutTables, type Tone } from '@/data/tasks'
import { role } from '@/stores/role'
import { suggestComment } from '@/assistant/taskSuggest'

const route = useRoute()
const router = useRouter()

const id = computed(() => String(route.params.id ?? ''))
const task = computed(() => findTask(id.value))
const mine = computed(() => isMyTask(id.value))
const process = computed(() => getProcess(id.value))

function suggest(dodgeType?: string) {
  if (!task.value) return ''
  return suggestComment({ task: task.value, role: role.value, history: process.value.history, dodgeType })
}
const me = computed(() => currentUser[role.value])

// A השתמטות file adds the dodging-declaration process on top of the צו 12 one.
const isDodging = computed(() => task.value?.declarationType === 'השתמטות')
const title = computed(() => (isDodging.value ? 'סיכום תיק השתמטות' : 'סיכום תיק צו 12'))
const timelineStep = computed(() => (isDodging.value ? 6 : 2))

// Header "גורם מטפל": me when the task is mine, else whoever holds it (always a מש״ק in the mock queues).
const handler = computed(() =>
  mine.value
    ? { name: me.value.name, title: me.value.title }
    : { name: task.value?.handler ?? '', title: 'מש״ק תו״ם' },
)

const open = reactive({ printout: true, tzav: true, dodging: true })
watch(
  isDodging,
  (d) => {
    // The dodging file focuses on its own process; the earlier stages start collapsed.
    open.printout = !d
    open.tzav = !d
    open.dodging = true
  },
  { immediate: true },
)

// Toast
const toast = ref<{ text: string; tone: Tone } | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | undefined
function showToast(text: string, tone: Tone = 'green') {
  toast.value = { text, tone }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = null), 3500)
}
onBeforeUnmount(() => clearTimeout(toastTimer))

function pull() {
  pullTask(id.value)
  // pullTask keeps the id; replace so the page re-reads the task from my queue.
  router.replace({ name: 'task', params: { id: id.value } })
  showToast('המשימה נמשכה לטיפולך')
}

function onSubmit(action: TaskAction, comment: string, dodgeType?: string) {
  const r = role.value
  let badge: { label: string; tone: Tone }
  let msg: string
  if (action === 'return') {
    badge = { label: 'הוחזר לתיקון', tone: 'red' }
    msg = 'המשימה הוחזרה לתיקון'
  } else if (action === 'forward') {
    badge = { label: `הועבר לטיפול ${nextStage[r]}`, tone: 'green' }
    msg = `המשימה הועברה לטיפול ${nextStage[r]}`
  } else {
    const what = isDodging.value ? `השתמטות${dodgeType ? ` - ${dodgeType}` : ''}` : 'צו 12'
    badge = { label: 'הוכרז', tone: 'green' }
    msg = `בוצעה הכרזה סופית: ${what}`
    if (!comment) comment = `הכרזה סופית על ${what}`
    else comment = `${comment}\nסוג הכרזה: ${what}`
  }
  process.value.history.push({ name: me.value.name, title: me.value.title, date: nowStamp(), badge, text: comment })
  process.value.outcome = badge
  showToast(msg, badge.tone)
}

function back() {
  if (window.history.state?.back) router.back()
  else router.push('/dodgers')
}

// The action panel sits in the last process section (השתמטות for dodging files, else צו 12).
const canAct = computed(() => mine.value && !process.value.outcome)
const footerProps = computed(() => ({
  outcome: process.value.outcome,
  handlerTitle: handler.value.title,
  // Only the מש״ק design offers pulling from the footer; everyone can pull from the header.
  canPull: !mine.value && role.value === 'mashak',
}))
</script>

<template>
  <main v-if="!task" class="missing">
    <p>המשימה לא נמצאה</p>
    <RouterLink to="/dodgers" class="btn btn-soft">חזרה לרשימת המשימות</RouterLink>
  </main>

  <template v-else>
    <TaskHeader
      :task="task"
      :title="title"
      :handler-name="handler.name"
      :handler-title="handler.title"
      :can-pull="!mine"
      @back="back"
      @pull="pull"
    />
    <TaskDetails :task="task" :current="timelineStep" />

    <main class="sections">
      <BigSection v-model:open="open.printout" title="פרטי תדפיס">
        <PrintoutTable v-for="t in printoutTables" :key="t.key" :table="t" />
      </BigSection>

      <BigSection v-model:open="open.tzav" title="תהליך הכרזה צו 12">
        <ProcessHistory :entries="isDodging ? process.history.slice(0, 2) : process.history" />
        <template v-if="!isDodging">
          <TaskActions
            v-if="canAct"
            :mode="role === 'pakad' ? 'declare' : 'review'"
            :suggest="suggest"
            @submit="onSubmit"
          />
          <ProcessFooter v-else v-bind="footerProps" @pull="pull" />
        </template>
      </BigSection>

      <BigSection v-if="isDodging" v-model:open="open.dodging" title="תהליך הכרזה השתמטות">
        <ProcessHistory :entries="process.history" />
        <TaskActions
          v-if="canAct"
          :mode="role === 'pakad' ? 'declare' : 'review'"
          :needs-dodge-type="role === 'pakad'"
          :suggest="suggest"
          @submit="onSubmit"
        />
        <ProcessFooter v-else v-bind="footerProps" @pull="pull" />
      </BigSection>
    </main>
  </template>

  <Transition name="toast">
    <div v-if="toast" class="toast" :class="toast.tone" role="status">
      <AppIcon :name="toast.tone === 'red' ? 'info' : 'check'" :size="18" />
      {{ toast.text }}
    </div>
  </Transition>
</template>

<style scoped>
.missing {
  padding: 60px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  font-size: 18px;
  color: var(--c-muted-2);
}
.sections {
  padding: 0 0 60px;
}
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  background: var(--c-primary-dark);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 6px 20px rgba(7, 25, 56, 0.25);
}
.toast.green :deep(svg) {
  color: #4fd89b;
}
.toast.red :deep(svg) {
  color: #ff6b7d;
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}
</style>
