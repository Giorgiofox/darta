# Countermeasures

This document defines the thirteen DARTA countermeasures. Each countermeasure addresses one or more adversarial tactics and is mapped to applicable security controls and standards. Countermeasures should be selected and prioritized based on the platform categories and threat actor tiers identified during threat modeling.

---

## CM-001 — Encrypted and Authenticated C2 Link

**Addresses tactics**: TA003 (Initial Access), TA004 (Execution)

**Description**: All command-and-control communications between the Ground Control Station and the drone must employ mutual-authentication encryption with a minimum of AES-256, incorporating replay protection mechanisms such as sequence counters or timestamps. The C2 link encryption must cover both command (uplink) and telemetry (downlink) channels. Key management processes must be defined and documented, including procedures for key rotation and revocation.

**Implementation notes**: For MAVLink-based systems, MAVLink 2 with signing (MAVLink 2 packet signing uses SHA-256 HMAC) provides a baseline; full encryption requires a transport-layer security layer such as TLS over a UDP/TCP tunnel. For DJI platforms, verify that the enterprise-tier encrypted link option is enabled and has not been disabled by configuration. For military platforms, STANAG 4586 compliance provides the baseline datalink security requirement.

**Framework references**:

| Standard | Reference |
|---|---|
| NIST SP 800-53 Rev 5 | SC-8: Transmission Confidentiality and Integrity |
| NIST SP 800-53 Rev 5 | SC-28: Protection of Information at Rest |
| RTCA DO-326A | Section 6.2: Airworthiness Security Process |
| EUROCAE ED-202A | Harmonized with DO-326A |
| STANAG 4586 | UAV Control System Datalink Security |

---

## CM-002 — GNSS Anti-Spoofing and Anti-Jamming

**Addresses tactics**: TA003 (Initial Access), TA009 (Impact)

**Description**: UAS operating in environments where GNSS spoofing or jamming is a credible threat should be equipped with multi-constellation GNSS receivers capable of detecting anomalous signal conditions. An inertial navigation system (INS/IMU) fallback must be configured to maintain stable flight when GNSS signal integrity cannot be confirmed. Where available, cryptographically authenticated GNSS signals should be used (Galileo OSNMA for civilian platforms; GPS Chips Message authentication for applicable platforms).

**Implementation notes**: For enterprise platforms, multi-constellation receivers (GPS + GLONASS + Galileo + BeiDou) provide increased spoofing detection capability compared to single-constellation. RTK corrections can serve as an independent cross-check against GNSS spoofing on survey and inspection platforms. Sudden large position discontinuities in recorded telemetry are an indicator of spoofing attempts and should be logged as anomalies.

**Framework references**:

| Standard | Reference |
|---|---|
| NIST SP 800-53 Rev 5 | SI-10: Information Input Validation |
| RTCA DO-316 | Minimum Operational Performance Standards for GPS Receivers |
| ICAO Annex 10 Volume I | GNSS Security Standards |
| FAA AC 20-138E | Airworthiness Approval of GNSS Equipment |

---

## CM-003 — Firmware Integrity Verification and Secure Boot

**Addresses tactics**: TA003 (Initial Access), TA005 (Persistence)

**Description**: All autopilot firmware, companion computer OS images, and onboard software must be cryptographically signed by the manufacturer or authorized party. A hardware root of trust (secure element, TPM, or equivalent) must verify the signature of all firmware before allowing boot. Unsigned or signature-failed firmware must be rejected and an alert generated to the operator. Firmware update channels must be authenticated and integrity-protected to prevent trojanized update delivery.

**Implementation notes**: Open autopilot platforms (ArduPilot, PX4) do not currently implement secure boot by default. Operators deploying these platforms for high-assurance use cases should evaluate hardware companions (Pixhawk 6X includes an STM32H7 with hardware security features) and consider community secure boot implementations where available. This is an active area of development in the open autopilot community.

**Framework references**:

| Standard | Reference |
|---|---|
| NIST SP 800-53 Rev 5 | SI-7: Software and Firmware Integrity |
| NIST SP 800-193 | Platform Firmware Resiliency Guidelines |
| RTCA DO-326A | Airworthiness Security |
| IEC 62443-4-2 | CR 3.4: Software and Information Integrity |
| EU Cyber Resilience Act | Article 13: Security Update Requirements |

---

## CM-004 — Remote ID Broadcast Integrity

**Addresses tactics**: TA006 (Defense Evasion)

**Description**: Remote ID broadcast systems must implement tamper detection mechanisms to identify attempts to suppress or falsify RID broadcasts. Production drones must not provide accessible interfaces that allow RID broadcast modification without authentication. Operators of UAS operations where RID integrity is operationally significant should implement independent monitoring of expected RID broadcasts to detect suppression anomalies.

**Framework references**:

| Standard | Reference |
|---|---|
| ASTM F3411-22 | Standard Specification for Remote Identification and Tracking |
| EU Delegated Regulation 2019/945 | Class C1 and Above Technical Requirements |
| FAA Part 89 | Remote Identification of Unmanned Aircraft |
| NIST SP 800-53 Rev 5 | IA-3: Device Identification and Authentication |

---

## CM-005 — UTM and U-Space API Authentication and Authorization

**Addresses tactics**: TA003 (Initial Access), TA007 (Lateral Movement)

**Description**: All interactions with UTM and U-Space service APIs must use strong authentication mechanisms (OAuth 2.0 with short-lived tokens or mutual TLS) with role-based access control limiting each client to the minimum permissions required for its function. UTM service providers must implement anomaly detection on flight plan submission patterns to identify injection attempts. API interactions must be logged for audit purposes.

**Framework references**:

| Standard | Reference |
|---|---|
| NIST SP 800-53 Rev 5 | IA-2: Identification and Authentication |
| EUROCAE ED-269 | U-Space Architecture and Interfaces |
| SESAR JU | U-Space Architecture Specification |
| ISO/IEC 27001:2022 | Control A.9: Access Control |

---

## CM-006 — Onboard Behavioral Anomaly Detection

**Addresses tactics**: TA004 (Execution), TA006 (Defense Evasion)

**Description**: Onboard monitoring systems should implement real-time analysis of flight control command inputs, sensor value streams, and communication patterns to detect anomalies indicative of spoofing, command injection, or unauthorized operation. Anomalies should be logged, transmitted to the GCS, and trigger defined safe-state responses. Ground-side GCS monitoring should cross-correlate received telemetry against expected flight envelope parameters.

**Framework references**:

| Standard | Reference |
|---|---|
| NIST SP 800-53 Rev 5 | SI-4: System Monitoring |
| RTCA DO-178C | Software Considerations in Airborne Systems |
| IEC 62443-3-3 | SR 6.1: Audit Log Accessibility |

---

## CM-007 — Physical Debug Interface Protection

**Addresses tactics**: TA003 (Initial Access), TA005 (Persistence)

**Description**: All physical debug interfaces (JTAG, SWD, UART, USB) on production drone hardware must be disabled, physically removed, or protected by authentication mechanisms that prevent unauthorized access. Access to these interfaces on production platforms must require explicit authentication. Maintenance procedures accessing debug interfaces must be documented and access events logged.

**Framework references**:

| Standard | Reference |
|---|---|
| NIST SP 800-53 Rev 5 | AC-3: Access Enforcement |
| IEC 62443-4-2 | CR 1.1: Human User Identification and Authentication |
| NIST SP 800-193 | Platform Firmware Resiliency Guidelines |
| RTCA DO-326A | Section 5: Security Requirements |
| EU Cyber Resilience Act | Annex I: Essential Cybersecurity Requirements |

---

## CM-008 — GCS Network Segmentation and Hardening

**Addresses tactics**: TA003 (Initial Access), TA005 (Persistence), TA007 (Lateral Movement)

**Description**: GCS systems must be network-isolated from general enterprise infrastructure through dedicated VLAN assignment, physical network separation, or air-gap architecture depending on the operational risk profile. GCS host systems must be hardened following applicable security configuration baselines. Network-based intrusion detection should monitor GCS-facing network segments. Remote access to GCS systems must use multi-factor authentication and encrypted channels.

**Framework references**:

| Standard | Reference |
|---|---|
| NIST SP 800-53 Rev 5 | SC-7: Boundary Protection |
| CIS Controls v8 | Control 12: Network Infrastructure Management |
| ISO/IEC 27001:2022 | Control A.13: Communications Security |
| NIS2 Directive | Article 21: Security Measures |

---

## CM-009 — UAS Supply Chain Risk Management

**Addresses tactics**: TA002 (Resource Development), TA003 (Initial Access)

**Description**: Organizations procuring and operating UAS must implement supply chain risk management processes covering: verification of hardware and software component provenance, maintenance of a Software Bill of Materials (SBOM) for all UAS software components, security assessment of key suppliers, monitoring for CVEs affecting procured components, and prohibition or enhanced scrutiny of components from sources assessed as high-risk. Procurement decisions must consider the foreign ownership, control, or influence (FOCI) status of manufacturers and component suppliers.

**Framework references**:

| Standard | Reference |
|---|---|
| NIST SP 800-161r1 | Cybersecurity Supply Chain Risk Management |
| NIST SP 800-53 Rev 5 | SR-3: Supply Chain Controls and Plans |
| US NDAA Section 848 FY2020 | Restrictions on Covered UAS |
| EU Cyber Resilience Act | Article 13: Obligations of Manufacturers |
| FAA FOCI Guidance | Foreign Ownership Control and Influence |

---

## CM-010 — Swarm Node Mutual Authentication and Integrity

**Addresses tactics**: TA003 (Initial Access), TA005 (Persistence), TA007 (Lateral Movement)

**Description**: All inter-drone communications within a swarm must be protected by cryptographic mutual authentication between nodes. Message integrity must be verified at each receiving node to detect injection or modification. Swarm join protocols must authenticate new nodes before admitting them to the swarm network. Nodes that fail authentication or integrity checks must be isolated and flagged for operator review.

**Framework references**:

| Standard | Reference |
|---|---|
| NIST SP 800-53 Rev 5 | IA-3: Device Identification and Authentication |
| IEEE 1609.2 | Security Services for V2X (adaptable for drone swarm mesh) |
| STANAG 4586 | UAS Interoperability Standard |
| IEC 62443-3-3 | SR 1.2: Software Process and Device Identification |

---

## CM-011 — Tamper-Resistant Geofencing

**Addresses tactics**: TA004 (Execution), TA009 (Impact)

**Description**: Geofencing implementations must use cryptographically signed zone definitions to prevent unauthorized modification of operational boundaries. Hardware-enforced geofencing constraints that cannot be disabled via software command alone must be implemented for operations where geofencing is a safety or security control. Attempts to modify or disable geofencing outside of authorized maintenance procedures must be logged and alerted.

**Framework references**:

| Standard | Reference |
|---|---|
| NIST SP 800-53 Rev 5 | SI-10: Information Input Validation |
| EU Delegated Regulation 2019/945 | Geo-awareness Requirements (C1 and above) |
| FAA Part 107 | Airspace Authorization and Notification |
| ASTM F3322-22 | UAS Parachute Recovery Systems |

---

## CM-012 — Onboard Data Encryption and Secure Storage

**Addresses tactics**: TA008 (Collection and Exfiltration)

**Description**: All sensitive data stored on onboard media (flight plans, waypoint databases, payload data, flight logs) must be encrypted at rest using AES-256 or equivalent. Encryption keys must be managed through a defined key management process including secure key storage, key rotation, and key destruction procedures. Flight logs must be integrity-protected (e.g., cryptographic hash chain) to support forensic admissibility and tamper detection.

**Framework references**:

| Standard | Reference |
|---|---|
| NIST SP 800-53 Rev 5 | SC-28: Protection of Information at Rest |
| ISO/IEC 27001:2022 | Control A.10: Cryptography |
| RTCA DO-326A | Data Protection Requirements |
| NIST SP 800-111 | Guide to Storage Encryption Technologies |

---

## CM-013 — Incident Response and UAS Forensic Readiness

**Addresses tactics**: TA009 (Impact)

**Description**: Operators must maintain immutable, integrity-protected records of flight telemetry and logs sufficient to support post-incident forensic investigation. Incident response procedures specific to UAS events must be defined, documented, and exercised, covering: loss of C2, GNSS anomalies, suspected hijacking, and GCS compromise scenarios. Procedures must include chain of custody requirements for drone hardware recovered after an incident. Significant incidents must be reported to relevant authorities within the timelines required by applicable regulations.

**Framework references**:

| Standard | Reference |
|---|---|
| NIST SP 800-53 Rev 5 | IR-4: Incident Handling |
| NIST SP 800-86 | Guide to Integrating Forensic Techniques into IR |
| ASTM F3388 | UAS Forensic Investigation Framework |
| NIS2 Directive | Article 23: Reporting Obligations |
