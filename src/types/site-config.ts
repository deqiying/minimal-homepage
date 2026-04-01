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

export interface SiteConfig {
  pageTitle: string
  titleTyping: string[]
  subtitle?: string
  layout: GridLayoutConfig
  typewriter: TypewriterConfig
  links: SiteLink[]
}
