<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LinkGrid from './components/LinkGrid.vue'
import TypewriterTitle from './components/TypewriterTitle.vue'
import { loadSiteConfig } from './lib/site-config'
import type { SiteConfig } from './types/site-config'

const config = ref<SiteConfig | null>(null)
const loading = ref(true)

onMounted(async () => {
  config.value = await loadSiteConfig()
  loading.value = false
})
</script>

<template>
  <main class="page-shell">
    <section class="hero">
      <TypewriterTitle
        v-if="config"
        :strings="config.titleTyping"
        :type-speed="config.typewriter.typeSpeed"
        :back-speed="config.typewriter.backSpeed"
        :back-delay="config.typewriter.backDelay"
        :start-delay="config.typewriter.startDelay"
        :loop="config.typewriter.loop"
        :cursor-char="config.typewriter.cursorChar"
      />
      <p v-if="config?.subtitle" class="hero__subtitle">{{ config.subtitle }}</p>
    </section>

    <p v-if="loading" class="state-tip">正在读取 config.json ...</p>

    <p v-else-if="config && config.links.length === 0" class="state-tip">
      当前没有可展示的站点，请在 public/config.json 中补充 links。
    </p>

    <LinkGrid v-else-if="config" :links="config.links" :columns="config.layout.columns" />
  </main>
</template>

<style scoped>
.page-shell {
  width: min(1220px, 92vw);
  margin: 0 auto;
  padding: clamp(2.4rem, 5vw, 4.1rem) 0 clamp(2.3rem, 5vw, 4.5rem);
}

.hero {
  margin-bottom: clamp(1.55rem, 2.4vw, 2.3rem);
}

.hero__subtitle {
  margin: 0.95rem 0 0;
  font-size: clamp(1rem, 1.35vw, 1.35rem);
  color: var(--color-text-secondary);
  font-weight: 500;
  letter-spacing: 0.015em;
}

.state-tip {
  margin-top: 1rem;
  font-size: 1.02rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}
</style>
