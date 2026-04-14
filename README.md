# minimal-homepage

配置驱动的极简个人主页模板（单页、纯前端、可静态部署）。

[中文详细文档](docs/README.md) | [English Docs](docs/README.en.md)

## 项目亮点

- 单页极简：聚焦导航入口展示，结构清晰、维护成本低。
- 配置驱动：通过 `public/config.yaml` 管理标题、时间线与跳转按钮。
- 网站图标配置化：支持通过配置切换浏览器标签页 favicon，并保留默认图标兜底。
- YAML 友好：支持多行时间线文案编写，更适合持续补充主页内容。
- 页脚可配置：支持品牌图标、Footer navigation、ICP备案/公安备案与版权文案。
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
补充：`pnpm preview` 读取的是 `dist/` 构建产物；当前构建流程会保留已存在的 `dist/config.yaml`，所以本地预览优先看到的是该文件内容。

## Footer 配置（ICP备案/公安备案/版权/导航）

`public/config.yaml` 可新增 `siteIcon`、`footer` 与 `timeline` 字段：

```yaml
siteIcon:
  favicon: favicon-smile.svg

timeline:
  - timestamp: "2026-04-10 13:45:32"
    content: |
      上线 **时间线** 首版
      支持 *多行文案* 与 `行内代码`

footer:
  enabled: true
  brand:
    name: My Home Services
    icon: home
  navigation:
    - name: 关于本站
      url: https://example.com/about
      icon: notebook
      target: "_blank"
  icp:
    enabled: true
    number: 粤ICP备12345678号-1
    url: https://beian.miit.gov.cn/
    icon: icp.png
  police:
    enabled: true
    number: 粤公网安备44030002001234号
    url: https://beian.gov.cn/
    icon: police.png
  copyright:
    name: example. All rights reserved.
    startYear: 2023
    dynamicYear: true
```

行为规则：

- `siteIcon.favicon` 用于配置浏览器标签页 favicon，未配置时默认回退到 `favicon.svg`。
- `timeline` 支持按秒配置时间，页面仅显示到日，最新时间排在最上方。
- `timeline.content` 推荐使用 YAML 的 `|` 多行块文本。
- `footer.icp` 与 `footer.police` 都支持 `enabled / number / url / icon`，`icon` 可填 `public/` 下图片资源名，或继续复用 `AppIcon` 图标键。
- 任一备案启用且号码非空时：页脚中间按顺序显示可用备案项，并在文字前展示图标。
- 两类备案都未启用或号码为空时：页脚中间显示 `© 年份 web_name`，其中 `web_name` 来自 `footer.copyright.name`。
- 默认示例使用 `icp.png` 与 `police.png` 两个备案图片资源。
- 年份由原生 `Date` 计算，不需要引入任何第三方插件。
- 若修改 `public/config.yaml` 后本地 `preview` 未生效，优先检查 `dist/config.yaml` 是否仍是旧内容，而不是先判断页面未读取配置。

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
