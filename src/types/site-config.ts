export interface TypewriterConfig {
  typeSpeed: number
  backSpeed: number
  backDelay: number
  startDelay: number
  loop: boolean
  cursorChar: string
}

export interface GridColumns {
  desktop: number
  tablet: number
  mobile: number
}

export interface GridLayoutConfig {
  columns: GridColumns
}

export interface SiteLink {
  name: string
  url: string
  icon?: string
  target?: '_self' | '_blank'
  highlighted?: boolean
}

export interface TimelineEntry {
  timestamp: string
  displayDate: string
  content: string
}

export interface FooterBrandConfig {
  name?: string
  icon?: string
}

export interface FooterNavigationItem {
  name: string
  url: string
  icon?: string
  target?: '_self' | '_blank'
}

export interface FooterIcpConfig {
  enabled: boolean
  number: string
  url?: string
  icon?: string
}

export interface FooterPoliceConfig {
  enabled: boolean
  number: string
  url?: string
  icon?: string
}

export interface FooterCopyrightConfig {
  name: string
  startYear?: number
  dynamicYear: boolean
}

export interface FooterConfig {
  enabled: boolean
  brand: FooterBrandConfig
  navigation: FooterNavigationItem[]
  icp: FooterIcpConfig
  police: FooterPoliceConfig
  copyright: FooterCopyrightConfig
}

export interface SiteConfig {
  pageTitle: string
  titleTyping: string[]
  subtitle?: string
  layout: GridLayoutConfig
  typewriter: TypewriterConfig
  timeline: TimelineEntry[]
  links: SiteLink[]
  footer: FooterConfig
}
