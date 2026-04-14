import type {
  FooterConfig,
  FooterIcpConfig,
  FooterNavigationItem,
  FooterPoliceConfig,
  SiteConfig,
  SiteIconConfig,
  SiteLink,
  TimelineEntry,
} from '../types/site-config'
import { parseYaml } from './yaml-lite'

const defaultConfig: SiteConfig = {
  pageTitle: '在线服务',
  titleTyping: ['在线服务'],
  subtitle: 'Config-driven shortcut dashboard',
  siteIcon: {
    favicon: 'favicon.svg',
  },
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
  timeline: [],
  links: [],
  footer: {
    enabled: true,
    brand: {
      name: '',
      icon: '',
    },
    navigation: [],
    icp: {
      enabled: false,
      number: '',
      url: 'https://beian.miit.gov.cn/',
      icon: 'icp.png',
    },
    police: {
      enabled: false,
      number: '',
      url: 'https://beian.gov.cn/',
      icon: 'police.png',
    },
    copyright: {
      name: '',
      dynamicYear: true,
    },
  },
}

const cloneFooterConfig = (): FooterConfig => ({
  enabled: defaultConfig.footer.enabled,
  brand: {
    ...defaultConfig.footer.brand,
  },
  navigation: [...defaultConfig.footer.navigation],
  icp: {
    ...defaultConfig.footer.icp,
  },
  police: {
    ...defaultConfig.footer.police,
  },
  copyright: {
    ...defaultConfig.footer.copyright,
  },
})

const cloneSiteIconConfig = (): SiteIconConfig => ({
  ...defaultConfig.siteIcon,
})

export const createDefaultSiteConfig = (): SiteConfig => ({
  pageTitle: defaultConfig.pageTitle,
  titleTyping: [...defaultConfig.titleTyping],
  subtitle: defaultConfig.subtitle,
  siteIcon: cloneSiteIconConfig(),
  layout: {
    columns: {
      ...defaultConfig.layout.columns,
    },
  },
  typewriter: {
    ...defaultConfig.typewriter,
  },
  timeline: [],
  links: [],
  footer: cloneFooterConfig(),
})

const normalizeTimelineDate = (timestamp: string) => {
  const normalizedTimestamp = timestamp.trim()
  const parts = normalizedTimestamp.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?$/,
  )

  if (parts) {
    const year = Number(parts[1])
    const month = Number(parts[2])
    const day = Number(parts[3])
    const hours = Number(parts[4] ?? '0')
    const minutes = Number(parts[5] ?? '0')
    const seconds = Number(parts[6] ?? '0')

    const date = new Date(year, month - 1, day, hours, minutes, seconds)
    if (!Number.isNaN(date.getTime())) {
      return {
        sortValue: date.getTime(),
        displayDate: `${parts[1]}-${parts[2]}-${parts[3]}`,
      }
    }
  }

  const fallbackDate = new Date(normalizedTimestamp)
  if (Number.isNaN(fallbackDate.getTime())) {
    return null
  }

  const displayDate = [
    String(fallbackDate.getFullYear()).padStart(4, '0'),
    String(fallbackDate.getMonth() + 1).padStart(2, '0'),
    String(fallbackDate.getDate()).padStart(2, '0'),
  ].join('-')

  return {
    sortValue: fallbackDate.getTime(),
    displayDate,
  }
}

const sanitizeTimelineEntry = (input: unknown): (TimelineEntry & { sortValue: number }) | null => {
  if (!input || typeof input !== 'object') {
    return null
  }

  const candidate = input as Record<string, unknown>
  const timestamp = typeof candidate.timestamp === 'string' ? candidate.timestamp.trim() : ''
  const content = typeof candidate.content === 'string' ? candidate.content.replace(/\r\n?/g, '\n').trim() : ''

  if (!timestamp || !content) {
    return null
  }

  const normalizedDate = normalizeTimelineDate(timestamp)
  if (!normalizedDate) {
    return null
  }

  return {
    timestamp,
    displayDate: normalizedDate.displayDate,
    content,
    sortValue: normalizedDate.sortValue,
  }
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

const sanitizeFooterNavigationItem = (input: unknown): FooterNavigationItem | null => {
  if (!input || typeof input !== 'object') {
    return null
  }

  const candidate = input as Record<string, unknown>
  const name = typeof candidate.name === 'string' ? candidate.name.trim() : ''
  const url = typeof candidate.url === 'string' ? candidate.url.trim() : ''

  if (!name || !url) {
    return null
  }

  const icon = typeof candidate.icon === 'string' ? candidate.icon.trim() : undefined
  const target = candidate.target === '_self' ? '_self' : '_blank'

  return {
    name,
    url,
    icon,
    target,
  }
}

const sanitizeFooterRecord = <T extends FooterIcpConfig | FooterPoliceConfig>(input: unknown, fallback: T): T => {
  const candidate = input && typeof input === 'object' ? (input as Record<string, unknown>) : {}

  const enabled = typeof candidate.enabled === 'boolean' ? candidate.enabled : fallback.enabled
  const number = typeof candidate.number === 'string' ? candidate.number.trim() : fallback.number
  const url =
    typeof candidate.url === 'string' && candidate.url.trim().length > 0 ? candidate.url.trim() : fallback.url
  const icon =
    typeof candidate.icon === 'string' && candidate.icon.trim().length > 0 ? candidate.icon.trim() : fallback.icon

  return {
    ...fallback,
    enabled,
    number,
    url,
    icon,
  } as T
}

const sanitizeSiteIcon = (input: unknown): SiteIconConfig => {
  const candidate = input && typeof input === 'object' ? (input as Record<string, unknown>) : {}
  const favicon =
    typeof candidate.favicon === 'string' && candidate.favicon.trim().length > 0
      ? candidate.favicon.trim()
      : defaultConfig.siteIcon?.favicon

  return {
    favicon,
  }
}

const sanitizeFooter = (input: unknown, fallbackName: string): FooterConfig => {
  const fallbackFooter: FooterConfig = {
    ...defaultConfig.footer,
    brand: {
      ...defaultConfig.footer.brand,
      name: fallbackName,
    },
    icp: {
      ...defaultConfig.footer.icp,
    },
    police: {
      ...defaultConfig.footer.police,
    },
    copyright: {
      ...defaultConfig.footer.copyright,
      name: fallbackName,
    },
  }

  if (!input || typeof input !== 'object') {
    return fallbackFooter
  }

  const candidate = input as Record<string, unknown>

  const brandRaw = candidate.brand && typeof candidate.brand === 'object'
    ? (candidate.brand as Record<string, unknown>)
    : {}

  const brandName = typeof brandRaw.name === 'string' && brandRaw.name.trim().length > 0
    ? brandRaw.name.trim()
    : fallbackName

  const brandIcon = typeof brandRaw.icon === 'string' && brandRaw.icon.trim().length > 0
    ? brandRaw.icon.trim()
    : defaultConfig.footer.brand.icon

  const navigation = Array.isArray(candidate.navigation)
    ? candidate.navigation
        .map(sanitizeFooterNavigationItem)
        .filter((item): item is FooterNavigationItem => item !== null)
    : defaultConfig.footer.navigation

  const icp = sanitizeFooterRecord(candidate.icp, defaultConfig.footer.icp)
  const police = sanitizeFooterRecord(candidate.police, defaultConfig.footer.police)

  const copyrightRaw = candidate.copyright && typeof candidate.copyright === 'object'
    ? (candidate.copyright as Record<string, unknown>)
    : {}

  const copyrightName =
    typeof copyrightRaw.name === 'string' && copyrightRaw.name.trim().length > 0
      ? copyrightRaw.name.trim()
      : fallbackName

  const currentYear = new Date().getFullYear()
  const startYear = Number(copyrightRaw.startYear)
  const normalizedStartYear =
    Number.isInteger(startYear) && startYear > 0 && startYear <= currentYear ? startYear : undefined

  const dynamicYear =
    typeof copyrightRaw.dynamicYear === 'boolean'
      ? copyrightRaw.dynamicYear
      : defaultConfig.footer.copyright.dynamicYear

  return {
    enabled: typeof candidate.enabled === 'boolean' ? candidate.enabled : defaultConfig.footer.enabled,
    brand: {
      name: brandName,
      icon: brandIcon,
    },
    navigation,
    icp,
    police,
    copyright: {
      name: copyrightName,
      startYear: normalizedStartYear,
      dynamicYear,
    },
  }
}

const sanitizeConfig = (input: unknown): SiteConfig => {
  if (!input || typeof input !== 'object') {
    return createDefaultSiteConfig()
  }

  const candidate = input as Record<string, unknown>
  const timeline = Array.isArray(candidate.timeline)
    ? candidate.timeline
        .map(sanitizeTimelineEntry)
        .filter((item): item is TimelineEntry & { sortValue: number } => item !== null)
        .sort((left, right) => right.sortValue - left.sortValue)
        .map(({ sortValue: _sortValue, ...item }) => item)
    : []
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

  const pageTitle =
    typeof candidate.pageTitle === 'string' && candidate.pageTitle.trim().length > 0
      ? candidate.pageTitle
      : defaultConfig.pageTitle

  const siteIcon = sanitizeSiteIcon(candidate.siteIcon)
  const footer = sanitizeFooter(candidate.footer, pageTitle)

  return {
    pageTitle,
    titleTyping: titleTyping.length > 0 ? titleTyping : defaultConfig.titleTyping,
    subtitle: typeof candidate.subtitle === 'string' ? candidate.subtitle : defaultConfig.subtitle,
    siteIcon,
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
    timeline,
    links,
    footer,
  }
}

const warnConfigIssue = (message: string, error?: unknown) => {
  console.warn(`[site-config] ${message}`, error)
}

const resolveRuntimeUrl = (value: string) => {
  try {
    return new URL(value, document.baseURI || window.location.href)
  } catch {
    return null
  }
}

const createNoCacheRequestUrl = (value: string) => {
  const resolvedUrl = resolveRuntimeUrl(value)

  if (!resolvedUrl) {
    return value
  }

  resolvedUrl.searchParams.set('t', `${Date.now()}`)
  return resolvedUrl.toString()
}

export const loadSiteConfig = async (): Promise<SiteConfig> => {
  try {
    const configUrl = createNoCacheRequestUrl(`${import.meta.env.BASE_URL}config.yaml`)
    const response = await fetch(configUrl, { cache: 'no-store' })
    if (!response.ok) {
      warnConfigIssue('Failed to fetch public/config.yaml, falling back to default config.')
      return createDefaultSiteConfig()
    }

    const payload = parseYaml(await response.text()) as unknown
    return sanitizeConfig(payload)
  } catch (error) {
    warnConfigIssue('Failed to parse public/config.yaml, falling back to default config.', error)
    return createDefaultSiteConfig()
  }
}
