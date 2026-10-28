<script setup lang="ts">
// Body of the "דף סיכום" page, shared by the wizard's last step and the read-only detail page:
// baskets (expandable), "יתר המיוצבים", anchor dates and guidelines (same order as the first step).
import { onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import SummaryBasket from './SummaryBasket.vue'
import SummaryTargetRow from './SummaryTargetRow.vue'
import AnchorDatesEditor from './AnchorDatesEditor.vue'
import GuidelinesEditor from './GuidelinesEditor.vue'
import { findTarget, fmtRange, type Directive } from '@/data/directives'

const props = defineProps<{ d: Directive; editable?: boolean; canFix?: boolean }>()
// fix: go to the wizard step where a missing part is filled in (with the basket to focus).
const emit = defineEmits<{ editRest: []; fix: [stage: 'targets' | 'rest', basketId?: string] }>()

// Opening a basket (or a target) on its own closes the others, and a basket opens with its first
// target showing; closing one leaves the rest as they are. "פתיחת הכל" / "סגירת הכל" open or
// close every basket with all its targets (and separately, every "יתר המיוצבים" target).
const firstTarget = (id: string) => props.d.baskets.find((b) => b.id === id)?.targets[0]?.id
const openBaskets = ref<string[]>(props.d.baskets[0] ? [props.d.baskets[0].id] : [])
const openTargets = ref<string[]>(openBaskets.value.map(firstTarget).filter((x): x is string => !!x))
const openRests = ref<string[]>(props.d.rest[0] ? [props.d.rest[0].id] : [])

function toggleBasket(id: string) {
  if (openBaskets.value.includes(id)) {
    openBaskets.value = openBaskets.value.filter((x) => x !== id)
    return
  }
  openBaskets.value = [id]
  const first = firstTarget(id)
  openTargets.value = first ? [first] : []
}
function toggleTarget(id: string) {
  openTargets.value = openTargets.value.includes(id) ? openTargets.value.filter((x) => x !== id) : [id]
}
function toggleRest(id: string) {
  openRests.value = openRests.value.includes(id) ? openRests.value.filter((x) => x !== id) : [id]
}

// A slim line under the stepper (or the navbar on the detail page) that says where the reader is
// once a basket's header has scrolled out of view: "סל N · basket › open main target". Clicking it
// scrolls back to that basket's header. It replaces sticking the full headers, which took about a
// third of the screen.
const barTop = ref(56)
const crumb = ref<{ level: string; name: string; target?: string; el: HTMLElement } | null>(null)
let bandObserver: ResizeObserver | undefined
let frame = 0

const zoom = () => Number(getComputedStyle(document.documentElement).zoom) || 1
const targetName = (id: string | undefined) => {
  const t = [...props.d.baskets.flatMap((b) => b.targets), ...props.d.rest].find((x) => x.id === id)
  return t ? (findTarget(t.targetCode)?.name ?? t.targetCode) : undefined
}

function update() {
  frame = 0
  const z = zoom()
  const line = (barTop.value + 36) * z
  // The open main target the line is passing through, inside the given container.
  const openTargetIn = (root: Element) =>
    [...root.querySelectorAll<HTMLElement>('.tr.open')].find((tr) => {
      const r = tr.getBoundingClientRect()
      const row = tr.querySelector('.row')?.getBoundingClientRect()
      return !!row && row.bottom < line && r.bottom > line
    })?.dataset.target

  for (const sb of document.querySelectorAll<HTMLElement>('.summary .sb')) {
    const r = sb.getBoundingClientRect()
    const head = sb.querySelector('.head')?.getBoundingClientRect()
    if (head && head.bottom < line && r.bottom > line) {
      const i = props.d.baskets.findIndex((b) => b.id === sb.dataset.basket)
      crumb.value = { level: `סל ${i + 1}`, name: props.d.baskets[i]?.name ?? '', target: targetName(openTargetIn(sb)), el: sb }
      return
    }
  }
  const rest = document.querySelector<HTMLElement>('.summary .rest-list')
  const restTarget = rest && openTargetIn(rest)
  if (rest && restTarget) {
    crumb.value = { level: 'יתר המיוצבים', name: '', target: targetName(restTarget), el: rest }
    return
  }
  crumb.value = null
}
const onScroll = () => {
  if (!frame) frame = requestAnimationFrame(update)
}
function jump() {
  const el = crumb.value?.el
  if (!el) return
  // Land just below the stepper rather than under it.
  el.style.scrollMarginTop = `${barTop.value + 12}px`
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  // The page may not be attached to the document yet when this mounts, so look a tick later.
  setTimeout(() => {
    const band = document.querySelector<HTMLElement>('.stepper-band')
    if (!band) return
    const set = () => (barTop.value = 56 + band.offsetHeight)
    set()
    bandObserver = new ResizeObserver(set)
    bandObserver.observe(band)
  })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  bandObserver?.disconnect()
  if (frame) cancelAnimationFrame(frame)
})

function expandBaskets(open: boolean) {
  openBaskets.value = open ? props.d.baskets.map((b) => b.id) : []
  openTargets.value = open ? props.d.baskets.flatMap((b) => b.targets.map((t) => t.id)) : []
}
function expandRest(open: boolean) {
  openRests.value = open ? props.d.rest.map((t) => t.id) : []
}

</script>

<template>
  <div class="summary">
    <!-- Zero-height sticky anchor: the line floats from it without taking space in the page. -->
    <div class="crumb-anchor" :style="{ top: `${barTop}px` }">
      <Transition name="crumb">
        <button v-if="crumb" type="button" class="crumb" title="חזרה לראש הסל" @click="jump">
          <span class="crumb-level">{{ crumb.level }}</span>
          <b v-if="crumb.name">{{ crumb.name }}</b>
          <template v-if="crumb.target">
            <AppIcon v-if="crumb.name" name="chevron-left" :size="16" class="crumb-sep" />
            <span class="crumb-target">{{ crumb.target }}</span>
          </template>
          <AppIcon name="chevron-up" :size="16" class="crumb-up" />
        </button>
      </Transition>
    </div>
    <div v-if="d.baskets.length" class="bulk">
      <button type="button" class="dv-link bulk-btn" @click="expandBaskets(true)">
        <AppIcon name="unfold-more" :size="16" />
        פתיחת כל הסלים
      </button>
      <button type="button" class="dv-link bulk-btn" @click="expandBaskets(false)">
        <AppIcon name="unfold-less" :size="16" />
        סגירת כל הסלים
      </button>
    </div>
    <SummaryBasket
      v-for="(b, i) in d.baskets"
      :key="b.id"
      :basket="b"
      :index="i"
      :open="openBaskets.includes(b.id)"
      :open-targets="openTargets"
      :can-fix="canFix"
      @toggle="toggleBasket(b.id)"
      @toggle-target="toggleTarget"
      @fix="emit('fix', 'targets', b.id)"
    />
    <p v-if="!d.baskets.length" class="dv-card empty">לא הוגדרו סלים בדירקטיבה זו</p>

    <div class="dv-card extras">
      <!-- יתר המיוצבים -->
      <section>
        <div class="sec-head">
          <h3>יתר המיוצבים</h3>
          <span class="sec-acts">
            <template v-if="d.rest.length">
              <button type="button" class="dv-link bulk-btn" @click="expandRest(true)">
                <AppIcon name="unfold-more" :size="16" />
                פתיחת כל היעדים
              </button>
              <button type="button" class="dv-link bulk-btn" @click="expandRest(false)">
                <AppIcon name="unfold-less" :size="16" />
                סגירת כל היעדים
              </button>
            </template>
            <button v-if="editable" type="button" class="dv-link" @click="emit('editRest')">עריכה</button>
          </span>
        </div>
        <div v-if="d.rest.length" class="rest-list">
          <SummaryTargetRow
            v-for="t in d.rest"
            :key="t.id"
            :target="t"
            :open="openRests.includes(t.id)"
            :fix-label="canFix ? 'מעבר לשלב יתר מיוצבים' : undefined"
            @toggle="toggleRest(t.id)"
            @fix="emit('fix', 'rest')"
          />
        </div>
        <p v-else class="none">לא הוגדרו מיוצבים נוספים</p>
      </section>

      <!-- תאריכי עוגן -->
      <section>
        <div class="dv-section-head">
          <h3>תאריכי עוגן</h3>
          <small>טווחי תאריכים קבועים לפי יחידה</small>
        </div>
        <AnchorDatesEditor v-if="editable" :anchors="d.anchors" add-label="הוספת תאריכים" compact />
        <ul v-else-if="d.anchors.length" class="anchors">
          <li v-for="a in d.anchors" :key="a.id">
            <span class="dv-label">כותרת</span>
            <b>{{ a.title }}</b>
            <span class="dv-label">טווח תאריכים</span>
            <b>{{ fmtRange(a) }}</b>
          </li>
        </ul>
        <p v-else class="none">לא הוגדרו תאריכי עוגן</p>
      </section>

      <!-- הערות והנחיות (from the first step) -->
      <section>
        <div class="dv-section-head">
          <h3>הערות והנחיות</h3>
          <small>דגשים, הנחיות והערות כלליות לדירקטיבה</small>
        </div>
        <GuidelinesEditor :items="d.guidelines" :editable="editable" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.summary {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.empty {
  color: var(--c-muted);
}
.crumb-anchor {
  position: sticky;
  z-index: 14;
  height: 0;
  /* Cancels the list's gap, so the anchor adds no space. */
  margin-bottom: -20px;
}
/* Frosted like the stepper above it, with the basket's blue for its name. */
.crumb {
  position: absolute;
  inset-inline: 0;
  top: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 16px;
  border-radius: 0 0 10px 10px;
  background: rgba(226, 234, 253, 0.9);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  box-shadow: 0 6px 16px rgba(7, 25, 56, 0.08);
  font-size: 14px;
  color: var(--c-brand);
  text-align: start;
  white-space: nowrap;
}
.crumb-level {
  flex-shrink: 0;
  padding: 1px 8px;
  border-radius: 10px;
  background: #fff;
  font-size: 12px;
  font-weight: 700;
  color: var(--c-primary);
}
.crumb b {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.crumb-sep {
  flex-shrink: 0;
  opacity: 0.6;
}
.crumb-target {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--c-text);
}
.crumb-up {
  flex-shrink: 0;
  margin-inline-start: auto;
  opacity: 0.7;
}
.crumb:hover .crumb-up {
  opacity: 1;
}
.crumb-enter-active,
.crumb-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.crumb-enter-from,
.crumb-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
/* Open / close every basket at once, at the far (left) end above the list. */
.bulk {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-bottom: -8px;
}
.sec-acts {
  display: flex;
  align-items: center;
  gap: 16px;
}
.bulk-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}
.bulk-btn:hover {
  text-decoration: underline;
}
.extras {
  display: flex;
  flex-direction: column;
}
.extras > section {
  padding: 10px 0 40px;
}
.extras > section + section {
  border-top: 1px solid #e2e8f8;
  padding-top: 40px;
}
.sec-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.sec-head h3 {
  font-size: 16px;
  font-weight: 700;
}
/* Same list as the targets inside a basket. */
.rest-list {
  border: 1px solid var(--c-border-2);
  border-radius: 10px;
  overflow: hidden;
}
.none {
  font-size: 14px;
  color: var(--c-muted);
}
.anchors {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.anchors li {
  display: grid;
  grid-template-columns: auto 160px auto 1fr;
  align-items: center;
  gap: 10px;
  font-size: 16px;
}
</style>
