# PrintCost Studio 当前部署与验证

- 当前 Cloudflare Pages 地址：https://3d-printing-1r7.pages.dev/
- GitHub 仓库：https://github.com/garrison2025/3D-Printing
- main 为发布分支，Cloudflare Pages 接入仓库后自动构建。
- SITE_URL 可不填：Cloudflare main 构建默认采用当前稳定 Pages 域名；本地和非 main 预览分支 noindex。将来买正式域名后，在 Cloudflare 环境变量中设置 SITE_URL 为新 HTTPS 根地址并重新部署。

## 每次代码更新后

1. GitHub Actions → Code, math and SEO quality：确认最新 commit 测试、构建、静态 SEO 均通过。
2. Cloudflare → Workers & Pages → 对应项目 → Deployments：核对最新 commit 已发布。
3. GitHub Actions → Audit live Cloudflare Pages → Run workflow：输入 https://3d-printing-1r7.pages.dev 后运行；核对响应、noindex、canonical、Sitemap、robots、静态资源和真实404。只读，无付费 API。
4. 使用 Chrome DevTools → Lighthouse 分别运行 Mobile/Desktop 测试，保留实测性能、无障碍和 SEO 报告。不要把本地脚本分数当成 Lighthouse。
5. 如已验证 GSC 属性，用 URL Inspection 对首页和两篇指南进行 Test live URL，提交 sitemap。

## Windows 本地运行

使用 Node.js 20+，在仓库根目录运行 npm test、npm run build、node scripts/audit.mjs。通过 npm run preview 在 http://localhost:4173 查看。离线预览文件不是线上 SEO 证明。

## 质量边界

- 不虚构网站经营者、收入、客户评价。
- 未集成广告；上线后接入 AdSense 前需更新隐私声明及相关同意管理。
- 计算器参数在浏览器处理；真实机型、切片时间和耗材质量需由用户提供。
