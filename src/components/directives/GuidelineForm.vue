<script setup lang="ts">
// The add / edit form for one guideline. Styled as the note card itself: the title and
// text are typed in place, with the actions where the edit icons sit on a saved note.
import { onMounted, ref } from 'vue'

defineProps<{ submitLabel: string; showErrors: boolean }>()
const emit = defineEmits<{ save: []; cancel: [] }>()
const title = defineModel<string>('title', { required: true })
const text = defineModel<string>('text', { required: true })

const titleInput = ref<HTMLInputElement>()
onMounted(() => titleInput.value?.focus())
</script>

<template>
  <form class="note-form" :class="{ invalid: showErrors }" @submit.prevent="emit('save')" @keydown.esc="emit('cancel')">
    <div class="fields">
      <input
        ref="titleInput"
        v-model="title"
        class="title"
        :class="{ missing: showErrors && !title.trim() }"
        maxlength="60"
        placeholder="כותרת ההערה, לדוגמה: הנחיות ליום הגיוס"
        aria-label="כותרת ההערה"
      />
      <textarea
        v-model="text"
        class="text"
        :class="{ missing: showErrors && !text.trim() }"
        rows="2"
        placeholder="כתבו כאן את ההנחיות, הדגשים או ההערה…"
        aria-label="טקסט ההערה"
      />
      <p v-if="showErrors" class="error" role="alert">יש למלא כותרת וטקסט להערה</p>
    </div>
    <div class="acts">
      <button type="submit" class="btn btn-primary sm">{{ submitLabel }}</button>
      <button type="button" class="btn btn-soft sm" @click="emit('cancel')">ביטול</button>
    </div>
  </form>
</template>

<style scoped>
.note-form {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 14px 18px;
  border: 1px solid var(--c-primary);
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0, 70, 254, 0.08);
}
.note-form.invalid {
  border-color: var(--c-danger);
  box-shadow: 0 0 0 3px rgba(241, 43, 67, 0.08);
}
.fields {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
/* Borderless fields that match the saved note's title and text styles. */
.title,
.text {
  width: 100%;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  font: inherit;
}
.title {
  font-size: 15px;
  font-weight: 700;
  color: var(--c-brand);
}
.text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--c-text);
  resize: none;
  field-sizing: content;
  min-height: 2lh;
}
.title::placeholder,
.text::placeholder {
  color: var(--c-muted);
  font-weight: 400;
  opacity: 0.8;
}
.missing::placeholder {
  color: var(--c-danger);
  opacity: 0.7;
}
.error {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--c-danger);
}
.acts {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
.btn.sm {
  height: 28px;
  padding: 0 14px;
}
</style>
