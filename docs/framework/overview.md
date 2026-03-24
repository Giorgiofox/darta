# Framework Overview

## Purpose

DARTA (Drone Attack Research and Tactic Analysis) provides a structured taxonomy of adversarial Tactics, Techniques, and Procedures (TTPs) applicable to Unmanned Aerial Systems. Its primary purpose is to create a common language enabling meaningful communication between threat intelligence analysts, security engineers, red teams, standards bodies, regulators, and operators working across the UAS domain.

The framework is designed to support four primary use cases:

- **Threat modeling**: Systematic identification and assessment of threats relevant to a specific UAS system, operation, or infrastructure component.
- **Red team scoping and reporting**: Structured enumeration of test cases for UAS-focused security assessments and a standardized format for communicating findings.
- **Security research**: A shared identifier system enabling comparison and aggregation of published UAS security research findings.
- **Regulatory and standards development**: A systematic catalog of adversarial capabilities informing the development of security requirements and controls.

---

## Design Decisions

### Structural Model

DARTA adopts the tactic-technique-sub-technique hierarchy established by MITRE ATT&CK. This decision was made to maximize interoperability with existing security tools, processes, and analyst training that reference ATT&CK conventions. Organizations already using ATT&CK for enterprise or ICS threat modeling can extend their existing processes with DARTA for UAS-specific coverage.

Tactic IDs use the prefix `TA` followed by a zero-padded three-digit number (e.g., `TA003`). Technique IDs use the prefix `T` followed by the tactic number, a period, and a zero-padded three-digit sub-number (e.g., `T003.002`). This structure ensures visual disambiguation from ATT&CK IDs (which use `T` with a four-digit number) while maintaining a familiar format.

### Platform Scope

Unlike enterprise IT, where the target environment is relatively homogeneous, the UAS domain spans an enormous range of system architectures, communication protocols, and operational contexts. A consumer drone and a military MALE platform share fundamental aerodynamic principles but have almost nothing in common from a cybersecurity perspective.

DARTA addresses this by assigning a platform scope to each technique. Scope assignments indicate which categories of UAS platform are meaningfully exposed to a given technique. A technique scoped to "Military" only does not imply that consumer platforms are immune; it indicates that the technique is not a practical threat to consumer platforms given their architecture and typical operational context.

Platform scope is descriptive, not prescriptive. Organizations should use scope assignments as a starting point for threat modeling but apply judgment based on their specific system architecture.

### Adversary Tier

The three-tier adversary model provides a lightweight mechanism for prioritizing threats without requiring full threat actor attribution. Tier assignment to a technique reflects the minimum capability level an adversary realistically needs to execute the technique, not the maximum. A nation-state actor is assumed to be capable of all techniques across all tiers.

The tier model is deliberately coarse. DARTA does not attempt to enumerate specific threat actor groups or attribute techniques to named APTs, as this level of specificity changes rapidly and belongs in threat intelligence products rather than a foundational framework.

### Relationship to Existing Frameworks

DARTA is complementary to, not a replacement for, existing frameworks:

- **MITRE ATT&CK Enterprise and ICS**: Techniques in those matrices that apply to GCS infrastructure (which often runs on enterprise IT) or OT-like flight control systems remain valid. DARTA adds the RF, GNSS, avionics, and swarm-specific layer that ATT&CK does not address.
- **SPARTA**: SPARTA covers spacecraft cybersecurity. There is intentional conceptual overlap in areas such as RF link attacks, GNSS spoofing, and supply chain compromise, as these attack categories span both domains. DARTA does not duplicate SPARTA; it provides a UAS-specific instantiation of these categories with technique details appropriate to drone systems.
- **ATT&CK for ICS**: Flight controllers and autopilots share characteristics with industrial control systems. ATT&CK for ICS techniques such as impair process control and manipulate control are conceptually analogous to several DARTA techniques. Where an ATT&CK for ICS technique directly applies to a GCS or flight controller component, practitioners should cross-reference both frameworks.

---

## Framework Limitations

**Coverage completeness**: DARTA v0.1 represents an initial enumeration based on published research, documented incidents, and domain expertise. It is not exhaustive. Techniques that exist in practice but have not yet been publicly documented are not represented.

**Incident validation**: The techniques in v0.1 have not been systematically validated against a corpus of real-world UAS security incidents. Incident validation is a planned activity for v0.2 and will likely result in scope and description refinements.

**Military domain**: Coverage of military UAS techniques is limited to what is observable from unclassified public sources. Classified techniques and those disclosed only through government channels are not represented.

**Swarm and autonomous systems**: This is a rapidly evolving area. Techniques in TA004 and TA005 related to swarm and AI/ML systems reflect the state of published research as of early 2026 and will require frequent updating as operational swarm deployments mature.

**Countermeasure completeness**: The thirteen countermeasures in v0.1 address the most significant categories of risk. Per-technique countermeasure mappings are incomplete and will be expanded in subsequent versions.

---

## Methodology

The v0.1 framework was developed using the following methodology:

1. **Attack surface decomposition**: The UAS system was decomposed into functional attack surface segments: RF links, GNSS, onboard firmware/OS, companion computing, GCS software and network, UTM/U-Space API, swarm coordination, and supply chain.

2. **Literature survey**: Published academic and industry research on UAS security was surveyed to identify documented attack classes and techniques.

3. **Incident analysis**: Publicly documented UAS security incidents were analyzed to ground the technique set in observed adversarial behavior.

4. **Analogical mapping**: Attack classes from MITRE ATT&CK Enterprise, ATT&CK for ICS, and SPARTA were reviewed for applicability or adaptation to the UAS domain.

5. **Tactic and technique definition**: Techniques were grouped into tactical phases following the ATT&CK convention of adversarial goal-oriented phases.

6. **Countermeasure mapping**: Defensive controls were identified for each attack category and mapped to applicable standards and regulatory requirements.
