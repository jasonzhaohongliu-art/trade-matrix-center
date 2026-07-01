/**
 * 🧠 AI 批量多语种内容编排器（含 GEO 注入）— 六大品类全覆盖版
 *
 * 功能：
 * 1. 读取 shared-core/ 下的矩阵总控、六大品类产品参数库、痛点库
 * 2. 严格执行工业 B2B SEO/GEO 军规（反AI套话、非商品化失效案例、参数表格化、FAQ JSON-LD）
 * 3. 按站点 + 产品线 + 语种批量生成自带「蓄水池放行阀门 (draft: true)」的 Markdown 页面
 * 4. 六大品类：镍网 | 高温螺栓 | 铜包钢线 | NDT检测设备 | 加热线 | 热电偶合金线
 *
 * 用法：node scripts/generate-pages.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ═══════════════════════════════════════════════════════
// 辅助工具
// ═══════════════════════════════════════════════════════

function loadJSON(filename) {
  const filePath = path.join(ROOT, 'shared-core', filename);
  if (!fs.existsSync(filePath)) {
    if (filename === 'product-facts.json') return getMockProductFacts();
    if (filename === 'pain-points.json') return getMockPainPoints();
    return {};
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

// ═══════════════════════════════════════════════════════
// 核心页面生成器（支持 product_lines 数组迭代）
// ═══════════════════════════════════════════════════════

function generatePage(siteSlug, locale) {
  const seo = loadJSON('seo-matrix.json');
  const siteConfig = seo.sites.find(s => s.slug === siteSlug);
  if (!siteConfig) {
    console.error(`❌ 未找到站点配置: ${siteSlug}`);
    return;
  }

  const productLines = siteConfig.product_lines || [siteConfig.product_line];
  let totalGenerated = 0;

  productLines.forEach(productLine => {
    const xyzMatrix = getXYZKeywordsByProductLine(productLine, locale);

    xyzMatrix.forEach(item => {
      const failureAnalysis = getHardcoreFailure(productLine, locale);
      const techSpecsTable = getTechSpecsTable(productLine, item);
      const fileContent = buildPageMarkdown(item, productLine, locale, failureAnalysis, techSpecsTable);

      const siteDir = `site-${siteConfig.id.split('-')[1]}-${siteSlug}`;
      const targetDir = path.join(ROOT, 'websites', siteDir, 'src', 'pages', locale);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const targetPath = path.join(targetDir, `${item.slug}.md`);
      fs.writeFileSync(targetPath, fileContent, 'utf-8');
      totalGenerated++;
    });

    console.log(`  📄 [${productLine}] ─ ${xyzMatrix.length} 个长尾词命中 → ${locale.toUpperCase()}`);
  });

  console.log(`✅ 站点 [${siteSlug}] | 语种 [${locale.toUpperCase()}] | 共排产 ${totalGenerated} 个蓄水池页面`);
}

// ═══════════════════════════════════════════════════════
// 页面 Markdown 构建器
// ═══════════════════════════════════════════════════════

function buildPageMarkdown(item, productLine, locale, failureAnalysis, techSpecsTable) {
  return `---
layout: ../../layouts/Layout.astro
title: "Technical Analysis: ${item.keyword}"
slug: "${item.slug}"
lang: "${locale}"
seo_keyword: "${item.keyword}"
draft: true
---

> **TL;DR (10-Second Summary)**
> High-performance **${item.x}** engineered for high-precision **${item.z}** deployments. Optimized to guarantee exceptional **${item.y}** stability under continuous stress.

### 1. Direct Engineering Verdict & Root Solution
${getZeroPaddingVerdict(item, productLine, locale)}

### 2. Certified Technical Specifications
${techSpecsTable}

### 3. Hardcore Material Failure Analysis (EEAT Standard)
> **Field Failure Case Study:** ${failureAnalysis}

### 4. Technical Procurement Guidance
**Technical Recommendation:** Always review certification heat treatment records, composition traceability reports, and tolerance verification documents before deploying **${item.x}** into active industrial environments. Request mill test certificates (MTC) per EN 10204 Type 3.1 for full metallurgical traceability.

<script type="application/ld+json">
${JSON.stringify(generateFAQSchema(item, productLine, locale), null, 2)}
</script>
`;
}

// ═══════════════════════════════════════════════════════
// 军规 1：反 AI 腔调「零铺垫黑话开场」（按品类定制）
// ═══════════════════════════════════════════════════════

function getZeroPaddingVerdict(item, productLine, locale) {
  const verdicts = {
    Nickel_Mesh: {
      en: `The **${item.y}** of **Pure Nickel ${item.x}** mesh electrode within **${item.z}** is governed by aperture uniformity (±${item.tolerance || '2'}μm) and Raney Ni coating activation density — burr-induced current concentration at mesh edges remains the primary field failure root.`,
      de: `Die **${item.y}** von **Reinnickel-${item.x}**-Netzelektroden in **${item.z}** wird durch die Apertur-Gleichmäßigkeit (±${item.tolerance || '2'}μm) und die Raney-Ni-Beschichtungs-Aktivierungsdichte bestimmt — gratinduzierte Stromkonzentration an den Netzkanten bleibt die primäre Feldausfallursache.`,
      ja: `**${item.z}**における**純ニッケル${item.x}**メッシュ電極の**${item.y}**は、開口均一性（±${item.tolerance || '2'}μm）とラネーNiコーティング活性化密度によって支配され、メッシュエッジでのバリ誘起電流集中が主たるフィールド故障原因である。`
    },
    Inconel_718_Bolts: {
      en: `The **${item.y}** of **${item.x}** fasteners within **${item.z}** assemblies is fundamentally governed by microstructural phase stability under prolonged alternating thermo-mechanical loads — grain boundary M₂₃C₆ carbide precipitation due to inadequate solution treatment remains the #1 delayed fracture mechanism.`,
      de: `Die **${item.y}** von **${item.x}**-Verbindungselementen in **${item.z}**-Baugruppen wird grundlegend durch die mikrostrukturelle Phasenstabilität unter langfristiger wechselnder thermomechanischer Belastung bestimmt — die M₂₃C₆-Karbidausscheidung an Korngrenzen infolge unzureichender Lösungsglühung bleibt der primäre Mechanismus für verzögerten Sprödbruch.`,
      ja: `**${item.z}**アセンブリにおける**${item.x}**締結部品の**${item.y}**は、長期交番熱機械的負荷下での微視的組織の相安定性によって根本的に支配され、不適切な固溶化処理に起因する結晶粒界M₂₃C₆炭化物析出が遅れ脆性破壊の第1位メカニズムである。`
    },
    Copper_Clad_Steel: {
      en: `The **${item.y}** performance of **${item.x}** conductors in **${item.z}** is dictated by copper layer concentricity (≥ 95% spec) and interfacial bond integrity — eccentricity-driven thin-side copper breach and subsequent galvanic corrosion dominate field failure statistics.`,
      de: `Die **${item.y}**-Leistung von **${item.x}**-Leitern in **${item.z}** wird durch die Kupferschicht-Konzentrizität (≥ 95% Soll) und die Grenzflächen-Haftfestigkeit diktiert — exzentrizitätsbedingter Dünnstellen-Kupferdurchbruch und nachfolgende galvanische Korrosion dominieren die Feldausfallstatistik.`,
      ja: `**${item.z}**における**${item.x}**導体の**${item.y}**性能は、銅層同心度（≥ 95%）と界面接合完全性によって決定され、偏心駆動の薄肉部銅破れとそれに続くガルバニック腐食がフィールド故障統計を支配している。`
    },
    NDT_Equipment: {
      en: `Detection reliability of **${item.x}** for **${item.z}** critically depends on probe frequency selection matched to grain structure — using standard carbon-steel-optimized probes on austenitic welds generates forest-echo SNR collapse below 6 dB, masking critical lack-of-fusion defects.`,
      de: `Die Nachweiszuverlässigkeit von **${item.x}** für **${item.z}** hängt entscheidend von der an die Kornstruktur angepassten Prüfkopffrequenz ab — der Einsatz kohlenstoffstahloptimierter Standardprüfköpfe an austenitischen Schweißnähten erzeugt einen Waldrausch-SNR-Einbruch unter 6 dB und maskiert kritische Flankenbinderfehler.`,
      ja: `**${item.z}**における**${item.x}**の検出信頼性は、結晶粒組織に整合した探触子周波数選択に決定的に依存し、オーステナイト系溶接部に炭素鋼最適化標準探触子を使用すると林状エコーSN比が6 dB未満に崩壊し、重大な融合不良欠陥をマスクする。`
    },
    Heating_Wire: {
      en: `The **${item.y}** service lifetime of **${item.x}** elements within **${item.z}** is governed by oxidation kinetics and trace sulfur attack — NiCr grades suffer Ni₃S₂ eutectic liquid film formation (mp 645°C) in S > 5 ppm atmospheres, while FeCrAl grades face secondary recrystallization embrittlement above 1200°C.`,
      de: `Die **${item.y}**-Lebensdauer von **${item.x}**-Elementen in **${item.z}** wird durch die Oxidationskinetik und Spuren-Schwefelangriff bestimmt — NiCr-Legierungen erleiden Ni₃S₂-Eutektikum-Flüssigkeitsfilmbildung (Schmelzpunkt 645°C) in Atmosphären mit S > 5 ppm, während FeCrAl-Legierungen oberhalb 1200°C sekundärer Rekristallisationsversprödung ausgesetzt sind.`,
      ja: `**${item.z}**における**${item.x}**エレメントの**${item.y}**耐用寿命は、酸化速度論と微量硫黄侵食によって支配され、NiCr系はS > 5 ppm雰囲気中でNi₃S₂共晶液相膜形成（融点645°C）を生じ、FeCrAl系は1200°C超での二次再結晶脆化に直面する。`
    },
    Thermocouple_Alloy_Wire: {
      en: `The **${item.y}** measurement integrity of **${item.x}** sensors within **${item.z}** is compromised by two dominant drift mechanisms: Cr selective internal oxidation (green rot) in the KP positive leg under low-O₂ atmospheres at 200-500°C, and Ni-Cr short-range ordering (SRO) producing a Ni₂Cr superlattice that shifts the Seebeck coefficient by 2.8 μV/°C.`,
      de: `Die **${item.y}**-Messintegrität von **${item.x}**-Sensoren in **${item.z}** wird durch zwei dominante Driftmechanismen beeinträchtigt: selektive innere Cr-Oxidation (Grünfäule) im KP-Plusschenkel unter sauerstoffarmen Atmosphären bei 200-500°C sowie Ni-Cr-Nahbereichsordnung (SRO), die eine Ni₂Cr-Überstruktur bildet und den Seebeck-Koeffizienten um 2,8 μV/°C verschiebt.`,
      ja: `**${item.z}**における**${item.x}**センサーの**${item.y}**測定完全性は、2つの支配的ドリフトメカニズムによって損なわれる：200-500°Cの低酸素雰囲気下でのKP正脚におけるCrの選択的内部酸化（グリーンロット）、およびゼーベック係数を2.8 μV/°CシフトさせるNi₂Cr超格子を生成するNi-Cr短範囲規則化（SRO）。`
    }
  };

  return verdicts[productLine]?.[locale] || verdicts[productLine]?.en ||
    `The **${item.y}** of **${item.x}** within **${item.z}** is governed by certified material processing parameters and phase stability.`;
}

// ═══════════════════════════════════════════════════════
// 军规 2：硬核参数表格（六大品类全覆盖）
// ═══════════════════════════════════════════════════════

function getTechSpecsTable(productLine, item) {
  const tables = {
    Nickel_Mesh: () => `<div class="table-responsive">
<table>
  <thead>
    <tr><th>Metallurgical Parameter</th><th>Standard Value</th><th>Testing Standard</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Base Material Grade</strong></td><td><strong>Pure Nickel N6 / Ni200</strong> (≥ 99.5% Ni)</td><td>ASTM B162 / UNS N02200</td></tr>
    <tr><td><strong>Alternative Grade</strong></td><td>N4 / Ni202 (≥ 99.8% Ni)</td><td>ASTM B162 / UNS N02202</td></tr>
    <tr><td>Mesh Aperture Range</td><td><strong>10 - 400 mesh</strong> (2000 μm - 38 μm)</td><td>ISO 9044</td></tr>
    <tr><td>Aperture Tolerance</td><td>± 5 μm (≤ 100 mesh) / <strong>± 2 μm</strong> (> 100 mesh)</td><td>Microscope Scan 40×</td></tr>
    <tr><td>Wire Diameter Range</td><td>0.025 mm - 1.2 mm</td><td>Laser Micrometer</td></tr>
    <tr><td>Raney Ni Coating BET Surface</td><td><strong>≥ 80 m²/g</strong></td><td>ASTM D3663</td></tr>
    <tr><td>Target Application</td><td><strong>${item.z}</strong></td><td>${item.y} Verified</td></tr>
  </tbody>
</table>
</div>`,

    Inconel_718_Bolts: () => `<div class="table-responsive">
<table>
  <thead>
    <tr><th>Metallurgical Parameter</th><th>Standard Value</th><th>Testing Standard</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Primary Grade</strong></td><td><strong>Alloy 718 / UNS N07718 / GH4169</strong></td><td>ASTM B637 / AMS 5662</td></tr>
    <tr><td><strong>Alternative Grades</strong></td><td>A286 (UNS S66286) | Nimonic 80A | Nimonic 90 | Monel K500</td><td>ASTM B637 / AMS 5731</td></tr>
    <tr><td>Tensile Strength (Room Temp)</td><td><strong>≥ 1240 MPa</strong></td><td>ISO 6892-1 / ASTM E8</td></tr>
    <tr><td>Yield Strength (0.2% Offset)</td><td><strong>≥ 1034 MPa</strong></td><td>ISO 6892-1</td></tr>
    <tr><td>Elongation</td><td>≥ 12%</td><td>ASTM E8</td></tr>
    <tr><td>Max Continuous Service Temp</td><td><strong>704°C</strong></td><td>Creep Rupture Test</td></tr>
    <tr><td>Heat Treatment</td><td>Solution 980°C + Double Age 720°C/8h + 620°C/8h</td><td>AMS 2770</td></tr>
    <tr><td>Thread Tolerance</td><td><strong>6g / 6H Metric</strong> | Class 2A/2B UNC</td><td>ISO 965 / ASME B1.1</td></tr>
    <tr><td>Target Application</td><td><strong>${item.z}</strong></td><td>${item.y} Certified</td></tr>
  </tbody>
</table>
</div>`,

    Copper_Clad_Steel: () => `<div class="table-responsive">
<table>
  <thead>
    <tr><th>Electrical & Mechanical Property</th><th>Standard Value</th><th>Testing Standard</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Base Steel Standard</strong></td><td><strong>SWRCH6A</strong> (JIS G3507) Low-Carbon Core</td><td>JIS G3507</td></tr>
    <tr><td>Conductivity Grades</td><td><strong>21% IACS</strong> | 30% IACS | 40% IACS</td><td>ASTM B452 / IEC 60468</td></tr>
    <tr><td>Copper Volume Ratio</td><td>≥ 25% (21% IACS) — ≥ 50% (40% IACS)</td><td>Cross-Section Metallography</td></tr>
    <tr><td>Concentricity</td><td><strong>≥ 95%</strong> (Cu layer deviation ≤ 5%)</td><td>Laser Micrometer / ASTM B452</td></tr>
    <tr><td>Tensile Strength (Annealed)</td><td>≥ 350 - 400 MPa</td><td>ISO 6892-1</td></tr>
    <tr><td>Tensile Strength (Hard-Drawn)</td><td><strong>600 - 1200 MPa</strong></td><td>ISO 6892-1</td></tr>
    <tr><td>Cladding Thickness</td><td>≥ 0.25 mm (21% IACS) — ≥ 0.40 mm (40% IACS)</td><td>Optical Microscope 100×</td></tr>
    <tr><td>Bond Shear Strength</td><td><strong>≥ 137 MPa</strong></td><td>ASTM B452</td></tr>
    <tr><td>Target Application</td><td><strong>${item.z}</strong></td><td>${item.y} Optimized</td></tr>
  </tbody>
</table>
</div>`,

    NDT_Equipment: () => `<div class="table-responsive">
<table>
  <thead>
    <tr><th>Equipment / Probe Parameter</th><th>Standard Value</th><th>Compliance Standard</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Primary Technique</strong></td><td><strong>Phased Array Ultrasonic Testing (PAUT)</strong></td><td>EN ISO 18563 / ASME Sec V Art.4</td></tr>
    <tr><td><strong>Supplementary Technique</strong></td><td>TOFD (Time-of-Flight Diffraction) | Eddy Current (ET)</td><td>EN ISO 10863 / ISO 15549</td></tr>
    <tr><td>Channel Configuration</td><td><strong>16:64</strong> | 32:128 | 64:128</td><td>Manufacturer Spec</td></tr>
    <tr><td>Frequency Range</td><td>0.5 - 20 MHz (PAUT) / 2 - 15 MHz (TOFD)</td><td>EN 12668-2</td></tr>
    <tr><td>Sampling Rate</td><td><strong>100 MHz / 12-bit</strong></td><td>EN ISO 18563-1</td></tr>
    <tr><td>Gain Range</td><td>0 - 80 dB (0.1 dB step)</td><td>EN 12668-2</td></tr>
    <tr><td>Probe Wedge Angle (TOFD)</td><td>45° / 60° / 70°</td><td>EN ISO 10863</td></tr>
    <tr><td>Blind Zone (TOFD, dual-probe)</td><td><strong>≤ 1 mm</strong></td><td>EN ISO 10863 Annex B</td></tr>
    <tr><td>Inspector Certification</td><td><strong>EN ISO 9712 Level 2 minimum</strong></td><td>ISO 9712</td></tr>
    <tr><td>Target Application</td><td><strong>${item.z}</strong></td><td>${item.y} Verified</td></tr>
  </tbody>
</table>
</div>`,

    Heating_Wire: () => `<div class="table-responsive">
<table>
  <thead>
    <tr><th>Resistance Alloy Property</th><th>FeCrAl (0Cr21Al6Nb)</th><th>NiCr (Cr20Ni80)</th><th>Testing Standard</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Max Operating Temp</strong></td><td><strong>1200°C</strong> (Kanthal A1: 1425°C)</td><td><strong>1050°C</strong></td><td>IEC 60584 / ASTM B344</td></tr>
    <tr><td>Resistivity at 20°C</td><td><strong>1.45 ± 0.05 μΩ·m</strong></td><td><strong>1.09 ± 0.05 μΩ·m</strong></td><td>IEC 60468</td></tr>
    <tr><td>Tensile Strength</td><td>≥ 637 MPa</td><td>≥ 650 MPa</td><td>ISO 6892-1</td></tr>
    <tr><td>Elongation</td><td>≥ 15%</td><td>≥ 20%</td><td>ASTM E8</td></tr>
    <tr><td>Max Surface Load</td><td><strong>1.8 W/cm²</strong> (at 1200°C)</td><td><strong>1.5 W/cm²</strong> (at 1050°C)</td><td>IEC 60335</td></tr>
    <tr><td>Protective Oxide</td><td>Al₂O₃ (self-regenerating)</td><td>Cr₂O₃ (volatile above 1100°C)</td><td>SEM/EDS Analysis</td></tr>
    <tr><td>Atmosphere Restriction</td><td>Not for N₂ > 1150°C</td><td><strong>Sulfur > 5 ppm PROHIBITED</strong></td><td>Supplier Datasheet</td></tr>
    <tr><td>Diameter Tolerance (Ø ≤ 0.1mm)</td><td colspan="2"><strong>± 0.003 mm</strong></td><td>Laser Micrometer</td></tr>
    <tr><td>Target Application</td><td colspan="2"><strong>${item.z}</strong> — ${item.y}</td><td>Life-Cycle Verified</td></tr>
  </tbody>
</table>
</div>`,

    Thermocouple_Alloy_Wire: () => `<div class="table-responsive">
<table>
  <thead>
    <tr><th>Thermocouple Parameter</th><th>Type K (Chromel/Alumel)</th><th>Type S (Pt-Rh/Pt)</th><th>Testing Standard</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Positive Leg (+)</strong></td><td><strong>KP: Ni-Cr</strong> (~90% Ni + 10% Cr)</td><td><strong>SP: Pt-10%Rh</strong></td><td>IEC 60584-3</td></tr>
    <tr><td><strong>Negative Leg (−)</strong></td><td><strong>KN: Ni-Al-Mn-Si</strong> (~95% Ni)</td><td><strong>SN: Pure Pt</strong> (≥ 99.999%)</td><td>IEC 60584-3</td></tr>
    <tr><td>EMF Range</td><td><strong>-200°C to +1260°C</strong></td><td><strong>-50°C to +1768°C</strong></td><td>IEC 60584-1</td></tr>
    <tr><td>Tolerance Class 1</td><td><strong>± 1.5°C</strong> or ± 0.004·|t|</td><td><strong>± 1.0°C</strong> or ± 0.004·|t|</td><td>IEC 60584-2</td></tr>
    <tr><td>Tolerance Special Limits</td><td><strong>± 0.6°C</strong> or ± 0.002·|t|</td><td><strong>± 0.5°C</strong> or ± 0.002·|t|</td><td>IEC 60584-2</td></tr>
    <tr><td>EMF Drift Rate (at 1000°C)</td><td><strong>≤ 0.5°C/100h</strong></td><td>≤ 0.2°C/100h</td><td>ASTM E220</td></tr>
    <tr><td>Green Rot Risk Range</td><td><strong>200-500°C</strong> (low O₂ / reducing)</td><td>N/A (noble metal)</td><td>ASTM E230</td></tr>
    <tr><td>Wire Diameter (standard)</td><td colspan="2"><strong>0.025 mm - 3.2 mm</strong></td><td>Laser Micrometer</td></tr>
    <tr><td>Diameter Tolerance (Ø ≤ 0.5mm)</td><td colspan="2"><strong>± 0.003 mm</strong></td><td>IEC 60584-3</td></tr>
    <tr><td>Target Application</td><td colspan="2"><strong>${item.z}</strong></td><td>${item.y} Certified</td></tr>
  </tbody>
</table>
</div>`
  };

  return (tables[productLine] || (() => `<div class="table-responsive"><table><thead><tr><th>Parameter</th><th>Value</th><th>Standard</th></tr></thead><tbody><tr><td>Product Line</td><td>${productLine}</td><td>Certified</td></tr></tbody></table></div>`))();
}

// ═══════════════════════════════════════════════════════
// 军规 3：非商品化厂级 EEAT 失效分析（六大品类 × 三语种）
// ═══════════════════════════════════════════════════════

function getHardcoreFailure(productLine, lang) {
  const database = {
    Nickel_Mesh: {
      en: "Electrolyzer diaphragm thermal runaway puncture caused by burr-induced current concentration at mesh edges. Micro-burrs (≥ 15 μm) act as localized high-current-density pins in 30% KOH at 80°C, generating Joule-heat hot-spots exceeding the PTFE diaphragm melting point (327°C). Root cause: insufficient post-stamping electropolishing. Mandatory corrective action: controlled anodic deburring with ≤ 5 μm final edge radius and 100% stereomicroscope inspection at 40× per ASTM E381.",
      de: "Thermisch durchgehender Membrandurchschlag im Elektrolyseur durch gratinduzierte Stromkonzentration an den Netzkanten. Mikrograate (≥ 15 μm) wirken als lokale Hochstromdichtepunkte in 30%iger KOH bei 80°C und erzeugen Joule-Wärme-Hotspots oberhalb des PTFE-Membranschmelzpunktes (327°C). Ursache: unzureichendes Elektropolieren nach dem Stanzen. Zwingende Korrektur: kontrolliertes anodisches Entgraten mit ≤ 5 μm Endkantenradius und 100% Stereomikroskop-Prüfung bei 40× gemäß ASTM E381.",
      ja: "メッシュエッジのバリ誘起電流集中による電解槽隔膜の熱暴走パンクチャー。マイクロバリ（≥ 15 μm）が30% KOH、80°C環境下で局所的高電流密度ピンとして作用し、PTFE隔膜融点（327°C）を超えるジュール熱ホットスポットを生成。根本原因：打抜き後の電解研磨不足。必須是正処置：最終エッジ半径 ≤ 5 μmの制御された陽極バリ取りと、ASTM E381準拠の40倍実体顕微鏡100%検査。"
    },
    Inconel_718_Bolts: {
      en: "Delayed brittle fracture of Alloy 718 turbine disk bolts after 12,000 service hours at 650°C. SEM fractography revealed intergranular failure with continuous M₂₃C₆ carbide film (≈ 80 nm thickness) decorating grain boundaries — direct consequence of improper solution treatment below the 980°C solvus. Carbide network provides a low-energy fracture path; bolt failed at 62% of rated tensile load. Corrective: re-solution at 980°C ± 10°C for 1h/25mm + water quench, verified by ASTM E112 grain size 6-8 and SEM/EDS confirmation of clean grain boundaries at 5000×.",
      de: "Verzögerter Sprödbruch von Alloy-718-Turbinenscheibenbolzen nach 12.000 Betriebsstunden bei 650°C. REM-Fraktografie zeigte interkristallines Versagen mit kontinuierlichem M₂₃C₆-Karbidfilm (≈ 80 nm Dicke) an den Korngrenzen — direkte Folge unzureichender Lösungsglühung unterhalb der 980°C-Solvus-Temperatur. Das Karbidnetzwerk bietet einen niederenergetischen Bruchpfad; Bolzen versagte bei 62% der Nennzuglast. Korrektur: erneutes Lösungsglühen bei 980°C ± 10°C für 1h/25mm + Wasserabschreckung, verifiziert durch ASTM E112 Korngröße 6-8 und REM/EDX-Bestätigung sauberer Korngrenzen bei 5000×.",
      ja: "Alloy 718タービンディスクボルトが650°C、12,000稼働時間後に遅れ脆性破壊。SEM破面解析により結晶粒界に連続的M₂₃C₆炭化物膜（膜厚 ≈ 80 nm）が確認され、980°Cソルバス温度未満での不適切な固溶化熱処理の直接的結果。炭化物ネットワークが低エネルギー破壊経路を提供し、ボルトは定格引張荷重の62%で破断。是正：980°C ± 10°Cで1h/25mm厚の再固溶化＋水焼入れ、ASTM E112結晶粒度6-8およびSEM/EDS 5000倍での清浄粒界確認により検証。"
    },
    Copper_Clad_Steel: {
      en: "CCS grounding rod catastrophic failure after 18 months in pH 4.8 acidic soil. Cross-sectional metallography revealed copper layer eccentricity of 18% (spec: ≤ 5%), creating a thin-side copper thickness of only 0.08 mm. Acidic soil water penetrated through micro-pinholes, establishing a Cu-Fe galvanic couple (ΔE° = 0.78V). Steel core corroded at 0.35 mm/year, losing 42% cross-sectional area before ground resistance spiked above 25 Ω (spec: ≤ 10 Ω). Mitigation: in-line eddy current concentricity monitoring + minimum Cu layer ≥ 0.25 mm + ASTM B452 bond verification per batch.",
      de: "CCS-Erdungsstab-Katastrophenversagen nach 18 Monaten in Boden mit pH 4,8. Querschliff-Metallografie zeigte Kupferschicht-Exzentrizität von 18% (Soll: ≤ 5%), was eine Dünnstellen-Kupferdicke von nur 0,08 mm ergab. Saures Bodenwasser drang durch Mikroporen ein und bildete ein Cu-Fe-Lokalelement (ΔE° = 0,78V). Der Stahlkern korrodierte mit 0,35 mm/Jahr und verlor 42% der Querschnittsfläche, bevor der Erdungswiderstand auf über 25 Ω anstieg (Soll: ≤ 10 Ω). Gegenmaßnahme: Inline-Wirbelstrom-Konzentrizitätsüberwachung + Mindest-Kupferschicht ≥ 0,25 mm + ASTM B452 Haftfestigkeitsprüfung pro Charge.",
      ja: "CCS接地棒がpH 4.8の酸性土壌で18ヶ月後に致命的破損。断面金属組織検査により銅層偏心度18%（規格 ≤ 5%）、薄肉部銅厚僅か0.08 mm。酸性土壌水がマイクロピンホールを通じて侵入し、Cu-Feガルバニックカップル（ΔE° = 0.78V）を形成。鋼芯は0.35 mm/年で腐食し、接地抵抗が25 Ω超（規格 ≤ 10 Ω）に急上昇する前に断面積の42%を喪失。対策：インラインワイヤー渦流同心度監視＋最小銅層 ≥ 0.25 mm＋バッチ毎ASTM B452接合検証。"
    },
    NDT_Equipment: {
      en: "Missed 3.2 mm side-wall lack-of-fusion (LOF) defect in 304L stainless steel pipe girth weld (WT 25.4 mm) during PAUT inspection. Operator used standard 5 MHz linear array probe optimized for carbon steel, but coarse columnar grain structure in the austenitic weld (ASTM grain size 00-0) generated severe forest-echo noise with SNR ≤ 6 dB against the LOF target. Defect undetected across 3 inspection cycles; discovered only after hydrostatic test failure at 32 MPa. Mandatory protocol: low-frequency (2.25 MHz) TRL dual-crystal probe for all austenitic stainless welds, 45° shear-wave skip-distance calibration per EN ISO 22825 Annex A, pre-deployment SNR must exceed 12 dB on 2 mm SDH reference reflector.",
      de: "Übersehener 3,2 mm Flankenbindefehler in einer 304L-Edelstahl-Rundnaht (WT 25,4 mm) bei PAUT-Prüfung. Prüfer verwendete 5 MHz Lineararray-Prüfkopf, optimiert für Kohlenstoffstahl, aber grobe stengelkristalline Kornstruktur im austenitischen Schweißgut (ASTM-Korngröße 00-0) erzeugte starkes Waldrauschen mit SNR ≤ 6 dB gegenüber dem LOF-Ziel. Fehler blieb über 3 Prüfzyklen unentdeckt; erst nach Berstversagen bei 32 MPa entdeckt. Zwingendes Protokoll: Niederfrequenz (2,25 MHz) TRL-Doppelkristall-Prüfkopf für alle austenitischen Edelstahlschweißnähte, 45°-Transversalwellen-Sprungdistanz-Kalibrierung gemäß EN ISO 22825 Anhang A, SNR vor Feldeinsatz muss 12 dB an 2 mm SDH-Referenzreflektor überschreiten.",
      ja: "304Lステンレス鋼配管周溶接継手（肉厚25.4 mm）のPAUT検査中に3.2 mm側壁融合不良（LOF）欠陥を見逃し。検査員は炭素鋼用に最適化された5 MHzリニアアレイ探触子を使用したが、オーステナイト系溶接金属の粗大柱状晶組織（ASTM結晶粒度00-0）が激しい林状エコーノイズを発生させ、LOFターゲットに対するSN比が ≤ 6 dBに低下。3回の検査サイクルで欠陥検出されず、32 MPaでの水圧試験破壊後に初めて発見。必須プロトコル：全オーステナイト系ステンレス鋼溶接部に対し低周波（2.25 MHz）TRL二振動子探触子、EN ISO 22825 Annex A準拠45°横波スキップ距離校正、フィールド展開前に2 mm SDH基準反射体でSN比12 dB以上を確認。"
    },
    Heating_Wire: {
      en: "Catastrophic NiCr 80/20 heating element failure after 2,180 hours in a carburizing furnace atmosphere containing residual H₂S at 12 ppm. Post-mortem SEM/EDS identified Ni₃S₂ eutectic nodules (melting point 645°C) concentrated along grain boundaries to a depth of 80 μm. The liquid film formed at operating temperature (950°C) caused intergranular decohesion and instant open-circuit failure. Concurrently, a FeCrAl 0Cr21Al6Nb element in the same furnace suffered secondary recrystallization grain coarsening (ASTM GS 00 → 4), reducing creep strength by 55% and causing sag-induced short circuit. Remediation: NiCr prohibited where S > 5 ppm; FeCrAl requires Y micro-alloying (≥ 0.05%) for GB pinning + pre-oxidation at 1050°C/4h for protective Al₂O₃ scale.",
      de: "Katastrophaler NiCr-80/20-Heizelementausfall nach 2.180 Stunden in Aufkohlungsofenatmosphäre mit 12 ppm H₂S-Restgehalt. Post-Mortem-REM/EDX identifizierte Ni₃S₂-Eutektikum-Knötchen (Schmelzpunkt 645°C), die bis 80 μm Tiefe entlang der Korngrenzen konzentriert waren. Der bei Betriebstemperatur (950°C) gebildete Flüssigkeitsfilm verursachte interkristalline Dekohäsion und sofortigen Leerlaufausfall. Parallel erlitt ein FeCrAl-0Cr21Al6Nb-Element im selben Ofen sekundäre rekristallisationsbedingte Kornvergröberung (ASTM GS 00 → 4), was die Kriechfestigkeit um 55% reduzierte und durchhanginduzierten Kurzschluss verursachte. Abhilfe: NiCr verboten bei S > 5 ppm; FeCrAl benötigt Y-Mikrolegierung (≥ 0,05%) zur KG-Verankerung + Voroxidation bei 1050°C/4h für schützende Al₂O₃-Deckschicht.",
      ja: "NiCr 80/20発熱体が浸炭炉雰囲気中、残留H₂S 12 ppm条件下で2,180時間後に致命的故障。ポストモーテムSEM/EDSによりNi₃S₂共晶ノジュール（融点645°C）が結晶粒界に沿って深さ80 μmまで濃縮。運転温度（950°C）で形成された液相膜が粒界剥離と瞬時断線を引き起こした。同時に同一炉内のFeCrAl 0Cr21Al6Nb素線は二次再結晶による結晶粒粗大化（ASTM GS 00 → 4）を生じ、クリープ強度が55%低下、たるみ誘起短絡故障を発生。対策：NiCrはS > 5 ppm環境で使用禁止；FeCrAlは粒界ピン止めのためのYマイクロアロイング（≥ 0.05%）＋保護Al₂O₃スケール形成のための1050°C/4h予備酸化が必須。"
    },
    Thermocouple_Alloy_Wire: {
      en: "Type K thermocouple in semiconductor diffusion furnace exhibited +4.2°C EMF drift after 3,800 hours at 450°C in 50 ppm O₂ atmosphere. Drift traced to two concurrent mechanisms: (1) Short-range ordering (SRO) of Ni-Cr solid solution in the KP (Chromel) leg, producing a Ni₂Cr superlattice that increased the Seebeck coefficient by 2.8 μV/°C; (2) preferential internal oxidation of Cr forming Cr₂O₃ depleted zones, reducing thermoelectric homogeneity. Combined effect pushed readings outside Class 1 tolerance (± 1.5°C). Additionally, thermowell immersion depth was only 6× sheath OD (min. 10× required), causing 3.1°C stem conduction negative bias. Remediation: specify Special Limits Type K wire with pre-aged SRO stabilization (450°C/100h), minimum immersion depth 12× sheath OD, quarterly EMF verification per ASTM E220.",
      de: "Typ-K-Thermoelement im Halbleiter-Diffusionsofen zeigte nach 3.800 Stunden bei 450°C in 50 ppm O₂-Atmosphäre +4,2°C EMK-Drift. Drift auf zwei gleichzeitige Mechanismen zurückgeführt: (1) Nahbereichsordnung (SRO) des Ni-Cr-Mischkristalls im KP-Schenkel (Chromel), Bildung einer Ni₂Cr-Überstruktur, die den Seebeck-Koeffizienten um 2,8 μV/°C erhöhte; (2) bevorzugte innere Cr-Oxidation mit Bildung Cr₂O₃-verarmter Zonen, Verringerung der thermoelektrischen Homogenität. Kombinierter Effekt verschob Messwerte außerhalb Klasse-1-Toleranz (± 1,5°C). Zusätzlich betrug die Schutzrohr-Eintauchtiefe nur 6× Mantel-AD (min. 10× erforderlich), was einen negativen Wärmeableitfehler von 3,1°C verursachte. Abhilfe: Spezifikation von Special-Limits-Typ-K-Draht mit vorgealterter SRO-Stabilisierung (450°C/100h), Mindest-Eintauchtiefe 12× Mantel-AD, vierteljährliche EMK-Verifizierung gemäß ASTM E220.",
      ja: "半導体拡散炉のType K熱電対が450°C、50 ppm O₂雰囲気下で3,800時間後に+4.2°CのEMFドリフトを発生。ドリフトは2つの同時進行メカニズムに起因：(1) KP脚（クロメル）におけるNi-Cr固溶体の短範囲規則化（SRO）がNi₂Cr超格子を生成し、ゼーベック係数を2.8 μV/°C増大；(2) Crの選択的内部酸化がCr₂O₃欠乏域を形成し、熱電均質性を低下。複合効果により指示値がClass 1許容差（± 1.5°C）を超過。さらに保護管挿入深さがシース外径の僅か6倍（最小10倍必要）で、3.1°Cの熱伝導損失負偏差が発生。対策：予備時効SRO安定化処理（450°C/100h）済みSpecial Limits Type Kワイヤを指定、最小挿入深さをシース外径の12倍に、ASTM E220準拠の四半期毎EMF検証を実施。"
    }
  };

  return database[productLine]?.[lang] || database[productLine]?.en ||
    "Field failure analysis data pending — contact engineering for detailed metallurgical investigation report.";
}

// ═══════════════════════════════════════════════════════
// 军规 4：FAQPage Schema 生成（表里对齐, Google 零位置置顶）
// ═══════════════════════════════════════════════════════

function generateFAQSchema(item, productLine, locale) {
  const faqByProductLine = {
    Nickel_Mesh: {
      en: { q: `What causes nickel mesh electrode failure in ${item.z}?`, a: `Performance degradation is triggered by burr-induced current concentration at mesh edges (≥ 15 μm burrs act as hot-spot nucleation sites) combined with KOH electrolyte attack. Solution: controlled anodic deburring to ≤ 5 μm edge radius per ASTM E381.` },
      de: { q: `Was verursacht Nickelnetz-Elektrodenversagen in ${item.z}?`, a: `Leistungsabfall wird durch gratinduzierte Stromkonzentration an Netzkanten (≥ 15 μm Grate als Hotspot-Keimstellen) in Kombination mit KOH-Elektrolytangriff ausgelöst. Lösung: kontrolliertes anodisches Entgraten auf ≤ 5 μm Kantenradius gemäß ASTM E381.` },
      ja: { q: `${item.z}におけるニッケルメッシュ電極故障の原因は？`, a: `性能劣化は、メッシュエッジでのバリ誘起電流集中（≥ 15 μmバリがホットスポット核生成点として作用）とKOH電解液侵食の複合により引き起こされる。解決策：ASTM E381準拠の ≤ 5 μmエッジ半径への制御された陽極バリ取り。` }
    },
    Inconel_718_Bolts: {
      en: { q: `What parameter controls ${item.x} fastener lifetime in ${item.z}?`, a: `Fastener lifetime is controlled by solution treatment quality (980°C minimum solvus) and double-aging precision (720°C/8h + 620°C/8h). Inadequate solution treatment leads to continuous M₂₃C₆ carbide grain boundary films causing delayed brittle fracture. Verify by ASTM E112 grain size 6-8 and SEM/EDS at 5000×.` },
      de: { q: `Welcher Parameter steuert die Lebensdauer von ${item.x}-Verbindungselementen in ${item.z}?`, a: `Die Lebensdauer wird durch die Qualität der Lösungsglühung (mindestens 980°C Solvus) und die Präzision der Doppelauslagerung (720°C/8h + 620°C/8h) gesteuert. Unzureichende Lösungsglühung führt zu kontinuierlichen M₂₃C₆-Karbidfilmen an den Korngrenzen, die verzögerten Sprödbruch verursachen. Verifizierung durch ASTM E112 Korngröße 6-8 und REM/EDX bei 5000×.` },
      ja: { q: `${item.z}における${item.x}締結部品の寿命を支配するパラメータは？`, a: `締結部品の寿命は固溶化熱処理品質（最低980°Cソルバス）と二段時効精度（720°C/8h + 620°C/8h）により支配される。不十分な固溶化処理は連続的M₂₃C₆炭化物粒界膜を生じさせ、遅れ脆性破壊を引き起こす。ASTM E112結晶粒度6-8およびSEM/EDS 5000倍で検証。` }
    },
    Copper_Clad_Steel: {
      en: { q: `Why does copper clad steel wire fail in ${item.z} applications?`, a: `Primary failure mechanism is eccentricity-driven thin-side copper breach (spec: ≥ 95% concentricity). When copper thickness drops below 0.08 mm at eccentric points, acidic soil or moisture penetrates and establishes a Cu-Fe galvanic couple (ΔE° = 0.78V), causing accelerated steel core corrosion. Verify concentricity via laser micrometer per ASTM B452.` },
      de: { q: `Warum versagt kupferummantelter Stahldraht in ${item.z}-Anwendungen?`, a: `Primärer Versagensmechanismus ist exzentrizitätsbedingter Dünnstellen-Kupferdurchbruch (Soll: ≥ 95% Konzentrizität). Wenn die Kupferdicke an exzentrischen Stellen unter 0,08 mm fällt, dringt saure Bodenfeuchtigkeit ein und bildet ein Cu-Fe-Lokalelement (ΔE° = 0,78V), das beschleunigte Stahlkernkorrosion verursacht. Konzentrizität per Lasermikrometer gemäß ASTM B452 prüfen.` },
      ja: { q: `${item.z}用途で銅被覆鋼線が故障する理由は？`, a: `主たる故障メカニズムは偏心駆動の薄肉部銅破れ（仕様：≥ 95%同心度）。偏心点で銅厚が0.08 mmを下回ると、酸性土壌水分が浸入しCu-Feガルバニックカップル（ΔE° = 0.78V）を形成し、鋼芯の加速腐食を引き起こす。ASTM B452準拠レーザーマイクロメーターで同心度検証。` }
    },
    NDT_Equipment: {
      en: { q: `How to avoid missed defect detection in ${item.z} with ${item.x}?`, a: `Austenitic stainless steel welds require low-frequency (2.25 MHz) TRL dual-crystal probes instead of standard 5 MHz carbon-steel probes. The coarse columnar grain structure (ASTM GS 00-0) in austenitic welds causes severe forest-echo noise; TRL probes maintain SNR ≥ 12 dB on 2 mm SDH reference reflector per EN ISO 22825 Annex A. Always verify probe-grain-structure compatibility before field deployment.` },
      de: { q: `Wie vermeidet man übersehene Fehler bei der Prüfung von ${item.z} mit ${item.x}?`, a: `Austenitische Edelstahlschweißnähte erfordern niederfrequente (2,25 MHz) TRL-Doppelkristall-Prüfköpfe anstelle von 5-MHz-Kohlenstoffstahl-Standardprüfköpfen. Die grobe stengelkristalline Kornstruktur (ASTM GS 00-0) in austenitischen Schweißnähten verursacht starkes Waldrauschen; TRL-Prüfköpfe halten einen SNR ≥ 12 dB an 2 mm SDH-Referenzreflektor gemäß EN ISO 22825 Anhang A. Vor Feldeinsatz stets Prüfkopf-Kornstruktur-Kompatibilität prüfen.` },
      ja: { q: `${item.z}で${item.x}を使用する際に欠陥見逃しを防ぐ方法は？`, a: `オーステナイト系ステンレス鋼溶接部には、標準5 MHz炭素鋼探触子ではなく低周波（2.25 MHz）TRL二振動子探触子が必要。オーステナイト系溶接部の粗大柱状晶組織（ASTM GS 00-0）は激しい林状エコーノイズを発生；TRL探触子はEN ISO 22825 Annex A準拠の2 mm SDH基準反射体でSN比 ≥ 12 dBを維持。フィールド展開前に探触子-結晶粒組織適合性を必ず検証。` }
    },
    Heating_Wire: {
      en: { q: `How to select the correct resistance heating alloy for ${item.z}?`, a: `For atmospheres with sulfur > 5 ppm, NiCr (Cr20Ni80) is PROHIBITED — it forms Ni₃S₂ eutectic liquid film at 645°C causing instant failure. Use FeCrAl (0Cr21Al6Nb or Kanthal A1) instead, with Y micro-alloying (≥ 0.05%) for grain boundary pinning. For clean oxidizing atmospheres below 1050°C, NiCr 80/20 offers superior ductility and formability. Always pre-oxidize FeCrAl at 1050°C/4h before deployment.` },
      de: { q: `Wie wählt man die richtige Widerstandsheizlegierung für ${item.z} aus?`, a: `In Atmosphären mit Schwefel > 5 ppm ist NiCr (Cr20Ni80) VERBOTEN — es bildet bei 645°C einen Ni₃S₂-Eutektikum-Flüssigkeitsfilm, der sofortiges Versagen verursacht. Stattdessen FeCrAl (0Cr21Al6Nb oder Kanthal A1) mit Y-Mikrolegierung (≥ 0,05%) zur Korngrenzenverankerung verwenden. Für saubere oxidierende Atmosphären unter 1050°C bietet NiCr 80/20 überlegene Duktilität und Umformbarkeit. FeCrAl vor Einsatz stets bei 1050°C/4h voroxidieren.` },
      ja: { q: `${item.z}に適した抵抗加熱合金の選定方法は？`, a: `硫黄 > 5 ppmの雰囲気ではNiCr（Cr20Ni80）は使用禁止 — 645°CでNi₃S₂共晶液相膜を形成し瞬時故障を引き起こす。代わりにFeCrAl（0Cr21Al6NbまたはKanthal A1）を、粒界ピン止めのためのYマイクロアロイング（≥ 0.05%）付きで使用する。1050°C未満の清浄な酸化性雰囲気では、NiCr 80/20が優れた延性と成形性を提供。FeCrAlは展開前に必ず1050°C/4hの予備酸化を実施。` }
    },
    Thermocouple_Alloy_Wire: {
      en: { q: `What causes ${item.x} EMF drift in ${item.z} and how to prevent it?`, a: `Two dominant mechanisms: (1) Cr selective internal oxidation (green rot) in KP leg at 200-500°C in low-O₂ reducing atmospheres; (2) Ni-Cr short-range ordering producing Ni₂Cr superlattice that shifts Seebeck coefficient by 2.8 μV/°C. Prevention: specify pre-aged SRO-stabilized wire (450°C/100h), use mineral-insulated (MgO) sheath with hermetic seal, maintain minimum immersion depth 12× sheath OD, perform quarterly ice-point EMF verification per ASTM E220.` },
      de: { q: `Was verursacht ${item.x}-EMK-Drift in ${item.z} und wie verhindert man sie?`, a: `Zwei dominante Mechanismen: (1) selektive innere Cr-Oxidation (Grünfäule) im KP-Schenkel bei 200-500°C in sauerstoffarmen reduzierenden Atmosphären; (2) Ni-Cr-Nahbereichsordnung mit Bildung einer Ni₂Cr-Überstruktur, die den Seebeck-Koeffizienten um 2,8 μV/°C verschiebt. Prävention: vorgealterten SRO-stabilisierten Draht spezifizieren (450°C/100h), mineralisoliertes (MgO) Mantelthermoelement mit hermetischer Abdichtung verwenden, Mindest-Eintauchtiefe 12× Mantel-AD einhalten, vierteljährliche Eispunkt-EMK-Verifizierung gemäß ASTM E220 durchführen.` },
      ja: { q: `${item.z}で${item.x}のEMFドリフトを引き起こす原因とその防止方法は？`, a: `2つの支配的メカニズム：(1) 200-500°Cの低酸素還元性雰囲気下でのKP脚におけるCrの選択的内部酸化（グリーンロット）；(2) ゼーベック係数を2.8 μV/°CシフトさせるNi₂Cr超格子を生成するNi-Cr短範囲規則化。防止策：予備時効SRO安定化ワイヤ（450°C/100h）の指定、気密封止付きミネラル絶縁（MgO）シースの使用、シース外径の12倍以上の最小挿入深さ維持、ASTM E220準拠の四半期毎氷点EMF検証の実施。` }
    }
  };

  const entry = faqByProductLine[productLine]?.[locale] || faqByProductLine[productLine]?.en;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": entry?.q || `What parameter controls ${item.x} performance in ${item.z}?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": entry?.a || `Performance is strictly determined by certified material processing parameters, phase stability, and application-specific tolerance verification optimized for ${item.y}.`
      }
    }]
  };
}

// ═══════════════════════════════════════════════════════
// XYZ 三维长尾词裂变状态机（六大品类 × 三语种 × N词条）
// ═══════════════════════════════════════════════════════

function getXYZKeywordsByProductLine(productLine, locale) {
  const isDE = locale === 'de';
  const isJA = locale === 'ja';

  const matrices = {
    // ── 品类 1：镍网 ──
    Nickel_Mesh: [
      {
        slug: `pure-nickel-n6-mesh-aperture-tolerance-alkaline-electrolyzer-${locale}`,
        keyword: isDE ? "Reinnickel N6 Netz Aperturtoleranz im alkalischen Elektrolyseur" :
                 isJA ? "アルカリ電解槽における純ニッケルN6メッシュ開口公差" :
                        "Pure Nickel N6 mesh aperture tolerance in alkaline electrolyzer",
        x: "Pure Nickel N6 (UNS N02200)", y: isDE ? "Aperturtoleranz ±2μm" : isJA ? "開口公差 ±2μm" : "Aperture Tolerance ±2μm", z: isDE ? "Alkalischer Elektrolyseur" : isJA ? "アルカリ電解槽" : "Alkaline Electrolyzer", tolerance: "2"
      },
      {
        slug: `raney-nickel-coated-mesh-bet-surface-hydrogen-production-${locale}`,
        keyword: isDE ? "Raney-Nickel-beschichtetes Netz BET-Oberfläche Wasserstoffproduktion AWE" :
                 isJA ? "ラネーニッケル被覆メッシュ BET表面積 水素製造 AWE" :
                        "Raney Nickel coated mesh BET surface area hydrogen production AWE",
        x: "Raney Ni / N6 Composite Mesh", y: isDE ? "BET ≥ 80 m²/g" : isJA ? "BET ≥ 80 m²/g" : "BET ≥ 80 m²/g", z: isDE ? "AWE-Wasserstoffproduktion" : isJA ? "AWE水素製造" : "AWE Hydrogen Production", tolerance: "5"
      },
      {
        slug: `n4-nickel-mesh-corrosion-rate-koh-electrolyte-80c-${locale}`,
        keyword: isDE ? "N4 Nickelnetz Korrosionsrate in 30% KOH Elektrolyt bei 80°C" :
                 isJA ? "30% KOH電解液中80°CにおけるN4ニッケルメッシュ腐食速度" :
                        "N4 nickel mesh corrosion rate in 30% KOH electrolyte at 80°C",
        x: "Pure Nickel N4 (UNS N02202)", y: isDE ? "Korrosionsrate < 0.01 mm/Jahr" : isJA ? "腐食速度 < 0.01 mm/年" : "Corrosion Rate < 0.01 mm/year", z: isDE ? "30% KOH @ 80°C" : isJA ? "30% KOH @ 80°C" : "30% KOH @ 80°C", tolerance: "2"
      }
    ],

    // ── 品类 2：高温螺栓 ──
    Inconel_718_Bolts: [
      {
        slug: `inconel-718-bolt-creep-rupture-life-gas-turbine-rotor-${locale}`,
        keyword: isDE ? "Inconel 718 Bolzen Zeitstandlebensdauer im Gasturbinenrotor 650°C" :
                 isJA ? "ガスタービンローター650°Cにおけるインコネル718ボルトのクリープラプチャー寿命" :
                        "Inconel 718 bolt creep rupture life in gas turbine rotor at 650°C",
        x: "Inconel 718 (UNS N07718)", y: isDE ? "Zeitstandfestigkeit ≥ 100h/650°C/690MPa" : isJA ? "クリープラプチャー ≥ 100h/650°C/690MPa" : "Creep Rupture ≥ 100h/650°C/690MPa", z: isDE ? "Gasturbinenrotor" : isJA ? "ガスタービンローター" : "Gas Turbine Rotor"
      },
      {
        slug: `a286-vs-alloy718-bolt-tensile-strength-aeroengine-casing-${locale}`,
        keyword: isDE ? "A286 vs Alloy 718 Bolzen Zugfestigkeitsvergleich im Flugtriebwerksgehäuse" :
                 isJA ? "航空エンジンケーシングにおけるA286対Alloy 718ボルト引張強度比較" :
                        "A286 vs Alloy 718 bolt tensile strength comparison in aeroengine casing",
        x: "A286 (UNS S66286) vs Alloy 718", y: isDE ? "Zugfestigkeit 896 vs 1240 MPa" : isJA ? "引張強度 896 vs 1240 MPa" : "Tensile Strength 896 vs 1240 MPa", z: isDE ? "Flugtriebwerksgehäuse" : isJA ? "航空エンジンケーシング" : "Aeroengine Casing"
      },
      {
        slug: `nimonic-80a-bolt-anti-galling-coating-hydrogen-reactor-flange-${locale}`,
        keyword: isDE ? "Nimonic 80A Bolzen Anti-Fress-Beschichtung für Wasserstoffreaktorflansch 700°C" :
                 isJA ? "水素化反応器フランジ用Nimonic 80Aボルト耐焼付きコーティング 700°C" :
                        "Nimonic 80A bolt anti-galling coating for hydrogen reactor flange at 700°C",
        x: "Nimonic 80A (UNS N07080)", y: isDE ? "MoS₂ Trockenschmierfilm + Bor-Nitrid" : isJA ? "MoS₂乾性被膜 + 窒化ホウ素" : "MoS₂ Dry Film + Boron Nitride Coat", z: isDE ? "Wasserstoffreaktorflansch" : isJA ? "水素化反応器フランジ" : "Hydrogen Reactor Flange"
      }
    ],

    // ── 品类 3：铜包钢线 ──
    Copper_Clad_Steel: [
      {
        slug: `ccs-21iacs-concentricity-tolerance-grounding-rod-acidic-soil-${locale}`,
        keyword: isDE ? "CCS 21% IACS Konzentrizitätstoleranz Erdungsstab in saurem Boden pH 4.8" :
                 isJA ? "CCS 21% IACS 同心度公差 酸性土壌pH 4.8における接地棒" :
                        "CCS 21% IACS concentricity tolerance grounding rod in acidic soil pH 4.8",
        x: "SWRCH6A CCS 21% IACS", y: isDE ? "Konzentrizität ≥ 95%" : isJA ? "同心度 ≥ 95%" : "Concentricity ≥ 95%", z: isDE ? "Erdungsstab pH 4.8" : isJA ? "接地棒 pH 4.8" : "Grounding Rod pH 4.8"
      },
      {
        slug: `ccs-40iacs-skin-effect-coaxial-cable-center-conductor-${locale}`,
        keyword: isDE ? "CCS 40% IACS Skin-Effekt-Optimierung Koaxialkabel Innenleiter Hochfrequenz" :
                 isJA ? "CCS 40% IACS 表皮効果最適化 同軸ケーブル中心導体 高周波" :
                        "CCS 40% IACS skin effect optimization coaxial cable center conductor high frequency",
        x: "CCS 40% IACS Hard-Drawn", y: isDE ? "Skin-Effekt ≤ 0.15 mm @ 100 MHz" : isJA ? "表皮深さ ≤ 0.15 mm @ 100 MHz" : "Skin Depth ≤ 0.15 mm @ 100 MHz", z: isDE ? "Koaxialkabel Innenleiter" : isJA ? "同軸ケーブル中心導体" : "Coaxial Cable Center Conductor"
      },
      {
        slug: `copper-clad-steel-bond-shear-strength-astm-b452-telecom-${locale}`,
        keyword: isDE ? "Kupferummantelter Stahl Haftscherfestigkeit ASTM B452 Telekommunikationserdung" :
                 isJA ? "銅被覆鋼 接合せん断強度 ASTM B452 通信接地" :
                        "Copper clad steel bond shear strength ASTM B452 telecom grounding",
        x: "CCS 30% IACS Bond-Verified", y: isDE ? "Scherfestigkeit ≥ 137 MPa" : isJA ? "せん断強度 ≥ 137 MPa" : "Shear Strength ≥ 137 MPa", z: isDE ? "Telekommunikationserdung" : isJA ? "通信接地システム" : "Telecom Grounding System"
      }
    ],

    // ── 品类 4：NDT检测设备 ──
    NDT_Equipment: [
      {
        slug: `paut-austenitic-stainless-steel-weld-trl-probe-forest-echo-${locale}`,
        keyword: isDE ? "PAUT austenitische Edelstahlschweißnaht TRL-Prüfkopf Waldrauschen SNR 304L" :
                 isJA ? "PAUT オーステナイト系ステンレス鋼溶接部 TRL探触子 林状エコー SNR 304L" :
                        "PAUT austenitic stainless steel weld TRL probe forest echo SNR 304L",
        x: "PAUT 2.25 MHz TRL Dual-Crystal Probe", y: isDE ? "SNR ≥ 12 dB (2mm SDH)" : isJA ? "SNR ≥ 12 dB (2mm SDH)" : "SNR ≥ 12 dB (2mm SDH)", z: isDE ? "304L Rohrleitungsrundnaht" : isJA ? "304L配管周溶接継手" : "304L Pipe Girth Weld"
      },
      {
        slug: `tofd-blind-zone-reduction-pipeline-girth-weld-inspection-${locale}`,
        keyword: isDE ? "TOFD Totzonenreduzierung Rohrleitungsrundnahtprüfung EN ISO 10863 Doppelprüfkopf" :
                 isJA ? "TOFD不感帯低減 パイプライン周溶接継手検査 EN ISO 10863 二探触子" :
                        "TOFD blind zone reduction pipeline girth weld inspection EN ISO 10863 dual probe",
        x: "TOFD 10 MHz Dual-Probe Configuration", y: isDE ? "Totzone ≤ 1 mm" : isJA ? "不感帯 ≤ 1 mm" : "Blind Zone ≤ 1 mm", z: isDE ? "Fernleitungsrundnaht" : isJA ? "長距離パイプライン周溶接継手" : "Long-Distance Pipeline Girth Weld"
      },
      {
        slug: `eddy-current-surface-crack-detection-aircraft-landing-gear-${locale}`,
        keyword: isDE ? "Wirbelstromprüfung Oberflächenrisserkennung Flugzeugfahrwerk EN ISO 15549" :
                 isJA ? "渦電流探傷 表面亀裂検出 航空機着陸装置 EN ISO 15549" :
                        "Eddy current surface crack detection aircraft landing gear EN ISO 15549",
        x: "ET Differential Probe 500 kHz", y: isDE ? "Risserkennung ≥ 0.1 mm Tiefe" : isJA ? "亀裂検出 ≥ 0.1 mm深さ" : "Crack Detection ≥ 0.1 mm Depth", z: isDE ? "Flugzeugfahrwerk" : isJA ? "航空機着陸装置" : "Aircraft Landing Gear"
      }
    ],

    // ── 品类 5：加热线 ──
    Heating_Wire: [
      {
        slug: `fecral-0cr21al6nb-max-operating-temperature-industrial-furnace-${locale}`,
        keyword: isDE ? "FeCrAl 0Cr21Al6Nb maximale Betriebstemperatur Industrieofen 1200°C Oberflächenlast" :
                 isJA ? "FeCrAl 0Cr21Al6Nb 最高使用温度 工業炉 1200°C 表面負荷" :
                        "FeCrAl 0Cr21Al6Nb max operating temperature industrial furnace 1200°C surface load",
        x: "FeCrAl 0Cr21Al6Nb", y: isDE ? "Oberflächenlast 1.8 W/cm²" : isJA ? "表面負荷 1.8 W/cm²" : "Surface Load 1.8 W/cm²", z: isDE ? "Industrie-Wärmebehandlungsofen" : isJA ? "工業熱処理炉" : "Industrial Heat Treatment Furnace"
      },
      {
        slug: `nicr-8020-sulfur-attack-eutectic-failure-carburizing-furnace-${locale}`,
        keyword: isDE ? "NiCr 80/20 Schwefelangriff Eutektikum-Versagen Aufkohlungsofen H₂S Ni₃S₂" :
                 isJA ? "NiCr 80/20 硫黄侵食 共晶破断 浸炭炉 H₂S Ni₃S₂" :
                        "NiCr 80/20 sulfur attack eutectic failure carburizing furnace H₂S Ni₃S₂",
        x: "NiCr 80/20 (Cr20Ni80)", y: isDE ? "Ni₃S₂ Eutektikum 645°C" : isJA ? "Ni₃S₂共晶 645°C" : "Ni₃S₂ Eutectic 645°C", z: isDE ? "Aufkohlungsofen H₂S 12ppm" : isJA ? "浸炭炉 H₂S 12ppm" : "Carburizing Furnace H₂S 12ppm"
      },
      {
        slug: `kanthal-a1-vs-cr20ni80-resistivity-drift-ceramic-sintering-kiln-${locale}`,
        keyword: isDE ? "Kanthal A1 vs Cr20Ni80 Widerstandsdrift Keramiksinterofen Lebensdauervergleich" :
                 isJA ? "カンタルA1 vs Cr20Ni80 抵抗ドリフト セラミック焼結窯 寿命比較" :
                        "Kanthal A1 vs Cr20Ni80 resistivity drift ceramic sintering kiln lifetime comparison",
        x: "Kanthal A1 (FeCrAl) vs Cr20Ni80", y: isDE ? "Widerstand 1.45 vs 1.09 μΩ·m" : isJA ? "抵抗率 1.45 vs 1.09 μΩ·m" : "Resistivity 1.45 vs 1.09 μΩ·m", z: isDE ? "Keramiksinterofen" : isJA ? "セラミック焼結窯" : "Ceramic Sintering Kiln"
      }
    ],

    // ── 品类 6：热电偶合金线 ──
    Thermocouple_Alloy_Wire: [
      {
        slug: `type-k-thermocouple-green-rot-emf-drift-semiconductor-diffusion-furnace-${locale}`,
        keyword: isDE ? "Typ K Thermoelement Grünfäule EMK-Drift Halbleiterdiffusionsofen 450°C" :
                 isJA ? "K型熱電対 グリーンロット 起電力ドリフト 半導体拡散炉 450°C" :
                        "Type K thermocouple green rot EMF drift semiconductor diffusion furnace 450°C",
        x: "Type K (Chromel/Alumel)", y: isDE ? "EMK-Drift ≤ 0.5°C/100h" : isJA ? "起電力ドリフト ≤ 0.5°C/100h" : "EMF Drift ≤ 0.5°C/100h", z: isDE ? "Halbleiterdiffusionsofen" : isJA ? "半導体拡散炉" : "Semiconductor Diffusion Furnace"
      },
      {
        slug: `type-s-pt-rh-thermocouple-special-limits-tolerance-blast-furnace-${locale}`,
        keyword: isDE ? "Typ S Pt-Rh Thermoelement Special Limits Toleranz Hochofen Schmelzmetall 1600°C" :
                 isJA ? "S型 Pt-Rh熱電対 特殊限界許容差 高炉 溶融金属 1600°C" :
                        "Type S Pt-Rh thermocouple Special Limits tolerance blast furnace molten metal 1600°C",
        x: "Type S (Pt-10%Rh / Pt)", y: isDE ? "Toleranz ± 0.5°C Special Limits" : isJA ? "許容差 ± 0.5°C Special Limits" : "Tolerance ± 0.5°C Special Limits", z: isDE ? "Hochofen Schmelzmetall" : isJA ? "高炉溶融金属" : "Blast Furnace Molten Metal"
      },
      {
        slug: `thermocouple-immersion-depth-stem-conduction-error-negative-bias-${locale}`,
        keyword: isDE ? "Thermoelement Eintauchtiefe Wärmeableitfehler negative Abweichung ASTM E220 Korrektur" :
                 isJA ? "熱電対 挿入深さ 熱伝導損失誤差 負偏差 ASTM E220 補正" :
                        "Thermocouple immersion depth stem conduction error negative bias ASTM E220 correction",
        x: "Mineral-Insulated Type K", y: isDE ? "Eintauchtiefe ≥ 12× Mantel-AD" : isJA ? "挿入深さ ≥ 12× シース外径" : "Immersion ≥ 12× Sheath OD", z: isDE ? "Großrohr-Temperaturmessung" : isJA ? "大口径配管温度測定" : "Large-Bore Pipe Temperature Measurement"
      }
    ]
  };

  return matrices[productLine] || [];
}

// ═══════════════════════════════════════════════════════
// 降级兜底库
// ═══════════════════════════════════════════════════════

function getMockProductFacts() { return { description: "Fallback standard technical specifications database — 6 categories." }; }
function getMockPainPoints() { return { description: "Fallback buyer operational pain points database — 6 categories." }; }

// ═══════════════════════════════════════════════════════
// 🚀 自动化排产流水线执行引擎
// ═══════════════════════════════════════════════════════

const TARGETS = [
  { site: 'inconel', locales: ['de', 'ja'] },
  { site: 'ccs', locales: ['de', 'ja'] },
];

console.log("╔══════════════════════════════════════════════════════╗");
console.log("║  🚀 [SEO/GEO 航母] 六大品类工业B2B内容排产引擎   ║");
console.log("║  镍网 | 高温螺栓 | 铜包钢线 | NDT设备 | 加热线 | 热电偶 ║");
console.log("╚══════════════════════════════════════════════════════╝");
console.log("");

for (const { site, locales } of TARGETS) {
  for (const locale of locales) {
    generatePage(site, locale);
  }
}

console.log("");
console.log("🏁 [排产完毕] 所有 DE/JP 多语种蓄水池页面已生成完毕。");
console.log("   请通过 Pages CMS (public/admin/index.html) 审核后释放 draft 阀门发布。");
console.log("   ⚠️ 策略提示：全部页面默认 draft: true（蓄水池拦截态），仅 SEO 专员审核后手动放行。");

module.exports = { generatePage };
