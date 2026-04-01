<script setup lang="ts">
import { computed } from 'vue'
import type { GridColumns, SiteLink } from '../types/site-config'
import LinkCard from './LinkCard.vue'

const props = defineProps<{
  links: SiteLink[]
  columns: GridColumns
}>()

const gridStyle = computed(() => ({
  '--columns-desktop': String(props.columns.desktop),
  '--columns-tablet': String(props.columns.tablet),
  '--columns-mobile': String(props.columns.mobile),
}))
</script>

<template>
  <section class="link-grid" :style="gridStyle" aria-label="在线服务入口">
    <LinkCard v-for="item in links" :key="`${item.name}-${item.url}`" :item="item" />
  </section>
</template>

<style scoped>
.link-grid {
  display: grid;
  grid-template-columns: repeat(var(--columns-desktop), minmax(0, 1fr));
  gap: 0.95rem;
}

@media (max-width: 1080px) {
  .link-grid {
    grid-template-columns: repeat(var(--columns-tablet), minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .link-grid {
    grid-template-columns: repeat(var(--columns-mobile), minmax(0, 1fr));
  }
}
</style>
