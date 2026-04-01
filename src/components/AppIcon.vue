<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name?: string
}>()

const iconName = computed(() => props.name?.toLowerCase() ?? '')
</script>

<template>
  <svg
    class="app-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <template v-if="iconName === 'home'">
      <path d="M3 10.8 12 3l9 7.8" />
      <path d="M6.5 9.8V21h11V9.8" />
      <path d="M10 21v-5.5h4V21" />
    </template>

    <template v-else-if="iconName === 'monitor'">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
      <path d="M6.5 10h2.5l1.2-2.2 2 4.4 1.4-2.8H17.5" />
    </template>

    <template v-else-if="iconName === 'image'">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="M21 15.4 16 10.8l-4.2 4.2-2.8-2.6L3 18" />
    </template>

    <template v-else-if="iconName === 'server'">
      <rect x="4" y="3" width="16" height="6" rx="1.5" />
      <rect x="4" y="10" width="16" height="6" rx="1.5" />
      <rect x="4" y="17" width="16" height="4" rx="1.5" />
      <path d="M8 6h.01M8 13h.01M8 19h.01" />
    </template>

    <template v-else-if="iconName === 'calculator'">
      <rect x="4" y="2.8" width="16" height="18.4" rx="2" />
      <path d="M8 7h8" />
      <path d="M8 12h2M14 12h2M8 16h2M14 16h2" />
      <path d="M11 11v6" />
    </template>

    <template v-else-if="iconName === 'bot'">
      <rect x="4" y="7" width="16" height="12" rx="3" />
      <path d="M12 3v4" />
      <path d="M9 12h.01M15 12h.01" />
      <path d="M8.5 15.5h7" />
      <path d="M2.5 12h1.5M20 12h1.5" />
    </template>

    <template v-else-if="iconName === 'mail'">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </template>

    <template v-else-if="iconName === 'cloud'">
      <path d="M8 18h8.5a4.5 4.5 0 0 0 .2-9 5.8 5.8 0 0 0-11.3 1.7A4 4 0 0 0 8 18Z" />
      <path d="M12 10v8" />
      <path d="m9.2 12.8 2.8-2.8 2.8 2.8" />
    </template>

    <template v-else-if="iconName === 'notebook'">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 3v18" />
      <path d="M12 8h4M12 12h4M12 16h4" />
    </template>

    <template v-else-if="iconName === 'chart'">
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="m7.5 15.5 3-3 2.5 2 4-5" />
    </template>

    <template v-else>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h10M7 12h10M7 16h6" />
    </template>
  </svg>
</template>

<style scoped>
.app-icon {
  width: 1.65rem;
  height: 1.65rem;
  flex: none;
}
</style>
