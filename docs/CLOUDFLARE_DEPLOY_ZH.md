# Cloudflare Pages 部署操作说明

> 现在交付的是已生成的源码及静态构建，不是已经上线的网站。正式域名、联系渠道、浏览器 QA 尚未确认。

## A. 从 GitHub 连接 Cloudflare Pages（推荐）

1. 将本 ZIP 解压，保留 package.json、scripts、src、public 等目录。
2. 把解压后的项目目录提交到你的 GitHub 仓库；不要只上传 `dist`，否则每次更新需要人工重建。
3. Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git。
4. 选择新项目仓库，Build command 填 `npm run build`，Build output directory 填 `dist`，Framework preset 选 `None`。
5. Environment variables 中添加：`SITE_URL` = **你自己确认的最终正式站点地址**，例如 `https://你的正式域名`。不要直接使用示例。本站构建器通过它生成 canonical、sitemap、OG URL 以及发布版 index/follow。
6. 连接自有域名并配置 DNS/HTTPS。更改 SITE_URL 后重新部署，避免 canonical 指向旧域名。
7. 上线前补全实际可用的联系地址或 issue tracker，并同步修订 Contact 页面、Privacy 页面；然后执行手机/桌面浏览器验收。
8. 正式网页核查：`robots.txt`、`sitemap.xml`、首页及指南返回 200、canonical 指向最终域名、未知路由返回 404、计算和 CSV/打印能真实运行。
9. 在 Google Search Console 验证域名并提交 sitemap。不要把 Search Console 验证码硬编码到未授权仓库。

## B. Windows 电脑本地预览

- **最快看界面**：双击 `preview-offline.html`；这是首页的单文件预览，不代表已进行浏览器自动化验收，指南链接在离线文件模式下不会完整呈现样式。
- **看完整网站**：安装 Node.js 20+，PowerShell 在项目目录执行 `npm run build`、`npm run preview`，Chrome 打开 http://localhost:4173 。项目没有第三方 npm 依赖。
- `SITE_URL` 未设置时默认生成 `noindex` 本地预览，这是刻意的安全机制，不要把此状态的 dist 目录作为正式可索引站点上传。

## C. 重要提醒

- 不得虚构网站作者、公司、真实付款/广告数据。
- 目前没有接入广告、统计或其他脚本。如果要接入 AdSense，先检查隐私说明、当地用户同意要求，并实测广告是否影响工具首屏和手机 Core Web Vitals。
- 网站当前只有一个核心计算器首页与两篇真正不同的指南索引页面，完整覆盖在研究矩阵内审批的关键词意图；不可仅为了多页面而批量生产薄内容。
