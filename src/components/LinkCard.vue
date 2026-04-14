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
  background:
    linear-gradient(145deg, rgb(20 27 40 / 0.9), rgb(20 27 40 / 0.76)),
    linear-gradient(180deg, rgb(121 199 255 / 0.06), transparent 55%);
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
  background:
    linear-gradient(145deg, rgb(25 33 49 / 0.94), rgb(22 29 43 / 0.82)),
    linear-gradient(180deg, rgb(121 199 255 / 0.14), transparent 55%);
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
  background:
    linear-gradient(145deg, rgb(28 39 58 / 0.94), rgb(21 29 43 / 0.82)),
    linear-gradient(180deg, rgb(121 199 255 / 0.16), transparent 58%);
  color: var(--color-accent);
}
</style>
