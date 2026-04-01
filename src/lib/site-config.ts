import type { SiteConfig, SiteLink } from '../types/site-config'

const defaultConfig: SiteConfig = {
  pageTitle: '在线服务',
  titleTyping: ['在线服务'],
  subtitle: 'Config-driven shortcut dashboard',
  layout: {
    columns: {
      desktop: 3,
      tablet: 2,
      mobile: 1,
    },
  },
  typewriter: {
    typeSpeed: 90,
    backSpeed: 45,
    backDelay: 1600,
    startDelay: 250,
    loop: true,
    cursorChar: '_',
  },
  links: [],
}

const sanitizeLink = (input: unknown): SiteLink | null => {
  if (!input || typeof input !== 'object') {
    return null
  }

  const candidate = input as Record<string, unknown>
  const name = typeof candidate.name === 'string' ? candidate.name.trim() : ''
  const url = typeof candidate.url === 'string' ? candidate.url.trim() : ''

  if (!name || !url) {
    return null
  }

  const icon = typeof candidate.icon === 'string' ? candidate.icon : undefined
  const target = candidate.target === '_self' ? '_self' : '_blank'
  const highlighted = Boolean(candidate.highlighted)

  return {
    name,
    url,
    icon,
    target,
    highlighted,
  }
}

const sanitizeConfig = (input: unknown): SiteConfig => {
  if (!input || typeof input !== 'object') {
    return defaultConfig
  }

  const candidate = input as Record<string, unknown>
  const links = Array.isArray(candidate.links)
    ? candidate.links.map(sanitizeLink).filter((item): item is SiteLink => item !== null)
    : []

  const desktop = Number(candidate.layout && typeof candidate.layout === 'object' && (candidate.layout as Record<string, unknown>).columns && typeof (candidate.layout as Record<string, unknown>).columns === 'object' && ((candidate.layout as Record<string, unknown>).columns as Record<string, unknown>).desktop)
  const tablet = Number(candidate.layout && typeof candidate.layout === 'object' && (candidate.layout as Record<string, unknown>).columns && typeof (candidate.layout as Record<string, unknown>).columns === 'object' && ((candidate.layout as Record<string, unknown>).columns as Record<string, unknown>).tablet)
  const mobile = Number(candidate.layout && typeof candidate.layout === 'object' && (candidate.layout as Record<string, unknown>).columns && typeof (candidate.layout as Record<string, unknown>).columns === 'object' && ((candidate.layout as Record<string, unknown>).columns as Record<string, unknown>).mobile)

  const titleTyping = Array.isArray(candidate.titleTyping)
    ? candidate.titleTyping.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : []

  const typewriterRaw =
    candidate.typewriter && typeof candidate.typewriter === 'object'
      ? (candidate.typewriter as Record<string, unknown>)
      : {}

  return {
    pageTitle:
      typeof candidate.pageTitle === 'string' && candidate.pageTitle.trim().length > 0
        ? candidate.pageTitle
        : defaultConfig.pageTitle,
    titleTyping: titleTyping.length > 0 ? titleTyping : defaultConfig.titleTyping,
    subtitle: typeof candidate.subtitle === 'string' ? candidate.subtitle : defaultConfig.subtitle,
    layout: {
      columns: {
        desktop: Number.isFinite(desktop) && desktop > 0 ? desktop : defaultConfig.layout.columns.desktop,
        tablet: Number.isFinite(tablet) && tablet > 0 ? tablet : defaultConfig.layout.columns.tablet,
        mobile: Number.isFinite(mobile) && mobile > 0 ? mobile : defaultConfig.layout.columns.mobile,
      },
    },
    typewriter: {
      typeSpeed:
        Number.isFinite(Number(typewriterRaw.typeSpeed)) && Number(typewriterRaw.typeSpeed) >= 0
          ? Number(typewriterRaw.typeSpeed)
          : defaultConfig.typewriter.typeSpeed,
      backSpeed:
        Number.isFinite(Number(typewriterRaw.backSpeed)) && Number(typewriterRaw.backSpeed) >= 0
          ? Number(typewriterRaw.backSpeed)
          : defaultConfig.typewriter.backSpeed,
      backDelay:
        Number.isFinite(Number(typewriterRaw.backDelay)) && Number(typewriterRaw.backDelay) >= 0
          ? Number(typewriterRaw.backDelay)
          : defaultConfig.typewriter.backDelay,
      startDelay:
        Number.isFinite(Number(typewriterRaw.startDelay)) && Number(typewriterRaw.startDelay) >= 0
          ? Number(typewriterRaw.startDelay)
          : defaultConfig.typewriter.startDelay,
      loop: typeof typewriterRaw.loop === 'boolean' ? typewriterRaw.loop : defaultConfig.typewriter.loop,
      cursorChar:
        typeof typewriterRaw.cursorChar === 'string' && typewriterRaw.cursorChar.length > 0
          ? typewriterRaw.cursorChar
          : defaultConfig.typewriter.cursorChar,
    },
    links,
  }
}

export const loadSiteConfig = async (): Promise<SiteConfig> => {
  try {
    const response = await fetch(import.meta.env.BASE_URL + 'config.json', { cache: 'no-store' })
    if (!response.ok) {
      return defaultConfig
    }

    const payload = (await response.json()) as unknown
    return sanitizeConfig(payload)
  } catch {
    return defaultConfig
  }
}
