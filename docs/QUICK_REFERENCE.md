# Quick Reference Guides

**Version 1.0 · January 2026**

Quick how-to guides for common documentation tasks.

---

## Guide 1: How to Add a New Metric

### When to Use
Adding a new data point to the climate narrative (e.g., new emissions data, temperature record).

### Step 1: Add Source (if new)
**File:** `src/data/story-data.json` → `sources` object

```json
"sources": {
  "ipcc_ar6": {
    "name": "IPCC Sixth Assessment Report",
    "ref": "AR6 WG1",
    "type": "intergovernmental",
    "trust_level": "very_high",
    "url": "https://www.ipcc.ch/ar6/"
  }
}
```

**Reference:** [03_data_schema.md §13.2-13.3](03_data_schema.md#132-source-types)

### Step 2: Add Metric to Registry
**File:** `src/data/story-data.json` → `metrics_registry`

```json
"metrics_registry": {
  "global_co2_2024": {
    "id": "global_co2_2024",
    "label": "CO₂ Atmosférico Global",
    "value": {
      "number": 421.5,
      "unit": "ppm",
      "precision": 0.1
    },
    "geography": "global",
    "type": "current_state",
    "year_reference": 2024,
    "sources": ["ipcc_ar6", "noaa"],
    "baseline": "280 ppm (pre-industrial)",
    "trend": {
      "direction": "up",
      "description": "Aumento contínuo desde era pré-industrial"
    }
  }
}
```

**Reference:** [03_data_schema.md §7-8](03_data_schema.md#7-metric-object-atomic-unit)

### Step 3: Reference in Narrative
**File:** `src/data/story-data.json` → `narrative`

```json
"narrative": {
  "ato_1_diagnostico": {
    "primary_metrics": [
      "global_co2_2024"  // ← Add metric ID here
    ]
  }
}
```

**Reference:** [03_data_schema.md §10](03_data_schema.md#10-narrative-linking)

### Step 4: Update Components
**Files:** Component files that use this metric

```tsx
// Example: Update a component to use the new metric
<DataLabel
  metricId="global_co2_2024"
  format="number"
/>
```

**Reference:** [05_component_library.md](05_component_library.md)

### Step 5: Validate
Run checklist from [03_data_schema.md §14](03_data_schema.md#14-validation-checklist):

- [ ] Every metric has ≥1 source
- [ ] Source has valid `type` and `trust_level`
- [ ] Metric ID is stable (don't change later)
- [ ] Units are included
- [ ] If percentage, baseline is specified

### Common Mistakes to Avoid

❌ **DON'T:** Embed numbers in narrative text
```json
"copy": "CO2 reached 421.5 ppm"  // WRONG
```

✅ **DO:** Reference metric IDs
```json
"primary_metrics": ["global_co2_2024"],  // RIGHT
"copy": "CO2 reached {metric_value} ppm"  // Component resolves this
```

❌ **DON'T:** Change metric IDs
```json
"global_co2_2024" → "global_co2_2025"  // BREAKS REFERENCES
```

✅ **DO:** Update values in place
```json
"global_co2_2024": { "value": { "number": 422.1 } }  // ID STAYS
```

---

## Guide 2: How to Implement a Component

### When to Use
Creating a new reusable UI component or modifying an existing one.

### Step 1: Check if Component Already Exists
**File:** [05_component_library.md](05_component_library.md)

Search the component library before creating new components.

### Step 2: Define Component Contract
Follow the template from [05_component_library.md](05_component_library.md):

```markdown
### X.X `<ComponentName>`

**Purpose**
[What it does in 1 sentence]

**Used in**
- Which acts/scenes
- When to use it

**Props (Contract)**
```typescript
interface ComponentNameProps {
  // Required
  requiredProp: string;

  // Optional
  optionalProp?: number;

  // Events
  onChange?: (value: number) => void;
}
```

**Data Shape**
[TypeScript interface for data prop]

**Behavior**
[What happens on mount, update, unmount]

**Rules**
[Constraints and forbidden uses]

**Accessibility**
[ARIA, keyboard, screen reader support]

**Performance**
[Rendering considerations]
```

### Step 3: Implement Component
**File:** `src/components/ComponentName.tsx`

```tsx
import { useMetric } from '@/hooks/useMetric';

interface ComponentNameProps {
  metricId: string;
  format?: 'number' | 'percentage';
  onYearChange?: (year: number) => void;
}

export function ComponentName({
  metricId,
  format = 'number',
  onYearChange
}: ComponentNameProps) {
  const metric = useMetric(metricId);

  if (!metric) return null;

  return (
    <div className="component-name">
      {/* Implementation */}
    </div>
  );
}
```

**References:**
- Style tokens: [02_style_guide.md §3.1](02_style_guide.md#31-design-tokens)
- Colors: [02_style_guide.md §3.2-3.4](02_style_guide.md#32-base-neutrals-foundation)
- Typography: [02_style_guide.md §4.2-4.3](02_style_guide.md#42-hierarchy)

### Step 4: Add Accessibility
```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function ComponentName(props: ComponentNameProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      role="img"
      aria-label={`${metric.label}: ${metric.value.number} ${metric.value.unit}`}
    >
      {/* Content */}
    </div>
  );
}
```

**Reference:** [02_style_guide.md §10](02_style_guide.md#10-accessibility)

### Step 5: Test with Storyboard
**File:** [06_storyboards.md](06_storyboards.md)

Find the row where this component is used and verify props match:

```markdown
| Scroll  | Components        | Props                         |
|---------|-------------------|-------------------------------|
| 1.0–1.2 | `<ComponentName>` | metricId="temp_2024"          |
```

### Common Mistakes to Avoid

❌ **DON'T:** Hardcode data in components
```tsx
const value = 1.6;  // WRONG
```

✅ **DO:** Use metric IDs from data
```tsx
const metric = useMetric('global_warming_2024');
const value = metric.value.number;  // RIGHT
```

❌ **DON'T:** Ignore reduced motion
```tsx
<div className="animate-bounce">  // WRONG
```

✅ **DO:** Check preference
```tsx
const reducedMotion = useReducedMotion();
<div className={reducedMotion ? '' : 'animate-bounce'}>  // RIGHT
```

❌ **DON'T:** Mix controlled/uncontrolled patterns
```tsx
const [state, setState] = useState();  // Internal state
const { value } = props;  // AND props?  // WRONG
```

✅ **DO:** Choose one pattern
```tsx
// Uncontrolled: Component manages own state
const [isOpen, setIsOpen] = useState(false);

// OR Controlled: Parent manages state
interface Props { isOpen: boolean; onToggle: () => void; }
```

---

## Guide 3: How to Update Narrative Copy

### When to Use
Changing story text, adjusting messaging, or adding new narrative sections.

### Step 1: Update Data File
**File:** `src/data/story-data.json` → `narrative`

```json
"narrative": {
  "ato_1_diagnostico": {
    "title": "O Diagnóstico",
    "primary_metrics": ["global_warming_2024"],
    "copy_blocks": [
      {
        "id": "act1_opening",
        "text": "Em 2024, o planeta cruzou um limite perigoso.",
        "appearAt": 0.2,
        "disappearAt": 0.5
      }
    ]
  }
}
```

**Reference:** [03_data_schema.md §10](03_data_schema.md#10-narrative-linking)

### Step 2: Update Storyboard
**File:** [06_storyboards.md](06_storyboards.md)

Find the corresponding row and update the narrative copy:

```markdown
| Scroll | Narrative Copy                                  |
|--------|--------------------------------------------------|
| 0.2    | "Em 2024, o planeta cruzou um limite perigoso." |
```

### Step 3: Verify Scroll Coordinates
Make sure `appearAt`/`disappearAt` match storyboard scroll ranges.

**Scroll unit definition:** [04_interaction_spec.md §2.3](04_interaction_spec.md#23-scroll-unit-definition)

### Step 4: Update Components (if needed)
If copy affects component rendering (e.g., labels, tooltips):

```tsx
<NarrativeBlock
  text={narrativeCopy.act1_opening.text}
  appearAt={narrativeCopy.act1_opening.appearAt}
  disappearAt={narrativeCopy.act1_opening.disappearAt}
/>
```

### Step 5: Test Narrative Flow
Scroll through the act and verify:
- [ ] Text appears at correct scroll position
- [ ] Text is readable (contrast, font size per [02_style_guide.md §4.3](02_style_guide.md#43-responsive-typography))
- [ ] Text doesn't overlap visuals
- [ ] Emotional intent matches [01_story_architecture.md](01_story_architecture.md)

### Common Mistakes to Avoid

❌ **DON'T:** Embed numbers in copy
```json
"text": "Temperature rose 1.6°C"  // WRONG - can't update
```

✅ **DO:** Use metric references or placeholders
```json
"text": "Temperature rose {value}°C",  // Component fills in
"primary_metrics": ["global_warming_2024"]  // RIGHT
```

❌ **DON'T:** Change scroll units without updating storyboard
```json
"appearAt": 0.5  // Changed from 0.2
```
But storyboard still says `| 0.2 | ... |`  // MISMATCH

✅ **DO:** Update both data and storyboard together
```json
"appearAt": 0.5  // Data file
```
```markdown
| 0.5    | ... |  // Storyboard  // RIGHT
```

❌ **DON'T:** Forget translation keys
```json
"text": "Temperature rose"  // Only Portuguese?
```

✅ **DO:** Use localization structure
```json
"text": {
  "pt-BR": "Temperatura subiu",
  "en": "Temperature rose"
}  // RIGHT
```

---

## Guide 4: How to Add Scroll Behavior

### When to Use
Implementing sticky sections, scroll-triggered animations, or scroll-scrubbed video.

### Step 1: Define Scroll Budget
**File:** [04_interaction_spec.md](04_interaction_spec.md) and [06_storyboards.md](06_storyboards.md)

Determine how many scroll units this section needs:

```markdown
## My New Scene

| Scroll  | Visual Stage  | Components    |
|---------|---------------|---------------|
| 5.0–6.5 | SVG pinned    | `<MyComponent>` |
```

**Scroll unit = 100vh** (see [04_interaction_spec.md §2.3](04_interaction_spec.md#23-scroll-unit-definition))

### Step 2: Implement Sticky Stage
**File:** `src/components/MyScene.tsx`

```tsx
import { StickyStage } from '@/components/StickyStage';
import { MyComponent } from '@/components/MyComponent';

export function MyScene() {
  return (
    <StorySection
      id="my_scene"
      scrollUnits={1.5}  // 6.5 - 5.0 = 1.5 units
      background="dark"
    >
      <StickyStage stickyStart={0} stickyEnd={1.5}>
        <MyComponent />
      </StickyStage>
    </StorySection>
  );
}
```

**Reference:** [05_component_library.md §3.2](05_component_library.md#32-stickystage)

### Step 3: Implement Scroll Progress Hook
**File:** `src/hooks/useScrollProgress.ts`

```ts
export function useScrollProgress(
  scrollUnits: number
): { progress: number; scrollY: number } {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const maxScroll = scrollUnits * viewportHeight;
      const currentProgress = Math.min(scrollY / maxScroll, 1);

      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollUnits]);

  return { progress, scrollY: window.scrollY };
}
```

### Step 4: Connect to Component
```tsx
export function MyComponent() {
  const { progress } = useScrollProgress(1.5);

  return (
    <svg style={{ opacity: progress }}>
      {/* Content fades in over 1.5 scroll units */}
    </svg>
  );
}
```

**Motion timing reference:** [02_style_guide.md §7.4](02_style_guide.md#74-motion-timing)

### Step 5: Add Reduced Motion Support
```tsx
const reducedMotion = useReducedMotion();

return (
  <svg
    style={{
      opacity: reducedMotion ? 1 : progress,  // Skip animation
      transition: reducedMotion ? 'none' : 'opacity 400ms ease-out'
    }}
  >
```

**Reference:** [04_interaction_spec.md §8](04_interaction_spec.md#8-reduced-motion-mode-global)

### Common Mistakes to Avoid

❌ **DON'T:** Hardcode pixel values
```tsx
const stickyEnd = 800;  // WRONG - breaks on resize
```

✅ **DO:** Use scroll units
```tsx
const stickyEnd = 1.5;  // RIGHT - responsive
```

❌ **DON'T:** Ignore mobile
```tsx
<pin duration={4}>  // Too long for mobile
```

✅ **DO:** Adjust per device
```tsx
<pin duration={isMobile ? 2 : 4}>  // RIGHT
```

**Reference:** [04_interaction_spec.md §9](04_interaction_spec.md#9-mobile-specific-rules)

---

## Quick Reference Checklist

Before committing any changes:

### Data Changes ([03_data_schema.md](03_data_schema.md))
- [ ] All metrics have ≥1 source
- [ ] All sources have valid type/trust_level
- [ ] No orphaned metric IDs
- [ ] Units included
- [ ] Percentages have baselines

### Component Changes ([05_component_library.md](05_component_library.md))
- [ ] Props contract documented
- [ ] Data shapes specified
- [ ] Accessibility notes added
- [ ] Performance considerations noted
- [ ] Reduced motion supported

### Style Changes ([02_style_guide.md](02_style_guide.md))
- [ ] Uses design tokens (not hardcoded values)
- [ ] Colors from semantic palette
- [ ] Typography follows hierarchy
- [ ] Motion uses timing specs
- [ ] Responsive breakpoints defined

### Scroll/Interaction Changes ([04_interaction_spec.md](04_interaction_spec.md))
- [ ] Scroll units defined (100vh)
- [ ] Trigger thresholds specified
- [ ] Reduced motion override included
- [ ] Mobile rules documented
- [ ] No scroll hijacking

### Narrative Changes ([01_story_architecture.md](01_story_architecture.md))
- [ ] Emotional intent clear
- [ ] Scroll sequence documented
- [ ] Data focus specified
- [ ] Transition to next act defined

---

**Need more detail?** See the full documentation:
- [00_overview.md](00_overview.md) - Project vision
- [01_story_architecture.md](01_story_architecture.md) - Narrative structure
- [02_style_guide.md](02_style_guide.md) - Visual design
- [03_data_schema.md](03_data_schema.md) - Data contract
- [04_interaction_spec.md](04_interaction_spec.md) - Scroll behavior
- [05_component_library.md](05_component_library.md) - Component specs
- [06_storyboards.md](06_storyboards.md) - Implementation storyboard
