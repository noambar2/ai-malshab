<script setup lang="ts">
import { onMounted, reactive, type Component } from 'vue'
import AccordionSection from '@/components/AccordionSection.vue'
import AppIcon from '@/components/AppIcon.vue'
import MalshabHeader from '@/components/malshab/MalshabHeader.vue'
import MalshabDetails from '@/components/malshab/MalshabDetails.vue'
import SmartAssistant from '@/assistant/SmartAssistant.vue'
import { markViewed } from '@/stores/people'
import SummonsSection from '@/components/malshab/sections/SummonsSection.vue'
import DraftDataSection from '@/components/malshab/sections/DraftDataSection.vue'
import MaaSection from '@/components/malshab/sections/MaaSection.vue'
import MaaFormSection from '@/components/malshab/sections/MaaFormSection.vue'
import EducationSection from '@/components/malshab/sections/EducationSection.vue'
import AtudaSection from '@/components/malshab/sections/AtudaSection.vue'
import PositionsSection from '@/components/malshab/sections/PositionsSection.vue'
import SayarotSection from '@/components/malshab/sections/SayarotSection.vue'
import EmptySection from '@/components/malshab/sections/EmptySection.vue'
import MedicalSection from '@/components/malshab/sections/MedicalSection.vue'
import GoalsSection from '@/components/malshab/sections/GoalsSection.vue'
import AllocationsSection from '@/components/malshab/sections/AllocationsSection.vue'
import DraftStatusSection from '@/components/malshab/sections/DraftStatusSection.vue'
import { summonsState } from '@/data/mock'
import { allocationsMeta, draftStatus, goalsMeta } from '@/data/sectionsA'

interface SectionDef {
  key: string
  title: string
  // value is shown big and dark, label small and grey; done shows a check/x badge
  summary?: { value?: string; label?: string; labelFirst?: boolean }
  done?: boolean
  meta?: () => string
  component: Component
}

const sections: SectionDef[] = [
  { key: 'medical', title: 'רפואי', summary: { value: '97', label: 'פרופיל' }, component: MedicalSection },
  {
    key: 'summons',
    title: 'זימונים',
    summary: { label: 'זימונים' },
    meta: () => `תאריך עדכון ${summonsState.updatedAt}`,
    component: SummonsSection,
  },
  { key: 'goals', title: 'יעדים', summary: { value: goalsMeta.count }, meta: () => `תאריך עדכון ${goalsMeta.updatedAt}`, component: GoalsSection },
  { key: 'allocations', title: 'הקצאות', summary: { value: allocationsMeta.label, label: allocationsMeta.count, labelFirst: true }, meta: () => `תאריך עדכון ${allocationsMeta.updatedAt}`, component: AllocationsSection },
  { key: 'draftStatus', title: 'סטטוס נתוני גיוס', summary: { value: draftStatus.status, label: 'סטטוס' }, meta: () => `תאריך עדכון ${draftStatus.updatedAt}`, component: DraftStatusSection },
  { key: 'draftData', title: 'נתוני גיוס, איכות, אינדיקציות', summary: { value: '60', label: 'דפ״ר' }, component: DraftDataSection },
  { key: 'maa', title: 'מא״ה', done: true, component: MaaSection },
  { key: 'maaForm', title: 'שאלון מא״ה', done: false, component: MaaFormSection },
  { key: 'education', title: 'השכלה', done: true, component: EducationSection },
  { key: 'atuda', title: 'עתודה', done: true, component: AtudaSection },
  { key: 'positions', title: 'משרות', done: true, component: PositionsSection },
  { key: 'sayarot', title: 'סיירות', summary: { value: 'חוקה', label: '02', labelFirst: true }, component: SayarotSection },
  { key: 'tashForm', title: 'שאלון ת״ש', done: false, component: EmptySection },
]

const open = reactive<Record<string, boolean>>({ summons: true })

onMounted(() => markViewed())

function setAll(value: boolean) {
  for (const s of sections) open[s.key] = value
}
</script>

<template>
  <MalshabHeader />
  <MalshabDetails />

  <main class="data">
    <div class="data-head">
      <h2>נתוני מלש״ב</h2>
      <div class="data-actions">
        <button class="icon-btn" title="פתיחת הכל" @click="setAll(true)">
          <AppIcon name="unfold-more" :size="18" />
        </button>
        <button class="icon-btn" title="סגירת הכל" @click="setAll(false)">
          <AppIcon name="unfold-less" :size="18" />
        </button>
        <button class="btn btn-soft">
          <AppIcon name="filter" :size="16" />
          תצוגת רשומות
        </button>
      </div>
    </div>

    <div class="list">
      <AccordionSection
        v-for="s in sections"
        :key="s.key"
        v-model:open="open[s.key]"
        :title="s.title"
      >
        <template v-if="s.meta" #meta>{{ s.meta() }}</template>
        <template #summary>
          <template v-if="s.done !== undefined">
            <span class="done-badge" :class="s.done ? 'yes' : 'no'">
              <AppIcon :name="s.done ? 'check' : 'close'" :size="12" />
            </span>
            <span>{{ s.done ? 'בוצע' : 'לא בוצע' }}</span>
          </template>
          <template v-else-if="s.key === 'summons'">
            <span class="big">{{ summonsState.list.length }}</span>
            <span>{{ s.summary?.label }}</span>
          </template>
          <template v-else-if="s.summary?.labelFirst">
            <span>{{ s.summary.label }}</span>
            <span class="big">{{ s.summary.value }}</span>
          </template>
          <template v-else>
            <span class="big">{{ s.summary?.value }}</span>
            <span v-if="s.summary?.label">{{ s.summary.label }}</span>
          </template>
        </template>
        <component :is="s.component" :section-key="s.key" />
      </AccordionSection>
    </div>
  </main>

  <SmartAssistant />
</template>

<style scoped>
.data {
  padding: 30px;
  /* Room for the floating assistant button (60px tall, 30px off the bottom) plus the
     normal page padding, so the last section isn't hidden behind it. */
  padding-bottom: calc(30px + 60px + 30px);
}
.data-head {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
h2 {
  font-size: 22px;
  font-weight: 600;
  color: var(--c-brand);
}
.data-actions {
  margin-inline-start: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.big {
  font-size: 22px;
  font-weight: 500;
  color: var(--c-text);
}
.done-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: #fff;
}
.done-badge.yes {
  background: #27ae60;
}
.done-badge.no {
  background: #e5484d;
}
</style>
