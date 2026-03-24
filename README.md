# DARTA — Drone Attack Research and Tactic Analysis

**Version 0.1 — Draft for Community Review**  
March 2026

---

DARTA is an open-source, unclassified framework that catalogs the adversarial Tactics, Techniques, and Procedures (TTPs) applicable to Unmanned Aerial Systems (UAS) across civil consumer, enterprise, military tactical, Ground Control Station / UTM infrastructure, and autonomous swarm domains.

The framework is structurally modeled on MITRE ATT&CK and The Aerospace Corporation's SPARTA matrix for spacecraft. It provides a common language and reference taxonomy for UAS security practitioners, operators, regulators, manufacturers, and red teams conducting threat modeling, vulnerability assessment, and security architecture review.

---

## Contents

- [Framework Overview](#framework-overview)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Framework Scope](#framework-scope)
- [Tactics Summary](#tactics-summary)
- [Countermeasures](#countermeasures)
- [Related Frameworks](#related-frameworks)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## Framework Overview

| Property | Value |
|---|---|
| Version | 0.1 Draft |
| Tactics | 9 |
| Techniques | 57 |
| Sub-Techniques | 228 |
| Countermeasures | 13 |
| Platform Scopes | 5 |
| Threat Actor Tiers | 3 |
| Status | Community Review |

DARTA addresses an identified gap in the UAS cybersecurity landscape: no unified, public taxonomy of adversarial behaviors covering the full UAS attack surface existed prior to this work. Existing frameworks either adapt enterprise IT models (MITRE ATT&CK Enterprise, ICS) in ways that miss domain-specific attack vectors, or address narrow subsets such as GPS spoofing or MAVLink security in isolation.

---

## Repository Structure

```
darta/
├── README.md                        # This file
├── CONTRIBUTING.md                  # Contribution guidelines
├── CHANGELOG.md                     # Version history
├── LICENSE                          # License terms
│
├── docs/
│   ├── DARTA_v0.1.docx              # Full framework document (Word)
│   ├── framework/
│   │   ├── overview.md              # Framework methodology and design decisions
│   │   ├── platform-taxonomy.md     # Platform category definitions
│   │   ├── threat-actors.md         # Threat actor tier definitions
│   │   ├── usage-guide.md           # How to use DARTA for threat modeling and red team
│   │   └── regulatory-landscape.md  # Regulatory and standards context
│   └── tactics/
│       ├── TA001-reconnaissance.md
│       ├── TA002-resource-development.md
│       ├── TA003-initial-access.md
│       ├── TA004-execution.md
│       ├── TA005-persistence.md
│       ├── TA006-defense-evasion.md
│       ├── TA007-lateral-movement.md
│       ├── TA008-collection-exfiltration.md
│       └── TA009-impact.md
│
├── countermeasures/
│   └── countermeasures.md           # All countermeasures with framework mappings
│
├── data/
│   └── darta.json                   # Machine-readable framework data
│
└── site/
    ├── src/
    │   └── App.jsx                  # React SPA source
    ├── public/
    │   └── index.html
    ├── package.json
    └── vite.config.js
```

---

## Getting Started

### Using the Framework for Threat Modeling

1. Review the [Platform Taxonomy](docs/framework/platform-taxonomy.md) to identify which platform categories apply to your system.
2. Review the [Threat Actor Profiles](docs/framework/threat-actors.md) to determine which adversary tiers are realistic for your context.
3. Work through the nine tactics in `docs/tactics/` and identify techniques that represent credible threats.
4. Map identified techniques to countermeasures in `countermeasures/countermeasures.md`.
5. Use the framework references in the countermeasures document to align findings with applicable regulatory or standards obligations.

### Running the Web Navigator

```bash
cd site
npm install
npm run dev
```

The navigator will be available at `http://localhost:5173`. For production build:

```bash
npm run build
```

The output in `site/dist/` can be deployed to any static hosting provider (GitHub Pages, Netlify, Vercel, or a self-hosted web server).

### Using the Machine-Readable Data

The file `data/darta.json` contains the complete framework in a structured JSON format suitable for tooling integration, custom navigator implementations, and automated threat modeling pipelines.

---

## Framework Scope

DARTA v0.1 covers the following attack surface domains:

- RF command, control, and communication links
- GNSS and GPS positioning and timing systems
- Onboard flight control firmware and real-time operating systems
- Companion computers and payload processing systems
- Ground Control Station software and host infrastructure
- UTM and U-Space service API and backend systems
- Drone swarm communication and coordination protocols
- UAS hardware and software supply chain

DARTA does not currently cover directed energy weapon attacks against UAS (partially covered by SPARTA), kinetic anti-satellite effects, or classified electronic warfare techniques. These areas are planned for future revisions.

### Platform Categories

| Shorthand | Category | Examples |
|---|---|---|
| Consumer | Consumer / Hobbyist UAS | DJI Mini 4 Pro, Autel Evo Nano |
| Enterprise | Enterprise / Professional UAS | DJI Matrice 350, WingtraOne |
| Military | Military Tactical UAS (sUAS to MALE) | AeroVironment Raven, MQ-9 Reaper |
| GCS / UTM | Ground Control Station and UTM Infrastructure | QGroundControl, Mission Planner, DJI FlightHub |
| Swarm | Drone Swarm and Autonomous Systems | Intel Shooting Star, DARPA OFFSET |

---

## Tactics Summary

| ID | Name | Techniques | Description |
|---|---|---|---|
| TA001 | Reconnaissance | 6 | Information gathering on platforms, operators, protocols, and supply chain |
| TA002 | Resource Development | 5 | Acquisition and staging of attack capabilities and infrastructure |
| TA003 | Initial Access | 8 | Gaining a foothold via RF, network, supply chain, or physical means |
| TA004 | Execution | 7 | Running malicious actions on compromised UAS or GCS components |
| TA005 | Persistence | 5 | Maintaining long-term access across reboots and remediation |
| TA006 | Defense Evasion | 6 | Avoiding detection by operators, C-UAS sensors, and monitoring systems |
| TA007 | Lateral Movement | 5 | Moving from initial foothold to adjacent systems and networks |
| TA008 | Collection and Exfiltration | 5 | Intercepting and exfiltrating video, telemetry, and mission data |
| TA009 | Impact | 6 | Causing physical, operational, or informational harm |

Full technique and sub-technique documentation is in `docs/tactics/`.

---

## Countermeasures

Thirteen countermeasures are defined and mapped to the following frameworks and standards:

- NIST SP 800-53 Rev 5
- RTCA DO-326A / EUROCAE ED-202A
- ASTM F38 Committee Standards (F3411, F3322, F3388)
- STANAG 4586
- IEC 62443
- EU U-Space Regulation (2021/664, 665, 666)
- EU Cyber Resilience Act
- NIS2 Directive (2022/2555)
- FAA Part 89 / Part 107

Full countermeasure documentation is in `countermeasures/countermeasures.md`.

---

## Related Frameworks

| Framework | Organization | Domain | Relationship to DARTA |
|---|---|---|---|
| MITRE ATT&CK | MITRE Corporation | Enterprise IT, ICS, Mobile | Structural model and TTP taxonomy conventions |
| SPARTA | The Aerospace Corporation | Spacecraft | Direct domain analog — methodology source |
| MITRE ATT&CK for ICS | MITRE Corporation | Industrial Control Systems | Partial overlap for GCS/OT components |
| DroneSec Threat Intelligence | DroneSec | UAS (commercial TI) | Real-world incident baseline |
| NIST UAS Cybersecurity Work | NIST | UAS | Control framework alignment |

---

## Contributing

Community contributions are the primary mechanism for expanding and validating DARTA. Contributions are welcome in the following areas:

- New or refined techniques and sub-techniques
- Real-world incident mappings to existing technique IDs
- Detection guidance per technique (IoC, sensor data sources)
- Countermeasure additions or corrections
- Translation and localization
- Tooling and integrations

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

Reported issues and discussion topics should use the GitHub Issues tracker. For significant structural changes, open a Discussion before submitting a pull request.

---

## Versioning

DARTA follows a semantic versioning scheme adapted for knowledge framework releases:

- **Major version** (1.x): Community-validated, expert-reviewed, stable release
- **Minor version** (0.x): Significant content additions or structural changes
- **Patch version** (0.1.x): Corrections, clarifications, and minor additions

The current version is **0.1 Draft**. The framework is under active development and the content, structure, and identifiers may change before v1.0.

Technique IDs (e.g., `T003.002`) and tactic IDs (e.g., `TA003`) are considered stable from v1.0 onward. In pre-1.0 versions, IDs may be reassigned if the taxonomy is restructured.

---

## Disclaimer

DARTA is an unclassified, open-source framework released for research and educational purposes. The information contained herein is intended to support defensive security activities, threat modeling, and standards development.

Nothing in this document or repository constitutes authorization or encouragement to perform offensive activities against UAS systems without explicit written permission from all relevant system owners and in compliance with all applicable laws and regulations. The framework authors assume no liability for misuse of the content.

DARTA is not affiliated with MITRE Corporation, The Aerospace Corporation, or any government agency. MITRE ATT&CK is a registered trademark of The MITRE Corporation. SPARTA is a product of The Aerospace Corporation.

---

## License

This work is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).

You are free to share and adapt the material for any purpose, including commercial use, provided appropriate credit is given, a link to the license is provided, and any changes are indicated.

Full license terms: https://creativecommons.org/licenses/by/4.0/
