Below is **`/docs/05_component_library.md`**, written as a **canonical component reference**.
This document bridges **story architecture → interaction spec → implementation**, and is designed to work equally well for designers, frontend devs, and coding agents.

---

# **05 — Component Library**

## *A Jornada do Clima*

**Version 1.0 · January 2026**

---

## 1. Purpose of This Document

This document defines **all reusable components** used in *A Jornada do Clima*.

It exists to ensure:

* Visual and interaction consistency
* Predictable data bindings
* Reusability across chapters
* Clear separation between data, layout, and motion

This is **not a design system UI kit** — it is a **narrative component system**.

---

## 2. Component Taxonomy

Components are grouped by function:

1. **Narrative Containers**
2. **Data Visual Components**
3. **Media Components**
4. **Interactive Components**
5. **Utility & UI Components**

Each component definition includes:

* Purpose
* Props (inputs)
* Data dependencies
* Interaction behavior
* Usage rules
* Forbidden uses

---

## 3. Narrative Container Components

---

### 3.1 `<StorySection>`

**Purpose**
Top-level wrapper for each narrative act or subsection.

**Used in**

* All atos
* Section boundaries

**Props**

```ts
id: string
title?: string
background: "dark" | "light" | "neutral"
scrollUnits: number
```

**Behavior**

* Defines scroll pacing
* Controls background transitions
* Hosts sticky visuals

**Rules**

* Must not contain more than one sticky visual
* Background transitions only happen here

---

### 3.2 `<StickyStage>`

**Purpose**
Holds the primary visual that remains pinned during scroll.

**Used in**

* Ato 1 (climate stripes)
* Ato 2 (Sankey)
* Ato 4 (goal tracker)

**Props**

```ts
stickyStart: number
stickyEnd: number
```

**Behavior**

* Pins content vertically
* Releases cleanly at section end

**Rules**

* Only one per StorySection
* Must be vertically centered

---

## 4. Data Visualization Components

---

### 4.1 `<ClimateStripesSVG>`

**Purpose**
Show long-term temperature evolution as color over time.

**Data**

* Annual temperature anomaly series

**Props**

```ts
data: TemperatureSeries[]
highlightThresholds?: number[]
showLabels: boolean
```

**Behavior**

* Scroll maps to year progression
* Colors interpolate linearly

**Rules**

* No axes until final state
* No interaction besides scroll

---

### 4.2 `<TemperatureGauge>`

**Purpose**
Communicate current warming level vs thresholds.

**Data**

* Current temperature anomaly

**Props**

```ts
value: number
thresholds: { warning: number; critical: number }
```

**Behavior**

* Fills vertically
* Threshold markers appear late

**Rules**

* Never shown before ClimateStripes
* Must include textual context

---

### 4.3 `<SankeyEmissions>`

**Purpose**
Show causal flow from activities → gases → atmosphere.

**Data**

* Emissions by sector and gas

**Props**

```ts
mode: "global" | "brazil"
data: SankeyData
```

**Behavior**

* Layered reveal on scroll
* Mode toggle morphs weights

**Rules**

* No animated re-layout on toggle
* Flow thickness must be proportional

---

### 4.4 `<GoalTrackerTimeline>`

**Purpose**
Compare current policy trajectory vs required trajectory.

**Data**

* Historical emissions
* NDC targets
* Science-based targets

**Props**

```ts
baselineYear: number
currentYear: number
paths: PathDefinition[]
```

**Behavior**

* Scroll animates time
* Two futures persist simultaneously

**Rules**

* Gap must remain visible
* No collapsing lines

---

## 5. Media Components

---

### 5.1 `<NarrativeImage>`

**Purpose**
Provide human or environmental context.

**Props**

```ts
src: string
alt: string
entry: "fade" | "slide-up" | "slide-side"
parallax?: boolean
```

**Behavior**

* Scroll-triggered entry
* Optional subtle parallax

**Rules**

* Max parallax 15%
* Never overlaps charts

---

## 6. Interactive Components

---

### 6.1 `<SolutionImpactSandbox>`

**Purpose**
Allow users to explore cumulative impact of solutions.

**Data**

* Solution impact metrics

**Props**

```ts
solutions: SolutionDefinition[]
maxSelections?: number
```

**Behavior**

* User toggles solutions
* Aggregate impact updates live
* Reset always available

**Rules**

* No scoring
* No forced interaction
* Scroll remains active

---

### 6.2 `<SolutionCard>`

**Purpose**
Represent a single mitigation strategy.

**Props**

```ts
label: string
impactValue: number
unit: string
description?: string
```

**Behavior**

* Click/tap toggles inclusion
* Visual feedback on selection

**Rules**

* No gamified visuals
* Must show uncertainty if present

---

### 6.3 `<CompareToggle>`

**Purpose**
Switch between Global and Brazil views.

**Props**

```ts
options: ["global", "brazil"]
value: string
```

**Behavior**

* Smooth fade/morph
* No layout jump

**Rules**

* Must preserve scroll position

---

## 6.4 Video Components

### 6.4.1 `<AutoPlayVideoSection>`

**Purpose**
A scroll-triggered video “scene” that **auto-starts when it enters view**, displays **subtitles**, and when finished **auto-advances** the narrative by scrolling to the next section.

**Used in**

* Chapter transitions (“breathers”)
* Short documentary clips that replace a static image beat
* Strong emotional/context moments (e.g., floods, fires, testimonies)

**Props**

```ts
src: string
poster?: string
captionsSrc: string              // WebVTT (.vtt) preferred
language?: string                // e.g., "pt-BR"
autoScrollTargetId: string       // next section anchor id
autoplayThreshold?: number       // default 0.6 (60% visible)
scrollLockDuringPlayback?: boolean // default false
showControls?: boolean           // default false
muted?: boolean                  // default true (mobile autoplay compatibility)
```

**Behavior**

* When the component becomes sufficiently visible (`autoplayThreshold`), it:

  1. Loads (if not loaded)
  2. Auto-plays (muted by default)
  3. Shows captions/subtitles (always on by default)
* When video ends:

  * Triggers an **auto-scroll** to the element with `autoScrollTargetId`
  * Auto-scroll is **smooth** and **short-distance**, like “turning a page”

**Interaction rules**

* User can pause/resume (tap) if `showControls=false` via a simple overlay
* If user scrolls away during playback:

  * Video should pause
  * Resume if they return (optional but recommended)

**Accessibility**

* Captions are mandatory
* Provide `alt` equivalent via:

  * captions + short text summary (outside component)
* Respect `prefers-reduced-motion`:

  * No auto-scroll if reduced-motion is enabled (must show a “Continue” button instead)

**Hard rules**

* Never auto-scroll if:

  * user has reduced-motion enabled
  * user manually paused the video
  * video failed to load (fallback to “Continue”)
* Autoplay must be muted by default to work on mobile browsers
* No loud audio surprise: if unmuted is allowed, require explicit user action

**Forbidden**

* Using this for long videos (> ~45–60 seconds) inside the primary scroll flow
* Auto-scrolling multiple sections ahead
* Auto-playing with sound without user gesture

---

### 6.5.2 `<ScrollScrubVideo>`

**Purpose**
A “scroll-scrubbed” video component where the **user’s scroll position controls playback progress**, creating the effect of the video unfolding *as you scroll* (frame-accurate feel).

**Used in**

* Explanatory sequences (e.g., forest loss over time)
* “Process” visuals (e.g., emissions filling the atmosphere)
* Data-to-reality transitions (e.g., map morphs, timeline journeys)

**Props**

```ts
src: string
poster?: string
captionsSrc?: string             // optional; recommended for key narration
scrollUnits: number              // how much scroll distance maps to full video
startOffset?: number             // default 0 (0% progress)
endOffset?: number               // default 1 (100% progress)
pin?: boolean                    // default true (sticky-like behavior)
smoothing?: number               // default 0.08 (lerp factor)
```

**Behavior**

* The video is **not time-driven**. It is **scroll-driven**:

  * entering the section pins the video (if `pin=true`)
  * scroll progress maps to playback time between `startOffset` and `endOffset`
* On scroll up, playback reverses accordingly
* Captions (if provided) should sync to current time
* When the user finishes the scroll range, the video remains at the final frame and the section releases (if pinned)

**Interaction rules**

* No play/pause controls by default (scroll is the control)
* If user stops scrolling, frame stays stable (no drift)
* On mobile, scrub should remain smooth and responsive

**Performance requirements**

* Preload strategy:

  * Preload metadata early
  * Preload enough buffer before entering scrub zone
* If browser cannot scrub video reliably:

  * Use a fallback mode (sequence of images or reduced FPS approach)

**Accessibility**

* If captions exist, they should remain readable against video (subtle scrim)
* Provide a short text description near the component for screen readers

**Hard rules**

* Must not hijack scroll:

  * Scrolling continues to move the page; the video responds to it
* Must not introduce jank:

  * If performance drops, fallback gracefully
* Respect `prefers-reduced-motion`:

  * Replace with a static keyframe + optional manual play mode

**Forbidden**

* Using extremely large videos without a fallback plan
* Using scrub video as a background while other charts require attention
* Combining scrub with heavy parallax layers in the same section

---

### 6.6 Shared Video Utilities

**Purpose**
Common hooks and utilities for video components.

**Hooks**

```ts
// useIntersectionTrigger
useIntersectionTrigger(threshold: number = 0.6)
  → [ref: RefObject<HTMLElement>, isVisible: boolean]

// useScrollProgress
useScrollProgress(scrollUnits: number)
  → { progress: number (0–1), scrollY: number }

// useReducedMotion
useReducedMotion()
  → boolean
```

**Usage**

All video components must use these shared utilities for consistency.

---

## 7. Text Components

---

### 7.1 `<NarrativeBlock>`

**Purpose**
Deliver narrative text tied to scroll state.

**Props**

```ts
text: string
appearAt: number
disappearAt: number
```

**Behavior**

* Fade in/out based on scroll

**Rules**

* One idea per block
* Max 3 lines (desktop)

---

### 7.2 `<DataLabel>`

**Purpose**
Reveal numeric values after visual context.

**Props**

```ts
value: number
unit: string
format?: string
```

**Behavior**

* Appears after visual settles

**Rules**

* Never first thing user sees

---

## 8. Utility Components

---

### 8.1 `<SourceDrawer>`

**Purpose**
Expose sources without breaking narrative flow.

**Props**

```ts
sourceIds: string[]
```

**Behavior**

* Expand/collapse
* Overlay or inline (context-dependent)

**Rules**

* Never auto-open
* Must be accessible

---

### 8.2 `<ChapterProgressIndicator>`

**Purpose**
Show progress through narrative.

**Props**

```ts
currentChapter: string
```

**Behavior**

* Passive indicator
* Updates on section entry

**Rules**

* No click navigation by default

---

## 9. Component Usage Rules (Hard Constraints)

* Components must be **pure** (data in → render out)
* No component fetches data directly
* No component owns scroll state globally
* Visual components never contain narrative logic
* Narrative components never contain raw data

---

## 10. Anti-Patterns (Explicitly Forbidden)

* One-off bespoke components for single scenes
* Hardcoded numbers in components
* Components with side effects outside their scope
* Components that assume a specific chapter

---

## 11. Component North Star

> **If a component cannot be reused in another chapter
> without changing its internals, it is not a component.**
