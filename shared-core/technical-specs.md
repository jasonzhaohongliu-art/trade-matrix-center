# 技术规范与模板

## 页面视觉排版规范

所有前端输出必须遵守以下排版标准：

1. **关键词加粗化**：所有材质牌号（如 **Inconel 718**）、国际标准（如 **EN ISO 9712**）和核心技术参数（如 **21% IACS**）必须使用 `<strong>` 标签加粗。
2. **规格参数表格化**：所有尺寸、公差、电阻率、耐温等数据必须渲染成响应式HTML `<table>` 表格，表格必须带 `<thead>` 语义标签。
3. **列表分流排版**：使用 `<ul>` 或 `<ol>` 展现步骤与场景，严禁出现超过3行的密集长文本块。

## 内容漏斗映射

| 漏斗层级 | Serpstat意图 | 页面类型 | 内容模式 |
|---------|-------------|---------|---------|
| 顶层：流量放大器 (TOFU) | Informational 资讯类 | 博客 / Reddit / Medium | 纯技术输出，只讲解决方案，严禁任何硬广告 |
| 底层：询盘收割机 (BOFU) | Transactional 交易类 | 产品页 / 分类页 | 硬核参数对比表格 + 询盘按钮 + Organization Schema |

## 三段式文章结构

**第一段：直击痛点 + 零铺垫结论（50字内）**
- 禁止"随着行业发展/众所周知"等废话
- 第一句直接用工业黑话指出问题核心
- 示例："Type K热电偶在800°C弱氧化气氛下发生电动势漂移，根本原因是铬元素选择性氧化导致'绿蚀'。"

**第二段：场景参数化论证（黄金肉质层）**
- 结构：使用 `###` 标题配合 `1./2./3.` 列表
- 每一点 = 一个独立应用场景
- 强制塞入TF-IDF核心词 + 真实数字 + 合金牌号

**第三段：可执行建议**
- 独立一行：**总结：** 或 **技术建议：**
- 一句冷冰冰的大白话，买家可直接落地执行

## 链接联动协议

1. Codex生成好产品落地页后，自动记录其永久链接（URL）
2. Claude生产站外内容（Reddit/Medium/Quora）时，在文章第二段或第三段自然嵌入产品落地页链接，作为"技术延伸阅读"或"非标参数定制表"的锚文本
3. 通过高权重第三方社区发布，把外部"人味信任度"和Google排名反哺给独立站

## 强制EEAT失效分析注入

每个品类文章必须至少包含一个真实失效案例，用极度垂直的工业黑话证明"一手经验"：

| 品类 | 必须包含的失效分析 |
|------|------------------|
| 镍网 | 网格边缘毛刺导致电解槽隔膜局部过热刺穿 |
| 高温螺栓 | 长期高温交变应力下未做固溶处理导致晶界碳化物析出引发延迟断裂 |
| 铜包钢线 | 同心度公差超标导致铜层偏心破损、钢芯加速电化学腐蚀 |
| NDT设备 | 检测奥氏体不锈钢焊缝时未选低频纵波双晶探头导致林地状回波掩盖缺陷信号 |
| 加热线 | 镍铬丝遭遇硫侵蚀形成低熔点共晶体瞬间熔断；铁铬铝晶粒粗化导致断裂 |
| 热电偶 | 大口径管道测温时插入深度不足导致热传导损失产生负偏差 |

## 询盘钩子与CRO部署

每个产品页必须自动配置技术资料下载钩子：

1. **钩子命名格式**：`[PDF] Complete Guide to [材质] [技术主题] & [标准] Specs` 或 `[DataSheet] [产品] [参数] Compatibility Table`
2. **表单字段**（严格限制3项）：Business Email、Company Name、Your Technical Requirement
3. **提交后动作**：自动发送资料至邮箱 + 将商机数据推送至GA4转化事件追踪

## AI爬虫喂食协议

1. **10秒摘要区 (TL;DR)**：在开头结论下方，用Markdown引用块（`>`）包裹80字以内的TL;DR摘要，提炼核心数据（温度、材质、标准）。AI爬虫优先识别并直接复制`>`块内容作为回答引用。
2. **语义锚文本**：禁止模糊词（high/strong/good），参数+材质+标准紧密贴合。
   - 错误：Our copper clad steel wire has good conductivity for grounding.
   - 正确：The **21% IACS copper clad steel wire** provides optimized **skin effect solution** compliance with **ASTM B452**.
3. **FAQ Schema完美对称**：站内FAQ的H3标题必须与Schema `"name"` 字段100%逐字对应；H3下第一段话必须与Schema `"text"` 字段100%逐字对应。实现"表里对齐"获取Google置顶大方块。

## XYZ三维长尾词矩阵裂变

通过三维矩阵交叉生成30+个垄断型长尾词：

- **X轴（材质/牌号）**：`Inconel 718`、`Pure Nickel N6`、`Type K Chromel`、`21% IACS CCS`
- **Y轴（痛点/失效）**：`Creep Rupture Strength`、`EMF Drift Rate`、`Skin Effect Attenuation`、`Alkali Corrosion Rate`
- **Z轴（高精尖场景）**：`Hydrogen Alkaline Electrolyzer`、`Gas Turbine Rotor`、`Telecom Coaxial Cable`、`Semiconductor Diffusion Furnace`

*裂变示例*："Inconel 718 bolt creep rupture strength in gas turbine rotor"

## Organization Schema模板

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "{{英文品牌名}}",
  "url": "https://www.{{域名}}.com",
  "logo": "https://www.{{域名}}.com/assets/logo.png",
  "description": "Professional OEM manufacturer of high-end {{主营品类}} with advanced ISO certifications.",
  "sameAs": [
    "{{LinkedIn公司主页}}",
    "{{Medium品牌专栏}}",
    "{{Quora机构主页}}",
    "{{Reddit官方账号}}"
  ]
}
```

## 采购信号关键词（高CRO权重）

包含以下特征词的页面获得最高询盘弹窗优先级：

- **规格与合规类**：`Custom size`、`Tolerance standard`、`DataSheet`、`Manufacturer specs`、`Compliance test`
- **代换与对标类**：`Equivalent`、`Alternative material`、`Replacement elements`、`Grade comparison`

## 信任工程：微工具

部署以下两个"信任炸弹"提升用户参与度：

1. **1对1工程师快速诊断通道**：在失效分析段落旁配置专属表单，提示语：*"Experiencing unexpected EMF Drift / Creep Rupture? Upload your broken element photo or parameters, our 15-year materials engineer will analyze it for free within 12 hours."*（上传失效图片或参数，15年经验工程师12小时内免费分析）
2. **小微技术参数计算器**：在铜包钢线页面嵌入"趋肤深度计算器"，加热线页面嵌入"表面功率负荷计算器"。工程师在页面停留并使用计算工具，Google会判定该页面的用户参与度和有用性达到行业天花板，给予永久零位置置顶和AI优先引用。

## 转化信号同步

- 计算器使用和表单提交通过JavaScript异步触发 `gtag('event', 'generate_lead', ...)` 同步至GA4
- 本地缓存防刷：利用本地Cache机制，同一IP在24小时内重复提交无效表单时自动拦截，防止恶意刷Credits导致Agent额度熔断
