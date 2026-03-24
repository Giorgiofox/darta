# Changelog

All notable changes to DARTA will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). DARTA uses a semantic versioning scheme adapted for knowledge framework releases. See the versioning section of [README.md](README.md) for details.

---

## [Unreleased]

_Changes staged for the next release will be listed here._

---

## [0.1.0] — 2026-03-24

### Added

- Initial framework release for community review.
- Nine tactical phases: Reconnaissance, Resource Development, Initial Access, Execution, Persistence, Defense Evasion, Lateral Movement, Collection and Exfiltration, Impact.
- 57 techniques with 228 sub-techniques covering all defined platform scopes.
- Five platform scope categories: Consumer, Enterprise, Military, GCS/UTM, Swarm/Autonomous.
- Three adversary tier definitions: L1 Opportunistic, L2 Technically Capable, L3 Nation-State/Advanced.
- 13 countermeasures with mappings to NIST SP 800-53 Rev 5, DO-326A/ED-202A, ASTM F38, STANAG 4586, IEC 62443, EU U-Space Regulation, EU Cyber Resilience Act, NIS2 Directive.
- Full framework document (DARTA_v0.1.docx).
- React SPA web navigator with interactive matrix, platform and actor tier filtering, technique drill-down, and countermeasure views.
- Machine-readable framework data (data/darta.json).
- Framework documentation: overview, platform taxonomy, threat actor profiles, usage guide, regulatory landscape.
- Per-tactic documentation files in docs/tactics/.
- Repository documentation: README.md, CONTRIBUTING.md, CHANGELOG.md, LICENSE.

---

## Versioning Reference

| Version Pattern | Meaning |
|---|---|
| 0.x.x | Pre-release, community review phase |
| 1.0.0 | First community-validated stable release |
| 1.x.0 | Minor additions (new techniques, countermeasures) |
| 1.0.x | Corrections and clarifications |

Technique IDs (T00X.00X) and Tactic IDs (TA00X) are considered stable identifiers from v1.0.0 onward. In pre-1.0 versions, IDs may be reassigned if the taxonomy is restructured.
