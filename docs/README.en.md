# minimal-homepage

A config-driven minimal personal homepage project.

This is a single-page frontend site that generates navigation cards from a JSON config, ships with a dark visual style by default, includes a typewriter title effect, and builds to pure static assets for easy deployment.

## Features

- Config-driven: manage title text and links in public/config.json.
- Configurable footer: supports brand icon, footer navigation, ICP record switch, and copyright text.
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
│   └── config.json
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

Main config file: public/config.json.

Key fields:

- pageTitle: main page title.
- titleTyping: typewriter strings array.
- subtitle: subtitle text.
- layout.columns.desktop/tablet/mobile: responsive grid columns.
- typewriter: typing behavior options.
- links: list of navigation items.
- footer: footer settings (brand, navigation, ICP record, copyright).

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
- copyright.name: copyright holder/web name.
- copyright.startYear: starting year (optional).
- copyright.dynamicYear: enable dynamic year rendering.

Center text behavior:

- If `icp.enabled=true` and `icp.number` is not empty, show ICP text in the center.
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

Usually no. Update public/config.json first.

## Docs

- Chinese README: docs/README.md
- English README: docs/README.en.md
- Repository description suggestions: docs/repo-description.md
