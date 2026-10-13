<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import { findPerson, searchPeople, type Person } from '@/data/people'
import { dodgersKpis, dodgersState, taskStatusLabel } from '@/data/dodgers'
import { TODAY, directiveStatus, directiveTotals, directivesState, fmtDate, isPast } from '@/data/directives'
import { currentUser } from '@/data/tasks'
import { role, roleLabels } from '@/stores/role'
import { isFavorite, peopleState, timeAgo, toggleFavorite } from '@/stores/people'

const router = useRouter()
const query = ref('')
const active = ref(0)
const focused = ref(false)
const notFound = ref(false)
const searchInput = ref<HTMLInputElement>()

const results = computed(() => searchPeople(query.value))
const user = computed(() => currentUser[role.value])

const greeting = (() => {
  const h = new Date().getHours()
  return h < 12 ? 'בוקר טוב' : h < 17 ? 'צהריים טובים' : h < 21 ? 'ערב טוב' : 'לילה טוב'
})()

function open(p?: Person) {
  if (!p) return
  router.push('/malshab')
}

function submit() {
  const q = query.value.trim()
  if (!q) return
  const hit = results.value[active.value] ?? results.value[0]
  if (hit) return open(hit)
  notFound.value = true
}

function move(delta: number) {
  if (!results.value.length) return
  active.value = (active.value + delta + results.value.length) % results.value.length
}

function onInput() {
  active.value = 0
  notFound.value = false
}

const recent = computed(() =>
  peopleState.recent
    .map((r) => ({ person: findPerson(r.idNumber), at: r.at }))
    .filter((r): r is { person: Person; at: number } => !!r.person)
    .slice(0, 4),
)
const favorites = computed(() =>
  peopleState.favorites
    .map(findPerson)
    .filter((p): p is Person => !!p)
    .slice(0, 4),
)

// Draft-dodgers widget: what needs my attention first.
const urgent = computed(() =>
  [...dodgersState.mine]
    .filter((t) => t.status !== 'new')
    .sort((a) => (a.status === 'returned' ? -1 : 1))
    .slice(0, 3),
)
const newCount = computed(() => dodgersState.mine.filter((t) => t.status === 'new').length)

// Directives widget: the next ones coming up.
const upcoming = computed(() =>
  directivesState.list
    .filter((d) => !isPast(d) && !d.draft && d.date)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3),
)
const drafts = computed(() => directivesState.list.filter((d) => d.draft).length)

function daysUntil(date: string) {
  const days = Math.round((new Date(date).getTime() - new Date(TODAY).getTime()) / 86400000)
  return days === 0 ? 'היום' : days === 1 ? 'מחר' : `בעוד ${days} ימים`
}

onMounted(() => searchInput.value?.focus())
</script>

<template>
  <main class="home">
    <section class="hero">
      <p class="hello">{{ greeting }}, {{ user.name }} <span>· {{ roleLabels[role] }}</span></p>
      <h1>איזה מלש״ב נחפש היום?</h1>

      <form class="big-search" :class="{ open: focused && results.length }" @submit.prevent="submit">
        <AppIcon name="search" :size="22" />
        <input
          ref="searchInput"
          v-model="query"
          type="search"
          inputmode="numeric"
          placeholder="הקלידו תעודת זהות, מספר אישי או שם"
          aria-label="חיפוש מלש״ב"
          @input="onInput"
          @focus="focused = true"
          @blur="focused = false"
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
        />
        <button type="submit" class="btn btn-primary">חיפוש</button>

        <ul v-if="focused && results.length" class="suggestions" role="listbox">
          <li
            v-for="(p, i) in results"
            :key="p.idNumber"
            :class="{ active: i === active }"
            role="option"
            @mousedown.prevent="open(p)"
            @mouseenter="active = i"
          >
            <span class="avatar">{{ p.fullName[0] }}</span>
            <span class="who">
              <b>{{ p.fullName }}</b>
              <small>ת.ז {{ p.idNumber }} · מ.א {{ p.personalNumber }}</small>
            </span>
            <span class="tag">{{ p.office }}</span>
          </li>
        </ul>
      </form>
      <p v-if="notFound" class="not-found">לא נמצא מלש״ב התואם ל״{{ query }}״. בדקו את המספר ונסו שוב.</p>
      <p v-else class="hint">לדוגמה: 209842881 או ״בר כהן״</p>

      <div class="shelves">
        <div class="shelf">
          <h2>נצפו לאחרונה</h2>
          <div class="people">
            <div
              v-for="r in recent"
              :key="r.person.idNumber"
              class="person"
              role="button"
              tabindex="0"
              @click="open(r.person)"
              @keydown.enter="open(r.person)"
            >
              <span class="avatar">{{ r.person.fullName[0] }}</span>
              <span class="who">
                <b>{{ r.person.fullName }}</b>
                <small>{{ r.person.idNumber }} · {{ timeAgo(r.at) }}</small>
              </span>
              <button
                class="star"
                :class="{ on: isFavorite(r.person.idNumber) }"
                :aria-label="isFavorite(r.person.idNumber) ? 'הסרה ממועדפים' : 'הוספה למועדפים'"
                @click.stop="toggleFavorite(r.person.idNumber)"
              >
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" /></svg>
              </button>
            </div>
            <p v-if="!recent.length" class="shelf-empty">עוד לא נצפו מלש״בים</p>
          </div>
        </div>

        <div class="shelf">
          <h2>מועדפים <span class="count">{{ favorites.length }}</span></h2>
          <div class="people">
            <div
              v-for="p in favorites"
              :key="p.idNumber"
              class="person"
              role="button"
              tabindex="0"
              @click="open(p)"
              @keydown.enter="open(p)"
            >
              <span class="avatar fav">{{ p.fullName[0] }}</span>
              <span class="who">
                <b>{{ p.fullName }}</b>
                <small>{{ p.idNumber }} · {{ p.status }}</small>
              </span>
              <button class="star on" aria-label="הסרה ממועדפים" @click.stop="toggleFavorite(p.idNumber)">
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" /></svg>
              </button>
            </div>
            <p v-if="!favorites.length" class="shelf-empty">לחצו על הכוכב ליד מלש״ב כדי להוסיף למועדפים</p>
          </div>
        </div>
      </div>
    </section>

    <div class="grid">
      <section class="card panel">
        <header>
          <h2>משתמטים וצו 12</h2>
          <RouterLink to="/dodgers" class="more">לכל המשימות <AppIcon name="arrow-left" :size="14" /></RouterLink>
        </header>
        <div class="mini-kpis">
          <div><b>{{ dodgersState.mine.length }}</b><span>בטיפולי</span></div>
          <div><b>{{ newCount }}</b><span>חדשות</span></div>
          <div class="red"><b>{{ dodgersState.mine.filter((t) => t.status === 'returned').length }}</b><span>הוחזרו לתיקון</span></div>
          <div class="yellow"><b>{{ dodgersState.mine.filter((t) => t.status === 'overdue').length }}</b><span>מעל 48 שעות</span></div>
        </div>
        <h3>דורש טיפול</h3>
        <ul class="tasks">
          <li v-for="t in urgent" :key="t.id" @click="router.push(`/dodgers/task/${t.id}`)">
            <span class="who">
              <b>{{ t.fullName }}</b>
              <small>{{ t.declarationType }} · {{ t.statusReason }}</small>
            </span>
            <span class="pill" :class="t.status">{{ taskStatusLabel[t.status] }}</span>
          </li>
        </ul>
        <RouterLink v-if="role !== 'pakad'" to="/dialer" class="dialer">
          <span>פוטנציאל לחייגן</span>
          <span class="bar"><span :style="{ width: dodgersKpis.dialerApprovedPct + '%' }" /></span>
          <b>{{ dodgersKpis.dialerApprovedPct }}%</b>
        </RouterLink>
      </section>

      <section class="card panel">
        <header>
          <h2>דירקטיבות קרובות</h2>
          <RouterLink to="/directives" class="more">לכל הדירקטיבות <AppIcon name="arrow-left" :size="14" /></RouterLink>
        </header>
        <ul class="directives">
          <li v-for="d in upcoming" :key="d.id" @click="router.push(`/directives/${d.id}`)">
            <span class="date-box">
              <b>{{ fmtDate(d.date).slice(0, 2) }}</b>
              <small>{{ fmtDate(d.date).slice(3, 5) }}/{{ fmtDate(d.date).slice(8) }}</small>
            </span>
            <span class="who">
              <b>{{ d.station }}</b>
              <small>{{ directiveTotals(d).baskets }} סלים · {{ directiveTotals(d).plans }} תוכניות · {{ d.owner }}</small>
            </span>
            <span class="when" :class="{ soon: directiveStatus(d) === 'active' }">{{ daysUntil(d.date) }}</span>
          </li>
          <li v-if="!upcoming.length" class="empty">אין דירקטיבות מתוכננות</li>
        </ul>
        <div class="dir-actions">
          <RouterLink to="/directives/new" class="btn btn-primary"><AppIcon name="plus" :size="14" /> דירקטיבה חדשה</RouterLink>
          <RouterLink v-if="drafts" to="/directives" class="btn btn-soft">{{ drafts }} טיוטות ממתינות</RouterLink>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.home {
  /* Fits the screen exactly: no page scroll, long lists scroll inside their card. */
  display: flex;
  flex-direction: column;
  height: calc(var(--screen-h) - 56px);
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 30px;
}
.hero {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 32px 26px;
  margin-bottom: 20px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 15% 20%, rgba(77, 125, 255, 0.18), transparent 45%),
    radial-gradient(circle at 85% 90%, rgba(0, 70, 254, 0.12), transparent 50%),
    var(--c-header-bg);
  text-align: center;
}
.hello {
  font-size: 15px;
  color: var(--c-muted-2);
}
.hello span {
  color: var(--c-muted);
}
h1 {
  margin: 4px 0 18px;
  font-size: 26px;
  font-weight: 700;
  color: var(--c-brand);
}
.big-search {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: min(640px, 100%);
  height: 60px;
  padding: 0 20px;
  padding-inline-end: 8px;
  border-radius: 30px;
  background: #fff;
  color: var(--c-muted);
  box-shadow: 0 10px 30px rgba(13, 45, 143, 0.12);
  border: 1px solid transparent;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.big-search:focus-within {
  border-color: rgba(0, 70, 254, 0.35);
  box-shadow: 0 0 0 4px rgba(0, 70, 254, 0.08), 0 10px 30px rgba(13, 45, 143, 0.14);
}
.big-search.open {
  border-radius: 30px 30px 0 0;
}
.big-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  font-size: 18px;
  color: var(--c-text);
  background: transparent;
}
.big-search input::placeholder {
  color: var(--c-muted);
}
.big-search .btn {
  height: 44px;
  padding: 0 26px;
  font-size: 15px;
  border-radius: 22px;
}
.suggestions {
  position: absolute;
  top: 100%;
  inset-inline: -1px;
  z-index: 5;
  list-style: none;
  padding: 6px;
  margin: 0;
  background: #fff;
  border: 1px solid rgba(0, 70, 254, 0.35);
  border-top: 1px solid var(--c-divider);
  border-radius: 0 0 20px 20px;
  box-shadow: 0 16px 30px rgba(13, 45, 143, 0.14);
  text-align: start;
}
.suggestions li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 12px;
  cursor: pointer;
}
.suggestions li.active {
  background: var(--c-primary-soft);
}
.hint,
.not-found {
  margin-top: 10px;
  font-size: 13px;
  color: var(--c-muted);
}
.not-found {
  color: var(--c-danger);
}

/* Recently viewed + favorites live inside the search hero. */
.shelves {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
  width: min(1100px, 100%);
  margin-top: 22px;
  padding-top: 20px;
  border-top: 1px solid rgba(13, 45, 143, 0.1);
  text-align: start;
}
.shelf h2 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--c-muted-2);
}
.shelf .people {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.person {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 4px 14px rgba(13, 45, 143, 0.06);
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
}
.person:hover,
.person:focus-visible {
  outline: none;
  background: #fff;
  box-shadow: 0 8px 20px rgba(13, 45, 143, 0.12);
  transform: translateY(-1px);
}
.person .who b {
  font-size: 14px;
}
.person .avatar {
  width: 30px;
  height: 30px;
  font-size: 13px;
}
.shelf-empty {
  grid-column: 1 / -1;
  padding: 14px 0;
  font-size: 13px;
  color: var(--c-muted);
}

.grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 20px;
}
.panel ul {
  min-height: 0;
  overflow-y: auto;
}
.panel header {
  flex-shrink: 0;
}
.panel header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--c-brand);
}
h3 {
  margin: 16px 0 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--c-muted);
}
.count {
  padding: 1px 8px;
  border-radius: 10px;
  background: var(--c-primary-soft);
  color: var(--c-primary);
  font-size: 12px;
  font-weight: 600;
}
.more {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-inline-start: auto;
  font-size: 13px;
  font-weight: 500;
  color: var(--c-primary);
  text-decoration: none;
}
.more:hover {
  text-decoration: underline;
}

ul.tasks,
ul.directives {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}
.tasks li,
.directives li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.12s;
}
.tasks li:hover,
.directives li:hover {
  background: #f5f7ff;
}
.tasks li + li,
.directives li + li {
  border-top: 1px solid #f0f2f7;
}
li.empty {
  justify-content: center;
  padding: 24px 0;
  color: var(--c-muted);
  cursor: default;
}
li.empty:hover {
  background: none;
}
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--c-primary-soft);
  color: var(--c-primary);
  font-weight: 700;
}
.avatar.fav {
  background: #fff4d6;
  color: #c48a00;
}
.who {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}
.who b {
  font-size: 15px;
  font-weight: 600;
}
.who small {
  font-size: 12px;
  color: var(--c-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.when {
  font-size: 12px;
  color: var(--c-muted);
  white-space: nowrap;
}
.when.soon {
  color: var(--c-primary);
  font-weight: 600;
}
.tag {
  padding: 3px 10px;
  border-radius: 12px;
  background: #f5f6fa;
  font-size: 12px;
  color: var(--c-muted-2);
  white-space: nowrap;
}
.star {
  display: flex;
  padding: 4px;
  border-radius: 50%;
  fill: none;
  stroke: #b2b6c4;
  stroke-width: 1.6;
  stroke-linejoin: round;
  transition: transform 0.12s;
}
.star:hover {
  stroke: #e0a800;
  transform: scale(1.1);
}
.star.on {
  fill: #ffc21a;
  stroke: #ffc21a;
}

.mini-kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.mini-kpis div {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 4px;
  border-radius: 10px;
  background: #f7f8fc;
}
.mini-kpis b {
  font-size: 22px;
  font-weight: 700;
}
.mini-kpis span {
  font-size: 12px;
  color: var(--c-muted-2);
  white-space: nowrap;
}
.mini-kpis .red b {
  color: var(--c-danger);
}
.mini-kpis .yellow b {
  color: #c48a00;
}
.pill {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 12px;
  border-radius: 13px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
.pill.returned {
  background: #ffe0e4;
  color: var(--c-danger);
}
.pill.overdue {
  background: #fff3c7;
  color: #c48a00;
}
.dialer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f7f8fc;
  font-size: 13px;
  color: var(--c-text);
  text-decoration: none;
}
.dialer:hover {
  background: var(--c-primary-soft);
}
.dialer .bar {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: #e6e9f2;
  overflow: hidden;
}
.dialer .bar span {
  display: block;
  height: 100%;
  background: #10b795;
  border-radius: 4px;
}
.tasks + .dialer {
  margin-top: 14px;
}

.date-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  border-radius: 10px;
  background: var(--c-primary-soft);
  color: var(--c-primary);
  line-height: 1.1;
}
.date-box b {
  font-size: 17px;
}
.date-box small {
  font-size: 10px;
}
.dir-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
  padding-top: 14px;
}
.dir-actions .btn {
  text-decoration: none;
}
</style>
