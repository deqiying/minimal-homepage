<script setup lang="ts">
import type { TimelineEntry } from '../types/site-config'
import InlineRichText from './InlineRichText.vue'

defineProps<{
  entries: TimelineEntry[]
}>()
</script>

<template>
  <section class="timeline" aria-label="时间线">
    <article v-for="item in entries" :key="`${item.timestamp}-${item.content}`" class="timeline__item">
      <div class="timeline__meta">
        <time class="timeline__date" :datetime="item.timestamp">{{ item.displayDate }}</time>
      </div>

      <div class="timeline__card">
        <InlineRichText :content="item.content" />
      </div>
    </article>
  </section>
</template>

<style scoped>
.timeline {
  position: relative;
  width: min(860px, 100%);
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0.8rem;
  bottom: 0.8rem;
  left: calc(clamp(4.9rem, 16vw, 7.1rem) - 0.08rem);
  width: 2px;
  background: linear-gradient(180deg, rgb(121 199 255 / 0.9), rgb(121 199 255 / 0.24));
  box-shadow: 0 0 18px rgb(121 199 255 / 0.16);
}

.timeline__item {
  position: relative;
  display: grid;
  grid-template-columns: clamp(4.5rem, 15vw, 6.7rem) minmax(0, 1fr);
  gap: clamp(1rem, 2.4vw, 1.45rem);
  align-items: start;
}

.timeline__item + .timeline__item {
  margin-top: clamp(1rem, 2vw, 1.4rem);
}

.timeline__meta {
  position: relative;
  padding-top: 0.28rem;
  padding-right: clamp(0.95rem, 2vw, 1.2rem);
  text-align: right;
}

.timeline__meta::after {
  content: '';
  position: absolute;
  top: 0.5rem;
  right: -0.45rem;
  width: 0.9rem;
  height: 0.9rem;
  border: 2px solid color-mix(in srgb, var(--color-accent) 85%, white 15%);
  border-radius: 999px;
  background: var(--color-page-bg);
  box-shadow:
    0 0 0 0.28rem rgb(121 199 255 / 0.12),
    0 0 20px rgb(121 199 255 / 0.26);
}

.timeline__date {
  display: inline-block;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.timeline__card {
  padding: clamp(1rem, 2.5vw, 1.35rem) clamp(1rem, 2.5vw, 1.4rem);
  border: 1px solid color-mix(in srgb, var(--color-card-border) 90%, white 10%);
  border-radius: var(--radius-card);
  background:
    linear-gradient(145deg, rgb(20 27 40 / 0.92), rgb(20 27 40 / 0.7)),
    linear-gradient(180deg, rgb(121 199 255 / 0.08), transparent 45%);
  box-shadow: var(--shadow-card);
}

@media (max-width: 720px) {
  .timeline::before {
    left: calc(clamp(4.2rem, 20vw, 5.1rem) - 0.08rem);
  }

  .timeline__item {
    grid-template-columns: clamp(3.8rem, 18vw, 4.8rem) minmax(0, 1fr);
    gap: 0.9rem;
  }

  .timeline__meta {
    padding-right: 0.9rem;
  }

  .timeline__date {
    font-size: 0.8rem;
    letter-spacing: 0.02em;
  }

  .timeline__card {
    padding: 0.92rem 0.95rem 1rem;
  }
}
</style>
