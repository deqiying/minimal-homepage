# minimal-homepage

一个配置驱动的极简个人主页项目。

它是单页前端站点，支持通过配置文件生成导航按钮，默认黑暗风视觉，标题支持打字机效果，构建产物为纯静态文件，可直接部署到 Nginx 或其他静态托管服务。

## 特性

- 配置驱动：通过 public/config.json 管理页面文案和跳转入口。
- 页脚配置化：支持网站图标、Footer navigation、备案号与版权文案切换。
- 单页极简：聚焦个人主页导航，不依赖后端接口。
- 响应式布局：支持桌面端、平板端、移动端。
- 打字机标题：基于 typed.js 实现，支持 reduced-motion 降级。
- 纯静态部署：构建后仅输出 html/js/css 与静态资源。

## 技术栈

| 维度 | 方案 |
| ---- | ---- |
| 前端框架 | Vue 3 |
| 构建工具 | Vite |
| 语言 | TypeScript |
| 动效 | typed.js |
| 样式 | 原生 CSS + CSS Variables |

## 目录结构

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

## 快速开始

### 1) 安装依赖

~~~bash
pnpm install
~~~

### 2) 本地开发

~~~bash
pnpm dev
~~~

### 3) 类型检查

~~~bash
pnpm typecheck
~~~

### 4) 构建静态产物

~~~bash
pnpm build
~~~

### 5) 本地预览（HTTP）

~~~bash
pnpm preview
~~~

注意：请通过 HTTP 服务访问构建产物。直接使用 file:// 打开 dist/index.html 可能导致空白页。

## 配置文件

主配置文件为 public/config.json，核心字段如下：

- pageTitle: 页面标题。
- titleTyping: 标题打字机文案数组。
- subtitle: 副标题。
- layout.columns.desktop/tablet/mobile: 不同端的网格列数。
- typewriter: 打字机参数（速度、延迟、循环等）。
- links: 导航按钮数组。
- footer: 页脚配置（图标、导航、备案号、版权）。

links 每项建议字段：

- name: 按钮名称（必填）。
- url: 跳转链接（必填）。
- icon: 图标键（可选）。
- target: \_blank 或 \_self（可选）。
- highlighted: 是否高亮（可选）。

footer 推荐字段：

- enabled: 是否显示页脚（可选，默认 true）。
- brand.name: 网站品牌名（可选，默认回退 pageTitle）。
- brand.icon: 网站图标键（可选，复用 AppIcon 图标名）。
- navigation: 页脚导航数组（可选，支持 name/url/icon/target）。
- icp.enabled: 是否启用备案号显示。
- icp.number: 备案号文本。
- icp.url: 备案号跳转地址（默认工信部地址）。
- copyright.name: 版权名称（未配置时回退 pageTitle）。
- copyright.startYear: 起始年份（可选）。
- copyright.dynamicYear: 是否使用动态年份（推荐 true）。

页脚中间文案规则：

- 当 `icp.enabled=true` 且 `icp.number` 非空时，居中显示备案号。
- 否则居中显示 `© 年份 web_name`。
- 年份使用原生 `Date` 计算，无需额外插件。

## 部署（纯静态）

### 推荐流程

1. 在构建机执行 pnpm build。
2. 将 dist 目录上传到服务器。
3. 由 Nginx（或任意静态服务器）直接托管 dist。

### 关键说明

- 生产环境无需运行 pnpm dev。
- 生产环境无需 Node.js 常驻进程。
- 只需要可提供静态文件的 HTTP 服务。

## 常见问题

### 为什么直接打开 dist/index.html 会白屏？

因为浏览器在 file:// 协议下对模块与资源加载有额外限制。请使用 pnpm preview 或 Nginx 访问。

### 修改站点入口要改代码吗？

通常不需要。新增、删除、调整跳转入口优先修改 public/config.json。

## 文档

- 中文 README：docs/README.md
- English README: docs/README.en.md
- 仓库描述建议：docs/repo-description.md
