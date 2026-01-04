# **03 — Data Schema & Data Contract**

**Version 1.1 · January 2026**

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

## 3. High-Level Schema Overview

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

## 4. Meta Object

### Purpose

Describes scope, intent, and versioning.

### Required fields

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

## 5. Sources Object

### Purpose

Central registry for all data provenance.

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

## 6. Metric Object (Atomic Unit)

### Purpose

Represents a **single measurable fact**.

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

## 7. Extended Metric Fields

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

## 8. Metric Registry & Groups

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

## 9. Narrative Linking

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

## 10. Handling Ranges & Uncertainty

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

## 11. Versioning Rules

| Change type   | Action                |
| ------------- | --------------------- |
| Value update  | Update `last_updated` |
| Source change | Update `sources`      |
| Field added   | Minor schema bump     |
| Field removed | Major schema bump     |

---

## 12. Forbidden Practices

* ❌ Embedding numbers in narrative text
* ❌ Changing metric IDs
* ❌ Reusing one metric for different meanings
* ❌ Omitting units
* ❌ Using percentages without baselines

---

## 13. Validation Checklist

Before release:

* Every metric has ≥1 source
* Every source has a trust level
* No orphaned metric IDs
* All `update.status` reviewed
* All units consistent

---

## 14. Data Schema North Star

> **If the number changes tomorrow,
> the story must still work today.**
