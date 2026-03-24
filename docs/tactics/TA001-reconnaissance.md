# TA001 — Reconnaissance

The adversary collects information about target UAS platforms, operators, communication infrastructure, mission profiles, and supply chain to plan subsequent attack stages. Reconnaissance may be entirely passive with no trace on target systems, or may involve active probing that generates detectable signals.

---

## Techniques

### T001.001 — UAS Platform Identification

**Platform scope**: All  
**Minimum actor tier**: L1

**Description**: Collection of technical details on drone model, firmware version, onboard operating system, autopilot type, and hardware components through open source research, RF signal analysis, or reverse engineering of publicly available firmware images.

**Sub-techniques**:
- Firmware version enumeration via OTA update traffic analysis
- Autopilot identification through RF signature, MAVLink heartbeat parameters, or GCS detection (ArduPilot, PX4, DJI proprietary)
- Hardware component OSINT via FCC filings, CE declarations, and teardown publications
- RF signature and modulation scheme analysis to identify communication protocol

**Relevant countermeasures**: No direct countermeasure. Reduce publicly disclosed technical detail where operationally feasible.

---

### T001.002 — Operator and Mission Profiling

**Platform scope**: All  
**Minimum actor tier**: L1

**Description**: Identification of operator identity, regular flight corridors, operational schedules, and mission objectives through open source intelligence and Remote ID broadcast monitoring.

**Sub-techniques**:
- Remote ID broadcast interception and logging to build historical flight pattern database
- FAA DroneZone and EASA UAS registration lookup
- Social media and public flight log OSINT (AirData UAV, DJI SkyPixel, public forum posts)
- Physical observation and documentation of launch zones, landing zones, and operator behavior

**Relevant countermeasures**: CM-004 (Remote ID Broadcast Integrity).

---

### T001.003 — Communication Protocol Reconnaissance

**Platform scope**: Consumer, Enterprise, Military  
**Minimum actor tier**: L1

**Description**: Active or passive enumeration of RF links, operating frequencies, modulation schemes, encryption status, and control protocols in use by the target UAS.

**Sub-techniques**:
- MAVLink traffic passive capture using RTL-SDR or equivalent hardware
- DJI OcuSync and Lightbridge frequency and modulation identification via spectrum analysis
- C2 link frequency hopping pattern characterization
- Video downlink identification, frequency mapping, and protocol classification

**Relevant countermeasures**: CM-001 (Encrypted and Authenticated C2 Link) — an encrypted link prevents content analysis but does not prevent detection of the RF link itself.

---

### T001.004 — GCS and Backend Infrastructure Mapping

**Platform scope**: GCS, UTM  
**Minimum actor tier**: L2

**Description**: Discovery of Ground Control Station software, network topology, cloud API endpoints, UTM service interfaces, and authentication mechanisms through network scanning, passive traffic analysis, or open source research.

**Sub-techniques**:
- GCS software fingerprinting via network traffic or public version disclosure
- UTM and U-Space API endpoint discovery via DNS enumeration and certificate transparency logs
- Cloud service backend enumeration (AWS, Azure, GCP region and account identification)
- VPN and authentication mechanism detection via network fingerprinting

**Relevant countermeasures**: CM-008 (GCS Network Segmentation and Hardening).

---

### T001.005 — Supply Chain and Component Research

**Platform scope**: All  
**Minimum actor tier**: L2

**Description**: Systematic research into manufacturers, component suppliers, software dependencies, and known CVEs affecting specific hardware or firmware versions.

**Sub-techniques**:
- Component provenance and country-of-origin research using FCC filings and ITAR databases
- CVE and vendor advisory enumeration against identified autopilot and GCS software versions
- Third-party library dependency mapping via binary composition analysis
- Manufacturing and distribution chain analysis to identify supply chain insertion points

**Relevant countermeasures**: CM-009 (UAS Supply Chain Risk Management).

---

### T001.006 — Swarm Architecture Discovery

**Platform scope**: Swarm  
**Minimum actor tier**: L2

**Description**: Analysis of swarm network topology, coordination algorithms, leader-follower architecture, and inter-drone mesh protocol characteristics to identify optimal attack entry points.

**Sub-techniques**:
- Mesh network topology inference through RF traffic timing and signal strength analysis
- Leader node identification via traffic volume and command pattern analysis
- Swarm coordination protocol characterization
- Timing and synchronization pattern analysis to identify mission phase transitions

**Relevant countermeasures**: CM-010 (Swarm Node Mutual Authentication and Integrity).

---

## Detection Opportunities

| Technique | Detection Method | Data Source |
|---|---|---|
| T001.001 | Anomalous RF spectrum activity near operational area | RF monitoring / spectrum analyzer |
| T001.002 | Unauthorized Remote ID monitoring devices in operational area | Physical security |
| T001.003 | Passive RF capture devices near flight path or GCS | RF direction finding |
| T001.004 | Anomalous DNS queries or port scanning in GCS network | Network IDS / DNS logs |
| T001.005 | Not directly detectable at operator level | N/A |
| T001.006 | Anomalous RF devices near swarm operational envelope | RF monitoring |
