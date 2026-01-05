**Version 1.0 · January 2026**

---

## 1. Purpose of This Document

This document defines the **narrative structure** of *A Jornada do Clima*.

It answers:

* What story is being told
* In what order
* With what emotional intent
* Using which data and visuals
* Triggered by which scroll behaviors

This is **not** a visual design file and **not** a data schema.
It is the **narrative contract** that design, motion, and code must follow.

---

## 2. Narrative Model

### 2.1 Structure

The experience is structured as a **four-act journey**, inspired by documentary storytelling and museum exhibitions:

1. **Reality**
2. **Cause**
3. **Agency**
4. **Responsibility**

Each act:

* Answers **one central question**
* Has **one dominant emotion**
* Uses **one primary visualization logic**
* Transitions cleanly into the next

---

### 2.2 Scroll as Narrative Device

Scroll is not navigation.
Scroll is **time, causality, and revelation**.

Rules:

* Scrolling always moves the story forward
* Nothing important happens “off-scroll”
* The user never needs to scroll back to understand meaning

---

## 3. Act-by-Act Breakdown

---

## **ATO 1 — O Diagnóstico**

### *Onde estamos?*

### Narrative goal

Establish **immediate, lived reality** before any explanation.

### Emotional intent

> Grounded shock · Urgency · Recognition

No blame.
No solutions.
Only reality.

---

### Core message

> “O aquecimento global não é mais um risco futuro.
> Ele já define o mundo em que vivemos.”

---

### Data focus

* Aquecimento global atual
* Diferença entre média global e aquecimento regional no Brasil
* Concentração de CO₂ atmosférico

Numbers are introduced **after** the visual impact.

---

### Visual structure

* **Sticky SVG** (climate stripes / thermometer)
* Color progression from blue → red
* Gradual saturation as scroll advances

---

### Scroll sequence

1. Neutral background, minimal text
2. Years advance silently
3. Colors intensify
4. Only then: numbers appear
5. Split view: Global vs Brasil

---

### Transition to Ato 2

A short pause.
Text fades in:

> “Isso não aconteceu por acaso.”

Background remains dark.

---

### Implementation References

**Data Schema:**
- `metrics_registry.global_warming_2024`
- `metrics_registry.brazil_regional_warming_max`
- `metrics_registry.co2_atmospheric_2024`
- See [03_data_schema.md §7](03_data_schema.md#7-metric-object-atomic-unit)

**Interaction Spec:**
- Scroll-linked animations: [04_interaction_spec.md §5.1](04_interaction_spec.md#51-scroll-linked-animations)
- Discrete triggers: [04_interaction_spec.md §5.2](04_interaction_spec.md#52-discrete-scroll-triggers)
- Sticky behavior: [04_interaction_spec.md §4](04_interaction_spec.md#4-sticky-pinning-behavior)

**Components:**
- `<StorySection>`: [05_component_library.md §3.1](05_component_library.md#31-storysection)
- `<StickyStage>`: [05_component_library.md §3.2](05_component_library.md#32-stickystage)
- `<ClimateStripesSVG>`: [05_component_library.md §4.1](05_component_library.md#41-climatestripessvg)
- `<TemperatureGauge>`: [05_component_library.md §4.2](05_component_library.md#42-temperaturegauge)

**Style Guide:**
- Color progression (blue → red): [02_style_guide.md §3.3](02_style_guide.md#33-climate-semantic-colors)
- Motion timing: [02_style_guide.md §7.4](02_style_guide.md#74-motion-timing)

**Storyboard:**
- Rows 1.0–3.6 in [06_storyboards.md §4](06_storyboards.md#4-ato-1-o-diagnóstico-onde-estamos)

---

## **ATO 2 — A Anatomia do Problema**

### *Quem são os culpados?*

### Narrative goal

Replace confusion with **structural clarity**.

### Emotional intent

> Understanding · Clarity · De-personalization

This act removes guilt from individuals and places responsibility on systems.

---

### Core message

> “Não é um fenômeno natural.
> São escolhas humanas, organizadas em sistemas.”

---

### Data focus

* Emissões por fonte (fósseis, uso da terra)
* Emissões por setor
* Diferença estrutural entre mundo e Brasil

---

### Visual structure

* **Sankey diagram (SVG)**
* Activities → gases → atmosfera
* Visual weight reflects magnitude

---

### Scroll sequence

1. Human activities appear (energia, transporte, agro)
2. Flows rise toward gases
3. Atmosphere thickens
4. Toggle or fork:

   * Mundo
   * Brasil

Brazil’s land-use emissions visually surge.

---

### Transition to Ato 3

Text fades in over still diagram:

> “A boa notícia é que isso também significa que podemos mudar.”

Background lightens subtly.

---

### Implementation References

**Data Schema:**
- `metrics_registry.emissions_by_source_global`
- `metrics_registry.emissions_by_source_brazil`
- `metrics_registry.emissions_by_sector_global`
- `metrics_registry.emissions_by_sector_brazil`
- See [03_data_schema.md §9](03_data_schema.md#9-metric-registry-groups)

**Interaction Spec:**
- Layered scroll animations: [04_interaction_spec.md §5.1](04_interaction_spec.md#51-scroll-linked-animations)
- Toggle interactions: [04_interaction_spec.md §5.2](04_interaction_spec.md#52-discrete-scroll-triggers)
- Morph transitions: [02_style_guide.md §7.4](02_style_guide.md#74-motion-timing)

**Components:**
- `<SankeyEmissions>`: [05_component_library.md §4.3](05_component_library.md#43-sankeyemissions)
- `<CompareToggle>`: [05_component_library.md §6.3](05_component_library.md#63-comparetoggle)
- `<NarrativeBlock>`: [05_component_library.md §7.1](05_component_library.md#71-narrativeblock)

**Style Guide:**
- Flow thickness and visual weight: [02_style_guide.md §3.3](02_style_guide.md#33-climate-semantic-colors)
- Animation duration: [02_style_guide.md §7.4](02_style_guide.md#74-motion-timing) (base: 400ms, morph: 600ms)

**Storyboard:**
- Rows 4.0–7.2 in [06_storyboards.md §5](06_storyboards.md#5-ato-2-a-anatomia-do-problema-quem-são-os-culpados)

---

## **ATO 3 — A Caixa de Ferramentas**

### *Como consertamos?*

### Narrative goal

Transform urgency into **credible agency**.

### Emotional intent

> Relief · Empowerment · Pragmatism

This is the emotional turning point of the experience.

---

### Core message

> “As soluções já existem.
> Pela primeira vez, muitas são mais baratas que o sistema antigo.”

---

### Data focus

* Custo de energias renováveis
* Impacto de conservação florestal
* Eficiência energética
* Transporte elétrico
* Agropecuária sustentável

No offsets.
No compensations.
Only **real reductions**.

---

### Visual structure

* Comparative charts (custos, impacto)
* **Interactive impact sandbox**

---

### Scroll + interaction sequence

1. Static comparisons establish credibility
2. Interactive elements unlock
3. User selects solutions
4. Aggregate impact is visualized
5. Contextual equivalents appear (ex: carros removidos)

---

### Transition to Ato 4

Interaction pauses.
Text appears:

> “Saber o que funciona é diferente de fazer.”

Tone becomes serious again.

---

### Implementation References

**Data Schema:**
- `metrics_registry.solar_cost_vs_fossil`
- `metrics_registry.wind_cost_vs_fossil`
- `metrics_registry.forest_conservation_impact`
- `metrics_registry.electric_vehicle_impact`
- See [03_data_schema.md §9](03_data_schema.md#9-metric-registry-groups)

**Interaction Spec:**
- Interactive sandbox: [04_interaction_spec.md §7](04_interaction_spec.md#7-act-specific-interaction-adjustments)
- User selection handling: [05_component_library.md §6.1](05_component_library.md#61-solutionimpactsandbox)
- Reduced motion support: [04_interaction_spec.md §8](04_interaction_spec.md#8-reduced-motion-mode-global)

**Components:**
- `<SolutionImpactSandbox>`: [05_component_library.md §6.1](05_component_library.md#61-solutionimpactsandbox)
- `<SolutionCard>`: [05_component_library.md §6.2](05_component_library.md#62-solutioncard)
- `<DataLabel>`: [05_component_library.md §7.2](05_component_library.md#72-datalabel)

**Style Guide:**
- Chart styling: [02_style_guide.md §3.3](02_style_guide.md#33-climate-semantic-colors)
- Interactive states: [02_style_guide.md §9](02_style_guide.md#9-ui-elements)

**Storyboard:**
- Rows 7.5–10.6 in [06_storyboards.md §6](06_storyboards.md#6-ato-3-a-caixa-de-ferramentas-como-consertamos)

---

## **ATO 4 — O Caminho à Frente**

### *O Brasil na liderança?*

### Narrative goal

Expose the **gap between potential and ambition**.

### Emotional intent

> Responsibility · Tension · Civic awareness

This is not hopeful or pessimistic — it is honest.

---

### Core message

> “O Brasil tem a chave.
> O desafio não é capacidade, é decisão.”

---

### Data focus

* Meta oficial do Brasil (NDC)
* Meta recomendada pela ciência
* Papel do desmatamento na matriz nacional

---

### Visual structure

* **Goal tracker timeline**
* Past → present → two futures
* Visible gap between trajectories

---

### Scroll sequence

1. Historical baseline
2. Current position
3. Two diverging lines:

   * Política atual
   * Caminho 1,5°C
4. Gap remains on screen

No resolution is forced.

---

### Implementation References

**Data Schema:**
- `metrics_registry.brazil_ndc_target`
- `metrics_registry.science_based_target_1_5c`
- `metrics_registry.deforestation_rate_brazil`
- `metrics_registry.historical_emissions_brazil`
- See [03_data_schema.md §9](03_data_schema.md#9-metric-registry-groups)

**Interaction Spec:**
- Timeline animation: [04_interaction_spec.md §5.1](04_interaction_spec.md#51-scroll-linked-animations)
- Path divergence: [04_interaction_spec.md §5.1](04_interaction_spec.md#51-scroll-linked-animations)
- Gap persistence: [04_interaction_spec.md §4.3](04_interaction_spec.md#43-constraints)

**Components:**
- `<GoalTrackerTimeline>`: [05_component_library.md §4.4](05_component_library.md#44-goaltrackertimeline)
- `<NarrativeBlock>`: [05_component_library.md §7.1](05_component_library.md#71-narrativeblock)
- `<SourceDrawer>`: [05_component_library.md §8.1](05_component_library.md#81-sourcedrawer)

**Style Guide:**
- Path colors (policy vs science): [02_style_guide.md §3.3](02_style_guide.md#33-climate-semantic-colors)
- Gap visualization: [02_style_guide.md §3.3](02_style_guide.md#33-climate-semantic-colors)
- Timeline typography: [02_style_guide.md §4.2](02_style_guide.md#42-hierarchy)

**Storyboard:**
- Rows 11.0–13.2+ in [06_storyboards.md §7](06_storyboards.md#7-ato-4-o-caminho-à-frente-o-brasil-na-liderança)

---

### Ending state

Quiet screen.
No CTA button.

Final text:

> “O futuro ainda não está escrito.
> Mas o tempo para decidir é agora.”

---

## 4. Narrative Constraints (Hard Rules)

* No act may exceed ~25–30% of total scroll length
* No chart appears without narrative context
* No solution appears before causality is clear
* Brazil is never shown without global context
* No optimism without evidence

---

## 5. Relationship to Other Documents

This document:

* Defines **what** the story is
* References **which data** is used (but not how it’s structured)
* Informs **style and interaction**, but does not define them

Conflicts are resolved in this order:

1. Overview
2. Story Architecture
3. Style Guide
4. Interaction Spec
5. Implementation

---

## 6. Narrative North Star

> **Se o usuário parar em qualquer ponto da rolagem,
> a tela ainda deve fazer sentido como parte de uma história maior.**

