<script setup lang="ts">
// Create / edit / duplicate a directive. Steps follow the Figma flow:
// הגדרות כלליות → סלים (define baskets, then "יעדים לשיבוץ" per main target) → יתר מיוצבים → סיכום.
// ?edit=<id> edits an existing directive, ?from=<id> starts a copy of one.
import '@/components/directives/directives.css'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WizardStepper from '@/components/directives/WizardStepper.vue'
import StepGeneral from '@/components/directives/StepGeneral.vue'
import StepBaskets from '@/components/directives/StepBaskets.vue'
import StepTargets from '@/components/directives/StepTargets.vue'
import StepRest from '@/components/directives/StepRest.vue'
import DirectiveSummary from '@/components/directives/DirectiveSummary.vue'
import MetaLine from '@/components/directives/MetaLine.vue'
import {
  cloneDirective,
  emptyDirective,
  getDirective,
  hasNum,
  newBasket,
  restTargetValid,
  saveDirective,
  type Directive,
} from '@/data/directives'

const route = useRoute()
const router = useRouter()

type Stage = 'general' | 'baskets' | 'targets' | 'rest' | 'summary'
const STEPS = ['הגדרות כלליות', 'סלים', 'יתר מיוצבים', 'סיכום']
const stageOfStep: Stage[] = ['general', 'baskets', 'rest', 'summary']
const order: Stage[] = ['general', 'baskets', 'targets', 'rest', 'summary']
const stepOf = (s: Stage) => (s === 'general' ? 0 : s === 'baskets' || s === 'targets' ? 1 : s === 'rest' ? 2 : 3)

const editId = typeof route.query.edit === 'string' ? route.query.edit : ''
const fromId = typeof route.query.from === 'string' ? route.query.from : ''

function initial(): Directive {
  const src = getDirective(editId || fromId)
  if (!src) return emptyDirective()
  const copy = cloneDirective(src)
  if (!editId) {
    // Duplicate: same structure, new directive.
    copy.id = ''
    copy.draft = true
    copy.date = ''
  }
  return copy
}

const d = reactive<Directive>(initial())
const isEdit = !!editId && !!getDirective(editId)

const stage = ref<Stage>('general')
const reachedIdx = ref(isEdit || fromId ? 3 : 0)
const step = computed(() => stepOf(stage.value))
const showErrors = ref(false)
const editingBaskets = ref<string[]>([])
const basketsError = ref('')
const stageKey = ref(0) // remounts the step so local UI state resets on navigation

watch(stage, (s) => {
  reachedIdx.value = Math.max(reachedIdx.value, stepOf(s))
  showErrors.value = false
  basketsError.value = ''
  stageKey.value++
  window.scrollTo({ top: 0 })
  if (s === 'baskets' && !d.baskets.length) {
    const b = newBasket()
    d.baskets.push(b)
    editingBaskets.value = [b.id]
  }
})

// --- validation per stage ---
function validGeneral() {
  return (
    !!d.district &&
    !!d.station &&
    !!d.owner &&
    !!d.date &&
    d.reasons.length > 0 &&
    d.forecasts.length > 0 &&
    d.cohorts.length > 0 &&
    d.anchors.every((a) => a.title && a.from && a.to)
  )
}
function validBaskets() {
  if (!d.baskets.length) {
    basketsError.value = 'יש להגדיר לפחות סל אחד'
    return false
  }
  if (editingBaskets.value.length) {
    basketsError.value = 'יש לשמור ולסגור את כל הסלים הפתוחים לפני המעבר לשלב הבא'
    return false
  }
  return true
}
const validTargets = () =>
  d.baskets.every((b) => b.targets.every((t) => t.subTargets.every((s) => s.targetCode && hasNum(s.quantity))))
const validRest = () => d.rest.every(restTargetValid)

function validate(s: Stage) {
  showErrors.value = true
  if (s === 'general') return validGeneral()
  if (s === 'baskets') return validBaskets()
  if (s === 'targets') return validTargets()
  if (s === 'rest') return validRest()
  return true
}

const errorText = computed(() => {
  if (!showErrors.value) return ''
  if (stage.value === 'general' && !validGeneral()) return 'יש למלא את כל שדות החובה המסומנים'
  if (stage.value === 'targets' && !validTargets()) return 'יש לבחור יעד ולמלא "כמה ניתן לשבץ" בכל יעד לשיבוץ'
  if (stage.value === 'rest' && !validRest()) return 'יש להשלים את שדות החובה בכל היעדים לפני המעבר לשלב הבא'
  return ''
})

function next() {
  if (!validate(stage.value)) return
  if (stage.value === 'summary') return finish()
  const i = order.indexOf(stage.value)
  stage.value = order[i + 1] ?? 'summary'
}
function back() {
  const i = order.indexOf(stage.value)
  if (i <= 0) router.push(isEdit ? `/directives/${editId}` : '/directives')
  else stage.value = order[i - 1] ?? 'general'
}
function goStep(i: number) {
  const target = stageOfStep[i]
  if (!target || i > reachedIdx.value) return
  if (i > step.value && !validate(stage.value)) return
  stage.value = target
}

function finish() {
  d.draft = false
  const id = saveDirective(d)
  router.push(`/directives/${id}`)
}
function saveDraft() {
  d.draft = true
  const id = saveDirective(d)
  router.push(`/directives/${id}`)
}
</script>

<template>
  <div class="wizard">
    <WizardStepper :steps="STEPS" :current="step" :reached="reachedIdx" @go="goStep" />

    <main class="dv-page">
      <p v-if="isEdit || fromId" class="mode">
        {{ isEdit ? `עריכת דירקטיבה #${editId}` : `דירקטיבה חדשה - שכפול של דירקטיבה #${fromId}` }}
      </p>

      <StepGeneral v-if="stage === 'general'" :key="stageKey" :d="d" :show-errors="showErrors" />
      <StepBaskets
        v-else-if="stage === 'baskets'"
        :key="stageKey"
        v-model:editing="editingBaskets"
        :d="d"
        :error="basketsError"
      />
      <StepTargets
        v-else-if="stage === 'targets'"
        :key="stageKey"
        :d="d"
        :show-errors="showErrors"
        @edit-baskets="stage = 'baskets'"
      />
      <StepRest v-else-if="stage === 'rest'" :key="stageKey" :d="d" />
      <template v-else>
        <div class="dv-title-row">
          <h1 class="dv-title">סיכום</h1>
          <MetaLine :d="d" />
        </div>
        <DirectiveSummary :key="stageKey" :d="d" editable @edit-rest="stage = 'rest'" />
      </template>
    </main>

    <footer class="bar">
      <button type="button" class="draft" @click="saveDraft">שמירה כטיוטה</button>
      <p v-if="errorText" class="err">{{ errorText }}</p>
      <div class="nav">
        <button type="button" class="btn btn-soft" @click="back">חזרה אחורה</button>
        <button type="button" class="btn btn-primary" @click="next">
          {{ stage === 'summary' ? (isEdit ? 'שמירת שינויים' : 'סיום ויצירת דירקטיבה') : 'לשלב הבא' }}
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.wizard {
  min-height: calc(100vh - 56px);
  background: #f9f9fe;
  padding-bottom: 72px;
}
.mode {
  margin: -10px 0 16px;
  font-size: 13px;
  color: var(--c-primary);
}
.bar {
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 15;
  display: flex;
  align-items: center;
  gap: 20px;
  height: 72px;
  padding: 0 60px;
  background: #f9f9fe;
  box-shadow: 0 -1px 0 #eceef5, 0 -6px 16px rgba(7, 25, 56, 0.04);
}
.draft {
  font-size: 13px;
  color: var(--c-primary);
  text-decoration: underline;
}
.err {
  font-size: 13px;
  color: var(--c-danger);
}
.nav {
  display: flex;
  gap: 10px;
  margin-inline-start: auto;
}
.nav .btn {
  min-width: 113px;
}
</style>
