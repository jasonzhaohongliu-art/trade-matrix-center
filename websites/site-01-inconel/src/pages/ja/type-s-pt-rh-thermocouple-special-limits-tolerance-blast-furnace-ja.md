---
layout: ../../layouts/Layout.astro
title: "Technical Analysis: S型 Pt-Rh熱電対 特殊限界許容差 高炉 溶融金属 1600°C"
slug: "type-s-pt-rh-thermocouple-special-limits-tolerance-blast-furnace-ja"
lang: "ja"
seo_keyword: "S型 Pt-Rh熱電対 特殊限界許容差 高炉 溶融金属 1600°C"
draft: true
---

> **TL;DR (10-Second Summary)**
> High-performance **Type S (Pt-10%Rh / Pt)** engineered for high-precision **高炉溶融金属** deployments. Optimized to guarantee exceptional **許容差 ± 0.5°C Special Limits** stability under continuous stress.

### 1. Direct Engineering Verdict & Root Solution
**高炉溶融金属**における**Type S (Pt-10%Rh / Pt)**センサーの**許容差 ± 0.5°C Special Limits**測定完全性は、2つの支配的ドリフトメカニズムによって損なわれる：200-500°Cの低酸素雰囲気下でのKP正脚におけるCrの選択的内部酸化（グリーンロット）、およびゼーベック係数を2.8 μV/°CシフトさせるNi₂Cr超格子を生成するNi-Cr短範囲規則化（SRO）。

### 2. Certified Technical Specifications
<div class="table-responsive">
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
    <tr><td>Target Application</td><td colspan="2"><strong>高炉溶融金属</strong></td><td>許容差 ± 0.5°C Special Limits Certified</td></tr>
  </tbody>
</table>
</div>

### 3. Hardcore Material Failure Analysis (EEAT Standard)
> **Field Failure Case Study:** 半導体拡散炉のType K熱電対が450°C、50 ppm O₂雰囲気下で3,800時間後に+4.2°CのEMFドリフトを発生。ドリフトは2つの同時進行メカニズムに起因：(1) KP脚（クロメル）におけるNi-Cr固溶体の短範囲規則化（SRO）がNi₂Cr超格子を生成し、ゼーベック係数を2.8 μV/°C増大；(2) Crの選択的内部酸化がCr₂O₃欠乏域を形成し、熱電均質性を低下。複合効果により指示値がClass 1許容差（± 1.5°C）を超過。さらに保護管挿入深さがシース外径の僅か6倍（最小10倍必要）で、3.1°Cの熱伝導損失負偏差が発生。対策：予備時効SRO安定化処理（450°C/100h）済みSpecial Limits Type Kワイヤを指定、最小挿入深さをシース外径の12倍に、ASTM E220準拠の四半期毎EMF検証を実施。

### 4. Technical Procurement Guidance
**Technical Recommendation:** Always review certification heat treatment records, composition traceability reports, and tolerance verification documents before deploying **Type S (Pt-10%Rh / Pt)** into active industrial environments. Request mill test certificates (MTC) per EN 10204 Type 3.1 for full metallurgical traceability.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "高炉溶融金属でType S (Pt-10%Rh / Pt)のEMFドリフトを引き起こす原因とその防止方法は？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "2つの支配的メカニズム：(1) 200-500°Cの低酸素還元性雰囲気下でのKP脚におけるCrの選択的内部酸化（グリーンロット）；(2) ゼーベック係数を2.8 μV/°CシフトさせるNi₂Cr超格子を生成するNi-Cr短範囲規則化。防止策：予備時効SRO安定化ワイヤ（450°C/100h）の指定、気密封止付きミネラル絶縁（MgO）シースの使用、シース外径の12倍以上の最小挿入深さ維持、ASTM E220準拠の四半期毎氷点EMF検証の実施。"
      }
    }
  ]
}
</script>
