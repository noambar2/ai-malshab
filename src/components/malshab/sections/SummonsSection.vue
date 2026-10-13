<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import AddSummonsModal from '../AddSummonsModal.vue'
import { summonsState } from '@/data/mock'

const showModal = ref(false)
</script>

<template>
  <div class="toolbar">
    <button class="icon-btn"><AppIcon name="columns" :size="18" /></button>
    <button class="icon-btn"><AppIcon name="filter" :size="18" /></button>
    <span class="hint">
      <b>{{ summonsState.list.length }}</b> זימונים - לחץ על שורה לפרטים מלאים ועריכה
    </span>
    <span class="add-wrap" :class="{ blocked: summonsState.hasBlocking }">
      <button
        class="btn btn-primary"
        :disabled="summonsState.hasBlocking"
        @click="showModal = true"
      >
        <AppIcon name="plus" :size="16" />
        הוספת זימון
      </button>
      <span v-if="summonsState.hasBlocking" class="tooltip">
        קיים זימון חוסם,<br />לא ניתן להוסיף זימון חדש
      </span>
    </span>
  </div>

  <div class="table-wrap">
    <table class="table clickable">
      <thead>
        <tr>
          <th>תאריך זימון</th>
          <th>סוג זימון</th>
          <th>שם הזימון</th>
          <th>נושא הזימון</th>
          <th>סטטוס</th>
          <th>סיבת סטטוס</th>
          <th>סיבת סגירה</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(s, i) in summonsState.list" :key="i">
          <td>{{ s.date }}</td>
          <td>{{ s.type }}</td>
          <td>{{ s.name }}</td>
          <td>{{ s.topic }}</td>
          <td><StatusBadge :status="s.status" /></td>
          <td>{{ s.statusReason }}</td>
          <td>{{ s.closeReason }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <AddSummonsModal v-if="showModal" @close="showModal = false" />
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.hint {
  font-size: 14px;
  font-weight: 500;
}
.hint b {
  font-size: 16px;
}
.add-wrap {
  position: relative;
  margin-inline-start: auto;
}
.tooltip {
  display: none;
  position: absolute;
  bottom: calc(100% + 10px);
  left: -28px;
  padding: 6px 10px;
  border-radius: 4px;
  background: #e6e6e6;
  color: var(--c-text-2);
  font-size: 14px;
  line-height: 1.3;
  white-space: nowrap;
}
.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  border: 7px solid transparent;
  border-top-color: #e6e6e6;
  transform: translateX(-50%);
}
.add-wrap.blocked:hover .tooltip {
  display: block;
}
</style>
