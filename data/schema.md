# DARTA JSON Schema Reference

The file `darta.json` provides the complete DARTA framework in machine-readable format. This document describes the schema.

---

## Top-Level Structure

```json
{
  "framework":       { ... },
  "platforms":       [ ... ],
  "actor_tiers":     [ ... ],
  "tactics":         [ ... ],
  "countermeasures": [ ... ],
  "statistics":      { ... }
}
```

---

## framework

Metadata about the framework release.

| Field | Type | Description |
|---|---|---|
| name | string | Short name: "DARTA" |
| full_name | string | Full name |
| version | string | Semantic version (e.g., "0.1.0") |
| status | string | "draft" or "stable" |
| release_date | string | ISO 8601 date |
| description | string | One-sentence description |
| license | string | SPDX license identifier |
| url | string | Canonical URL of the framework |

---

## platforms

Array of platform category objects.

| Field | Type | Description |
|---|---|---|
| id | string | Lowercase shorthand used in technique entries |
| name | string | Human-readable category name |

Platform IDs: `consumer`, `enterprise`, `military`, `gcs`, `utm`, `swarm`, `all`

---

## actor_tiers

Array of adversary tier objects.

| Field | Type | Description |
|---|---|---|
| id | string | Tier identifier: "L1", "L2", or "L3" |
| name | string | Tier designation |
| description | string | Capability summary |

---

## tactics

Array of tactic objects, each containing a techniques array.

### Tactic Object

| Field | Type | Description |
|---|---|---|
| id | string | Tactic identifier (e.g., "TA003") |
| name | string | Tactic name |
| short | string | Abbreviated label for matrix display |
| description | string | Tactic summary |
| techniques | array | Array of technique objects |

### Technique Object

| Field | Type | Description |
|---|---|---|
| id | string | Technique identifier (e.g., "T003.002") |
| name | string | Technique name |
| platforms | array | Array of applicable platform IDs |
| actor_min | string | Minimum actor tier ID ("L1", "L2", or "L3") |
| sub_techniques | array | Array of sub-technique name strings |

---

## countermeasures

Array of countermeasure objects.

| Field | Type | Description |
|---|---|---|
| id | string | Countermeasure identifier (e.g., "CM-001") |
| name | string | Control name |
| tactic_ids | array | Tactic IDs this countermeasure addresses |
| refs | array | Framework reference strings |

---

## statistics

Aggregate counts for quick reference.

| Field | Type | Description |
|---|---|---|
| tactics | integer | Total number of tactics |
| techniques | integer | Total number of techniques |
| sub_techniques | integer | Total number of sub-techniques |
| countermeasures | integer | Total number of countermeasures |
| platforms | integer | Number of platform categories (excluding "all") |
| actor_tiers | integer | Number of actor tiers |

---

## Versioning

The JSON schema is versioned alongside the framework. Breaking changes to the schema structure will result in a minor version increment. Field additions that do not break existing consumers are not considered breaking changes.

Consumers of `darta.json` should validate against the schema version field before processing.
