# 3D Printing Cost & Pricing Tools — 完整建站与交付方案 V1.1｜完整关键词数据入册

- 方案日期：2026-11-02；**V1.1 关键词明细补充版**
- 状态：**设计方案完成；开发、部署、实际 QA 尚未执行**
- 目标：美国英语市场；新建、纯前端、无需登录、无需付费 API 的 3D 打印成本及商业报价工具站
- 工作名称（非已确认品牌/域名）：**PrintCost Studio**。最终品牌、域名及运营者信息由站点所有者确定；不得自动冒用他人品牌。
- 研究依据：用户 Semrush 美国数据库截图；`3D_Printing_Competitor_Keyword_Matrix_20261102.xlsx`（296条位置记录、131个去重词：P0 25、P1 62、P2 7、排除37）。**完整131词的搜索量/KD/CPC/排名/预估流量/页面映射已直接写入本方案第13节；无需额外打开 Excel 才能执行。** **这些只属于所提供的导出，不是市场全部关键词。**
- 项目规范：`https://github.com/chenmu2024/Website-Starter-Standard`（2026-11-02已读取最新 README/BUILD-INTAKE-CONTRACT/DESIGN/QA 等）；需求判断与项目落地遵守 `https://github.com/chenmu2024/gefei-seo`。

## 01. 决策和产品边界

### 确定做什么

一个可立即使用、无需注册的 3D 打印成本及报价工作台，帮助 FDM 打印者输入切片软件提供的耗材克数、打印时间、材料价格、机器及电价、人工和商业费用，得到：

1. 每板打印基础成本、失败率调整后的每件成功品期望成本；
2. 每件成本构成（材料/电力/机器折旧/人工/耗材或包装）；
3. 以用户设定的目标**利润率 Margin**计算建议销售价；支持**加价率 Markup**对照；
4. 商业费用（平台百分比、每笔固定费、包装、运费）分项显示；
5. 单位费用（每克材料成本、每小时机器成本）；
6. 当前报价的 CSV 导出、打印友好报价单、本地保存和一键重置。

**明确不做**：打印机交易商城、STL 模型库、付费 AI、用户账户系统、服务器存档、持续抓取耗材价格、实时物流/平台费率 API、未经验证的自动切片与精准耗材估算、不确定的商业收入承诺。

首版支持 FDM/FFF 的正式计算；树脂 SLA 模式只有在公式、测试与资料足够时才上线（可以采用同一个入口切换，但不得展示不完整按钮）。**不为未来功能预先创建可索引的空页面。**

### 核心用户旅程

自然搜索进入首页 → 首屏看到工具和输入说明 → 选择材料/输入实际切片数值 → 结果立即刷新 → 选择成本或售价视图 → 查看公式/假设 → 可复制/导出/打印 → 使用指南或返回修改参数。默认无需注册和上传。

## 02. 竞争依据与差异化

| 竞品 | 主要学习点 | 必须超越的方面 | 不得复制的内容 |
|---|---|---|---|
| `https://printpal.io/tools/3d-print-cost-calculator` | 极简、低阻力的输入与输出；3个主词排名靠前 | 完整的失败率处理、精确的报价公式、可验证的默认值和批量分摊 | 品牌、文案、UI、代码、素材 |
| `https://3dprintingcostcalculator.com/` | FDM/Resin输入、成本分解、打印报价 | 让基础用户不被高级设置淹没；把利润率/加价率讲清 | 品牌、价格声明、模板与设计 |
| `https://3dprintforce.com/3d-printing-calculator` | 商家人工、包装、物流、平台费用 | 不登录就能导出并查看净利润、费用归属 | 商家收费文案、平台费率假设 |

以上功能来自2026-11-02核查的公开页面；搜索排名与数量来自用户的 Semrush 文件，不能据此保证本站排名或收入。

独立价值主张：**“Calculate a true print cost and a profitable selling price — with transparent formulas, no signup, and files staying on your device.”** 仅在实际网络请求/存储检查通过后才能公布最后一项隐私断言；如加载分析、广告脚本，披露准确行为。

## 03. SEO 信息架构（冻结初版）

| 路由 | 主用户意图 | 目标词（美国月量/KD，来自用户导出） | 页型/是否索引 | 说明 |
|---|---|---|---|---|
| `/` | 计算3D打印成本、价格、耗材 | `3d print cost calculator` 2400/18；`3d printing cost calculator` 1600/13；`calculate cost of 3d printing` 1900/18 | **核心工具、index** | 价格、材料、小时模式是工具内状态，不额外创建同义词 URL |
| `/how-much-does-3d-printing-cost/` | 解答“打印一件东西多少钱” | `how much does 3d printing cost` 1600/19；`how much does it cost to 3d print` 880/21 | **有计算算例的独特指南、index** | 使用明确成本例子，嵌入/链接工具；需要真正回答问题 |
| `/how-to-price-3d-prints/` | 打印品商业报价及利润 | `how to price 3d printed items` 170/18；`how to price 3d print` 210/22 | **有差异化定价示例的指南、index 但发布前检查意图** | 手动配置平台费用，不宣称官方实时费率 |
| `/about/` `/privacy/` `/contact/` | 信任、透明度、联系 | 不做 SEO 批量占位 | **支持页；按真实内容设置索引** | 联系方式不得虚构 |

`/3d-print-pricing-calculator/`、`/filament-cost-calculator/`、`/resin-print-cost-calculator/`：**不在首批 Sitemap 中**；只有真正不同工具与独立 SERP 证据才可列入。对于 URL 参数，计算模式状态使用非索引的 hash 或本地内存，不应出现多个参数变体的可索引重复 URL。

### 首页标题/Meta 建议（最终品牌确定后微调）

- Title：`3D Print Cost Calculator — Filament, Electricity & Pricing`
- H1：`3D Print Cost Calculator`
- Meta：`Estimate 3D printing cost from filament, print time, electricity, machine wear and labor. Calculate a selling price, fees and profit instantly—free, no signup.`
- Title 不能机械塞入所有近义词；meta 不是排名保证。

指南页：
- `/how-much-does-3d-printing-cost/`：`How Much Does 3D Printing Cost? Real Examples & Formula` / H1 同主题。
- `/how-to-price-3d-prints/`：`How to Price 3D Prints: Cost, Margin & Marketplace Fees` / H1 同主题。
- 英语为 `lang="en"`；未通过西语/葡语市场 SERP 验证前不批量翻译创建 hreflang。

### 词群与相互链接

- 成本核心簇：`3d print cost calculator`、`3d printing cost calculator`、`calculate cost of 3d printing`、`3d print cost estimator`、`3d print calculator`、`3d printing cost estimator` → `/`。
- 报价簇：`3d printing price calculator`、`3d print price calculator`、`3d print pricing calculator`、`prices for 3d printing`、`price to 3d print` → `/` 的 **Pricing** 模式。无需单独 SEO URL。
- 耗材簇：`filament calculator`、`3d filament calculator`、`3d printer filament cost calculator`、`pla cost per gram`、`filament cost per gram` → `/` 的 **Filament** 模式。
- 信息簇：`how much does 3d printing cost`、`cost of 3d printing`、`how much does it cost to 3d print` → 第一篇指南。
- 卖家簇：`how to price 3d printed items`、`how much to charge for 3d prints`、`3d printing cost per hour` → 第二篇指南+首页小时成本解释。
- 排除：`3d printer cost`、`how much does a 3d printer cost`（买打印机意图）、`3d printed calculator`（产品/模型意图）、`3d printed house cost calculator`（不属于桌面FDM成本）。

不要宣称所有 P0 25 词都属于 25 个独立页面，也不要把各同义词的月搜索量合计当作可获得流量。


## 03A. 直接交给开发 AI 的核心关键词数据（美国 Semrush，2026-11-02 上传）

本节是**已验证竞品排名的具体数字**，而不是没有数据支撑的关键词建议。所有条目均来自第13节完整矩阵；若开发时需要更多字段，以第13节为准。

### 03A-1. 首页重点覆盖词（摘录）

| 关键词原文 | 美国月搜索量 | KD | CPC (USD) | 竞品已有自然排名 | 对应实现 |
|---|---:|---:|---:|---|---|
| `3d print cost calculator` | 2,400 | 18 | $2.66 | PrintPal #1, 3DPCC #2 | / |
| `calculate cost of 3d printing` | 1,900 | 18 | $2.66 | PrintPal #1, 3DPCC #3 | / |
| `3d printing cost calculator` | 1,600 | 13 | $2.66 | PrintPal #1, 3DPCC #2 | / |
| `3d print cost estimator` | 1,000 | 25 | $0.00 | PrintPal #1, 3DPCC #3 | / |
| `prices for 3d printing` | 2,900 | 23 | $0.26 | PrintPal #1, 3DPCC #4 | / (pricing mode) |
| `3d printing price calculator` | 880 | 21 | $1.75 | PrintPal #1, 3DPCC #2 | / (pricing mode) |
| `price to 3d print` | 2,400 | 19 | $0.24 | PrintPal #1, 3DPrintForce #6 | / (pricing mode) |
| `3d print price calculator` | 590 | 20 | $3.39 | PrintPal #1, 3DPCC #2 | / (pricing mode) |
| `3d printing pricing calculator` | 480 | 40 | $2.54 | PrintPal #1, 3DPCC #3 | / (pricing mode) |
| `3d print pricing calculator` | 320 | 14 | $2.54 | PrintPal #1, 3DPCC #2 | / (pricing mode) |
| `3d printer cost calculator` | 320 | 17 | $2.69 | PrintPal #1, 3DPCC #2 | / |
| `3d print calculator` | 590 | 25 | $1.64 | PrintPal #1, 3DPCC #2 | / |
| `calculate 3d print cost` | 170 | 20 | $2.89 | PrintPal #1, 3DPCC #3 | / |
| `3d printing cost estimator` | 140 | 20 | $2.89 | PrintPal #1, 3DPCC #3 | / |
| `3d printer calculator` | 90 | 16 | $0.00 | PrintPal #1, 3DPCC #2 | / |
| `3d print cost` | 260 | 13 | $0.24 | PrintPal #1, 3DPCC #3 | / |

**注意：**这是一个共享意图的页面关键词群，不能将月搜索量简单相加当作本站预测流量。关键词的 KD 属于该文件的 Semrush 导出，可能与此前不同日期截图或第三方工具的数值不同；不能擅自统一为同一个数字。

### 03A-2. 路由/功能归属规则

| 承接位置 | 搜索词类别 | 实施约束 |
|---|---|---|
| `/` 核心计算器 | P0 成本计算、估算与通用工具词 | 一个 canonical；输入与即时输出必须可操作 |
| `/` Pricing mode | 定价、利润、报价相关词 | 与成本计算器共用核心模型，不为同义词另建页 |
| `/` Filament mode | filament / PLA 每克成本、耗材价格 | 展示材料单位成本，明确卷重与含税价格输入 |
| `/` Hourly cost | per-hour 成本 | 解释折旧、用电、工时及产能假设 |
| `/how-much-does-3d-printing-cost/` | 信息型成本问题 | 提供独立示例、实际公式与链接，不能用工具说明文字凑一篇文章 |
| `/how-to-price-3d-prints/` | 商家定价、收费策略 | Margin/Markup/平台费计算示例；独立 SERP 意图还需复核 |
| 导出功能 | Excel/spreadsheet 意图 | 首版 CSV/打印，可提供 Excel 兼容导出；不为词创建空页面 |
| 排除/暂缓 | 买机器、模型、非英语、无关印刷等 | 不进入 title/H1/导航/站点地图；仅作为研究记录留存 |

### 03A-3. 数据状态与解释

- 每个词的 **Search Volume / KD / CPC** 使用3份美国 Organic Positions 导出的相同词条值；没有的数据记 `—`，不猜测。
- **3DPCC/PrintPal/3DPrintForce 排名** 是该词的非 AI Overview 自然排名；`—` 表示这些导出行里没有普通自然排名数据，不能解释为该站没有排名。
- **Traffic** 是 Semrush 对该词贡献给该竞品 URL 的月访问估算，不是搜索量、收入或 GSC 点击；同一关键词跨不同竞品的 Traffic 不得相加。
- 原始数据中包含 AI Overview 记录，已折叠为同一关键词，另在第13节用 `AIO` 标注；一个词不能因为同时有 AI Overview 和普通排名而算两个。
- 当前仅有**3DPCC前100行、PrintPal URL前100行、Force URL前96行**，不是三家完整自然排名关键词，也不代表整个赛道只有131个词。
- SEO 优先级按原矩阵 P0/P1/P2/EXCLUDE 继承；P1 不意味着一定新增索引页，P2 不意味着现在立项。

## 04. 核心计算模型：明确公式、单位和假设

### 输入及默认值（初始示例，非行业普适值）

| 参数 | 符号 | 单位 | 示例默认值 | 校验 |
|---|---|---|---:|---|
| 一卷耗材实付价格 | `spoolPrice` | USD | 25 | ≥0 |
| 一卷净耗材重量 | `spoolGrams` | g | 1000 | >0 |
| 本板实际用料（含支撑） | `usedGrams` | g/板 | 100 | ≥0 |
| 一板耗时 | `hours` | h/板 | 8 | ≥0 |
| 打印功率 | `watts` | W | 120 | ≥0 |
| 电费单价 | `energyRate` | USD/kWh | 0.18 | ≥0 |
| 打印机购置价 | `machineCost` | USD | 400 | ≥0 |
| 预估有效使用寿命 | `lifeHours` | h | 4000 | >0（使用折旧时） |
| 一板有效成品数 | `unitsPerPlate` | 件 | 1 | 整数≥1 |
| 每次尝试前的人工时间 | `prepMinutes` | min/板 | 10 | ≥0 |
| 人工费率 | `laborRate` | USD/h | 15 | ≥0 |
| 全板失败概率 | `failRate` | 比例 | 0.05 | 0≤p<1；UI建议最多95% |
| 每件成功品后处理/包装 | `finishPerUnit` | USD/件 | 0.50 | ≥0 |
| 平台佣金/支付百分费率 | `feeRate` | 比例 | 0.08 | 0≤f<1 |
| 每件交易分摊固定费 | `feeFixed` | USD/件 | 0.30 | ≥0 |
| 目标净利润率 | `margin` | 比例 | 0.30 | 0≤m<1；**f+m<1** |

不使用会变化的“某平台固定费率”默认宣称。提供“Generic / Etsy-like / Custom”仅为用户自定义标签，数字手动输入、可重置，说明可能另有广告、汇兑、退款费用。

### 首版确定公式（所有费用均以 USD 为单位）

```text
materialPerPlate  = usedGrams * spoolPrice / spoolGrams
energyPerPlate    = hours * (watts / 1000) * energyRate
machinePerPlate   = hours * (machineCost / lifeHours)
prepPerPlate      = (prepMinutes / 60) * laborRate
attemptCost       = materialPerPlate + energyPerPlate + machinePerPlate + prepPerPlate
expectedPlateCost = attemptCost / (1 - failRate)
productionPerUnit = expectedPlateCost / unitsPerPlate
COGS              = productionPerUnit + finishPerUnit

# 费用按“每件成功品的一笔订单”计算。f 是售出价格的比例费；c是固定费用；
# margin 指扣除 COGS 和交易费用后的利润占售价比例；不包含代收税。
recommendedSalePrice = (COGS + feeFixed) / (1 - feeRate - margin)
transactionFee       = feeRate * recommendedSalePrice + feeFixed
netProfit            = recommendedSalePrice - COGS - transactionFee
actualMargin         = netProfit / recommendedSalePrice
markupOnProductionCost = netProfit / COGS  # if COGS > 0; this is NOT margin
```

**失败率模型的前提**：每次失败都消耗整板材料、机器时间、准备人工；整板成品一起成功或失败。它是保守的期望成本估算，**不是实测故障率**。许多失败发生得较早，未来可增设“每次失败损失占比”但必须重新推导和测试。不应对已经含失败成本的 COGS 再加一次统一失败百分比。

**利润率与加价率不混用**：
- `margin` = 税前扣费用后利润 / 销售额；
- 成本加价率（cost markup）应单独定义：如需传统 `markup`, 可提供 `profit / COGS`，不能把它当作 margin，也不能用含交易费的分母而不说明。
- 对销售税/VAT只做可选展示，不将代收税算作收入；规则随地区不同，首版不提供税务合规建议。

**待增加的商家模式**：多件订单、运费和平台固定费要清楚“每订单还是每件”；否则不应假装准确。对应测试必须区分按板、按件和按订单的费用。首版可将每笔交易定义为每件成功品，批量模型单独验收。

**算例（由方案公式重新计算）**：材料 2.50，电 0.1728，机器 0.80，人工 2.50，单板5.9728；失败率5%后6.2871578947，后处理每件0.50，COGS=6.7871578947；f=8%、固定费0.30、目标净利润率30%，建议未四舍五入售价约11.43089983；建议售价显示 USD 11.43，所有计算使用未舍入内部值、只在展示时保留两位。展示值与校验允许 USD 0.01 级别的差异。

### 精度及异常

内部采用有限精度数值但不逐项过早四舍五入；输出货币两位、材料g显示合理精度；零耗材可以允许，但总价是否为零取决于其他成本；如果分母≤0则显示明确错误而不是 Infinity/NaN；禁止负数、非有限值、超大数导致页面卡死；重置必须恢复所有字段/模式；0% 失败率时不增加失败成本；100%失败不得生成报价。

## 05. 页面内容与体验

### 首页首屏（1366×768 Desktop）

1. 简洁导航：产品字标、Cost Calculator、Pricing Guide、How it Works（不要超长 SaaS 导航）；
2. 一行价值主张 + 清晰 H1；首屏不用图库首图、不放虚构用户数/评价；
3. 核心工作台同时显示：左侧输入（材料/时间），右侧 sticky 结果（Expected Cost / Suggested Price / Profit）；
4. 高级费用为可展开区，但默认演示值要解释“example only”；
5. 结果细分条和校验信息靠近价格；复制/打印是真功能；下方是公式、算例和 FAQ。

### 移动端（360–430px）

- 首屏 H1 + 核心输入；结果摘要紧跟当前输入组之后（不把结果压到 3 个长屏以下）；
- 输入尺寸≥44px；不要横向滚动；结果放在当前视区的简化卡片，可继续向下展开详细分解；
- 高级费用作为明示折叠组；费用单位固定可见，不依赖 placeholder；
- 工具到指南的引导排在计算完成后，而不是拦截操作。

### 首页内容顺序

Tool → transparent breakdown → interpretation/error help → worked example → calculation methodology → use cases (one-off hobby / seller) → non-repetitive FAQs → related guides → trust/privacy footer。

### 两篇指南

`how-much-does-3d-printing-cost/`：直接回答费用取决于重量、打印时间、材料单价、电力、机器/人工费用；给出1个完全可重算的样例、成本表、常见遗漏、与购买打印机价格的区别，链接工具输入对应参数。

`how-to-price-3d-prints/`：用表格解释成本、毛利/净利润、margin vs markup、平台手续费、退款/失败成本、报价样例、何时需要增加最小收费；表中的数字明确标为示例，不假装平台实际费率。

不要使用机器生成的流水账文章、无数据营销段落或每日自动更新的伪鲜度时间戳。

## 06. 页面技术与结构

- 推荐：**Astro 静态输出 + TypeScript + 原生 CSS/CSS Modules**；核心计算函数独立纯函数、带单测；计算交互用最少的浏览器 JS。
- 不要求数据库、Cloudflare Functions、KV、付费动画/AI/API、第三方账号。
- 运行时主要脚本在客户端；所有可索引正文、标题、内链、真实示例在 **原始 HTML** 中静态输出（不依赖点击/JS 才出现），符合 Google 对静态/预渲染的建议。
- 构建发布：Cloudflare Pages 静态部署，输出 `dist/`；项目名、正式域名待确定。仅有域名成本（不承诺 Cloudflare 免费配额永久不变）。
- `robots.txt`, `sitemap.xml`, `favicon`, social OG image（自制真实图形，不要竞品商标），唯一 canonical 都必须在部署域名确定后填写真实值。
- 数据持久化：本地 `localStorage` 可选，开关及 Reset/Clear data 明示；所有上传的解析在浏览器本地运行；接入 AdSense/GSC/分析脚本后必须更新隐私说明。
- JSON-LD：WebSite（真实品牌），WebApplication/SoftwareApplication（真实运行的网页工具，注意它不保证 Google 富结果），指南用适当 BlogPosting/Article 仅在真实作者和日期可用时采用。
- 不建立 `llms.txt` 作为所谓 Google 必备要求；不编造作者、公司、客户评价或实时活跃数据。
- 若要加 G-code 解析，先证明解析各切片器的实际 `time/filament` 字段可靠；不以 STL 文件大小和包围盒假装成精确打印时间/重量。

## 07. 视觉系统（可用于编码的值）

- 视觉定位：专业、清晰、耐看；**calculator-first**，不是泛 SaaS 营销登陆页。技术感来自对齐、信息层级和细节，不来自满屏渐变和发光。
- Theme: light first，允许操作系统暗色模式但必须正式测试后上线；默认无大图库背景。
- 颜色：canvas `#F6F8FC`，surface `#FFFFFF`，strong ink `#101827`，body `#344054`，muted `#667085`，border `#E4E9F2`，primary `#1567E8`，primary-hover `#0B56C5`，success `#0F916D`，warning `#B96A09`，error `#B42318`。高对比度需实际检测。
- 字体：系统字体 `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`（无网络字体依赖）；数字 `font-variant-numeric: tabular-nums`。
- 容器：最大1280px，工具主区 desktop 60/40 双栏，移动端单栏；标题行高1.15，正文16px/1.6；8px 基础 spacing，card radius12–16px；按内容重要程度使用细边界，无无意义的五重卡片嵌套。
- 输入要有 label、单位、help tooltip、示例值及 error state；计算结果显示成本、售卖价、平台费、净利，条形构成图只用 CSS/SVG、无额外图表包。
- Motion：输入更新数字淡入/平移 ≤180ms，费用条随值变化200ms；不在初次渲染时阻塞计算；`prefers-reduced-motion: reduce` 即刻展示最终值；页面外不循环动效。
- 交互完整状态：empty, valid, invalid, reset, copy success/failure, print view, disabled, focused, keyboard navigation；禁止只有样式没有行为的“下载”按钮。
- 对照参考：PrintPal 的任务简洁、3DPCC 的费用覆盖、3DPrintForce 的定价清晰；只能综合学习信息架构，原创设计，不复刻他们的视觉识别或源码。

## 08. 内容及组件层次

```
AppShell
 ├─ Header + accessible nav
 ├─ Hero (H1, clear 1-sentence purpose)
 ├─ CalculatorWorkspace
 │   ├─ ModeSwitch (Cost | Price | Filament; selected mode is state, not a new SEO URL)
 │   ├─ CoreInputs (filament, print-time, quantities)
 │   ├─ AdvancedInputs (power, depreciation, labor, failure, extras)
 │   ├─ ResultSummary (COGS, Recommended Price, Net Profit, Margin)
 │   ├─ CostBreakdown (labels and accessible text + optional bar)
 │   ├─ FormulaDetails (expansion, show each actual formula)
 │   └─ Actions (Copy summary, Export CSV, Print quote, Reset)
 ├─ WorkedExample (server-rendered static HTML)
 ├─ FAQ (relevant, accurate, no SEO-stuffed duplicates)
 ├─ Related Guides (ordinary crawlable <a href>)
 └─ Footer (truthful trust & privacy links)
```

## 09. 文件结构与发布规范

```
src/
  pages/index.astro
  pages/how-much-does-3d-printing-cost/index.astro
  pages/how-to-price-3d-prints/index.astro
  pages/about.astro
  pages/privacy.astro
  pages/contact.astro
  components/CalculatorWorkspace.astro
  components/CostInputs.astro
  components/ResultsPanel.astro
  components/FormulaExplainer.astro
  components/RelatedGuides.astro
  lib/calculations.ts
  lib/validators.ts
  lib/seo.ts
  styles/tokens.css
  styles/global.css
  layouts/BaseLayout.astro
  content/keyword-intent-map.json
public/robots.txt
public/favicon.svg
public/og-cost-calculator.png
scripts/
  audit/...
tests/calculations.test.ts
tests/seo.test.ts
```

`src/content/keyword-intent-map.json` 须由已核实的关键词矩阵生成，不能凭猜测新增 KD/搜索量。

## 10. 必须通过的 QA 门槛（未做时明确 NOT RUN）

### 功能 / 数学

- 计算公式及所有输入状态用自动测试覆盖；对正常、空、0、负、极大值、单位变换、百分比分母无效、批量多件、四舍五入逐项验证。
- 使用 `03_CALCULATION_TEST_FIXTURES.json` 的基准案例作为第一轮自动回归测试，并补充真实浏览器 E2E。
- 输出货币和利润率必须与手算/独立计算结果一致，差异≤0.01 USD（仅展示）；“Margin” 不得误写成 Markup。
- Reset 确实清理内容；复制/CSV/打印后的数据一致；无外部服务器发送用户计算数据。

### SEO 与质量

- 当前计划可索引主路由首页+2篇真正不同的指南（支持页按实际政策处理）；没有空白 PSEO 页面，非虚假 FAQ。
- 最终部署 URL 的 raw HTML 包含 H1、说明、示例、内链、canonical、OG/Meta；`sitemap.xml` 和 robots 不误屏蔽；未知页面真实404。
- Lighthouse 移动端性能目标≥90、Accessibility≥95、Best Practices≥90、SEO≥95，仅作为**内部目标，不得标称已达成**；Web Vitals 参考 LCP≤2.5s、INP≤200ms、CLS≤0.1（真实用户数据待上线才有）。
- 实测宽度 360/390/768/1024/1440px；键盘与无障碍标签可用；避免 CLS 和横向滚动。
- 运行 GitHub `Website-Starter-Standard/tools/seo_audit.py`，保存实际日志；按 `UI-RELEASE-EVIDENCE.md` 与 `SEO-GEO-RELEASE-EVIDENCE.md` 记录证据，未做标 NOT RUN。

### 上线 / 追踪

- 生产域名、GitHub 仓库与 Cloudflare Pages 项目待确定；不假定已创建/部署/安装分析工具。
- 上线后配置 Search Console；记录按页面/搜索词/CTR/排名与 GSC 收录数据的真实基线，按28天观察；不要虚构增长数据。
- 广告等有真实流量及隐私披露后再配置，不要为增加广告展示破坏首屏工具。

## 11. 交给下一位开发 AI 的执行合同

1. 先读取本方案和 `3D_Printing_Competitor_Keyword_Matrix_20261102.xlsx`，再读取 `Website-Starter-Standard` 最新主分支与 `gefei-seo` 对应研究交接规范。
2. 在代码提交前冻结受保护的主搜索意图、已确认页面和功能规则；对“搜索量/KD/收入”不得自造更新。
3. 建立 `PRD.md`、项目 `DESIGN.md`、`SEO-GEO-PROJECT-BRIEF.md`、`SEO-GEO-RELEASE-EVIDENCE.md`、`UI-RELEASE-EVIDENCE.md` 并将本方案落实进去。
4. 先实现独立纯计算模块及测试，再构建高质量响应式可用 UI；同步完成必要内容和 SEO，而非留大量 TODO 或虚假按钮。
5. 完成既定站点范围后执行完整 QA；实际部署验证成功之前禁止声称“上线完成”。
6. 所有非证据支持的后续新工具、新语言、几十个关键词单页扩张，都需回到研究阶段，不得自动增加。

## 12. 独立来源（检索日期 2026-11-02）

- 用户上传 Semrush 竞品 Positions x3；整合结果 `3D_Printing_Competitor_Keyword_Matrix_20261102.xlsx`。
- PrintPal：`https://www.printpal.io/tools/3d-print-cost-calculator`
- 3DPCC：`https://3dprintingcostcalculator.com/`
- 3D PrintForce：`https://3dprintforce.com/3d-printing-calculator`
- Google Search Central JS SEO：`https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics`
- Google Search Central title links：`https://developers.google.com/search/docs/appearance/title-link`
- Cloudflare Pages Limits：`https://developers.cloudflare.com/pages/platform/limits/`
- Website Starter Standard：`https://github.com/chenmu2024/Website-Starter-Standard`

---

## 13. 竞品关键词全量矩阵：131 个去重词及每词数据（本方案内置）

**数据日期与来源：**2026-11-02 用户上传的3份 Semrush 美国自然排名文件：

- `粘贴的文本 (1)(20261102-073116).txt`：3dprintingcostcalculator.com，前100条记录。
- `粘贴的文本 (2)(2).txt`：PrintPal 的 `/tools/3d-print-cost-calculator`，前100条记录。
- `粘贴的文本 (3).txt`：3dprintforce.com 的 `/3d-printing-calculator`，前96条记录。
- 合计296条记录；仅按小写化后的**完全一致关键词**去重为131个，**并未按搜索意图把不同文字表达合并**；47个词在三家均出现。
- 数据表按 P0/P1/P2/EXCLUDE 四类分组；每条保留 Volume、KD、CPC、各站自然排名、各站对该关键词的月流量估算、搜索意图和计划归属。

### 13.0 数据列说明

`US Vol` = 美国月搜索量估算；`KD` = Semrush 关键词难度；`CPC` = 估算点击单价 USD；`PCC/Pal/Force 排名` = 各竞品对应普通自然搜索位置；`PCC/Pal/Force 流量` = 该站这个词的每月自然流量估算。

数字中的 `—` 表示对应数据未出现在导出或无法归为普通自然排名，不等于0。`AIO=是` 表示该关键词相关导出还存在 AI Overview 记录，不应当作普通自然排名。所有搜索量、流量和 CPC 均**不能直接推导网站未来收入**。

### 13.1 P0 核心词（25个）：应覆盖首页和首页报价模式

| # | 精确关键词 | US Vol | KD | CPC $ | PCC 排名 | Pal 排名 | Force 排名 | PCC 流量 | Pal 流量 | Force 流量 | 建议承接位置 | AIO |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| 1 | `3d print cost calculator` | 2,400 | 18 | $2.66 | 2 | 1 | 5 | 316 | 595 | 72 | / | 是 |
| 2 | `calculate cost of 3d printing` | 1,900 | 18 | $2.66 | 3 | 1 | 5 | 155 | 471 | 57 | / | 是 |
| 3 | `3d printing cost calculator` | 1,600 | 13 | $2.66 | 2 | 1 | 5 | 211 | 396 | 38 | / | 是 |
| 4 | `3d print cost estimator` | 1,000 | 25 | $0.00 | 3 | 1 | 6 | 82 | 248 | 24 | / | 是 |
| 5 | `3d printing price calculator` | 880 | 21 | $1.75 | 2 | 1 | 5 | 116 | 218 | 26 | / (pricing mode) | 是 |
| 6 | `3d print price calculator` | 590 | 20 | $3.39 | 2 | 1 | 4 | 77 | 146 | 38 | / (pricing mode) | 否 |
| 7 | `3d printing pricing calculator` | 480 | 40 | $2.54 | 3 | 1 | 5 | 39 | 119 | 14 | / (pricing mode) | 是 |
| 8 | `3d print pricing calculator` | 320 | 14 | $2.54 | 2 | 1 | 4 | 42 | 79 | 11 | / (pricing mode) | 是 |
| 9 | `3d printer cost calculator` | 320 | 17 | $2.69 | 2 | 1 | 4 | 42 | 79 | 20 | / | 否 |
| 10 | `3d print calculator` | 590 | 25 | $1.64 | 2 | 1 | 4 | 48 | 77 | 20 | / | 是 |
| 11 | `calculate 3d print cost` | 170 | 20 | $2.89 | 3 | 1 | 7 | 13 | 42 | 3 | / | 否 |
| 12 | `3d printing cost estimator` | 140 | 20 | $2.89 | 3 | 1 | 4 | 6 | 34 | 4 | / | 是 |
| 13 | `3d printer calculator` | 90 | 16 | $0.00 | 2 | 1 | 4 | 11 | 22 | 5 | / | 否 |
| 14 | `3d print cost` | 260 | 13 | $0.24 | 3 | 1 | 8 | 11 | 21 | 4 | / | 否 |
| 15 | `3d print calculator cost` | 70 | 10 | $0.00 | 2 | 1 | 4 | 9 | 17 | 4 | / | 否 |
| 16 | `3d print cost calculator free` | 70 | 14 | $0.00 | 1 | 2 | 3 | 17 | 9 | 5 | / | 是 |
| 17 | `3d printing cost` | 590 | 20 | $0.25 | 5 | 8 | 13 | 14 | 11 | 2 | / | 否 |
| 18 | `3d printing calculator cost` | 40 | 22 | $0.00 | 2 | 1 | 4 | 5 | 9 | 2 | / | 是 |
| 19 | `printing cost calculator` | 140 | 23 | $3.93 | 9 | 5 | 26 | 2 | 4 | 0 | / | 是 |
| 20 | `3d print cost calculator bambu` | 50 | 11 | $0.00 | 4 | 2 | 22 | 1 | 3 | 0 | / | 否 |
| 21 | `prices for 3d printing` | 2,900 | 23 | $0.26 | 4 | 1 | — | 87 | 237 | — | / (pricing mode) | 否 |
| 22 | `price to 3d print` | 2,400 | 19 | $0.24 | — | 1 | 6 | — | 196 | 57 | / (pricing mode) | 否 |
| 23 | `3d print costs` | 50 | 17 | $0.33 | — | 1 | 13 | — | 6 | 0 | / | 否 |
| 24 | `3d printing calculator` | 170 | 9 | $1.64 | — | — | — | 1 | 3 | — | / | 是 |
| 25 | `printing cost estimator` | 30 | 22 | $4.18 | 1 | — | — | 7 | — | — | / | 否 |

### 13.2 P1 相关搜索词（62个）：支持模式与差异化内容

| # | 精确关键词 | US Vol | KD | CPC $ | PCC 排名 | Pal 排名 | Force 排名 | PCC 流量 | Pal 流量 | Force 流量 | 建议承接位置 | AIO |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| 1 | `3d printer printing price` | 3,600 | 31 | $0.26 | 16 | 3 | 46 | 5 | 158 | 0 | / (pricing mode) | 否 |
| 2 | `cost of printing 3d` | 2,400 | 21 | $0.24 | 6 | 2 | 16 | 16 | 105 | 3 | /how-much-does-3d-printing-cost/ | 否 |
| 3 | `filament cost calculator` | 320 | 28 | $0.00 | 3 | 1 | 5 | 26 | 79 | 14 | / (filament mode) | 否 |
| 4 | `3d printer filament cost calculator` | 210 | 21 | $0.00 | 4 | 1 | 18 | 13 | 52 | 0 | / (filament mode) | 否 |
| 5 | `3d printing filament cost calculator` | 210 | 21 | $0.00 | 4 | 1 | 6 | 13 | 52 | 6 | / (filament mode) | 否 |
| 6 | `3d filament calculator` | 170 | 9 | $0.00 | 3 | 1 | 8 | 13 | 42 | 4 | / (filament mode) | 否 |
| 7 | `3d printer filament calculator` | 140 | 20 | $0.00 | 3 | 1 | 7 | 11 | 34 | 3 | / (filament mode) | 否 |
| 8 | `filament price calculator` | 260 | 23 | $0.00 | 3 | 1 | 5 | 16 | 34 | 9 | / (filament mode) | 是 |
| 9 | `how much does 3d printing cost` | 1,600 | 19 | $0.34 | 20 | 7 | 55 | 2 | 30 | 0 | /how-much-does-3d-printing-cost/ | 否 |
| 10 | `3d printing filament calculator` | 110 | 18 | $0.00 | 3 | 1 | 8 | 9 | 27 | 2 | / (filament mode) | 否 |
| 11 | `how to price 3d print` | 210 | 22 | $1.33 | 10 | 2 | 4 | 0 | 17 | 4 | /how-to-price-3d-prints/ | 否 |
| 12 | `3d printing prices` | 260 | 19 | $0.29 | 5 | 2 | 12 | 6 | 16 | 0 | / (pricing mode) | 否 |
| 13 | `how much does it cost to 3d print` | 880 | 21 | $0.23 | 15 | 6 | 48 | 1 | 16 | 0 | /how-much-does-3d-printing-cost/ | 否 |
| 14 | `3d print pricing` | 170 | 33 | $0.26 | 3 | 1 | 5 | 7 | 13 | 4 | / (pricing mode) | 是 |
| 15 | `3d print price` | 90 | 46 | $0.35 | 3 | 1 | 8 | 3 | 11 | 1 | / (pricing mode) | 是 |
| 16 | `price for 3d printing` | 390 | 23 | $0.27 | 12 | 4 | 16 | 1 | 9 | 0 | / (pricing mode) | 否 |
| 17 | `3d printing price` | 170 | 18 | $0.26 | 2 | 6 | 15 | 7 | 3 | 0 | / (pricing mode) | 否 |
| 18 | `how much 3d printing costs` | 50 | 16 | $0.31 | 5 | 1 | 15 | 1 | 6 | 0 | /how-much-does-3d-printing-cost/ | 否 |
| 19 | `how much is 3d printing cost` | 170 | 22 | $0.30 | 6 | 3 | 50 | 3 | 4 | 0 | /how-much-does-3d-printing-cost/ | 否 |
| 20 | `how to calculate the cost of 3d printing` | 40 | 27 | $1.88 | 5 | 2 | 15 | 1 | 3 | 0 | /how-much-does-3d-printing-cost/ | 否 |
| 21 | `pricing for 3d printing` | 40 | 12 | $0.26 | 4 | 1 | 7 | 1 | 3 | 0 | /how-to-price-3d-prints/ | 否 |
| 22 | `filament calculator` | 260 | 12 | $0.00 | 3 | 1 | — | 21 | 64 | — | / (filament mode) | 是 |
| 23 | `how to price 3d printed items` | 170 | 18 | $1.10 | — | 1 | 6 | — | 13 | 2 | /how-to-price-3d-prints/ | 是 |
| 24 | `3d filament cost` | 390 | 14 | $0.33 | 6 | 3 | — | 5 | 11 | — | / (filament mode) | 否 |
| 25 | `pricing 3d prints` | 140 | 26 | $0.26 | — | 1 | 4 | — | 11 | 4 | /how-to-price-3d-prints/ | 否 |
| 26 | `3d printer filament cost` | 320 | 12 | $0.32 | 8 | 3 | — | 1 | 9 | — | / (filament mode) | 否 |
| 27 | `3d printing quotation` | 320 | 57 | $8.56 | 6 | — | 54 | 7 | — | 0 | / (pricing mode) | 否 |
| 28 | `cost of 3d printing` | 480 | 20 | $0.33 | — | 7 | 42 | — | 6 | 0 | /how-much-does-3d-printing-cost/ | 是 |
| 29 | `3d print pricer` | 210 | 38 | $0.35 | 2 | — | 46 | 5 | — | 0 | / (pricing mode) | 否 |
| 30 | `how much 3d print cost` | 40 | 16 | $0.31 | — | 1 | 14 | — | 5 | 0 | /how-much-does-3d-printing-cost/ | 否 |
| 31 | `filament cost per gram` | 50 | 0 | $0.00 | 2 | 1 | — | 2 | 4 | — | / (filament mode) | 否 |
| 32 | `how much does 3d print cost` | 70 | 17 | $0.23 | — | 3 | 31 | — | 4 | 0 | /how-much-does-3d-printing-cost/ | 否 |
| 33 | `how much does it cost for 3d printing` | 70 | 6 | $0.23 | 3 | — | 12 | 4 | — | 0 | /how-much-does-3d-printing-cost/ | 否 |
| 34 | `average cost of 3d printing` | 140 | 16 | $0.33 | — | 4 | 36 | — | 3 | 0 | /how-much-does-3d-printing-cost/ | 否 |
| 35 | `cost for 3d printing` | 50 | 16 | $0.33 | — | — | 43 | — | 3 | 0 | /how-much-does-3d-printing-cost/ | 是 |
| 36 | `how much do 3d prints cost` | 50 | 21 | $0.23 | — | 3 | 41 | — | 3 | 0 | /how-much-does-3d-printing-cost/ | 否 |
| 37 | `how much to charge for 3d prints` | 110 | 20 | $0.00 | — | 2 | 8 | — | 3 | 0 | /how-to-price-3d-prints/ | 否 |
| 38 | `how to price 3d prints to sell` | 90 | 22 | $1.07 | — | 2 | 5 | — | 3 | 1 | /how-to-price-3d-prints/ | 是 |
| 39 | `3d print prices` | 40 | 23 | $0.25 | 4 | — | 9 | 1 | — | 0 | / (pricing mode) | 否 |
| 40 | `how much does 3d printer filament cost` | 480 | 6 | $0.28 | — | 3 | — | — | 21 | — | / (filament mode) | 否 |
| 41 | `how much does a 3d print cost` | 720 | 28 | $0.21 | — | 3 | — | — | 17 | — | /how-much-does-3d-printing-cost/ | 否 |
| 42 | `3d printer material cost` | 320 | 22 | $0.31 | — | 3 | — | — | 14 | — | / (filament mode) | 否 |
| 43 | `3d printing filament cost` | 320 | 20 | $0.18 | — | 3 | — | — | 11 | — | / (filament mode) | 否 |
| 44 | `pla cost per gram` | 110 | 12 | $0.00 | 2 | — | — | 7 | — | — | / (filament mode) | 是 |
| 45 | `pla filament cost` | 110 | 21 | $0.35 | — | — | — | — | 6 | — | / (filament mode) | 是 |
| 46 | `3d print quote` | 320 | 56 | $10.68 | 9 | — | — | 4 | — | — | / (pricing mode) | 否 |
| 47 | `3d printer filament cost per gram` | 70 | 4 | $0.00 | — | — | — | 4 | — | — | / (filament mode) | 是 |
| 48 | `cost of pla per gram` | 90 | 0 | $0.00 | 2 | — | — | 3 | — | — | /how-much-does-3d-printing-cost/ | 否 |
| 49 | `filament cost` | 140 | 18 | $0.18 | — | 5 | — | — | 3 | — | / (filament mode) | 否 |
| 50 | `how much does filament cost` | 140 | 6 | $0.28 | — | 5 | — | — | 3 | — | / (filament mode) | 否 |
| 51 | `3d-printing quote` | 110 | 57 | $8.56 | 8 | — | — | 2 | — | — | / (pricing mode) | 否 |
| 52 | `3d printing cost per gram` | 70 | 9 | $0.00 | 6 | — | — | 1 | — | — | / (filament mode) | 否 |
| 53 | `how much is 1 gram of filament` | 40 | 8 | $0.00 | 3 | — | — | 1 | — | — | / (filament mode) | 否 |
| 54 | `pla cost` | 140 | 29 | $0.39 | 6 | — | — | 1 | — | — | / (filament mode) | 否 |
| 55 | `quote 3d printing` | 140 | 52 | $9.71 | 9 | — | — | 1 | — | — | / (pricing mode) | 否 |
| 56 | `3d printing average cost` | 50 | 19 | $0.23 | — | — | 58 | — | — | 0 | /how-much-does-3d-printing-cost/ | 否 |
| 57 | `3d printing cost per hour` | 50 | 2 | $0.00 | — | — | 23 | — | — | 0 | / (hourly-rate mode) | 否 |
| 58 | `3d printing service cost` | 110 | 25 | $1.47 | — | — | 53 | — | — | 0 | / (pricing mode) | 否 |
| 59 | `3d printing service price` | 50 | 23 | $3.04 | — | — | 55 | — | — | 0 | / (pricing mode) | 否 |
| 60 | `how much 3d printing cost` | 90 | 19 | $0.21 | — | — | 42 | — | — | 0 | /how-much-does-3d-printing-cost/ | 否 |
| 61 | `how much does it cost to 3d print something` | 320 | 25 | $1.39 | — | — | 56 | — | — | 0 | /how-much-does-3d-printing-cost/ | 否 |
| 62 | `how much to 3d print` | 50 | 16 | $0.21 | — | — | 48 | — | — | 0 | /how-to-price-3d-prints/ | 否 |

### 13.3 P2 待验证词（7个）：保留证据但不强行新建页

| # | 精确关键词 | US Vol | KD | CPC $ | PCC 排名 | Pal 排名 | Force 排名 | PCC 流量 | Pal 流量 | Force 流量 | 建议承接位置 | AIO |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| 1 | `3d printer price calculator` | 50 | 10 | $2.14 | 3 | 1 | 4 | 4 | 12 | 3 | / | 否 |
| 2 | `3d print cost calculator app` | 50 | 22 | $1.97 | 4 | — | 8 | 1 | — | 0 | / | 否 |
| 3 | `3d printing cost calculator excel` | 70 | 18 | $0.00 | — | — | 1 | — | — | 9 | / (export feature) | 否 |
| 4 | `3d printer printing cost` | 50 | 17 | $0.25 | 2 | — | — | 1 | — | — | — | 否 |
| 5 | `3d printing pricing spreadsheet` | 50 | 21 | $0.00 | — | — | 4 | — | — | 1 | / (export feature) | 是 |
| 6 | `3d printing cost comparison` | 40 | 26 | $0.00 | — | — | 15 | — | — | 0 | — | 否 |
| 7 | `calculadora precios impresion 3d` | 40 | 0 | $0.00 | — | — | 49 | — | — | 0 | /es/ (future) | 否 |

### 13.4 EXCLUDE 排除词（37个）：明确禁止为吸收搜索量而做不相关页面

| # | 精确关键词 | US Vol | KD | CPC $ | PCC 排名 | Pal 排名 | Force 排名 | PCC 流量 | Pal 流量 | Force 流量 | 建议承接位置 | AIO |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| 1 | `printing calculator` | 1,300 | 30 | $0.38 | — | — | — | 78 | 6 | 45 | — | 是 |
| 2 | `3d printed calculator` | 140 | 17 | $2.27 | 3 | 1 | 4 | 11 | 34 | 4 | — | 是 |
| 3 | `print calculator` | 110 | 14 | $1.64 | 2 | 3 | 6 | 14 | 9 | 3 | — | 否 |
| 4 | `3d printing price guide cost calculator 2026` | 90 | 11 | $0.00 | 1 | 3 | 5 | 11 | 5 | 2 | — | 是 |
| 5 | `3d printer pricing` | 70 | 43 | $0.00 | 4 | 1 | 22 | 2 | 4 | 0 | — | 否 |
| 6 | `3d printer cost` | 6,600 | 44 | $0.24 | 4 | 1 | — | 125 | 541 | — | — | 否 |
| 7 | `cost of 3d printer` | 1,300 | 34 | $0.25 | 11 | 1 | — | 3 | 106 | — | — | 否 |
| 8 | `3d printer costs` | 590 | 25 | $0.00 | 5 | 1 | — | 7 | 48 | — | — | 否 |
| 9 | `cost of a 3d printer` | 720 | 41 | $0.25 | 8 | 3 | — | 6 | 21 | — | — | 否 |
| 10 | `how much do 3d printers cost` | 2,400 | 33 | $0.23 | 25 | 6 | — | 1 | 12 | — | — | 否 |
| 11 | `how much 3d` | 50 | 26 | $0.25 | — | 1 | 51 | — | 6 | 0 | — | 否 |
| 12 | `3-d printer cost` | 70 | 41 | $0.25 | 4 | 1 | — | 0 | 4 | — | — | 否 |
| 13 | `3d print cijena` | 40 | 26 | $0.00 | 4 | 2 | — | 1 | 3 | — | — | 否 |
| 14 | `3d printed house cost calculator` | 50 | 17 | $0.00 | 6 | — | 35 | 1 | — | 0 | — | 否 |
| 15 | `3d printer quote` | 70 | 53 | $8.56 | 7 | — | 74 | 1 | — | 0 | — | 否 |
| 16 | `how much does a 3d printer cost` | 6,600 | 31 | $0.21 | — | 5 | — | — | 59 | — | — | 否 |
| 17 | `3d printers cost` | 320 | 39 | $0.25 | 1 | — | — | 20 | — | — | — | 否 |
| 18 | `cost of three d printers` | 9,900 | 56 | $0.25 | 16 | — | — | 14 | — | — | — | 否 |
| 19 | `cost of 3d printers` | 320 | 20 | $0.33 | — | 3 | — | — | 9 | — | — | 否 |
| 20 | `how much is 3d printer` | 1,600 | 36 | $0.24 | — | 11 | — | — | 4 | — | — | 否 |
| 21 | `how.much does a 3d printer cost` | 260 | 25 | $0.21 | — | 4 | — | — | 4 | — | — | 否 |
| 22 | `3d printer material price` | 90 | 24 | $0.19 | — | 2 | — | — | 3 | — | — | 否 |
| 23 | `3d printers costs` | 90 | 43 | $0.24 | — | 2 | — | — | 3 | — | — | 否 |
| 24 | `filament for 3d printer price` | 110 | 33 | $0.31 | — | — | — | — | 3 | — | — | 是 |
| 25 | `filament price` | 140 | 10 | $0.32 | 4 | — | — | 3 | — | — | — | 否 |
| 26 | `what is the cost of 3d printer` | 90 | 21 | $0.32 | — | 2 | — | — | 3 | — | — | 否 |
| 27 | `how much does a three d printer cost` | 1,600 | 61 | $0.21 | 19 | — | — | 2 | — | — | — | 否 |
| 28 | `print calc` | 70 | 10 | $2.61 | 4 | — | — | 2 | — | — | — | 否 |
| 29 | `printer calculator` | 140 | 24 | $0.32 | 7 | — | — | 2 | — | — | — | 否 |
| 30 | `3d print force calculator` | 40 | 27 | $0.00 | — | — | 2 | — | — | 1 | — | 是 |
| 31 | `3d price` | 40 | 31 | $0.00 | — | — | 4 | — | — | 0 | — | 否 |
| 32 | `how much a 3d printer` | 110 | 33 | $0.21 | — | — | 38 | — | — | 0 | — | 否 |
| 33 | `how much is a personal 3d printer` | 40 | 18 | $0.00 | 40 | — | — | 0 | — | — | — | 否 |
| 34 | `how much is the 3d` | 90 | — | $0.30 | — | — | 41 | — | — | 0 | — | 否 |
| 35 | `how much money are 3d printers` | 50 | 29 | $0.16 | — | — | 22 | — | — | 0 | — | 否 |
| 36 | `online print calculator` | 40 | 17 | $1.65 | — | — | 41 | — | — | 0 | — | 否 |
| 37 | `prusa calculator` | 50 | 18 | $0.00 | — | — | 28 | — | — | 0 | — | 否 |

### 13.5 排名与搜量之外：开发者还应保留的搜索意图约束

- **P0 的 `3d printer cost calculator` 与 `3d printer calculator`** 可能被设备购买意图污染。当前矩阵仍按历史分类标记为 P0，但开发执行时仅将其作为综合工具的次要自然覆盖，不写“买打印机”的不相关内容。
- **P1 的 `3d printer printing price`** 搜索量虽高，但竞品排名较弱且可能包含设备/服务报价的混合意图，严禁仅凭搜量单开页面。
- **P1 的 `3d printing quotation`** CPC 较高但难度高，实际企业报价与桌面爱好者工具意图未必一致；只让报价功能自然承接，不许虚构 B2B 报价服务。
- **P2 的西语关键词** 来自美国数据库中偶然的西语排名，并非西班牙或拉美市场专项研究，不据此上线西语版本。
- **EXCLUDE 的硬件价格词** 不是计算打印件成本的目标；禁止通过栏目扩张把网站改成通用设备购物站。

### 13.6 另一个800词宽表的用途与口径隔离

另一份上传文件 `粘贴的文本 (1)(20261102-072105).txt` 包含**800个混合3D打印主题词**。它是选题候选池，不是本次3家竞品关键词排名证据；部分词的搜索量/KD与后续美国导出不同，**不覆盖本章数据，不无差别并表**。从中提取的少量成本/报价词，只有经过与本章的精确字符串对照后才进入首版目标，其余非产品意图（打印机评测、STL下载、实体打印服务、本地维修、模型商品等）不能直接用于本站。

### 13.7 数据治理及实施验收

1. 开发 AI 不得只看分类总数：必须读取本章每个词的真实指标与归属，生成 `content/keyword-intent-map.json` 和 SEO 页面清单。
2. 新页面必须满足不同用户任务、独特可操作工具或独立指南意图；同义关键词由单一 canonical URL 覆盖。
3. 每次改动记录原始输入与采集日期；后续 Search Console 实际点击/展示数据优先于第三方预估，并单独建基线而不是覆盖旧 Semrush 快照。
4. 禁止将 `CPC × 搜索量` 视作 AdSense 收入预测；禁止把竞品流量相加当作本站可获得流量。
5. 若需要完整的296条逐站原始记录（含每行日期/URL/搜索意图），继续以已存在的 `3D_Printing_Competitor_Keyword_Matrix_20261102.xlsx` 的 `Raw Positions` 为准；**131个去重词的对应数字已在本方案完整呈现，无需查外部文件才能选择页面或功能。**

