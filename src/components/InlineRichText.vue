<script setup lang="ts">
import { computed } from 'vue'

interface TextToken {
  type: 'text' | 'strong' | 'em' | 'del' | 'code'
  value: string
}

const props = defineProps<{
  content: string
}>()

const tokenMatcher = /(\*\*.+?\*\*|~~.+?~~|`.+?`|\*.+?\*)/g

const createToken = (value: string): TextToken => {
  if (value.startsWith('**') && value.endsWith('**')) {
    return { type: 'strong', value: value.slice(2, -2) }
  }

  if (value.startsWith('*') && value.endsWith('*')) {
    return { type: 'em', value: value.slice(1, -1) }
  }

  if (value.startsWith('~~') && value.endsWith('~~')) {
    return { type: 'del', value: value.slice(2, -2) }
  }

  if (value.startsWith('`') && value.endsWith('`')) {
    return { type: 'code', value: value.slice(1, -1) }
  }

  return { type: 'text', value }
}

const parseLine = (line: string) => {
  const tokens: TextToken[] = []
  let cursor = 0

  for (const match of line.matchAll(tokenMatcher)) {
    const index = match.index ?? 0
    const rawValue = match[0]

    if (index > cursor) {
      tokens.push({ type: 'text', value: line.slice(cursor, index) })
    }

    tokens.push(createToken(rawValue))
    cursor = index + rawValue.length
  }

  if (cursor < line.length) {
    tokens.push({ type: 'text', value: line.slice(cursor) })
  }

  return tokens.length > 0 ? tokens : [{ type: 'text', value: '' }]
}

const lines = computed(() => props.content.replace(/\r\n?/g, '\n').split('\n').map(parseLine))
</script>

<template>
  <div class="inline-rich-text">
    <p
      v-for="(line, lineIndex) in lines"
      :key="`line-${lineIndex}`"
      class="inline-rich-text__line"
      :class="{ 'is-empty': line.length === 1 && line[0].value.length === 0 }"
    >
      <template v-for="(token, tokenIndex) in line" :key="`token-${lineIndex}-${tokenIndex}`">
        <strong v-if="token.type === 'strong'">{{ token.value }}</strong>
        <em v-else-if="token.type === 'em'">{{ token.value }}</em>
        <del v-else-if="token.type === 'del'">{{ token.value }}</del>
        <code v-else-if="token.type === 'code'" class="inline-rich-text__code">{{ token.value }}</code>
        <span v-else>{{ token.value }}</span>
      </template>
      <span v-if="line.length === 1 && line[0].value.length === 0" aria-hidden="true">&nbsp;</span>
    </p>
  </div>
</template>

<style scoped>
.inline-rich-text {
  display: grid;
  gap: 0.45rem;
}

.inline-rich-text__line {
  margin: 0;
  color: var(--color-text-primary);
  line-height: 1.72;
  white-space: pre-wrap;
}

.inline-rich-text__line.is-empty {
  min-height: 0.9rem;
}

.inline-rich-text__code {
  padding: 0.08rem 0.4rem;
  border: 1px solid color-mix(in srgb, var(--color-card-border) 90%, white 10%);
  border-radius: 999px;
  background: var(--color-code-bg);
  color: color-mix(in srgb, var(--color-accent) 78%, white 22%);
  font-family: 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.92em;
}
</style>
