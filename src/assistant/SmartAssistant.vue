<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import RichText from './RichText.vue'
import { QUICK_QUESTIONS, answer, greeting } from './answers'
import { assistantOpen } from './state'
import { malshab } from '@/data/mock'

interface Msg {
  id: number
  role: 'bot' | 'user'
  text: string
}

const open = assistantOpen
const msgs = ref<Msg[]>([])
const typing = ref(false)
const busy = ref(false)
const draft = ref('')
const stream = ref<HTMLElement>()
const input = ref<HTMLInputElement>()
const composer = ref<HTMLElement>()
let composerObserver: ResizeObserver | undefined
let nextId = 0
let alive = true
let typer: ReturnType<typeof setInterval> | undefined

// A chip question that was already asked drops off the list.
const asked = ref(new Set<string>())
const chips = computed(() => QUICK_QUESTIONS.filter((q) => !asked.value.has(q)))

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Chips hide while the user scrolls up to read, and come back near the bottom.
// Two thresholds so the chips appearing/disappearing doesn't flip the state back.
const nearBottom = ref(true)

function onStreamScroll() {
  const el = stream.value
  if (!el) return
  const gap = el.scrollHeight - el.scrollTop - el.clientHeight
  if (gap > 140) nearBottom.value = false
  else if (gap < 40) nearBottom.value = true
}

function scrollDown() {
  nearBottom.value = true
  nextTick(() => {
    if (stream.value) stream.value.scrollTop = stream.value.scrollHeight
  })
}

// The assistant "types" before each message, a little longer for longer messages.
async function say(texts: string[]) {
  busy.value = true
  for (const text of texts) {
    typing.value = true
    scrollDown()
    await delay(Math.min(450 + text.length * 4, 1400))
    if (!alive) return
    typing.value = false
    msgs.value.push({ id: nextId++, role: 'bot', text })
    scrollDown()
    await delay(140)
  }
  busy.value = false
  nextTick(() => input.value?.focus())
}

// The composer floats over the conversation (so the glass has something to blur),
// so the conversation is padded by the composer's height.
watch(composer, (el) => {
  composerObserver?.disconnect()
  if (!el) return
  composerObserver = new ResizeObserver(() => {
    stream.value?.style.setProperty('--composer-h', `${el.offsetHeight}px`)
    if (nearBottom.value) scrollDown()
  })
  composerObserver.observe(el)
})

watch(open, (isOpen) => {
  if (isOpen && !msgs.value.length) say(greeting())
  if (isOpen) nextTick(() => input.value?.focus())
})

function send() {
  const text = draft.value.trim()
  if (!text || busy.value) return
  stopTyper()
  msgs.value.push({ id: nextId++, role: 'user', text })
  if (QUICK_QUESTIONS.includes(text)) asked.value = new Set(asked.value).add(text)
  draft.value = ''
  scrollDown()
  say([answer(text)])
}

// A chip types its question into the box, so the user can still edit it before sending.
function useChip(q: string) {
  if (busy.value) return
  stopTyper()
  draft.value = ''
  let i = 0
  typer = setInterval(() => {
    draft.value = q.slice(0, ++i)
    if (i >= q.length) {
      stopTyper()
      input.value?.focus()
    }
  }, 18)
}

function stopTyper() {
  if (typer) clearInterval(typer)
  typer = undefined
}

function reset() {
  stopTyper()
  msgs.value = []
  asked.value = new Set()
  draft.value = ''
  say(greeting())
}

onBeforeUnmount(() => {
  alive = false
  composerObserver?.disconnect()
  stopTyper()
})
</script>

<template>
  <button v-if="!open" class="launcher" @click="open = true">
    <span class="halo" aria-hidden="true" />
    <span class="mark small"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9L12 2.5Zm6.5 11 .9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z" /></svg></span>
    <span class="launcher-text">
      <b>העוזר החכם</b>
      <small>סיכום ושאלות על {{ malshab.fullName.split(' ')[0] }}</small>
    </span>
  </button>

  <Transition name="drawer">
    <aside v-if="open" class="drawer" aria-label="העוזר החכם">
      <header class="head">
        <span class="mark"><svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9L12 2.5Zm6.5 11 .9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z" /></svg></span>
        <span class="titles">
          <span class="title">העוזר החכם</span>
          <span class="sub">{{ malshab.fullName }} · מ.א {{ malshab.personalNumber }}</span>
        </span>
        <button class="head-btn" title="שיחה חדשה" @click="reset">
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M12 5a7 7 0 0 1 6.32 4H15.5v1.5H21V5h-1.5v2.67A8.5 8.5 0 1 0 20.5 13H19a7 7 0 1 1-7-8Z" /></svg>
        </button>
        <button class="head-btn" title="סגירה" @click="open = false">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M6.4 5.3 12 10.9l5.6-5.6 1.1 1.1-5.6 5.6 5.6 5.6-1.1 1.1-5.6-5.6-5.6 5.6-1.1-1.1 5.6-5.6-5.6-5.6 1.1-1.1Z" /></svg>
        </button>
      </header>

      <div ref="stream" class="stream" role="log" aria-live="polite" @scroll.passive="onStreamScroll">
        <template v-for="m in msgs" :key="m.id">
          <div v-if="m.role === 'user'" class="user-msg">{{ m.text }}</div>
          <div v-else class="bot-msg"><RichText :text="m.text" /></div>
        </template>
        <div v-if="typing" class="typing" role="status" aria-label="העוזר מקליד">
          <span /><span /><span />
        </div>
      </div>

      <div ref="composer" class="composer">
        <Transition name="chips">
        <div v-if="!busy && nearBottom && chips.length" class="chips" role="group" aria-label="שאלות נפוצות">
          <button v-for="q in chips" :key="q" class="chip" @click="useChip(q)">{{ q }}</button>
        </div>
        </Transition>
        <form class="field" @submit.prevent="send">
          <input
            ref="input"
            v-model="draft"
            :disabled="busy"
            :placeholder="busy ? 'העוזר כותב…' : 'שאל/י כל דבר על המלש״ב…'"
            aria-label="שאלה"
          />
          <button type="submit" class="send" :disabled="busy || !draft.trim()" aria-label="שליחה">
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M20.5 3.5 2.8 10.6c-.8.3-.7 1.4.1 1.6l6.6 1.9 1.9 6.6c.2.8 1.3.9 1.6.1L20.5 3.5Zm-9 9.3-4.8-1.4 10.5-4.6-5.7 6Z" transform="scale(-1,1) translate(-24,0)" /></svg>
          </button>
        </form>
        <p class="note">העוזר עונה על סמך הנתונים הרשומים בתיק המלש״ב.</p>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(315deg, #0d2d8f 0%, #0046fe 55%, #4d7dff 100%);
  box-shadow: 0 6px 18px -6px rgba(0, 70, 254, 0.6);
}
.mark.small {
  width: 28px;
  height: 28px;
  box-shadow: none;
}

.launcher {
  position: fixed;
  left: 30px;
  bottom: 30px;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 60px;
  padding-inline: 10px 24px;
  border-radius: 30px;
  background: linear-gradient(315deg, #0d2d8f 0%, #0046fe 60%, #4d7dff 100%);
  box-shadow: 0 12px 32px -6px rgba(0, 70, 254, 0.55);
  color: #fff;
  text-align: start;
  transition: box-shadow 0.2s, transform 0.2s;
  animation: launcher-in 0.5s 0.3s ease-out both;
}
.launcher:hover {
  box-shadow: 0 16px 40px -6px rgba(0, 70, 254, 0.7);
  transform: translateY(-2px);
}
.launcher .mark.small {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
}
.launcher .mark.small svg {
  width: 20px;
  height: 20px;
}
.launcher-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}
.launcher-text b {
  font-size: 16px;
  font-weight: 700;
}
.launcher-text small {
  font-size: 12px;
  opacity: 0.85;
}
/* A soft pulse so the assistant is noticed on the profile page. */
.halo {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 0 0 0 rgba(0, 70, 254, 0.45);
  animation: halo 2.4s 1s ease-out 3;
  pointer-events: none;
}
@keyframes halo {
  to {
    box-shadow: 0 0 0 16px rgba(0, 70, 254, 0);
  }
}
@keyframes launcher-in {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.96);
  }
}
.chips-enter-active,
.chips-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.chips-enter-from,
.chips-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.drawer {
  position: fixed;
  top: 56px;
  left: 0;
  bottom: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  width: 440px;
  max-width: 100vw;
  background: #fff;
  box-shadow: 8px 0 40px rgba(13, 45, 143, 0.14);
}
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.28s ease, opacity 0.28s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-24px);
  opacity: 0;
}

.head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(13, 45, 143, 0.08);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
}
.titles {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  line-height: 1.3;
}
.title {
  font-size: 15px;
  font-weight: 600;
  color: var(--c-brand);
}
.sub {
  font-size: 12px;
  color: var(--c-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.head-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--c-muted-2);
}
.head-btn:hover {
  background: var(--c-primary-soft);
  color: var(--c-primary);
}

.stream {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 22px 20px calc(var(--composer-h, 160px) + 12px);
  background: linear-gradient(180deg, #fff 0%, #f3f6ff 100%);
}
/* The assistant writes straight onto the page; only the user's messages sit in bubbles. */
.bot-msg {
  font-size: 15px;
  line-height: 1.65;
  color: var(--c-text);
  animation: rise 0.26s ease-out both;
}
.user-msg {
  align-self: flex-start;
  max-width: 82%;
  padding: 10px 16px;
  border-radius: 20px;
  border-end-start-radius: 6px;
  background: var(--c-primary);
  color: #fff;
  font-size: 15px;
  line-height: 1.55;
  white-space: pre-wrap;
  animation: rise 0.26s ease-out both;
}
.typing {
  display: flex;
  gap: 6px;
  padding: 8px 4px;
}
.typing span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--c-primary);
  animation: bounce 1.1s infinite;
}
.typing span:nth-child(2) {
  animation-delay: 0.16s;
}
.typing span:nth-child(3) {
  animation-delay: 0.32s;
}

.composer {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 28px 16px 14px;
  pointer-events: none;
}
.composer > * {
  pointer-events: auto;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chip {
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(24px) saturate(1.5);
  -webkit-backdrop-filter: blur(24px) saturate(1.5);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 8px 32px rgba(13, 45, 143, 0.12);
  font-size: 13px;
  font-weight: 600;
  color: var(--c-brand);
  animation: rise 0.26s ease-out both;
  transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
}
.chip:hover {
  background: #fff;
  box-shadow: 0 0 18px rgba(0, 70, 254, 0.22);
}
.chip:active {
  transform: scale(0.97);
}
.field {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  padding-inline-start: 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(24px) saturate(1.5);
  -webkit-backdrop-filter: blur(24px) saturate(1.5);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 8px 32px rgba(13, 45, 143, 0.12);
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
}
.field:focus-within {
  background: #fff;
  border-color: rgba(0, 70, 254, 0.4);
  box-shadow: 0 0 20px rgba(0, 70, 254, 0.22);
}
.field input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 15px;
  padding: 6px 0;
}
.field input::placeholder {
  color: rgba(51, 60, 93, 0.45);
}
.send {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--c-primary);
  color: #fff;
  transition: background 0.15s, opacity 0.15s, transform 0.1s;
}
.send:hover:not(:disabled) {
  background: #0038cc;
}
.send:active:not(:disabled) {
  transform: scale(0.95);
}
.send:disabled {
  opacity: 0.4;
  cursor: default;
}
.note {
  text-shadow: 0 0 8px #fff;
  text-align: center;
  font-size: 11.5px;
  color: var(--c-muted);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
@keyframes bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-5px);
    opacity: 1;
  }
}
</style>
