# **02 — Style Guide**

**Version 1.0 · January 2026**

---

## 1. Purpose of This Document

This Style Guide defines the **visual identity, motion language, and interaction aesthetics** of *A Jornada do Clima*.

It exists to ensure that:

* The experience feels coherent across chapters
* Data remains legible and credible
* Motion supports understanding, not spectacle
* Brazil vs Global comparisons are visually consistent
* Future contributors do not “freestyle” visual decisions

This is a **system**, not a moodboard.

---

## 2. Design Philosophy

### 2.1 Core Principles

1. **Data is the protagonist**

   * Visuals exist to clarify data, never to decorate it.
2. **Restraint beats spectacle**

   * Subtlety builds trust.
3. **Scroll equals progression**

   * Motion always signals narrative advancement.
4. **Emotion through structure, not drama**

   * No shock effects, no gimmicks.
5. **Brazil is visually first-class**

   * Never smaller, lighter, or secondary by default.

---

## 3. Color System

### 3.1 Design Tokens

#### Spacing Scale
```text
4px   - xs     (icon padding, tight spacing)
8px   - sm     (button padding, compact gaps)
12px  - md     (card padding, standard gaps)
16px  - lg     (section padding, comfortable gaps)
24px  - xl     (large gaps, content spacing)
32px  - 2xl    (hero spacing, major sections)
48px  - 3xl    (viewport margins)
```

**Tailwind Mapping:** Use `space-*` utilities (e.g., `p-lg`, `gap-sm`)

#### Border Radius
```text
4px  - sm     (buttons, small cards)
8px  - md     (containers, cards)
12px - lg     (panels, modals)
16px - xl     (hero containers)
```

**Tailwind Mapping:** `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`

#### Shadows / Elevation
```text
sm  - 0 1px 2px rgba(0,0,0,0.1)     (subtle borders)
md  - 0 4px 6px rgba(0,0,0,0.15)    (cards, dropdowns)
lg  - 0 10px 15px rgba(0,0,0,0.2)   (modals, overlays)
xl  - 0 20px 25px rgba(0,0,0,0.25)  (hero elements)
```

**Tailwind Mapping:** `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`

#### Z-Index Tiers
```text
0     - Background content
10    - Standard content
100   - Sticky elements, tooltips
1000  - Overlays, modals
```

**Usage:** Never use arbitrary z-index values. Use these tiers with CSS variables.

#### Opacity Levels
```text
0%    - Hidden
25%   - Disabled state
50%   - Secondary content
75%   - Hover preview
100%  - Fully visible
```

---

### 3.2 Base Neutrals (Foundation)

```text
Background — Dark          #0E1116
Background — Light         #F6F7F9
Text — Primary             #FFFFFF
Text — Secondary           #C7CBD1
Grid / Divider             #2A2E35
Disabled / Muted           #6B7280
```

Usage:

* Dark backgrounds dominate **Ato 1 & 2**
* Light backgrounds emerge in **Ato 3**
* Mixed / neutral tones in **Ato 4**

---

### 3.3 Climate Semantic Colors

Used **only** in data visualizations.

```text
Cold (≤ 0°C anomaly)       #2C7BE5
Neutral / Baseline         #E9ECEF
Warm (+1.0°C)              #F39C12
Critical (+1.5°C)          #E74C3C
Extreme (+2.0°C+)          #8E1E1E
```

Rules:

* Red tones must always be contextualized with scale or legend
* No red for decoration or emphasis alone
* Gradients must be perceptually uniform

---

### 3.4 Brazil & Biome Accents

Used to differentiate **Brazil-specific data**, not for branding.

```text
Brazil Green               #1E7F43
Amazon Forest              #145A32
Cerrado                    #C9A227
Water / Rivers              #2D9CDB
```

Rules:

* Never mix biome colors in the same data encoding
* Always explain biome colors with a legend

---

## 4. Typography

### 4.1 Font Stack

**Primary UI & Body**

* `Inter`
  Weights: 400 / 500 / 600 / 700

**Headlines / Emphasis**

* `IBM Plex Sans` or `Source Sans 3`

**Numerical Emphasis (optional, sparing)**

* `IBM Plex Mono`

---

### 4.2 Hierarchy

```text
H1 — Chapter Title         48–56px / 700
H2 — Section Title         32–36px / 600
H3 — Callout               22–24px / 600
Body Text                  16–18px / 400
Caption / Source           12–13px / 400
```

---

### 4.3 Responsive Typography

| Breakpoint | Base | H1 | H2 | H3 | Body | Caption |
|------------|------|----|----|----|----|----|
| **Mobile** (< 768px) | 16px | 32px | 24px | 18px | 16px | 12px |
| **Tablet** (768–1024px) | 16px | 40px | 28px | 20px | 16px | 12px |
| **Desktop** (> 1024px) | 16px | 48px | 32px | 22px | 18px | 13px |

**Line Heights:**
- H1: 1.1
- H2: 1.2
- H3: 1.3
- Body: 1.5
- Caption: 1.4

**Implementation:**
- Use CSS `clamp()` for fluid scaling between breakpoints
- Mobile-first approach (start with mobile sizes)
- Ensure minimum readable size: 14px for body text

**Rules:**

* One numeric highlight per paragraph max
* Never bold entire paragraphs
* Sources are always visually secondary

---

## 5. Layout System

### 5.1 Grid

* 12-column grid (desktop)
* 4-column grid (mobile)
* Generous margins to avoid crowding visuals

### 5.2 Alignment

* Text aligned left or right of visuals
* Never center text over charts
* Avoid full-width text blocks over data

---

## 6. Visual Asset Types

### 6.1 SVGs — Primary Data Layer

Used for:

* Climate stripes
* Temperature charts
* Sankey diagrams
* Goal trackers

Behavior:

* Sticky (pinned) during scroll sections
* Scroll-linked animation (not time-based)
* Axes and numbers appear **after** motion

Rules:

* SVG preferred over canvas
* All SVGs must support ARIA labels
* No looping animations

---

### 6.2 Raster Images (PNG / WebP)

Used for:

* Landscapes
* Human scale
* Contextual grounding

Behavior:

* Slide + fade in
* Subtle parallax (≤ 15%)
* Always behind or beside data, never covering it

Rules:

* No stock-photo clichés
* No dramatic filters
* Natural color grading only

---

### 6.3 Text Blocks

Behavior:

* Fade in after visual settles
* Fade out before transition
* Never scroll faster than visuals

Rules:

* One idea per block
* Short sentences
* Active voice

---

## 7. Motion & Animation

### 7.1 Allowed Motions

* Fade
* Slide (X or Y, ≤ 40px)
* Scale (≤ 1.05 → 1)

### 7.2 Forbidden Motions

* Bounce
* Elastic
* Spin
* Shake
* Looping effects

---

### 7.3 Easing

```text
Primary: ease-out
Secondary: linear (for data fills)
```

Motion should feel **inevitable**, not playful.

---

### 7.4 Motion Timing

**Durations:**
- **Fast**: 200ms — hover states, micro-interactions, button feedback
- **Base**: 400ms — standard transitions, element entry/exit
- **Slow**: 700ms — major state changes, emphasis beats, chapter transitions

**Stagger Timing:**
- Sequential reveals: +50ms per item
- Grid layouts: +100ms per row
- Lists: +75ms per item

**Performance Targets:**
- All animations: 60fps (16ms per frame)
- Scroll-driven animations: ≤50ms latency
- State transitions: Complete within specified duration

**Examples:**
```css
/* Fast hover */
.button:hover { transition: background-color 200ms ease-out; }

/* Base fade-in */
.narrative-block { animation: fadeIn 400ms ease-out; }

/* Slow chapter transition */
.chapter-transition { transition: opacity 700ms ease-out; }

/* Staggered list items */
.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 75ms; }
.list-item:nth-child(3) { animation-delay: 150ms; }
```

---

## 8. Scroll Behavior Patterns

### 8.1 Sticky Sections

Used for:

* Core data visuals
* Diagrams that evolve with scroll

Rules:

* One sticky element at a time
* Clear visual handoff between sections

---

### 8.2 Scroll Triggers

* Triggered by scroll position, not velocity
* Deterministic behavior (no randomness)
* Scroll backward reverses state when possible

---

## 9. UI Elements

### 9.1 Navigation

* Minimal chapter indicator
* Appears only after first scroll
* Never blocks content

### 9.2 Tooltips

* Definition-only
* Optional
* No critical information hidden in tooltips

### 9.3 Sources

* Always accessible
* Visually understated
* Expandable on demand

---

## 10. Accessibility

### 10.1 Visual

* WCAG AA contrast minimum
* Color is never the sole carrier of meaning

### 10.2 Motion

* Respect `prefers-reduced-motion`
* Replace animations with static states if enabled

### 10.3 Interaction

* Keyboard navigable
* Touch-friendly hit areas

---

## 11. Performance Guidelines

* SVG > Canvas > Video
* Lazy-load raster images
* Avoid large background videos
* Keep animation layers minimal

---

## 12. What This Style Guide Prohibits

* Decorative charts
* Animated charts without narrative context
* Gamified UI patterns
* CTA-heavy layouts
* “Greenwashing” aesthetics

---

## 13. Style North Star

> **If the visuals disappeared, the story should still be true.
> If the story disappeared, the visuals should still be honest.**

