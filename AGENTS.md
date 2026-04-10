# AGENTS

## 1. 项目目标

本项目是一个纯前端个人主页导航站。
所有跳转入口和时间线内容由 `public/config.yaml` 配置驱动生成，不依赖后端接口。

## 2. 技术栈约束

- Framework: Vue 3
- Build Tool: Vite
- Language: TypeScript
- Animation: typed.js
- Styling: 原生 CSS + CSS Variables

禁止在未讨论的情况下引入以下内容：

- 后端接口、数据库、SSR
- 复杂状态管理库
- 与需求无关的 UI 框架

## 3. 目录规范

```text
HomePage/
├── public/
│   └── config.yaml           # 站点配置（运行时读取）
├── src/
│   ├── components/           # 组件目录
│   ├── lib/                  # 业务工具和配置加载
│   ├── styles/               # 全局样式和主题变量
│   ├── types/                # TypeScript 类型定义
│   ├── App.vue
│   └── main.ts
├── 技术框架方案.md            # 技术决策文档
├── 开发计划.md               # 实施文档
└── AGENTS.md                # 规范文档（本文件）
```

## 4. 配置文件规范

`public/config.yaml` 必须满足：

- `pageTitle`: string
- `titleTyping`: string[]
- `subtitle`: string
- `layout.columns.desktop/tablet/mobile`: number
- `typewriter`: object
- `timeline`: array
- `links`: array

`timeline` 每项建议字段：

- `timestamp`: 时间字符串（必填，建议始终加引号）
- `content`: 文案内容（必填，推荐使用 YAML `|` 多行块文本）

`links` 每项建议字段：

- `name`: 按钮文本（必填）
- `url`: 跳转地址（必填）
- `icon`: 图标键（可选）
- `target`: `_blank | _self`（可选）
- `highlighted`: boolean（可选）

## 5. 组件设计规范

- `App.vue`: 页面编排，不写复杂业务逻辑。
- `TypewriterTitle.vue`: 只负责标题动效和降级。
- `TimelineSection.vue`: 只负责时间线布局和渲染。
- `InlineRichText.vue`: 只负责时间线文案轻量格式渲染。
- `LinkGrid.vue`: 只负责网格布局。
- `LinkCard.vue`: 只负责单卡片渲染与跳转交互。
- `AppIcon.vue`: 只负责图标渲染。

组件职责必须单一，避免在一个组件内同时承担数据加载和复杂展示逻辑。

## 6. 样式规范

- 主题变量统一放在 `src/styles/tokens.css`。
- 全局基础样式统一放在 `src/styles/base.css`。
- 组件样式优先使用 `scoped`。
- 保持视觉风格：轻网格背景、低对比边框、明确 hover 反馈。

## 7. 开发与构建命令

- 安装依赖：`pnpm install`
- 本地开发：`pnpm dev`
- 类型检查：`pnpm typecheck`
- 生产构建：`pnpm build`
- 本地预览：`pnpm preview`

## 8. 质量门禁

每次变更后至少执行：

1. `pnpm typecheck`
2. `pnpm build`

并手动检查：

- 配置改动后时间线是否正确排序、日期是否仅显示到日
- 配置改动后按钮是否正确渲染
- 打字机效果是否正常
- 移动端布局是否不溢出

## 9. 提交与文档规范

- 任何影响实现方式的改动，需同步更新 `开发计划.md` 或 `技术框架方案.md`。
- 不做与当前需求无关的大规模重构。
- 新增依赖需说明理由与替代方案。

## 10. 部署规范（Nginx）

- 发布目录：`dist/`
- 站点类型：纯静态站点
- 不依赖 Node.js 运行时，不依赖后端接口
