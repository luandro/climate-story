# **06 — Storyboards (Scroll-by-Scroll)**

**Version 1.0 · January 2026**

---

## 1. Purpose of This Document

This document translates the **story architecture** and **interaction spec** into a **concrete scroll storyboard**.

It answers:

* What is on screen at each scroll moment
* Which components are active
* What the user sees, reads, and feels
* How transitions occur between frames

Think of this as a **comic strip for scrolling**:

* Each row = a scroll state
* Each state = one clear narrative beat

---

## 2. Storyboard Conventions

### Scroll Units

* `1 scroll unit ≈ 100vh`
* Fractions indicate partial progress inside a unit

### Columns Explained

| Column         | Meaning                  |
| -------------- | ------------------------ |
| Scroll         | Scroll range             |
| Visual Stage   | What is pinned / visible |
| Components     | Active components        |
| Narrative Copy | On-screen text           |
| Interaction    | User action              |
| Notes          | Implementation guidance  |

---

## 3. Global Opening (Landing)

| Scroll | Visual Stage        | Components         | Narrative Copy                                  | Interaction | Notes              |
| ------ | ------------------- | ------------------ | ----------------------------------------------- | ----------- | ------------------ |
| 0.0    | Dark neutral screen | `<StorySection>`   | *(none)*                                        | Scroll only | No CTA, no nav     |
| 0.2    | Subtle fade-in      | `<NarrativeBlock>` | “Em 2024, o planeta cruzou um limite perigoso.” | Scroll      | Text fades quickly |
| 0.5    | Transition          | *(none)*           | *(none)*                                        | Scroll      | Leads into Ato 1   |

---

## 4. ATO 1 — O Diagnóstico (Onde estamos?)

### Scene 1 — Warming Over Time

| Scroll  | Visual Stage  | Components                              | Narrative Copy           | Interaction | Notes                   |
| ------- | ------------- | --------------------------------------- | ------------------------ | ----------- | ----------------------- |
| 1.0–1.2 | SVG pinned    | `<StickyStage>` + `<ClimateStripesSVG>` | *(none)*                 | Scroll      | Years begin advancing   |
| 1.2–2.2 | SVG animating | `<ClimateStripesSVG>`                   | *(none)*                 | Scroll      | Colors shift blue → red |
| 2.2–2.5 | SVG saturated | `<ClimateStripesSVG>` + `<DataLabel>`   | “O mundo aqueceu 1,6°C.” | Scroll      | Numbers appear late     |

---

### Scene 2 — Brazil vs Global

| Scroll  | Visual Stage | Components           | Narrative Copy                                     | Interaction | Notes               |
| ------- | ------------ | -------------------- | -------------------------------------------------- | ----------- | ------------------- |
| 2.5–3.0 | Split view   | `<TemperatureGauge>` | “No Brasil, algumas regiões aqueceram ainda mais.” | Scroll      | Side-by-side gauges |
| 3.0–3.3 | Hold         | `<NarrativeBlock>`   | “O aquecimento não é uniforme.”                    | Scroll      | Pause for emphasis  |

---

### Transition to Ato 2

| Scroll  | Visual Stage | Components | Narrative Copy                  | Interaction | Notes                 |
| ------- | ------------ | ---------- | ------------------------------- | ----------- | --------------------- |
| 3.3–3.6 | Fade out     | *(none)*   | “Isso não aconteceu por acaso.” | Scroll      | Background stays dark |

---

## 5. ATO 2 — A Anatomia do Problema (Quem são os culpados?)

### Scene 1 — Activities Appear

| Scroll  | Visual Stage  | Components                            | Narrative Copy | Interaction | Notes      |
| ------- | ------------- | ------------------------------------- | -------------- | ----------- | ---------- |
| 4.0–4.5 | Sankey pinned | `<StickyStage>` + `<SankeyEmissions>` | *(none)*       | Scroll      | Nodes only |
| 4.5–5.0 | Flows animate | `<SankeyEmissions>`                   | *(none)*       | Scroll      | Flows rise |

---

### Scene 2 — Gases & Atmosphere

| Scroll  | Visual Stage        | Components          | Narrative Copy                        | Interaction | Notes                    |
| ------- | ------------------- | ------------------- | ------------------------------------- | ----------- | ------------------------ |
| 5.0–5.5 | Atmosphere thickens | `<SankeyEmissions>` | “Nossas escolhas moldam a atmosfera.” | Scroll      | Visual density increases |

---

### Scene 3 — Global vs Brazil

| Scroll  | Visual Stage   | Components        | Narrative Copy                         | Interaction | Notes            |
| ------- | -------------- | ----------------- | -------------------------------------- | ----------- | ---------------- |
| 5.5–6.2 | Toggle appears | `<CompareToggle>` | “No mundo, fósseis dominam.”           | Toggle      | Default = Global |
| 6.2–6.8 | Brazil mode    | `<CompareToggle>` | “No Brasil, o uso da terra muda tudo.” | Toggle      | Weights morph    |

---

### Transition to Ato 3

| Scroll  | Visual Stage  | Components | Narrative Copy                                | Interaction | Notes                |
| ------- | ------------- | ---------- | --------------------------------------------- | ----------- | -------------------- |
| 6.8–7.2 | Lightening bg | *(none)*   | “Se foi criado por humanos, pode ser mudado.” | Scroll      | Background brightens |

---

## 6. ATO 3 — A Caixa de Ferramentas (Como consertamos?)

### Scene 1 — Cost Reality

| Scroll  | Visual Stage  | Components              | Narrative Copy                        | Interaction | Notes         |
| ------- | ------------- | ----------------------- | ------------------------------------- | ----------- | ------------- |
| 7.5–8.0 | Charts pinned | `<ComparativeCostBars>` | *(none)*                              | Scroll      | Static bars   |
| 8.0–8.5 | Labels appear | `<DataLabel>`           | “Solar já é mais barato que fósseis.” | Scroll      | Cost emphasis |

---

### Scene 2 — Impact Sandbox

| Scroll   | Visual Stage     | Components                | Narrative Copy      | Interaction | Notes              |
| -------- | ---------------- | ------------------------- | ------------------- | ----------- | ------------------ |
| 8.5–9.0  | Sandbox revealed | `<SolutionImpactSandbox>` | “Escolha soluções.” | Click       | Interaction unlock |
| 9.0–9.8  | Live updates     | `<SolutionCard>`          | *(dynamic)*         | Click       | Aggregate impact   |
| 9.8–10.2 | Hold             | `<NarrativeBlock>`        | “Escala importa.”   | Scroll      | Emphasis pause     |

---

### Transition to Ato 4

| Scroll    | Visual Stage | Components | Narrative Copy                   | Interaction | Notes      |
| --------- | ------------ | ---------- | -------------------------------- | ----------- | ---------- |
| 10.2–10.6 | Fade out     | *(none)*   | “Saber não é o mesmo que fazer.” | Scroll      | Tone shift |

---

## 7. ATO 4 — O Caminho à Frente (O Brasil na liderança?)

### Scene 1 — Timeline Begins

| Scroll    | Visual Stage    | Components              | Narrative Copy | Interaction | Notes          |
| --------- | --------------- | ----------------------- | -------------- | ----------- | -------------- |
| 11.0–11.5 | Timeline pinned | `<GoalTrackerTimeline>` | *(none)*       | Scroll      | Past → present |

---

### Scene 2 — Two Futures

| Scroll    | Visual Stage    | Components              | Narrative Copy                           | Interaction | Notes       |
| --------- | --------------- | ----------------------- | ---------------------------------------- | ----------- | ----------- |
| 11.5–12.2 | Diverging paths | `<GoalTrackerTimeline>` | “Aqui, dois caminhos.”                   | Scroll      | Lines split |
| 12.2–12.8 | Gap emphasized  | `<NarrativeBlock>`      | “O problema não é potencial. É ambição.” | Scroll      | Gap remains |

---

### Ending

| Scroll    | Visual Stage | Components       | Narrative Copy                     | Interaction | Notes            |
| --------- | ------------ | ---------------- | ---------------------------------- | ----------- | ---------------- |
| 12.8–13.2 | Quiet hold   | *(none)*         | “O futuro ainda não está escrito.” | Scroll      | No CTA           |
| 13.2+     | End state    | `<SourceDrawer>` | *(sources only)*                   | Optional    | Reflection space |

---

## 8. Storyboard North Star

> **Cada rolagem deve responder a uma pergunta
> antes que o usuário perceba que perguntou.**


