<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { FooterConfig } from '../types/site-config'
import AppIcon from './AppIcon.vue'

const props = defineProps<{
  footer: FooterConfig
  pageTitle: string
}>()

const isCompact = ref(false)
let scrollFrameId: number | null = null

interface FooterRecordItem {
  key: 'icp' | 'police'
  label: string
  number: string
  url: string
  icon: string
  iconType: 'image' | 'symbol'
}

const defaultRecordUrls = {
  icp: 'https://beian.miit.gov.cn/',
  police: 'https://beian.gov.cn/',
} as const

const defaultRecordIcons = {
  icp: 'icp.png',
  police: 'police.png',
} as const

const imageIconPattern = /\.(png|jpe?g|gif|webp|svg|ico)(?:[?#].*)?$/i

const updateCompactState = () => {
  isCompact.value = window.scrollY > 72
}

const handleScroll = () => {
  if (scrollFrameId !== null) {
    return
  }

  scrollFrameId = window.requestAnimationFrame(() => {
    updateCompactState()
    scrollFrameId = null
  })
}

onMounted(() => {
  updateCompactState()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollFrameId !== null) {
    window.cancelAnimationFrame(scrollFrameId)
    scrollFrameId = null
  }
})

const currentYear = new Date().getFullYear()

const brandName = computed(() => {
  const configuredName = props.footer.brand.name?.trim() ?? ''
  if (configuredName.length > 0) {
    return configuredName
  }

  const fallbackName = props.pageTitle.trim()
  return fallbackName.length > 0 ? fallbackName : 'Website'
})

const brandIcon = computed(() => props.footer.brand.icon?.trim() ?? '')
const normalizeText = (value?: string) => value?.trim() ?? ''
const isImageIcon = (value: string) =>
  imageIconPattern.test(value) || value.startsWith('/') || value.startsWith('./') || value.startsWith('../')

const resolveIconUrl = (value: string) => {
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value
  }

  const normalizedPath = value.replace(/^\/+/, '')
  return `${import.meta.env.BASE_URL}${normalizedPath}`
}

const recordItems = computed<FooterRecordItem[]>(() => {
  const items: FooterRecordItem[] = []

  const icpNumber = normalizeText(props.footer.icp.number)
  if (props.footer.icp.enabled && icpNumber.length > 0) {
    const icpIcon = normalizeText(props.footer.icp.icon) || defaultRecordIcons.icp
    items.push({
      key: 'icp',
      label: 'ICP备案',
      number: icpNumber,
      url: normalizeText(props.footer.icp.url) || defaultRecordUrls.icp,
      icon: isImageIcon(icpIcon) ? resolveIconUrl(icpIcon) : icpIcon,
      iconType: isImageIcon(icpIcon) ? 'image' : 'symbol',
    })
  }

  const policeNumber = normalizeText(props.footer.police.number)
  if (props.footer.police.enabled && policeNumber.length > 0) {
    const policeIcon = normalizeText(props.footer.police.icon) || defaultRecordIcons.police
    items.push({
      key: 'police',
      label: '公安备案',
      number: policeNumber,
      url: normalizeText(props.footer.police.url) || defaultRecordUrls.police,
      icon: isImageIcon(policeIcon) ? resolveIconUrl(policeIcon) : policeIcon,
      iconType: isImageIcon(policeIcon) ? 'image' : 'symbol',
    })
  }

  return items
})

const showRecords = computed(() => recordItems.value.length > 0)

const copyrightText = computed(() => {
  const configuredName = props.footer.copyright.name.trim()
  const fallbackName = props.pageTitle.trim()
  const displayName = configuredName.length > 0 ? configuredName : fallbackName

  let yearText = String(currentYear)

  if (props.footer.copyright.dynamicYear) {
    const startYear = props.footer.copyright.startYear
    if (typeof startYear === 'number' && Number.isInteger(startYear) && startYear > 0 && startYear < currentYear) {
      yearText = `${startYear}-${currentYear}`
    }
  }

  return `© ${yearText} ${displayName}`
})

const linkRel = (target?: '_self' | '_blank') =>
  target === '_blank' ? 'noopener noreferrer' : undefined
</script>

<template>
  <footer class="site-footer" :class="{ 'is-compact': isCompact }" aria-label="页脚信息">
    <div class="site-footer__left">
      <span class="site-footer__brand" :aria-label="`${brandName} brand`">
        <AppIcon v-if="brandIcon" :name="brandIcon" />
        <span class="site-footer__brand-name">{{ brandName }}</span>
      </span>

      <nav v-if="footer.navigation.length > 0" class="site-footer__nav" aria-label="Footer navigation">
        <a
          v-for="item in footer.navigation"
          :key="`${item.name}-${item.url}`"
          class="site-footer__nav-item"
          :href="item.url"
          :target="item.target ?? '_blank'"
          :rel="linkRel(item.target)"
        >
          <AppIcon v-if="item.icon" :name="item.icon" />
          <span>{{ item.name }}</span>
        </a>
      </nav>
    </div>

    <p class="site-footer__center">
      <span v-if="showRecords" class="site-footer__record-list">
        <a
          v-for="item in recordItems"
          :key="item.key"
          class="site-footer__record-link"
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="item.label"
        >
          <img
            v-if="item.iconType === 'image'"
            class="site-footer__record-icon-image"
            :src="item.icon"
            alt=""
            aria-hidden="true"
          />
          <AppIcon v-else :name="item.icon" />
          <span class="site-footer__record-text">{{ item.number }}</span>
        </a>
      </span>
      <span v-else>{{ copyrightText }}</span>
    </p>
  </footer>
</template>

<style scoped>
.site-footer {
  position: fixed;
  left: 50%;
  bottom: 0.8rem;
  transform: translateX(-50%);
  width: min(1220px, 92vw);
  z-index: 50;
  display: flex;
  align-items: center;
  min-height: 3.5rem;
  padding: 0.78rem 1.2rem;
  border: 1px solid color-mix(in srgb, var(--color-card-border) 88%, white 12%);
  border-radius: var(--radius-card);
  background:
    linear-gradient(130deg, rgb(20 27 40 / 0.84), rgb(20 27 40 / 0.62)),
    linear-gradient(180deg, rgb(121 199 255 / 0.08), transparent 40%);
  box-shadow: 0 18px 42px rgb(4 8 20 / 0.42);
  animation: footer-float-in 0.45s ease-out;
  transition:
    box-shadow 0.22s ease,
    border-color 0.22s ease,
    background-color 0.22s ease;
}

.site-footer.is-compact {
  min-height: 2.8rem;
  padding: 0.52rem 1rem;
  box-shadow: 0 12px 28px rgb(4 8 20 / 0.34);
}

.site-footer.is-compact .site-footer__brand-name {
  font-size: 0.86rem;
}

.site-footer.is-compact .site-footer__nav-item {
  font-size: 0.81rem;
}

.site-footer.is-compact .site-footer__center {
  font-size: 0.84rem;
}

.site-footer__left {
  display: flex;
  align-items: center;
  gap: 0.45rem 0.95rem;
  flex-wrap: wrap;
  max-width: min(68%, 770px);
  color: var(--color-text-secondary);
}

.site-footer__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--color-text-primary);
}

.site-footer__brand-name {
  font-size: 0.93rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.site-footer__nav {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem 0.85rem;
  flex-wrap: wrap;
}

.site-footer__nav-item {
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.88rem;
  transition: color 0.2s ease;
}

.site-footer__nav-item:hover,
.site-footer__nav-item:focus-visible {
  color: color-mix(in srgb, var(--color-accent) 78%, white);
}

.site-footer__center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  display: flex;
  justify-content: center;
  max-width: min(42%, 460px);
  white-space: nowrap;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  letter-spacing: 0.015em;
  pointer-events: auto;
}

.site-footer__record-list {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem 0.9rem;
  flex-wrap: wrap;
  max-width: 100%;
}

.site-footer__record-link {
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  max-width: 100%;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px dashed transparent;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.site-footer__record-text {
  min-width: 0;
}

.site-footer__record-icon-image {
  width: 1rem;
  height: 1rem;
  flex: none;
  object-fit: contain;
}

.site-footer__record-link:hover,
.site-footer__record-link:focus-visible {
  color: color-mix(in srgb, var(--color-accent) 80%, white);
  border-color: color-mix(in srgb, var(--color-accent) 78%, white);
}

.site-footer :deep(.app-icon) {
  width: 1rem;
  height: 1rem;
}

@keyframes footer-float-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@media (max-width: 960px) {
  .site-footer {
    width: min(96vw, 740px);
    left: 50%;
    bottom: 0.5rem;
    min-height: 2.65rem;
    display: block;
    padding: 0.5rem 0.82rem;
  }

  .site-footer.is-compact {
    min-height: 2.38rem;
    padding: 0.42rem 0.72rem;
  }

  .site-footer__left {
    display: none;
  }

  .site-footer__center {
    position: static;
    transform: none;
    width: 100%;
    max-width: none;
    font-size: 0.8rem;
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    line-height: 1.4;
  }

  .site-footer__record-list {
    width: 100%;
    row-gap: 0.28rem;
  }

  .site-footer__record-link {
    max-width: 100%;
  }

  .site-footer__record-text {
    white-space: normal;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-footer {
    animation: none;
    transition: none;
  }
}
</style>
