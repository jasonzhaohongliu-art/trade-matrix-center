---
name: industrial-b2b-seo-geo
description: 中国制造商出海工业B2B领域的SEO/GEO总策划系统，覆盖美国、欧盟、印度、韩国、日本、越南六大目标市场。支持镍网、高温螺栓、铜包钢线、NDT检测设备、加热线、热电偶合金线六大品类。提供从Serpstat关键词研究到Reddit/Perplexity/Claude内容生产再到GA4转化追踪的完整7步SOP流水线，内置可调API信用点控制系统。当用户需要关键词策略、网站架构规划、内容生产工作流、竞品分析、Serpstat额度管理，或提及SEO/GEO/内容营销/独立站建站/工业品外贸流量增长时触发使用。
---

# 工业B2B SEO/GEO 总策划系统

## 核心原则

1. **打破GEO/SEO伪概念**：Google已定论，不存在脱离传统SEO的AI排名。AI搜索沿用传统搜索的排名体系与质量标准，常规搜索实力就是AI搜索里的最终排位。
2. **砍掉一切伪捷径**：不配置`llms.txt`（官方明确表示从不用），不刻意改写AI句式，不刷虚假品牌提及。
3. **死守非商品化内容**：流水线式通用攻略和模板化产品介绍属于"大路货"，无法打动大模型。真正被AI优先引用的是专属一手案例、实战经验、硬核材质数据与具体解决方案。

## 三大杠杆点

1. **语料空白点**：在Reddit答题或建站前，利用Perplexity深度剖析同行高赞回答的评论区，找出"说得好但没说透"的缺口，这是内容拿第一的致命武器。
2. **高权重来源卡位（Medium & Quora）**：Medium、Quora和Reddit是大模型训练数据中最核心的高权重来源。在这些平台提及独立站链接，被AI引用的概率呈几何倍数暴增。
3. **品牌实体交叉验证**：配置Organization的JSON-LD结构化数据，用`sameAs`关联LinkedIn公司主页、官方社区账号。人味背书+官方身份对齐，大模型交叉验证时才会100%信任。

## 7步SOP流水线

当接收到具体工业品类和关键词时，全自动执行以下7步流水线。

### 第1步：Serpstat数据雷达与关键词清洗

**额度控制**：执行前阅读 `references/serpstat-credit-config.md`，根据预算档位调整所有参数。

1. **关键词选择（长尾拓展）**：输入工业主词，拓展成千上万长尾衍生词，优先筛选CPC高、竞争度中等的词，锁定海外采购商真实意向。
2. **关键词聚类**：将所有长尾词一键导入，系统根据谷歌前10页重合度按语义聚类。**直接拿聚类结果去建独立站的H2/H3目录结构**。
3. **搜索建议**：抓取Google搜索底部的问题类词条，作为第4步（Perplexity挖掘空白点）的黄金题库。
4. **域名多维对撞**：输入主词锁定在线竞争对手，将自身网站与2个欧美顶尖同行域名对撞，一键导出"缺失关键词清单"。

**省钱提示**：批量操作始终使用Batch Analysis；提高`INCREMENTAL_CACHE_TTL`减少刷新频率。完整参数表和分档预算模板见 `references/serpstat-credit-config.md`。

### 第2步：TF-IDF文本语义分析

写任何网页内容前：
1. 将关键词输入Serpstat文本分析工具
2. 扫描谷歌排名前10的所有页面，计算每个行业术语的黄金出现频次与权重密度
3. 提取文章必须包含的核心技术词及频次，作为"强制军规"注入Claude生产流水线

### 第3步：批量分析（降本神器）

1. 使用Serpstat **Batch Analysis**批量分析功能，把6大品类所有衍生词、所有竞品域名一次性打包导入，一键导出含搜索量、关键词难度（KD）、搜索意图的完整大表
2. 根据KD值策略分流：**KD<30的长尾词走自动化快速上线流程；KD>50的难词走多代理精抠流程**

### 第4步：Reddit战场与题库挖掘

各品类目标社区：完整Reddit社区映射表及订阅人数见 `references/category-details.md`。

**指令**：阅读 `references/prompts-library.md` -> "Reddit战场与题库挖掘"获取完整控制台指令。

执行要点：
- 精准寻找工程师、采购商、车间操作工聚集的垂直板块
- 将50个高互动问题分类为：选型指南、材质对比、成本效益分析、故障排查
- 改写成AI搜索友好的长尾格式

### 第5步：Perplexity逆向拦截同行七寸

1. 将第4步最热帖子链接/标题输入Perplexity，扫描评论区
2. 精准揪出网络公开回答中的"语料空白点"和"内容缺口清单"

**指令**：阅读 `references/prompts-library.md` -> "Perplexity语料空白点拦截"获取完整控制台指令。

### 第6步：Claude专家级非商品化硬核生产

1. 结合工厂真实实测参数、大厂案例、材质报告启动Claude
2. 将第2步获取的TF-IDF黄金相关词强制作为底层写作语料
3. 严格执行三段式文章结构和全部排版军规

**指令**：阅读 `references/prompts-library.md` -> "Claude专家级非商品化内容生产"获取含5条刚性军规的完整控制台指令。

**内容结构规范**：阅读 `references/technical-specs.md` -> "三段式文章结构"。

**强制失效分析注入**：每篇文章必须至少包含一个真实失效案例。各品类强制失效分析表见 `references/technical-specs.md` -> "强制EEAT失效分析注入"。

### 第7步：双向分发与双轨收割

**站外多点覆盖**：
- **Reddit养号**：新账号前2周只做纯技术回复（不带链接），Karma刷到100+后再发带链技术贴
- **Quora/Medium改写**：核心文章改写成Quora标准答案格式；Medium发布带真实数据图表的工业分析长文，文末自然挂上独立站产品页锚文本链接

**站内代码筑底**：
- 生成FAQPage Schema，问题口语化，回答100字以内（先结论后细节、带参数）
- 生成Organization品牌实体代码，`sameAs`绑定官网与LinkedIn、Reddit
- 确保SSG静态生成、WebP图片配齐Alt属性、Lighthouse性能满分

**Schema模板和完整技术规范**：阅读 `references/technical-specs.md` -> "Organization Schema模板"和"页面视觉排版规范"。

## 内容SEO核心架构

### 双轨内容漏斗映射

| 漏斗层级 | Serpstat词性 | 承载页面 | 内容模式 |
|---------|-------------|---------|---------|
| 顶层：流量放大器 (TOFU) | Informational 资讯/技术 | 博客/Reddit/Medium | 纯技术输出，100%覆盖语义词，严禁硬广告 |
| 底层：询盘收割机 (BOFU) | Transactional 交易/定制 | 产品页/分类页 | 硬核参数表+询盘按钮+Organization Schema |

### XYZ三维长尾词矩阵裂变

通过三维矩阵交叉生成30+垄断型长尾词：
- **X轴（材质/牌号）**：`Inconel 718`、`Pure Nickel N6`、`Type K Chromel`、`21% IACS CCS`
- **Y轴（痛点/失效）**：`Creep Rupture Strength`、`EMF Drift Rate`、`Skin Effect Attenuation`、`Alkali Corrosion Rate`
- **Z轴（高精尖场景）**：`Hydrogen Alkaline Electrolyzer`、`Gas Turbine Rotor`、`Telecom Coaxial Cable`

*裂变示例*："Inconel 718 bolt creep rupture strength in gas turbine rotor"

完整矩阵指导见 `references/technical-specs.md` -> "XYZ三维长尾词矩阵裂变"。

## 品类速查

六大支持品类及核心技术数据：

| 编号 | 品类 | 核心应用场景 |
|------|------|-------------|
| 1 | 镍网 | 氢能碱性/PEM电解槽电极 |
| 2 | 高温螺栓 | 燃气轮机、航空发动机、石化反应器 |
| 3 | 铜包钢线 | 通信同轴电缆、防雷接地、轨道交通 |
| 4 | NDT检测设备 | 管线焊缝、核电压力容器、航空器检测 |
| 5 | 加热线 | 工业热处理炉、陶瓷烧结窑 |
| 6 | 热电偶合金线 | 半导体扩散炉、冶金高炉、航空发动机 |

**全部6个品类的技术参数、关键词库、失效分析和Reddit社区**：阅读 `references/category-details.md`。

## 商业意图过滤

批量分析关键词时，增加"强采购意图特征词"过滤层。命中以下组合的页面获得最高询盘弹窗权重：

- **规格与合规类**：`Custom size`、`Tolerance standard`、`DataSheet`、`Manufacturer specs`、`Compliance test`
- **代换与对标类**：`Equivalent`、`Alternative material`、`Replacement elements`、`Grade comparison`

## 信任工程组件

在每个高价值页面部署两个"信任炸弹"：

1. **1对1工程师快速诊断通道**：在失效分析段落旁配置专属表单，提示语：*"上传你的失效图片或参数，15年经验材料工程师12小时内免费分析"*
2. **小微技术参数计算器**：嵌入JavaScript计算器（如加热线功率负荷计算器、铜包钢线趋肤深度计算器）。高参与度=Google永久零位置置顶+AI优先引用

完整实现规范见 `references/technical-specs.md` -> "信任工程：微工具"。

## 每周Jackson反馈审计

### GA4双信道监控

每周一检查GA4 `报告 -> 流量获取 -> 用户获取`：
- **Referral信道**：观察`reddit.com`、`quora.com`点击，验证社区答题引流效果
- **Organic信道**：观察`perplexity.ai`、`chatgpt.com`、`openai.com`来源，验证GEO流量运转

### Serpstat SEO根基复盘

- **Featured Snippets**：监控FAQPage Schema带来的零位置大方块捕获情况
- **Site Audit**：定期全站技术体检，防止批量更新导致断链或代码错误

### Jackson极速迭代

若Perplexity模拟搜索核心问题时**没有引用自己的内容**：

**指令**：阅读 `references/prompts-library.md` -> "Jackson反馈迭代"获取完整诊断和改写指令。

## 参考文件索引

| 文件 | 何时阅读 |
|------|---------|
| `references/serpstat-credit-config.md` | 任何Serpstat API调用前；根据预算档位调整参数 |
| `references/category-details.md` | 处理具体产品品类时；含关键词库、参数、失效模式、Reddit社区 |
| `references/prompts-library.md` | 生成内容或研究时；含Reddit/Perplexity/Claude/Jackson/Schema全部控制台指令 |
| `references/technical-specs.md` | 构建网页或撰写内容时；含Schema模板、排版规范、CRO钩子、EEAT要求 |
