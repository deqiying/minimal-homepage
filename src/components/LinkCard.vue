<script setup lang="ts">
import type { SiteLink } from '../types/site-config'
import AppIcon from './AppIcon.vue'

defineProps<{
  item: SiteLink
}>()
</script>

<template>
  <a
    class="link-card"
    :class="{ 'is-highlighted': item.highlighted }"
    :href="item.url"
    :target="item.target ?? '_blank'"
    rel="noreferrer"
  >
    <span class="link-card__icon" aria-hidden="true">
      <AppIcon :name="item.icon" />
    </span>
    <span class="link-card__name">{{ item.name }}</span>
  </a>
</template>

<style scoped>
.link-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 5.6rem;
  border-radius: var(--radius-card);
  border: 2px solid var(--color-card-border);
  background: var(--color-card-bg);
  backdrop-filter: blur(3px);
  color: var(--color-text-primary);
  padding: 1.1rem 1.35rem;
  text-decoration: none;
  box-shadow: var(--shadow-card);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.link-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--color-accent) 72%, white);
  background: color-mix(in srgb, var(--color-card-bg) 84%, rgb(121 199 255 / 0.18));
  box-shadow: var(--shadow-card-hover);
}

.link-card:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--color-accent) 55%, white);
  outline-offset: 2px;
}

.link-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-icon);
}

.link-card__name {
  font-size: clamp(1.15rem, 1.85vw, 2rem);
  line-height: 1.15;
  font-weight: 600;
}

.is-highlighted {
  border-color: color-mix(in srgb, var(--color-accent) 58%, var(--color-card-border));
  background: color-mix(in srgb, var(--color-accent) 14%, var(--color-card-bg));
  color: var(--color-accent);
}
</style>
