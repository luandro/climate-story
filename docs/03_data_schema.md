# **03 — Data Schema & Data Contract**

**Version 2.0 · January 2026**

---

## 1. Purpose of This Document

This document defines the **canonical data schema** for *A Jornada do Clima*.

It exists to ensure that:

* Data can be updated without breaking the narrative
* Visualizations remain stable across releases
* Sources are always traceable
* Numbers are isolated from storytelling text
* Developers, designers, and editors share a common data language

This document is a **contract**.
Breaking it requires an explicit version change.

---

## 2. Core Design Principles

1. **Numbers are isolated**

   * No numeric value is embedded in narrative copy.
2. **Context travels with data**

   * Units, baselines, and caveats are mandatory.
3. **Sources are first-class**

   * Every metric links to one or more sources.
4. **Stable IDs**

   * IDs never change, even if values do.
5. **Narrative is referential**

   * Story sections reference metric IDs, never raw values.

---

## 3. TypeScript Reference

The canonical TypeScript types are defined in:

**`src/data/storyData.ts`**

This document (`03_data_schema.md`) defines the **contract** and **business rules**.
The TypeScript file enforces the contract at compile-time.

**Relationship:**
- This doc = "What and why" (specification, rules, validation)
- TypeScript file = "How" (implementation, types, interfaces)

When they conflict, the TypeScript file wins (update this doc to match).

---

## 4. High-Level Schema Overview

```text
root
 ├─ meta
 ├─ sources
 ├─ metrics_registry
 ├─ metrics
 │   ├─ global_emissions_factors
 │   ├─ emissions_by_sector
 │   ├─ current_status_kpis
 │   ├─ solutions_impact
 │   ├─ brazil_context
 │   ├─ economic_data
 ├─ narrative
 ├─ app_structure
 └─ data_quality
```

---

## 5. Meta Object

### Purpose

Describes scope, intent, and versioning.

### Required vs Optional Fields

**Required:**
```json
{
  "schema_version": "string",
  "last_updated": "YYYY-MM-DD",
  "intended_use": ["string"],
  "localization": {
    "default_language": "string",
    "supported_languages": ["string"]
  }
}
```

**Optional:** None (all meta fields are required)

### Example structure

```json
{
  "schema_version": "2.0",
  "last_updated": "YYYY-MM-DD",
  "intended_use": ["scrollytelling", "data_visualization"],
  "localization": {
    "default_language": "pt-BR",
    "supported_languages": ["pt-BR", "en"]
  }
}
```

Rules:

* `schema_version` changes only when structure changes
* `last_updated` changes whenever any metric value changes

---

## 6. Sources Object

### Purpose

Central registry for all data provenance.

### Required vs Optional Fields

**Required:**
```json
{
  "source_id": {
    "name": "string",
    "type": "string",
    "trust_level": "string"
  }
}
```

**Optional:**
```json
{
  "ref": "string | null",
  "url": "string | null"
}
```

### Structure

```json
"sources": {
  "source_id": {
    "name": "string",
    "ref": "string",
    "type": "government | intergovernmental | ngo | academic | media",
    "trust_level": "very_high | high | medium | unknown",
    "url": "string | null"
  }
}
```

Rules:

* IDs are strings (numeric or semantic)
* A source can be reused across many metrics
* URLs are recommended but not required

---

## 7. Metric Object (Atomic Unit)

### Purpose

Represents a **single measurable fact**.

### Required vs Optional Fields

**Required:**
```json
{
  "id": "string",
  "label": "string",
  "value": {
    "number": "number",
    "unit": "string"
  },
  "geography": "string",
  "type": "string",
  "year_reference": "number",
  "sources": ["string"]
}
```

**Optional (but recommended for completeness):**
```json
{
  "value": {
    "precision": "number"
  },
  "baseline": "string",
  "context": {},
  "trend": {},
  "thresholds": {},
  "notes": ["string"],
  "update": {}
}
```

**Conditional (required in specific cases):**
```json
{
  "target_range": {}  // Required when range is authoritative
}
```

### Required structure

```json
{
  "id": "stable_metric_id",
  "label": "Human-readable name",
  "value": {
    "number": 0,
    "unit": "string",
    "precision": 0.1
  },
  "geography": "global | Brazil | region",
  "type": "current_state | trend | projection | target",
  "year_reference": 2024,
  "sources": ["source_id"]
}
```

---

## 8. Extended Metric Fields

### Required vs Optional

**Optional but Common Fields:**

Use these to provide context and improve data quality:
- `precision`: For decimal accuracy
- `baseline`: For comparison reference
- `context`: For historical data
- `trend`: For direction indicators
- `thresholds`: For warning/critical levels
- `notes`: For editor comments
- `update`: For maintenance tracking

**Conditional Requirements:**

- If `update.status` is not `"ok"`, `notes` becomes **required**
- If `target_range` is present, it becomes authoritative (see §10)

### Optional but common fields

```json
{
  "baseline": "string",
  "context": {
    "preindustrial": { "number": 280, "unit": "ppm" }
  },
  "trend": {
    "direction": "up | down | stable",
    "description": "string"
  },
  "thresholds": {
    "warning": 1.5,
    "critical": 2.0
  },
  "notes": ["string"],
  "update": {
    "frequency": "annual | monthly | policy_change",
    "status": "ok | needs_update | needs_better_source"
  }
}
```

Rules:

* `notes` are for editors, not users
* `update.status` is mandatory for maintenance

---

## 9. Metric Registry & Groups

### Required vs Optional

**Registry:** Required
- All metric objects must exist in the central registry
- Registry keys must match metric `id` fields
- Only registry holds actual metric values

**Groups:** Optional (for organization only)
- Used to group metrics for narrative/visualization purposes
- Groups never store values, only references to metric IDs
- Can be nested or overlapping as needed

### Registry (required)

All **metric objects** live in a central registry keyed by `id`.

```json
"metrics_registry": {
  "global_warming_2024": {
    "id": "global_warming_2024",
    "label": "Aquecimento Global (vs Pré-industrial)",
    "value": { "number": 1.6, "unit": "°C", "precision": 0.01 },
    "geography": "global",
    "type": "current_state",
    "year_reference": 2024,
    "sources": ["13", "14"]
  }
}
```

Rules:

* Registry keys must match `id`
* Only registry holds metric values

### Groups (referential only)

Metrics are grouped **for narrative and visualization purposes only**.

Example:

```json
"current_status_kpis": {
  "title": "Indicadores Climáticos Atuais",
  "chart_type_suggestion": "KPI",
  "items": ["metric_id_1", "metric_id_2"]
}
```

Rules:

* Groups never store values
* Groups only reference metric IDs

---

## 10. Narrative Linking

### Required vs Optional Fields

**Required:**
```json
{
  "narrative": {
    "section_id": {
      "title": "string",
      "primary_metrics": ["metric_id"]
    }
  }
}
```

**Optional:**
```json
{
  "secondary_metrics": ["metric_id"],
  "copy_blocks": [
    {
      "id": "string",
      "text": "string",
      "appearAt": "number",
      "disappearAt": "number"
    }
  ]
}
```

**Rules:**
- Narrative sections **never embed numeric values** in text
- Always reference metric IDs from the registry
- Scroll coordinates (`appearAt`, `disappearAt`) are in scroll units

### Narrative Linking

Narrative sections **never embed numbers**.

Instead:

```json
"ato_1_diagnostico": {
  "primary_metrics": [
    "global_warming_2024",
    "brazil_regional_warming_max"
  ]
}
```

This allows:

* Automatic number updates
* Language localization
* Visual re-skinning

---

## 10.1. Handling Ranges & Uncertainty

### Ranges

```json
"target_range": {
  "min": { "number": 59, "unit": "%" },
  "max": { "number": 67, "unit": "%" }
}
```

### Optional: point value for ranges

When a range is primary, you may include a single `value` as a helper for charts, but the range is authoritative.

```json
{
  "value": { "number": 63, "unit": "%" },
  "target_range": {
    "min": { "number": 59, "unit": "%" },
    "max": { "number": 67, "unit": "%" }
  },
  "notes": ["Value is midpoint; range is authoritative."]
}
```

### Update candidates (future-proofing)

```json
"update_candidates": [
  {
    "label": "NOAA 2025",
    "value": { "number": 424.2, "unit": "ppm" },
    "source": "noaa"
  }
]
```

---

## 10.2. Versioning Rules

| Change type   | Action                |
| ------------- | --------------------- |
| Value update  | Update `last_updated` |
| Source change | Update `sources`      |
| Field added   | Minor schema bump     |
| Field removed | Major schema bump     |

---

## 10.3. Forbidden Practices

* ❌ Embedding numbers in narrative text
* ❌ Changing metric IDs
* ❌ Reusing one metric for different meanings
* ❌ Omitting units
* ❌ Using percentages without baselines

---

## 11. Controlled Vocabularies

### 11.1 Geography

Valid values for `metric.geography`:

```text
global       # Worldwide data
brazil       # Brazil-specific data
```

**Future extensions** (not yet implemented):
```text
north_america
europe
asia
south_america
africa
oceania
```

**Rules:**
* Use `global` for worldwide averages or totals
* Use `brazil` for Brazil-specific data only
* Regional breakdowns require explicit biome/state context

---

### 11.2 Source Types

Valid values for `source.type`:

```text
government         # Official government data (e.g., INPE, NASA, NOAA)
intergovernmental  # Multi-national bodies (e.g., IPCC, IEA, WHO)
ngo                # Non-profit organizations (e.g., WRI, EDF)
academic           # Peer-reviewed research
media              # Reporting with data (use sparingly)
```

**Rules:**
* Prefer `government` and `intergovernmental` for highest trust
* Use `academic` only for peer-reviewed, consensus research
* Use `media` only when original sources are unavailable
* One source can have multiple types (e.g., `["government", "academic"]`)

---

### 11.3 Source Trust Levels

Valid values for `source.trust_level`:

```text
very_high   # Multiple consensus sources, official data
high        # Official government/NGO data, peer-reviewed
medium      # Single source or indirect measurement
unknown     # Needs verification or validation
```

**Rules:**
* `very_high`: IPCC assessments, NASA/NOAA long-term records
* `high`: Government databases, peer-reviewed research, established NGOs
* `medium`: Industry reports, single studies, gray literature
* `unknown`: Requires additional validation before use

**Validation:**
* Every metric must have at least one source with `trust_level: "high"` or `"very_high"`
* Sources marked `unknown` should trigger review warnings

---

## 12. Validation Checklist

Before release:

* Every metric has ≥1 source
* Every source has a trust level
* No orphaned metric IDs
* All `update.status` reviewed
* All units consistent

---

## 13. Data Schema North Star

> **If the number changes tomorrow,
> the story must still work today.**
