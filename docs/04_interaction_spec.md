# **04 — Interaction & Scroll Specification**

**Version 1.1 · January 2026**

---

## 1. Purpose of This Document

This document defines the **interaction logic and scroll behavior** of *A Jornada do Clima*.

It specifies:

* How scrolling functions as a narrative driver
* How sticky visuals, animations, and video behave
* When auto-play and auto-scroll are allowed
* How user interaction and accessibility constraints are enforced

This is a **behavioral contract**.
Visual styling is defined in the Style Guide.
Data usage is defined in the Data Schema.

---

## 2. Core Interaction Model

### 2.1 Scroll as a Deterministic State Machine

Scrolling is treated as a **deterministic state machine**.

* Scroll position → visual state
* No randomness
* No time-based animations independent of scroll (except controlled video playback)
* Scroll direction reversal reverses state whenever technically feasible

---

### 2.2 Section Anatomy

Each narrative section (`StorySection`) follows this structure:

```
[ Spacer In ]
[ Sticky / Pinned Stage ]
[ Scroll-driven Layers ]
[ Spacer Out ]
```

Rules:

* Only **one pinned element** active at a time
* Pinned elements are vertically centered
* Spacers define pacing and emotional breathing room

---

## 3. Global Scroll Rules

* Vertical scrolling only
* Horizontal scroll is forbidden
* No scroll hijacking
* No scroll snapping
* Scroll must always remain user-controlled

---

## 4. Sticky & Pinning Behavior

### 4.1 Entry

A component becomes pinned when:

* Its container reaches the defined trigger point
* The previous pinned component has fully released

---

### 4.2 Exit

A pinned component releases when:

* The scroll range for that scene completes
* The next section’s spacer begins

---

### 4.3 Constraints

* Max pin duration: **3–4 scroll units**
* Never overlap pinned elements
* Pinned content must never block scroll input

---

## 5. Animation & Trigger Types

### 5.1 Scroll-Linked Animations

Preferred animation model:

```text
progress = clamp(
  (scrollY - triggerStart) / (triggerEnd - triggerStart),
  0,
  1
)
```

Used for:

* Chart growth
* Color interpolation
* Line progression
* Opacity fades

---

### 5.2 Discrete Scroll Triggers

Used for:

* Text entry/exit
* Image slide-ins
* Mode toggles (Global ↔ Brazil)
* Video autoplay triggers

```text
if scrollY >= threshold → enter
if scrollY < threshold → exit
```

---

## 6. Video Interaction Rules (New)

Video is a **first-class narrative element**, not decoration.

Two distinct video behaviors are supported.

---

## 6.1 Auto-Play Video Sections (`<AutoPlayVideoSection>`)

### Purpose

Introduce short documentary or emotional context beats that:

* Auto-play when entering view
* Display subtitles
* Optionally auto-advance the narrative

---

### Trigger Rules

* Video auto-plays when **≥ 60% visible**
* Video auto-plays **muted by default**
* Subtitles/captions are **always on**

---

### Auto-Scroll Rules

Auto-scroll to the next section is allowed **only if all conditions are met**:

1. Video reaches natural end
2. User did not manually pause
3. `prefers-reduced-motion` is **false**
4. Auto-scroll distance is short (next section only)

If any condition fails:

* Show a visible **“Continue”** affordance instead

---

### Scroll Behavior During Playback

* Scroll remains enabled
* Scrolling away pauses video
* Returning to view resumes (recommended, not mandatory)

---

### Accessibility Overrides

If `prefers-reduced-motion` is enabled:

* Video may auto-play
* **Auto-scroll is disabled**
* User must explicitly continue

---

### Forbidden

* Auto-playing with sound
* Auto-scrolling multiple sections
* Long-form videos (> ~60s) inside main scroll flow

---

## 6.2 Scroll-Scrubbed Video (`<ScrollScrubVideo>`)

### Purpose

Use video as a **time-based visual layer controlled by scroll**.

---

### Behavior

* Video playback time maps directly to scroll progress
* Scroll forward → video advances
* Scroll backward → video reverses
* Video is typically pinned during scrub range

---

### Scroll Mapping

```text
videoTime = lerp(startTime, endTime, scrollProgress)
```

Optional smoothing may be applied to avoid jitter.

---

### Constraints

* Scrub range must be clearly bounded
* Video freezes on final frame after scrub completes
* No auto-play independent of scroll

---

### Performance Rules

* Preload metadata before scrub range
* Buffer sufficiently before user enters scrub
* If scrub performance degrades:

  * Fallback to static keyframes or reduced-FPS mode

---

### Accessibility

* Captions recommended for narrated content
* Provide text alternative nearby
* If reduced motion:

  * Replace scrub with static frame + manual play option

---

### Forbidden

* Scroll hijacking
* Combining scrubbed video with heavy parallax or charts
* Using scrub video as a decorative background

---

## 7. Act-Specific Interaction Adjustments

### ATO 1 — Diagnóstico

* Video allowed only as **short atmospheric intro**
* No auto-scroll in Ato 1

### ATO 2 — Anatomia

* Video may illustrate processes (scrub preferred)
* Must not compete with Sankey diagram

### ATO 3 — Ferramentas

* Auto-play videos allowed as case studies
* Must not interrupt interactive sandbox

### ATO 4 — Caminho

* Video use discouraged
* Focus remains on data tension and targets

---

## 8. Reduced Motion Mode (Global)

If `prefers-reduced-motion` is detected:

* Disable:

  * Auto-scroll
  * Video scrub
  * Parallax
* Replace with:

  * Static frames
  * Explicit user actions
* Preserve narrative order and meaning

---

## 9. Mobile-Specific Rules

* Shorter pin durations
* Lower scrub sensitivity
* Larger tap targets
* Conservative video preload strategy

---

## 10. Forbidden Interaction Patterns (Hard Rules)

* Scroll hijacking
* Auto-advancing without user consent (except allowed auto-scroll cases)
* Surprise audio
* Infinite animation loops
* Competing pinned elements

---

## 11. Interaction Testing Checklist

Before release:

* Scroll forward/backward behaves predictably
* Videos pause/resume correctly on visibility change
* Auto-scroll never triggers in reduced-motion mode
* Scrub videos remain responsive on mid-range devices
* No pinned overlap across all breakpoints

---

## 12. Interaction North Star

> **The interface should feel like turning pages,
> not like the page is turning you.**

