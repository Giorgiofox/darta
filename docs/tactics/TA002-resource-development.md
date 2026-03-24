# TA002 — Resource Development

The adversary acquires, develops, or stages capabilities required to execute an attack against UAS systems. Resource development may occur entirely offline and is generally not observable by the target operator until attack execution begins.

---

## Techniques

### T002.001 — Acquire RF Attack Infrastructure

**Platform scope**: All  
**Minimum actor tier**: L1

**Description**: Procurement or construction of software-defined radio hardware, directional antennas, signal jammers, and GNSS spoofing transmitters for use in RF-based attacks.

**Sub-techniques**:
- SDR hardware procurement (HackRF One, USRP B200, RTL-SDR)
- High-gain directional antenna assembly for extended range or stealth
- GPS and GNSS spoofing device construction or purchase
- Commercial jammer acquisition (note: illegal to operate in most jurisdictions without authorization)

**Notes**: SDR hardware is commercially available and legal to possess in most jurisdictions. The legal boundary lies at transmission without authorization, not possession.

---

### T002.002 — Develop or Acquire Exploit Capabilities

**Platform scope**: All  
**Minimum actor tier**: L2

**Description**: Development, purchase, or adaptation of exploit code targeting UAS firmware, autopilot software, GCS applications, or UTM and U-Space APIs.

**Sub-techniques**:
- MAVLink protocol exploit development targeting unauthenticated command acceptance
- GCS software vulnerability research and exploitation tool development
- Firmware extraction and reverse engineering toolchain configuration
- UTM API fuzzing and logic flaw exploitation

---

### T002.003 — Obtain or Modify a Rogue UAS

**Platform scope**: All  
**Minimum actor tier**: L1

**Description**: Acquisition or modification of a drone to be used as a proximity attack platform, RF relay node, electronic attack delivery vehicle, or physical payload carrier.

**Sub-techniques**:
- Commercial drone modification for attack payload integration
- Compromised friendly drone repurposing after initial access
- FPV racing platform adaptation for kinetic or proximity attack use

---

### T002.004 — Develop Malicious Firmware or Software

**Platform scope**: All  
**Minimum actor tier**: L2

**Description**: Creation of trojanized firmware images, malicious GCS plugins, backdoored autopilot parameter files, or supply chain implants for delivery to target systems.

**Sub-techniques**:
- Trojanized autopilot firmware build (ArduPilot, PX4, or proprietary)
- Malicious GCS plugin or script development
- Backdoored parameter file creation encoding adversarial failsafe behavior
- Supply chain implant development for insertion during manufacturing or distribution

---

### T002.005 — Stage Attack Infrastructure

**Platform scope**: GCS, UTM  
**Minimum actor tier**: L2

**Description**: Preparation of command-and-control infrastructure, rogue GCS instances, spoofing relay servers, or UTM impersonation endpoints for use during attack execution.

**Sub-techniques**:
- Rogue GCS deployment and RF configuration for C2 link takeover
- Man-in-the-middle relay infrastructure setup for credential capture
- Fake UTM and U-Space endpoint staging for flight plan injection
- Encrypted adversarial C2 channel preparation for post-compromise operations

---

## Detection Opportunities

Resource development activities primarily occur outside the observable environment of the target operator. Detection opportunities are limited and generally rely on threat intelligence rather than direct observation.

| Technique | Detection Method | Data Source |
|---|---|---|
| T002.001 | Not observable by target | Threat intelligence |
| T002.002 | Vulnerability disclosure and PoC publication monitoring | CVE databases, security research feeds |
| T002.003 | Not observable by target | Threat intelligence |
| T002.004 | Unauthorized firmware images in distribution channels | Firmware integrity verification (CM-003) |
| T002.005 | Rogue infrastructure appearing in RF environment | Pre-operation RF survey |
