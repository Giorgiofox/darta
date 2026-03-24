# Threat Actor Profiles

DARTA defines three adversary tiers based on technical capability, available resources, and operational intent. Each technique entry specifies the minimum tier required for realistic execution. Higher-tier actors are assumed to possess all capabilities of lower tiers.

The three-tier model is deliberately coarse. It does not attempt to enumerate named threat actor groups, as attribution intelligence belongs in operational threat intelligence products rather than a foundational framework. The tiers provide a practical prioritization mechanism for threat modeling without requiring detailed actor attribution.

---

## Tier Definitions

### L1 — Opportunistic / Low-Skill

**Minimum technical capability**: Basic electronics knowledge, ability to follow publicly available tutorials, access to commercially available hardware and open-source software.

**Typical resources**: Consumer-grade hardware (RTL-SDR dongle, commercial RC equipment, smartphone), open-source software (GNU Radio, publicly available exploit scripts), no specialized tooling.

**Operational intent**: Opportunistic rather than targeted. May include curious hobbyists, recreational experimenters, petty criminals, or protesters. Not pursuing persistent access or sustained campaigns.

**Representative techniques accessible at this tier**:

- T001.001 (UAS Platform Identification via OSINT)
- T001.002 (Operator and Mission Profiling via Remote ID monitoring)
- T003.005 (Physical Interface Exploitation via unsupervised physical access)
- T004.007 (Replay Attack using captured command packets)
- T006.002 (Remote ID Suppression using available bypass methods)
- T008.001 (Video Feed Interception of unencrypted analog FPV feeds)
- T009.003 (Mission Disruption via commercial RF jammer)
- T009.004 (Weaponization with minimal modification of consumer drone)

---

### L2 — Technically Capable

**Minimum technical capability**: Software development skills, RF engineering knowledge, ability to write custom exploit code, familiarity with penetration testing methodology and tooling.

**Typical resources**: Software-defined radio equipment (HackRF, USRP), laptop-based RF analysis tools, custom scripting capability, moderate budget for specialized hardware, access to vulnerability research and exploitation techniques.

**Operational intent**: May be targeted or semi-targeted. Includes: security researchers (both defensive and offensive), organized criminal groups with technical capacity, hacktivists, corporate espionage operators, insider threats with technical skills.

**Distinguishing capabilities beyond L1**:

- Development of custom RF attack tools (GNSS spoofing transmitters, MAVLink injection scripts)
- Active exploitation of software vulnerabilities in GCS and autopilot software
- Ability to reverse-engineer proprietary protocols to a usable degree
- Network penetration capability sufficient to compromise GCS infrastructure
- Development of tailored payloads (malicious firmware, GCS plugins)

**Representative techniques first accessible at this tier**:

- T003.001 (RF Command Link Hijacking via MAVLink injection)
- T003.002 (GNSS Spoofing via SDR-based transmitter)
- T003.003 (GCS Network Compromise via vulnerability exploitation)
- T004.001 (Malicious Command Injection)
- T004.002 (Firmware Exploitation)
- T006.001 (Telemetry Manipulation)
- T007.003 (Drone to Enterprise Network Pivot)
- T009.001 (Drone Hijacking)

---

### L3 — Nation-State / Advanced Persistent

**Minimum technical capability**: Teams of specialists across RF engineering, hardware security, software exploitation, and operational tradecraft. Access to classified vulnerability information and purpose-built tooling.

**Typical resources**: Significant budget, custom hardware development capability (including hardware implants), access to classified intelligence about target systems, ability to conduct multi-year research programs against specific targets.

**Operational intent**: Targeted, persistent, and often covert. Objectives may include: strategic intelligence collection, disruption of adversary military or critical infrastructure operations, technology theft, long-term persistent access for future contingency use.

**Distinguishing capabilities beyond L2**:

- Supply chain hardware and firmware implant development and insertion
- Large-scale coordinated GNSS spoofing affecting wide geographic areas
- Zero-day exploitation of flight controller and GCS software
- Custom hardware implants for long-term covert access
- Full-spectrum electronic warfare capabilities
- AI/ML model poisoning at the supply chain level

**Representative techniques first accessible at this tier**:

- T003.004 (Supply Chain Compromise via hardware or firmware implant)
- T004.005 (AI and ML Model Exploitation via training data poisoning)
- T005.001 (Firmware Implant surviving update cycles)
- T005.005 (Swarm Node Persistence)
- T006.006 (Physical Signature Reduction via purpose-built low-observable platforms)
- T007.004 (UTM Federation Abuse requiring sustained infrastructure access)

---

## Application Notes

### Tier as Minimum, Not Exclusive

A tier assignment in a technique entry indicates the minimum capability required for realistic execution of that technique. It does not mean that only actors at that tier will attempt it. An L3 actor will routinely use L1 techniques when they are sufficient for the objective.

### Tier and Platform Interaction

The minimum tier required for a technique against a given platform may differ from the stated tier if the platform has security measures that raise the capability bar. For example, T003.001 (RF Command Link Hijacking) is assessed at L2 for platforms using unencrypted or weakly authenticated C2. A platform with properly implemented encrypted and authenticated C2 (CM-001) effectively raises this technique to L3 or beyond for that specific platform.

This interaction is the mechanism by which countermeasures translate to practical risk reduction: they raise the minimum actor tier required, reducing the population of adversaries capable of executing the technique.

### Context-Dependent Assessment

Tier assessments should be revisited in light of the specific operational context:

- A platform regularly operated in a location accessible to L1 actors (public events, urban airspace) faces a different practical risk profile than one operated in a controlled and access-restricted environment.
- The publication of a public proof-of-concept exploit for a specific technique may effectively lower the tier from L2 to L1 for that technique against vulnerable platforms.
- Insider threats present an anomaly: an L1-capability insider with legitimate physical access may be capable of executing techniques normally assessed at L2 or L3 by removing the access barrier that constrains external actors.
