<script setup lang="ts">
import { computed } from 'vue'

// Renders the assistant's tiny markup: **bold**, "- " bullets, blank line = paragraph break.
const props = defineProps<{ text: string }>()

type Block = { kind: 'p'; lines: string[] } | { kind: 'ul'; items: string[] }

const blocks = computed(() => {
  const out: Block[] = []
  for (const line of props.text.split('\n')) {
    const last = out[out.length - 1]
    if (line.startsWith('- ')) {
      if (last?.kind === 'ul') last.items.push(line.slice(2))
      else out.push({ kind: 'ul', items: [line.slice(2)] })
    } else if (!line.trim()) {
      out.push({ kind: 'p', lines: [] })
    } else if (last?.kind === 'p' && last.lines.length) {
      last.lines.push(line)
    } else {
      out.push({ kind: 'p', lines: [line] })
    }
  }
  return out.filter((b) => (b.kind === 'p' ? b.lines.length : true))
})

function parts(line: string) {
  return line.split(/(\*\*[^*]+\*\*)/g).map((p) =>
    p.startsWith('**') && p.endsWith('**') ? { bold: true, t: p.slice(2, -2) } : { bold: false, t: p },
  )
}
</script>

<template>
  <div class="rich">
    <template v-for="(b, i) in blocks" :key="i">
      <ul v-if="b.kind === 'ul'">
        <li v-for="(item, j) in b.items" :key="j">
          <template v-for="(p, k) in parts(item)" :key="k">
            <strong v-if="p.bold">{{ p.t }}</strong><template v-else>{{ p.t }}</template>
          </template>
        </li>
      </ul>
      <p v-else>
        <template v-for="(line, j) in b.lines" :key="j">
          <br v-if="j" />
          <template v-for="(p, k) in parts(line)" :key="k">
            <strong v-if="p.bold">{{ p.t }}</strong><template v-else>{{ p.t }}</template>
          </template>
        </template>
      </p>
    </template>
  </div>
</template>

<style scoped>
.rich {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
strong {
  font-weight: 700;
  color: var(--c-brand);
}
ul {
  margin: 0;
  padding-inline-start: 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
li::marker {
  color: var(--c-primary);
}
</style>
