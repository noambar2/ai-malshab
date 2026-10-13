<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { dodgeTypes } from '@/data/tasks'

export type TaskAction = 'forward' | 'return' | 'declare'

const props = defineProps<{
  // review: מש״ק / רמ״ד recommend onward or return; declare: פוקד makes the final declaration.
  mode: 'review' | 'declare'
  // The פוקד must pick a dodge type before declaring השתמטות.
  needsDodgeType?: boolean
}>()
const emit = defineEmits<{ submit: [action: TaskAction, comment: string, dodgeType?: string] }>()

const MAX = 250
const comment = ref('')
const dodgeType = ref<string>('')
const error = ref('')
const tipVisible = ref(false)

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
        v-model="comment"
        :maxlength="MAX"
        :placeholder="mode === 'review' ? 'הוספת הערה / המלצה חדשה...' : 'הוספת התייחסות חדשה...'"
        rows="2"
      />
      <span class="counter">{{ comment.length }}/{{ MAX }}</span>
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
  color: var(--c-primary-dark);
}
textarea::placeholder {
  color: var(--c-primary-dark);
  opacity: 0.5;
}
.counter {
  font-size: 14px;
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
