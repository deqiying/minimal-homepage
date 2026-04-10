# minimal-homepage

A config-driven minimal personal homepage project.

This is a single-page frontend site that generates navigation cards and a vertical timeline from a YAML config, ships with a dark visual style by default, includes a typewriter title effect, and builds to pure static assets for easy deployment.

## Features

- Config-driven: manage title text, timeline entries, and links in public/config.yaml.
- Better multiline authoring: timeline content uses YAML block text for easier editing.
- Configurable footer: supports brand icon, footer navigation, ICP record, public security record, and copyright text.
- Minimal single-page architecture: no backend APIs required.
- Responsive layout: desktop, tablet, and mobile ready.
- Typewriter title: powered by typed.js with reduced-motion fallback.
- Pure static deployment: outputs only html/js/css and static assets.

## Tech Stack

| Area | Choice |
| ---- | ---- |
| Framework | Vue 3 |
| Build Tool | Vite |
| Language | TypeScript |
| Animation | typed.js |
| Styling | Native CSS + CSS Variables |

## Project Structure

~~~text
minimal-homepage/
├── docs/
│   ├── README.md
│   ├── README.en.md
│   └── repo-description.md
├── public/
│   └── config.yaml
├── src/
│   ├── components/
│   ├── lib/
│   ├── styles/
│   ├── types/
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── vite.config.ts
├── 技术框架方案.md
├── 开发计划.md
└── AGENTS.md
~~~

## Getting Started

### 1) Install dependencies

~~~bash
pnpm install
~~~

### 2) Run dev server

~~~bash
pnpm dev
~~~

### 3) Type check

~~~bash
pnpm typecheck
~~~

### 4) Build for production

~~~bash
pnpm build
~~~

### 5) Preview over HTTP

~~~bash
pnpm preview
~~~

Important: access the built app via HTTP. Opening dist/index.html with file:// may result in a blank page.

## Configuration

Main config file: public/config.yaml.

Key fields:

- pageTitle: main page title.
- titleTyping: typewriter strings array.
- subtitle: subtitle text.
- layout.columns.desktop/tablet/mobile: responsive grid columns.
- typewriter: typing behavior options.
- timeline: timeline entry list.
- links: list of navigation items.
- footer: footer settings (brand, navigation, ICP record, public security record, copyright).

Recommended fields for each timeline item:

- timestamp: quoted datetime string, ideally with second-level precision.
- content: timeline copy, preferably using YAML block text with `|`.
- UI shows only `YYYY-MM-DD`, while sorting keeps the full timestamp.

Recommended fields for each link item:

- name: display text (required).
- url: target URL (required).
- icon: icon key (optional).
- target: \_blank or \_self (optional).
- highlighted: highlighted style flag (optional).

Recommended fields for footer:

- enabled: whether to render footer (optional, default true).
- brand.name: brand name (optional, falls back to pageTitle).
- brand.icon: built-in AppIcon key for brand icon (optional).
- navigation: footer navigation array (optional, supports name/url/icon/target).
- icp.enabled: toggle ICP record display.
- icp.number: ICP record text.
- icp.url: ICP target URL (defaults to MIIT website).
- icp.icon: ICP icon asset name in `public/` or AppIcon key (defaults to `icp.png`).
- police.enabled: toggle public security record display.
- police.number: public security record text.
- police.url: public security target URL (defaults to `https://beian.gov.cn/`).
- police.icon: public security icon asset name in `public/` or AppIcon key (defaults to `police.png`).
- copyright.name: copyright holder/web name.
- copyright.startYear: starting year (optional).
- copyright.dynamicYear: enable dynamic year rendering.

Supported lightweight formatting:

- `**bold**`
- `*italic*`
- `~~strikethrough~~`
- `` `inline code` ``
- line breaks

Center text behavior:

- If either `icp` or `police` is enabled and has a non-empty record number, show the available record links in the center with icons.
- If both are available, render them in `icp` then `police` order.
- Otherwise show `© year web_name` in the center.
- Year is computed with native `Date`, no extra plugin required.

## Deployment (Pure Static)

### Recommended steps

1. Run pnpm build on your build machine.
2. Upload the dist folder to your server.
3. Serve dist with Nginx (or any static HTTP server).

### Notes

- No pnpm dev in production.
- No long-running Node.js process required.
- Only a static HTTP server is needed.

## FAQ

### Why do I get a blank page when opening dist/index.html directly?

Because file:// has stricter loading behavior for module assets. Use pnpm preview or an HTTP server like Nginx.

### Do I need to change source code when adding links?

Usually no. Update public/config.yaml first.

## Docs

- Chinese README: docs/README.md
- English README: docs/README.en.md
- Repository description suggestions: docs/repo-description.md
