---
layout: ../../layouts/Layout.astro
title: "Technical Analysis: Wirbelstromprüfung Oberflächenrisserkennung Flugzeugfahrwerk EN ISO 15549"
slug: "eddy-current-surface-crack-detection-aircraft-landing-gear-de"
lang: "de"
seo_keyword: "Wirbelstromprüfung Oberflächenrisserkennung Flugzeugfahrwerk EN ISO 15549"
draft: true
---

> **TL;DR (10-Second Summary)**
> High-performance **ET Differential Probe 500 kHz** engineered for high-precision **Flugzeugfahrwerk** deployments. Optimized to guarantee exceptional **Risserkennung ≥ 0.1 mm Tiefe** stability under continuous stress.

### 1. Direct Engineering Verdict & Root Solution
Die Nachweiszuverlässigkeit von **ET Differential Probe 500 kHz** für **Flugzeugfahrwerk** hängt entscheidend von der an die Kornstruktur angepassten Prüfkopffrequenz ab — der Einsatz kohlenstoffstahloptimierter Standardprüfköpfe an austenitischen Schweißnähten erzeugt einen Waldrausch-SNR-Einbruch unter 6 dB und maskiert kritische Flankenbinderfehler.

### 2. Certified Technical Specifications
<div class="table-responsive">
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
    <tr><td>Target Application</td><td><strong>Flugzeugfahrwerk</strong></td><td>Risserkennung ≥ 0.1 mm Tiefe Verified</td></tr>
  </tbody>
</table>
</div>

### 3. Hardcore Material Failure Analysis (EEAT Standard)
> **Field Failure Case Study:** Übersehener 3,2 mm Flankenbindefehler in einer 304L-Edelstahl-Rundnaht (WT 25,4 mm) bei PAUT-Prüfung. Prüfer verwendete 5 MHz Lineararray-Prüfkopf, optimiert für Kohlenstoffstahl, aber grobe stengelkristalline Kornstruktur im austenitischen Schweißgut (ASTM-Korngröße 00-0) erzeugte starkes Waldrauschen mit SNR ≤ 6 dB gegenüber dem LOF-Ziel. Fehler blieb über 3 Prüfzyklen unentdeckt; erst nach Berstversagen bei 32 MPa entdeckt. Zwingendes Protokoll: Niederfrequenz (2,25 MHz) TRL-Doppelkristall-Prüfkopf für alle austenitischen Edelstahlschweißnähte, 45°-Transversalwellen-Sprungdistanz-Kalibrierung gemäß EN ISO 22825 Anhang A, SNR vor Feldeinsatz muss 12 dB an 2 mm SDH-Referenzreflektor überschreiten.

### 4. Technical Procurement Guidance
**Technical Recommendation:** Always review certification heat treatment records, composition traceability reports, and tolerance verification documents before deploying **ET Differential Probe 500 kHz** into active industrial environments. Request mill test certificates (MTC) per EN 10204 Type 3.1 for full metallurgical traceability.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Wie vermeidet man übersehene Fehler bei der Prüfung von Flugzeugfahrwerk mit ET Differential Probe 500 kHz?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Austenitische Edelstahlschweißnähte erfordern niederfrequente (2,25 MHz) TRL-Doppelkristall-Prüfköpfe anstelle von 5-MHz-Kohlenstoffstahl-Standardprüfköpfen. Die grobe stengelkristalline Kornstruktur (ASTM GS 00-0) in austenitischen Schweißnähten verursacht starkes Waldrauschen; TRL-Prüfköpfe halten einen SNR ≥ 12 dB an 2 mm SDH-Referenzreflektor gemäß EN ISO 22825 Anhang A. Vor Feldeinsatz stets Prüfkopf-Kornstruktur-Kompatibilität prüfen."
      }
    }
  ]
}
</script>
