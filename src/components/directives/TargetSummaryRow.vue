<script setup lang="ts">
// A basket's main target as one read-only row on the basket grid (.bk-grid): name and note,
// מקצוע across two number columns, סוג שיבוץ, יעד פינוי, מיוצבים, then edit / delete (with an inline
// confirmation). Used on a saved basket and inside the basket editor.
import { computed, ref } from 'vue'
import DvIcon from './DvIcon.vue'
import NoteLine from './NoteLine.vue'
import { findTarget, type MainTarget } from '@/data/directives'

const props = defineProps<{ target: MainTarget }>()
const emit = defineEmits<{ edit: []; remove: [] }>()

const info = computed(() => findTarget(props.target.targetCode))
const confirming = ref(false)
</script>

<template>
  <div class="srow bk-grid">
    <div class="tname">
      <h4>
        <span class="nm">{{ info?.name ?? 'יעד לא נבחר' }}</span>
        <small>{{ target.targetCode }}</small>
      </h4>
      <NoteLine v-if="target.notes" :text="target.notes" />
    </div>
    <dl class="sum-stat wide">
      <dt>מקצוע</dt>
      <dd :data-tip="info ? `${info.profession} ${info.professionCode}` : undefined">
        {{ info?.profession ?? '-' }}<span class="code">{{ info?.professionCode }}</span>
      </dd>
    </dl>
    <dl class="sum-stat"><dt>סוג שיבוץ</dt><dd>{{ target.placementType || '-' }}</dd></dl>
    <dl class="sum-stat"><dt>יעד פינוי</dt><dd>{{ target.evacTarget || '-' }}</dd></dl>
    <dl class="sum-stat"><dt>מיוצבים</dt><dd>{{ info?.stabilized ?? 0 }}</dd></dl>
    <div class="acts">
      <div v-if="confirming" class="confirm">
        <span class="confirm-q">למחוק את היעד?</span>
        <button type="button" class="btn dv-btn-danger sm" @click="emit('remove')">מחיקה</button>
        <button type="button" class="btn btn-soft sm" @click="confirming = false">ביטול</button>
      </div>
      <template v-else>
        <button type="button" class="act" title="עריכת היעד" aria-label="עריכת היעד" @click="emit('edit')">
          <DvIcon name="edit" :size="16" />
        </button>
        <button type="button" class="act del" title="מחיקת היעד" aria-label="מחיקת היעד" @click="confirming = true">
          <DvIcon name="trash" :size="16" />
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.srow {
  padding: 10px 0;
}
.tname {
  min-width: 0;
  padding-inline-end: 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tname h4 {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--c-text);
}
.tname .nm {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.tname small {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 400;
  color: var(--c-muted);
}
.acts {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
/* The delete confirmation floats over the numbers rather than resizing the column. */
.confirm {
  position: absolute;
  inset-inline-end: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(7, 25, 56, 0.14);
  white-space: nowrap;
}
.confirm-q {
  font-size: 13px;
  margin-inline-end: 4px;
}
.btn.sm {
  height: 28px;
  padding: 0 12px;
}
.act {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--c-primary);
}
.act:hover {
  background: var(--c-primary-soft);
}
.act.del {
  color: var(--c-muted-2);
}
.act.del:hover {
  background: #ffe8eb;
  color: var(--c-danger);
}
</style>
