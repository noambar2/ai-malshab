<script setup lang="ts">
// "שכפול דירקטיבת עבר" — pick an existing directive to start a new one from.
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { directivesState, directiveTotals, fmtDate, isPast } from '@/data/directives'

const emit = defineEmits<{ close: []; pick: [id: string] }>()

const query = ref('')
const pastOnly = ref(true)
const rows = computed(() => {
  const q = query.value.trim()
  return directivesState.list
    .filter((d) => !pastOnly.value || isPast(d))
    .filter((d) => !q || [d.id, d.station, d.owner, ...d.baskets.map((b) => b.name)].some((s) => s.includes(q)))
    .sort((a, b) => b.date.localeCompare(a.date))
})
</script>

<template>
  <div class="dv-overlay" @click.self="emit('close')">
    <div class="dv-modal" role="dialog" aria-modal="true" aria-label="שכפול דירקטיבת עבר">
      <header class="dv-modal-head">
        <h2>שכפול דירקטיבת עבר</h2>
        <small>בחרו דירקטיבה - הסלים, היעדים וההגדרות שלה יועתקו לדירקטיבה חדשה</small>
        <button class="close" aria-label="סגירה" @click="emit('close')">
          <AppIcon name="close" :size="20" />
        </button>
      </header>
      <div class="content">
        <div class="toolbar">
          <label class="search">
            <AppIcon name="search" :size="18" />
            <input v-model="query" placeholder="חיפוש לפי מספר, תחנה, אחראי או סל" />
          </label>
          <label class="check">
            <input v-model="pastOnly" type="checkbox" />
            דירקטיבות עבר בלבד
          </label>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>מס׳</th>
                <th>תחנה</th>
                <th>אחראי/ת</th>
                <th>תאריך</th>
                <th>סלים</th>
                <th>יעדים</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in rows" :key="d.id">
                <td>{{ d.id }}</td>
                <td class="strong">{{ d.station }}</td>
                <td>{{ d.owner }}</td>
                <td>{{ d.date ? fmtDate(d.date) : '-' }}</td>
                <td>{{ directiveTotals(d).baskets }}</td>
                <td>{{ directiveTotals(d).targets }}</td>
                <td>
                  <button class="btn btn-soft choose" @click="emit('pick', d.id)">
                    בחירה
                    <AppIcon name="arrow-left" :size="16" />
                  </button>
                </td>
              </tr>
              <tr v-if="!rows.length">
                <td colspan="7" class="none">לא נמצאו דירקטיבות</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  padding: 20px;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
}
.toolbar .search {
  width: 320px;
}
.check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--c-text-2);
  cursor: pointer;
}
.check input {
  accent-color: var(--c-primary);
  width: 16px;
  height: 16px;
}
.table td {
  font-size: 14px;
}
.strong {
  font-weight: 700;
}
.choose {
  height: 30px;
}
.none {
  color: var(--c-muted);
  font-weight: 400;
}
</style>
