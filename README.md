# minimal-homepage

配置驱动的极简个人主页模板（单页、纯前端、可静态部署）。

[中文详细文档](docs/README.md) | [English Docs](docs/README.en.md)

## 项目亮点

- 单页极简：聚焦导航入口展示，结构清晰、维护成本低。
- 配置驱动：通过 `public/config.json` 管理标题与跳转按钮。
- 默认黑暗风：适合个人主页与开发者风格场景。
- 打字机效果：标题支持 typewriter 动效并兼容 reduced-motion。
- 纯静态部署：构建后仅产出 `dist/`，无需后端服务。

## 技术栈

- Vue 3
- Vite
- TypeScript
- typed.js
- 原生 CSS + CSS Variables

## 快速开始

### 1) 安装依赖

```bash
pnpm install
```

### 2) 本地开发

```bash
pnpm dev
```

### 3) 构建生产版本

```bash
pnpm build
```

### 4) 本地预览构建产物

```bash
pnpm preview
```

注意：请通过 HTTP 访问构建产物，不建议直接用 `file://` 打开 `dist/index.html`。

## 部署说明（静态服务器）

1. 执行 `pnpm build`。
2. 上传 `dist/` 到服务器。
3. 使用 Nginx（或任意静态服务器）托管 `dist/`。

## 文档导航

- 中文文档：`docs/README.md`
- English documentation: `docs/README.en.md`
- 仓库描述建议：`docs/repo-description.md`

## 适用场景

- 个人主页导航页
- 轻量内网入口页
- 无后端的静态展示页
