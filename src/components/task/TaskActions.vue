<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { dodgeTypes } from '@/data/tasks'

export type TaskAction = 'forward' | 'return' | 'declare'

const props = defineProps<{
  // review: מש״ק / רמ״ד recommend onward or return; declare: פוקד makes the final declaration.
  mode: 'review' | 'declare'
  // The פוקד must pick a dodge type before declaring השתמטות.
  needsDodgeType?: boolean
  // Drafts a comment for "הצעה חכמה"; gets the dodge type picked so far.
  suggest?: (dodgeType?: string) => string
}>()
const emit = defineEmits<{ submit: [action: TaskAction, comment: string, dodgeType?: string] }>()

const MAX = 250
const comment = ref('')
const dodgeType = ref<string>('')
const error = ref('')
const tipVisible = ref(false)

// "הצעה חכמה": the assistant types a drafted comment into the box, which stays editable.
const writing = ref(false)
const textarea = ref<HTMLTextAreaElement>()
let typer: ReturnType<typeof setInterval> | undefined

function smartSuggest() {
  if (!props.suggest || writing.value) return
  const text = props.suggest(dodgeType.value || undefined).slice(0, MAX)
  comment.value = ''
  writing.value = true
  let i = 0
  typer = setInterval(() => {
    i = Math.min(i + 3, text.length)
    comment.value = text.slice(0, i)
    if (i >= text.length) stopTyping()
  }, 16)
}

function clearComment() {
  stopTyping()
  comment.value = ''
  textarea.value?.focus()
}

function stopTyping() {
  if (typer) clearInterval(typer)
  typer = undefined
  writing.value = false
}

onBeforeUnmount(stopTyping)

const declareBlocked = computed(() => !!props.needsDodgeType && !dodgeType.value)

watch(comment, () => {
  if (comment.value.trim()) error.value = ''
})

function submit(action: TaskAction) {
  const text = comment.value.trim()
  if (action === 'return' && !text) {
    error.value = 'יש לפרט מה נדרש לתקן לפני החזרה לתיקון'
    return
  }
  if (action === 'forward' && !text) {
    error.value = 'יש להוסיף המלצה לפני העברה לגורם הבא'
    return
  }
  if (action === 'declare' && declareBlocked.value) return
  emit('submit', action, text, dodgeType.value || undefined)
  comment.value = ''
  dodgeType.value = ''
  error.value = ''
}
</script>

<template>
  <div class="actions">
    <label class="comment" :class="{ invalid: error, filled: comment }">
      <textarea
        ref="textarea"
        v-model="comment"
        :maxlength="MAX"
        :placeholder="mode === 'review' ? 'הוספת הערה / המלצה חדשה...' : 'הוספת התייחסות חדשה...'"
        rows="2"
        :readonly="writing"
      />
      <span class="field-foot">
        <button
          v-if="suggest"
          type="button"
          class="smart"
          :class="{ writing }"
          :disabled="writing"
          @click="smartSuggest"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9L12 2.5Zm6.5 11 .9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z"
            />
          </svg>
          {{ writing ? 'כותב…' : comment ? 'הצעה חכמה חדשה' : 'הצעה חכמה' }}
        </button>
        <button v-if="comment && !writing" type="button" class="clear" @click.prevent="clearComment">
          <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
            <path
              fill="currentColor"
              d="M6.4 5.3 12 10.9l5.6-5.6 1.1 1.1-5.6 5.6 5.6 5.6-1.1 1.1-5.6-5.6-5.6 5.6-1.1-1.1 5.6-5.6-5.6-5.6 1.1-1.1Z"
            />
          </svg>
          ניקוי
        </button>
        <span class="counter">{{ comment.length }}/{{ MAX }}</span>
      </span>
    </label>
    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <div class="row">
      <fieldset v-if="needsDodgeType" class="dodge">
        <legend>סוג השתמטות</legend>
        <div class="options">
          <label v-for="t in dodgeTypes" :key="t" class="radio">
            <input v-model="dodgeType" type="radio" name="dodge-type" :value="t" />
            <span class="mark" />
            {{ t }}
          </label>
        </div>
      </fieldset>

      <div class="buttons">
        <button class="btn btn-soft" @click="submit('return')">החזרה לתיקון</button>
        <button v-if="mode === 'review'" class="btn btn-primary" @click="submit('forward')">
          המלצה והעברה לגורם הבא
        </button>
        <span
          v-else
          class="tip-host"
          @mouseenter="tipVisible = declareBlocked"
          @mouseleave="tipVisible = false"
          @focusin="tipVisible = declareBlocked"
          @focusout="tipVisible = false"
        >
          <button class="btn btn-primary" :disabled="declareBlocked" @click="submit('declare')">
            הכרזה סופית
          </button>
          <span class="tooltip" :class="{ show: tipVisible }" role="tooltip">
            יש לבחור סוג השתמטות לפני ההכרזה הסופית
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top: 1px solid var(--c-divider);
  padding-top: 20px;
}
.comment {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 80px;
  padding: 10px 20px;
  border: 1px solid var(--c-primary-soft);
  border-radius: 10px;
  background: var(--c-page);
  cursor: text;
  transition: border-color 0.15s;
}
.comment:focus-within {
  border-color: var(--c-primary);
}
.comment.invalid {
  border-color: #f0142f;
}
textarea {
  border: 0;
  background: transparent;
  outline: none;
  resize: none;
  font-size: 14px;
  line-height: 1.6;
  color: var(--c-primary-dark);
  /* Grow with the text, so a full suggestion is visible without scrolling. */
  field-sizing: content;
  min-height: 44px;
}
textarea::placeholder {
  color: var(--c-primary-dark);
  opacity: 0.5;
}
.field-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
}
.smart {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 12px;
  border-radius: 14px;
  background: linear-gradient(315deg, #0d2d8f 0%, #0046fe 55%, #4d7dff 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 6px 14px -6px rgba(0, 70, 254, 0.6);
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
}
.smart:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px -6px rgba(0, 70, 254, 0.7);
}
.smart:disabled {
  cursor: default;
}
.smart.writing svg {
  animation: twinkle 0.8s ease-in-out infinite;
}
@keyframes twinkle {
  50% {
    opacity: 0.4;
    transform: scale(0.85);
  }
}
.clear {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 10px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 600;
  color: var(--c-muted-2);
  transition: background 0.15s, color 0.15s;
}
.clear:hover {
  background: #e9ecf5;
  color: var(--c-text);
}
/* Small and quiet, pinned to the left end of the field. Physical margin on purpose:
   the counter is direction: ltr, which would flip a logical margin to the wrong side. */
.counter {
  margin-right: auto;
  font-size: 11px;
  opacity: 0.6;
  color: var(--c-muted-2);
  text-align: end;
  direction: ltr;
  align-self: flex-end;
}
.error {
  margin-top: -12px;
  font-size: 12px;
  color: #f0142f;
}
.row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}
.dodge {
  flex: 1;
  border: 0;
  padding: 0;
  min-width: 0;
}
legend {
  padding: 0;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 500;
  color: var(--c-text);
}
.options {
  display: flex;
  gap: 20px;
}
.radio {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: var(--c-text);
  cursor: pointer;
}
.radio input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.mark {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid var(--c-border-2);
  background: #fff;
  transition: border 0.1s;
}
.radio:hover .mark {
  border-color: var(--c-primary);
}
.radio input:checked + .mark {
  border: 6px solid var(--c-primary);
}
.radio input:focus-visible + .mark {
  outline: 2px solid var(--c-primary);
  outline-offset: 2px;
}
.buttons {
  margin-inline-start: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}
.tip-host {
  position: relative;
  display: inline-flex;
}
/* Let the wrapper receive hover even though the button itself is disabled. */
.tip-host .btn:disabled {
  pointer-events: none;
}
.tooltip {
  position: absolute;
  bottom: calc(100% + 11px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 70px;
  padding: 5px 10px;
  border-radius: 4px;
  background: #eaeaea;
  color: #777;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}
.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 7px solid transparent;
  border-top-color: #eaeaea;
  border-bottom: 0;
}
.tooltip.show {
  opacity: 1;
}
</style>
