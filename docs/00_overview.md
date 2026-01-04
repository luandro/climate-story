### Overview & Vision Document

**Version 1.0 · January 2026**

---

## 1. Project Summary

**A Jornada do Clima** is an interactive, scroll-driven narrative experience that transforms climate data into a **clear, emotionally grounded, and action-oriented story**, with a strong comparative lens between **global dynamics and Brazil’s unique role**.

Rather than functioning as a dashboard or report, the experience is designed as a **guided visual argument**: as the user scrolls, data, imagery, and motion work together to answer four essential questions:

1. **Onde estamos?** (Current reality)
2. **Por que chegamos aqui?** (Causes)
3. **O que realmente funciona?** (Solutions)
4. **Qual é o papel do Brasil?** (Responsibility & leadership)

The application is built to be:

* Scientifically grounded
* Emotionally responsible
* Politically relevant
* Updateable over time without breaking the narrative

---

## 2. Purpose

The purpose of *A Jornada do Clima* is to:

* **Expose current climate reality** using the most credible available data
* **Make causality visible**, showing how human systems shape the climate
* **Replace abstraction with lived meaning** (temperature, impacts, costs)
* **Counter eco-anxiety with credible agency**, focusing on real solutions (not carbon credits)
* **Position Brazil as a pivotal actor**, not a marginal case

This project explicitly avoids:

* Alarmism without explanation
* Gamification that trivializes the topic
* Carbon offset narratives that obscure real reductions
* Overly technical dashboards inaccessible to the general public

---

## 3. Target Audience

Primary audiences:

* **General public with high curiosity but low patience for technical reports**
* **Students and educators**
* **Journalists and communicators**
* **Policy-adjacent audiences**
* **Civil society organizations**

Secondary audiences:

* Developers and designers building similar experiences
* Researchers seeking narrative ways to communicate data

The experience assumes **no prior climate expertise**, but does not simplify facts beyond scientific integrity.

---

## 4. Core Design Principles

### 4.1 Data First, Always

Data is never decorative.
Every visual element exists to support a factual claim.

### 4.2 Scroll = Time

Scrolling always represents **progression**:

* In years
* In causality
* In consequences
* In decision space

No scroll action is meaningless.

### 4.3 Emotion Before Explanation

Users should **feel the change** (heat, scale, imbalance) before seeing numbers.

### 4.4 Brazil Is Central

Brazilian data is always shown:

* In comparison with global data
* In its own context (land use, forests, energy)
* As a leverage point, not a footnote

### 4.5 Update Without Rewrite

All numbers are isolated in a structured data layer, allowing:

* Annual updates
* New sources
* Scenario comparisons
  without breaking layout or narrative flow.

---

## 5. Narrative Structure (High-Level)

The experience is structured as a four-act journey:

### **Ato 1 — O Diagnóstico**

**Question:** Onde estamos?
**Focus:** Temperature, CO₂, immediate reality
**Emotion:** Urgency, grounding
**Key idea:** The climate crisis is no longer abstract or future-tense.

---

### **Ato 2 — A Anatomia do Problema**

**Question:** Quem são os culpados?
**Focus:** Emissions by source and sector
**Emotion:** Clarity
**Key idea:** Climate change is systemic, not accidental — and not evenly distributed.

---

### **Ato 3 — A Caixa de Ferramentas**

**Question:** Como consertamos?
**Focus:** Proven solutions and their real impact
**Emotion:** Relief, agency
**Key idea:** The tools already exist, and many are cheaper than the old system.

---

### **Ato 4 — O Caminho à Frente**

**Question:** O Brasil na liderança?
**Focus:** Targets, ambition, and gaps
**Emotion:** Responsibility
**Key idea:** The problem is not lack of potential, but lack of ambition.

---

## 6. What This Project Is (and Is Not)

### This project **is**:

* A scrollytelling documentary
* A data-driven narrative
* A living product that evolves with new data
* A comparative lens on climate responsibility

### This project **is not**:

* A static report
* A traditional dashboard
* A game
* A policy whitepaper
* A carbon-offset marketplace

---

## 7. Success Criteria

The project is successful if:

* Users reach at least **Ato 3** (solutions)
* Users understand **why Brazil matters globally**
* Data feels **credible and legible**, not overwhelming
* The experience sparks **discussion**, not paralysis
* Data updates can be made without redesigning the app

---

## 8. Document Hierarchy

This overview is the **entry point** to the full documentation set.

All other documents (story architecture, style guide, data schema, interaction specs, components, QA, etc.) must align with the principles and goals defined here.

If a design or technical decision conflicts with this overview, **the overview wins unless explicitly revised**.

---

## 9. Document Navigation

This overview is the entry point. For detailed specifications, refer to:

| Document | Purpose | Link |
|----------|---------|------|
| **Story Architecture** | Narrative structure, act-by-act breakdown, emotional intent | → [01_story_architecture.md](01_story_architecture.md) |
| **Style Guide** | Visual identity, colors, typography, motion, accessibility | → [02_style_guide.md](02_style_guide.md) |
| **Data Schema** | Data structure, metric registry, sources, narrative linking | → [03_data_schema.md](03_data_schema.md) |
| **Interaction Spec** | Scroll behavior, sticky elements, video interaction rules | → [04_interaction_spec.md](04_interaction_spec.md) |
| **Component Library** | Reusable components with props, behavior, usage rules | → [05_component_library.md](05_component_library.md) |
| **Storyboards** | Scroll-by-scroll breakdown, implementation mapping | → [06_storyboards.md](06_storyboards.md) |
| **Quick Reference** | How-to guides for common tasks | → [QUICK_REFERENCE.md](QUICK_REFERENCE.md) |

**Language Policy:**
- Primary narrative language: Portuguese (pt-BR)
- Documentation language: English
- Data labels: Localizable via data schema

---

## 10. Living Document Policy

This document is expected to evolve.

All changes should:

* Be versioned
* Be discussed in relation to narrative impact
* Preserve the core principles unless intentionally redefined

---

## 11. One-Sentence North Star

> **A Jornada do Clima transforma dados científicos em uma experiência visual contínua que mostra, sem simplificações ou atalhos, onde estamos, por que chegamos aqui, e o que realmente muda o jogo — especialmente no Brasil.**

