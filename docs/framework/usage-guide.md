# Usage Guide

This document describes how to apply DARTA for the four primary use cases: threat modeling, red team operations, security research, and regulatory and standards development.

---

## 1. Threat Modeling

Threat modeling with DARTA produces a structured, documented assessment of which adversarial TTPs are relevant to a specific UAS system, operation, or infrastructure component, and which countermeasures are in place or required.

### Step-by-Step Process

**Step 1 — Define the target of evaluation**

Precisely define what you are threat modeling. Examples:

- A specific drone model used for a particular operational mission
- A fleet management system and its GCS infrastructure
- A UTM service provider API
- An end-to-end operational workflow (drone + GCS + cloud + UTM)

**Step 2 — Identify applicable platform categories**

Using the definitions in [platform-taxonomy.md](platform-taxonomy.md), identify which DARTA platform categories apply. Most real-world systems span multiple categories (e.g., an enterprise inspection operation involves both `Enterprise` drone platforms and `GCS/UTM` infrastructure).

**Step 3 — Assess realistic threat actor tiers**

Using the definitions in [threat-actors.md](threat-actors.md), determine which adversary tiers are realistic given the operational context:

- A hobbyist drone used for recreational photography: primarily L1, possibly L2.
- An enterprise inspection drone used on energy infrastructure: L2 and L3.
- A military tactical UAS: all tiers with primary emphasis on L3.

**Step 4 — Enumerate applicable techniques**

Work through each of the nine tactics. For each tactic, identify techniques that:

(a) Apply to at least one of your identified platform categories, and  
(b) Are within the capability range of your assessed threat actor tiers.

Use the DARTA web navigator (see [README.md](../../README.md)) to filter by platform and actor tier. For each applicable technique, record whether it is currently mitigated, partially mitigated, or unmitigated.

**Step 5 — Assess countermeasure status**

For each identified technique, review the relevant countermeasures in [countermeasures.md](../../countermeasures/countermeasures.md). Assess whether each countermeasure is:

- Fully implemented
- Partially implemented (document what is missing)
- Not implemented
- Not applicable

**Step 6 — Prioritize findings**

Prioritize unmitigated and partially mitigated techniques by combining:

- Adversary tier required (lower tier = more accessible to a wider threat population)
- Platform scope match (techniques directly applicable to your platform are higher priority than analogous techniques)
- Impact potential (cross-reference TA009 techniques to identify what a successful execution would mean for your operation)

**Step 7 — Document and report**

Document findings using DARTA technique IDs as stable references. A finding documented as "T003.002 (GNSS Spoofing) — unmitigated, L2 actor accessible, applicable to Enterprise platform" is unambiguous and portable across teams and review cycles.

---

## 2. Red Team Operations

### Scoping

DARTA provides a structured technique enumeration for scoping UAS security assessments. When defining a test scope, map proposed test cases to DARTA technique IDs to:

- Ensure systematic coverage of the attack surface
- Communicate scope clearly to operators and system owners
- Avoid duplication between test cases

### Rules of Engagement Considerations

Several DARTA techniques carry operational safety risk if executed against live systems. The following categories require explicit, documented authorization and safety planning:

- **TA009 techniques** (Impact): Forced crash, drone hijacking, weaponization scenarios. These should only be tested in controlled environments with appropriate safety measures and operator notification.
- **T003.002 (GNSS Spoofing)**: Requires RF containment measures. Uncontained GPS spoofing transmissions are illegal in most jurisdictions and may affect other receivers in the vicinity.
- **T006.003 (RF Emission Minimization) / T003.001 (RF Link Hijacking)**: Active RF attacks require appropriate licensing or exemptions in most jurisdictions.
- **T004.003 (Malicious Code Deployment)**: Should only be executed on test platforms isolated from operational systems.

### Reporting

Use DARTA technique IDs as the primary finding identifier in assessment reports. This enables clients to cross-reference findings against the framework's sub-technique descriptions, countermeasure recommendations, and framework reference mappings without requiring detailed re-explanation in every report.

**Finding format**:
```
Finding ID: [your internal ID]
DARTA Technique: T003.001 — RF Command Link Hijacking
Sub-technique: MAVLink unauthenticated command injection
Severity: [your severity rating]
Platform: [affected platform]
Description: [specific details of what was tested and observed]
Countermeasure: CM-001 (Encrypted and Authenticated C2 Link) — not implemented
References: NIST SP 800-53 SC-8
```

---

## 3. Security Research

### Referencing DARTA in Publications

When publishing UAS security research, reference DARTA technique IDs in your work to contribute to the shared vocabulary. If your research identifies a technique not covered by DARTA, consider submitting a contribution (see [CONTRIBUTING.md](../../CONTRIBUTING.md)).

**Citation format**:
```
DARTA [T003.002] — GNSS Spoofing. Drone Attack Research and Tactic Analysis, v0.1. 
https://[darta-site-url]/technique/T003.002
```

### Mapping Research to Techniques

When mapping existing published research to DARTA techniques, consider:

- A single research paper may demonstrate multiple techniques or sub-techniques.
- Research demonstrating a new attack variant should be mapped to the most specific applicable sub-technique, or submitted as a new sub-technique if no match exists.
- Theoretical techniques not demonstrated in practice should be noted as such in technique descriptions.

---

## 4. Regulatory and Standards Development

DARTA provides standards and regulatory bodies with a systematic enumeration of UAS adversarial capabilities against which security requirements can be written and evaluated.

### Mapping Security Requirements to DARTA

When drafting UAS cybersecurity requirements, the following process is recommended:

1. Identify the platform categories and operational contexts within scope of the regulation or standard.
2. Use DARTA to enumerate applicable techniques for those categories.
3. For each technique, verify that the proposed requirement set addresses the technique through one or more controls.
4. Use the DARTA countermeasure framework mappings to cross-reference proposed requirements against established controls in NIST SP 800-53, DO-326A, and IEC 62443.

### Gap Analysis

Organizations assessing alignment between existing regulations and the UAS threat landscape can use DARTA to identify gaps: techniques for which no existing regulatory requirement provides coverage. Document these gaps as follows:

- Technique ID and name
- Platform scope
- Minimum actor tier
- Existing controls that partially address the technique (if any)
- Assessment of residual risk

---

## Using the Machine-Readable Data

The file `data/darta.json` provides the complete framework in JSON format. The schema is documented in `data/schema.md`. Example use cases:

- Automated threat model generation: import DARTA data into threat modeling tools to automatically populate relevant techniques based on system attributes
- Custom navigator implementations: build organization-specific views filtered to relevant platform categories and regulatory contexts
- Integration with GRC platforms: map DARTA techniques to risk register entries automatically
- CI/CD integration: automated checks that security test cases cover defined DARTA techniques for a given platform scope

---

## Worked Example

**Scenario**: You are assessing the security of an enterprise UAS operation used for infrastructure inspection of a power transmission network. The drone is a DJI Matrice 350 RTK running DJI enterprise software, operated via a GCS laptop on a dedicated Wi-Fi network, with flight plans synchronized to a cloud fleet management platform.

**Platform categories**: Enterprise, GCS/UTM.

**Realistic adversary tiers**: L2 (technically capable — disgruntled contractor, industrial competitor); L3 (nation-state — given critical infrastructure context).

**High-priority techniques identified**:

| Technique | Rationale |
|---|---|
| T001.003 — Communication Protocol Reconnaissance | DJI OcuSync RF scanning is L1-accessible |
| T003.002 — GNSS Spoofing | Widely demonstrated against DJI Enterprise platforms, L2 accessible |
| T003.003 — GCS Network Compromise | GCS laptop on Wi-Fi is a significant attack surface, L2 accessible |
| T004.001 — Malicious Command Injection | Relevant if C2 link is intercepted, L2 accessible |
| T008.001 — Video Feed Interception | DJI video downlink encryption weaknesses documented in public research |
| T009.003 — Mission Disruption and Denial | RF jamming accessible at L1; significant operational impact |

**Countermeasures to assess**:

- CM-001: Encrypted and authenticated C2 link — is DJI enterprise link encryption enabled and verified?
- CM-002: GNSS anti-spoofing — does the platform have RTK correction as a spoofing detection mechanism?
- CM-008: GCS network segmentation — is the GCS laptop isolated from the corporate network?
- CM-012: Onboard data encryption — is stored video and telemetry data encrypted at rest?
