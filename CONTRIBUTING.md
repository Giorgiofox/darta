# Contributing to DARTA

Thank you for your interest in contributing to the Drone Attack Research and Tactic Analysis (DARTA) framework. Community contributions are essential to building a comprehensive, accurate, and practically useful resource for the UAS cybersecurity community.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [What We Are Looking For](#what-we-are-looking-for)
- [What We Are Not Looking For](#what-we-are-not-looking-for)
- [Contribution Types](#contribution-types)
- [Submission Process](#submission-process)
- [Content Standards](#content-standards)
- [Technique Submission Template](#technique-submission-template)
- [Countermeasure Submission Template](#countermeasure-submission-template)
- [Review Process](#review-process)
- [Attribution](#attribution)

---

## Code of Conduct

All contributors are expected to engage professionally and constructively. Discussion of offensive techniques is within scope of the framework's purpose; use of the project as a platform for sharing operational attack tooling, active exploit code, or targeting of specific systems or organizations is not.

---

## What We Are Looking For

- New techniques or sub-techniques grounded in documented real-world incidents, published research, or demonstrated proof-of-concept work
- Corrections to existing technique descriptions, sub-techniques, or platform scope assignments
- Real-world incident mappings linking documented UAS security events to existing technique IDs
- Detection guidance for existing techniques, including relevant IoCs, sensor data sources, and monitoring recommendations
- Additional countermeasures with proper framework reference mappings
- Improvements to framework documentation, usage guides, and regulatory landscape coverage
- Tooling: navigator enhancements, JSON schema improvements, integrations with threat modeling tools

---

## What We Are Not Looking For

- Techniques that are purely theoretical with no documented or demonstrable basis
- Content that would provide operational uplift to malicious actors without commensurate defensive value
- Marketing content or vendor-specific product references in technique descriptions
- Techniques already covered by MITRE ATT&CK Enterprise or ICS without UAS-specific adaptation

---

## Contribution Types

### Type A: Minor Corrections

Typos, factual corrections, broken links, and minor clarifications to existing content. Submit directly as a pull request with a clear description of the change.

### Type B: New Sub-Techniques

Addition of sub-techniques to existing techniques. Submit as a pull request with supporting references. At least one of the following is required:

- Published academic or industry research paper
- Documented incident report (public or sanitized)
- Public proof-of-concept demonstration with responsible disclosure completed

### Type C: New Techniques

Addition of new techniques to existing tactics. Open a GitHub Issue using the Technique Submission template before submitting a pull request. New techniques require review and discussion before acceptance.

### Type D: Structural Changes

Changes to tactic definitions, technique ID reassignments, or changes to the overall taxonomy structure. Open a GitHub Discussion before any work begins. Structural changes are held to a higher standard and require broader community consensus.

### Type E: New Tactics

Proposals for additional tactical phases. Open a GitHub Discussion. This type of contribution requires demonstrated coverage of adversarial behaviors not addressed by existing tactics and is subject to extended review.

---

## Submission Process

1. Fork the repository to your GitHub account.
2. Create a feature branch with a descriptive name: `feature/add-T003-009-mavlink-desync` or `fix/T006-002-platform-scope`.
3. Make your changes following the content standards below.
4. Update `CHANGELOG.md` with a brief description of your changes under the `[Unreleased]` section.
5. Submit a pull request to the `main` branch with:
   - A clear title describing the change
   - A description of the change and its rationale
   - References supporting any new or modified content
   - The contribution type (A through E) noted in the PR description

---

## Content Standards

### Language

All framework content must be in English. Technical terminology should follow established usage in the UAS and cybersecurity communities. Avoid vendor-specific jargon where a neutral technical term exists.

### Tone

Framework content is written in the declarative, third-person present tense. Descriptions are precise and technical. Avoid hedging language in technique descriptions; use specific technical terminology.

Correct: "The adversary transmits counterfeit GNSS signals at power levels sufficient to override the authentic satellite signal, causing the drone's position solution to shift toward adversary-controlled coordinates."

Incorrect: "The attacker might try to mess with the GPS signal to possibly confuse the drone."

### References

All new technique content must include at least one supporting reference. Acceptable reference types:

- Peer-reviewed academic publications
- Published conference proceedings (USENIX, IEEE, ACM, Black Hat, DEF CON with written papers)
- Government or standards body publications
- Industry threat intelligence reports from named organizations
- Public CVE entries with associated technical analysis
- Documented incident reports from identified organizations

References to classified material are not accepted.

### Technique IDs

Do not assign technique IDs in your pull request. IDs are assigned by maintainers during the review process to avoid conflicts. Use a placeholder such as `T00X.00Y` in your submission.

---

## Technique Submission Template

When opening a GitHub Issue to propose a new technique, use the following structure:

```
## Proposed Technique

**Proposed Tactic:** [e.g., TA003 - Initial Access]
**Proposed Name:** [technique name]
**Platform Scope:** [All / Consumer / Enterprise / Military / GCS / UTM / Swarm]
**Minimum Actor Tier:** [L1 / L2 / L3]

## Description

[2-4 sentence technical description of what the adversary does and how]

## Sub-Techniques

- [sub-technique 1]
- [sub-technique 2]
- [sub-technique 3]

## Supporting References

- [reference 1]
- [reference 2]

## Why This is Not Covered by Existing Techniques

[Brief explanation of why this is distinct from existing techniques T00X.XXX]

## Real-World Evidence

[Description of documented incident, published research, or PoC demonstrating the technique]
```

---

## Countermeasure Submission Template

```
## Proposed Countermeasure

**Proposed Name:** [control name]
**Addresses Tactics:** [e.g., TA003, TA005]

## Description

[2-3 sentence description of the control and what it mitigates]

## Framework References

- [NIST SP 800-53 control ID and name]
- [Aviation or UAS standard reference]
- [Regulatory reference if applicable]

## Implementation Notes

[Optional: practical notes on implementation challenges or platform-specific considerations]
```

---

## Review Process

Pull requests are reviewed by framework maintainers. The review process includes:

1. **Automated checks**: Markdown formatting, JSON schema validation for data file changes.
2. **Technical review**: Assessment of technical accuracy, clarity, and alignment with framework scope.
3. **Reference verification**: Confirmation that supporting references substantiate the proposed content.
4. **Consistency review**: Verification that new content does not duplicate existing techniques and follows style conventions.

Review timelines are best-effort. Minor corrections (Type A) are typically reviewed within two weeks. Structural changes (Types D and E) may take longer pending community discussion.

Accepted contributions are merged to the `main` branch and included in the next release. Contributors are listed in `CHANGELOG.md` for the release in which their contribution appears.

---

## Attribution

Contributors who submit accepted content are listed in `CHANGELOG.md` under the relevant release. Significant contributors may be listed in a `CONTRIBUTORS.md` file maintained in the repository root.

DARTA does not currently offer financial compensation for contributions. All contributions are made under the project license (CC BY 4.0), meaning your contributed content may be shared, adapted, and built upon by others with attribution.
