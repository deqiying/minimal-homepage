<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LinkGrid from './components/LinkGrid.vue'
import SiteFooter from './components/SiteFooter.vue'
import TimelineSection from './components/TimelineSection.vue'
import TypewriterTitle from './components/TypewriterTitle.vue'
import { createDefaultSiteConfig, loadSiteConfig } from './lib/site-config'
import type { SiteConfig } from './types/site-config'

const config = ref<SiteConfig>(createDefaultSiteConfig())
const loading = ref(true)

const updateDocumentTitle = (pageTitle: string) => {
  const normalizedTitle = pageTitle.trim()
  if (normalizedTitle.length > 0) {
    document.title = normalizedTitle
  }
}

onMounted(async () => {
  updateDocumentTitle(config.value.pageTitle)

  try {
    config.value = await loadSiteConfig()
  } finally {
    updateDocumentTitle(config.value.pageTitle)
    loading.value = false
  }
})
</script>

<template>
  <main class="page-shell" :class="{ 'has-floating-footer': !loading && Boolean(config.footer.enabled) }">
    <section v-if="loading" class="loading-stage" aria-live="polite">
      <div class="loading-stage__panel">
        <p class="loading-stage__eyebrow">LOADING</p>
        <p class="loading-stage__title">正在加载页面</p>
        <p class="loading-stage__tip">页面内容即将就绪，请稍候。</p>
      </div>
    </section>

    <template v-else>
      <section class="hero">
        <TypewriterTitle
          :strings="config.titleTyping"
          :type-speed="config.typewriter.typeSpeed"
          :back-speed="config.typewriter.backSpeed"
          :back-delay="config.typewriter.backDelay"
          :start-delay="config.typewriter.startDelay"
          :loop="config.typewriter.loop"
          :cursor-char="config.typewriter.cursorChar"
        />
        <p v-if="config.subtitle" class="hero__subtitle">{{ config.subtitle }}</p>
      </section>

      <TimelineSection
        v-if="config.timeline.length > 0"
        class="page-section"
        :entries="config.timeline"
      />

      <LinkGrid
        v-if="config.links.length > 0"
        class="page-section page-section--links"
        :links="config.links"
        :columns="config.layout.columns"
      />

      <SiteFooter
        v-if="config.footer.enabled"
        :footer="config.footer"
        :page-title="config.pageTitle"
      />
    </template>
  </main>
</template>

<style scoped>
.page-shell {
  width: min(1220px, 92vw);
  margin: 0 auto;
  padding: clamp(2.4rem, 5vw, 4.1rem) 0 clamp(2.3rem, 5vw, 4.5rem);
}

.page-shell.has-floating-footer {
  --floating-footer-safe-space: clamp(5.6rem, 13vh, 7.4rem);
  padding-bottom: calc(clamp(2.3rem, 5vw, 4.5rem) + var(--floating-footer-safe-space));
}

.hero {
  margin-bottom: clamp(1.55rem, 2.4vw, 2.3rem);
}

.loading-stage {
  min-height: clamp(18rem, 46vh, 28rem);
  display: grid;
  place-items: center;
}

.loading-stage__panel {
  width: min(420px, 100%);
  padding: clamp(1.2rem, 3vw, 1.65rem) clamp(1.15rem, 3vw, 1.55rem);
  border: 1px solid color-mix(in srgb, var(--color-card-border) 90%, white 10%);
  border-radius: var(--radius-card);
  background:
    linear-gradient(145deg, rgb(20 27 40 / 0.88), rgb(20 27 40 / 0.68)),
    linear-gradient(180deg, rgb(121 199 255 / 0.08), transparent 48%);
  box-shadow: var(--shadow-card);
  text-align: center;
  backdrop-filter: blur(10px);
}

.loading-stage__eyebrow {
  margin: 0;
  color: color-mix(in srgb, var(--color-accent) 75%, white 25%);
  font-size: 0.78rem;
  letter-spacing: 0.22em;
  font-weight: 700;
}

.loading-stage__title {
  margin: 0.75rem 0 0;
  color: var(--color-text-primary);
  font-size: clamp(1.05rem, 1.8vw, 1.2rem);
  font-weight: 700;
}

.loading-stage__tip {
  margin: 0.6rem 0 0;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.65;
}

.page-section + .page-section {
  margin-top: clamp(1.55rem, 2.8vw, 2.2rem);
}

.hero__subtitle {
  margin: 0.95rem 0 0;
  font-size: clamp(1rem, 1.35vw, 1.35rem);
  color: var(--color-text-secondary);
  font-weight: 500;
  letter-spacing: 0.015em;
}

@media (max-width: 960px) {
  .page-shell.has-floating-footer {
    --floating-footer-safe-space: clamp(4.4rem, 11vh, 5.9rem);
  }
}
</style>
