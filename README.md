# YC · Personal Website

YC（林羿辰 / Yi-Chen Lin）的**个人品牌主页**——整个「YC」身份的门面。一个温暖、手作感、「不像 AI」的单页网站，介绍我是谁、在做什么、看重什么，以及 YC 这个角色的世界。

> 认真生活，浪漫创作。· Live earnestly, create romantically. ♥

线上地址：通过 **GitHub Pages** 部署（见下方 *Deploy*）。

## 这个仓库是什么

这是部署上线的那一版个人网站本体。技术栈是 **React + TypeScript + Vite + Tailwind**，按 section 拆成组件，方便后续扩展（路由、CMS、更多板块）。视觉与文案围绕 YC 的个人品牌——理性与浪漫共存、用工程思维把事情做扎实、把浪漫留在细节里。

主要板块：Hero（自我介绍 + 轮播身份词）、About（YC 的小世界 + 多造型）、Now（正在做 / 正在学 / 最近想说）、Work（AI / 设计 / 音乐 / 阅读 / 生活五条创作方向）、Values（我看重什么）。

## 目录结构

```text
app/                  React + TS + Vite 应用（运行时唯一真源）
  src/components/*     每个页面 section 一个组件（Hero / About / Now / Work …）
  src/effects.ts       所有交互（自定义光标、视差、计数、灯箱、彩蛋…）
  src/styles.css       手写样式，保证像素级一致的观感
  src/data.ts          场景 / 身份词等内容数据
  public/assets/*       图片、视频等静态资源
.github/workflows/    GitHub Pages 自动部署
```

> 应用层更详细的开发说明见 [`app/README.md`](app/README.md)。

## Run it

```bash
cd app
npm install      # 首次
npm run dev      # 本地开发 http://localhost:5173
npm run build    # 生产构建 → app/dist
npm run preview  # 本地预览生产构建
```

## Deploy

`main` 分支每次 push 触发 `.github/workflows/deploy.yml`：`npm ci && npm run build`，把 `app/dist` 发布到 **GitHub Pages**。

## 版权 · License

© 2026 Yi-Chen Lin（林羿辰 / **YC**）。**保留一切权利 / All Rights Reserved.**

本仓库为 YC 的个人作品，**版权归 YC 所有**。源码、文案、设计与图像素材公开仅供浏览与参考，**未经书面许可，不得复制、修改、再分发或用于商业用途**。「YC」角色形象、画风与品牌资产为 YC 专有，**不在任何开源 / 共享授权范围内**。

This is YC's personal website. The source is public for viewing only — no
copying, modifying, redistribution, or commercial use without written
permission. The YC character, art style, and brand assets are proprietary and
are **not** open-source or shared. See [LICENSE](LICENSE) · Contact:
yichen.lin.2004@gmail.com
