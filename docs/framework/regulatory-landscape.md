# Regulatory and Standards Landscape

This document summarizes the regulatory frameworks and technical standards most relevant to DARTA countermeasure mappings. It is not a comprehensive legal or compliance reference. Organizations should consult qualified legal and regulatory counsel for compliance determinations.

---

## United States

### FAA Part 107

Operational rules governing small UAS (sUAS) under 55 lb operating in the National Airspace System for commercial and recreational purposes. Part 107 establishes the operational context for civil drone operations but does not prescribe specific cybersecurity controls. Relevant to DARTA primarily as the regulatory framework within which UAS operators function.

### FAA Part 89 / Remote ID Rule

Requires most UAS operating in US airspace to broadcast Remote Identification (Remote ID) information including UAS identity and real-time location. The Remote ID requirement is directly targeted by DARTA technique T006.002 (Remote ID Suppression or Spoofing). DARTA countermeasure CM-004 addresses the integrity requirements of Remote ID systems.

### NDAA Section 848 (FY2020) and Subsequent Provisions

The National Defense Authorization Act Section 848 and subsequent provisions restrict federal agency procurement of UAS from identified adversary nations (currently including products from DJI, Autel Robotics, and others on the Department of Defense's Covered List). This legislative response to supply chain risk is directly related to DARTA TA002 (Resource Development) and TA003 (Initial Access via supply chain) and countermeasure CM-009.

### CISA UAS Security Guidance

The Cybersecurity and Infrastructure Security Agency has published guidance for critical infrastructure operators on managing UAS-related cyber risks. The guidance emphasizes integration of physical and cyber risk management and is relevant to operators for whom UAS are both tools and potential attack vectors.

### NIST Cybersecurity Framework and SP 800-53 Rev 5

NIST SP 800-53 Rev 5 is the primary security control catalog referenced in DARTA countermeasure mappings. The relevant control families are:

- **AC** (Access Control): Physical and logical access restrictions
- **IA** (Identification and Authentication): Device and user authentication
- **SC** (System and Communications Protection): Network protection, encryption
- **SI** (System and Information Integrity): Firmware integrity, anomaly detection
- **IR** (Incident Response): Incident handling and forensics
- **SR** (Supply Chain Risk Management): CM-009 mapping

### NIST SP 800-193: Platform Firmware Resiliency Guidelines

Directly applicable to UAS firmware security. Defines protect, detect, and recover capabilities for platform firmware against unauthorized modification. Referenced in DARTA countermeasures CM-003 and CM-007.

### NIST UAS Cybersecurity Working Group

NIST has an active working group developing UAS-specific cybersecurity guidance. Outputs from this group are expected to provide more specific guidance than the general SP 800-53 catalog and will be incorporated into DARTA countermeasure mappings as they are published.

---

## European Union

### EU Delegated Regulation 2019/945 and Implementing Regulation 2019/947

The foundational EU regulatory framework for UAS. Regulation 2019/945 defines UAS product classes (C0 through C6) with progressively stringent technical requirements. Regulation 2019/947 defines operational categories (Open, Specific, Certified) with corresponding safety and operational requirements.

Geo-awareness requirements (relevant to DARTA CM-011) apply from Class C1 onward under Regulation 2019/945. Remote ID requirements apply from Class C1 and above in the Open category.

### EU U-Space Regulation (2021/664, 2021/665, 2021/666)

Three regulations establishing the U-Space framework for UAS traffic management services in designated U-Space airspace:

- **2021/664**: Common rules for the U-Space airspace framework
- **2021/665**: Amendment of implementing regulations for ATM/ANS to integrate U-Space
- **2021/666**: Common rules for the single European sky

U-Space directly creates new attack surface through UTM API exposure (DARTA TA003, T003.006; TA007, T007.004). DARTA countermeasure CM-005 addresses authentication requirements for U-Space API interactions.

### NIS2 Directive (2022/2555)

The Network and Information Security Directive 2 (NIS2) expands the scope of the original NIS Directive to cover additional sectors and entities. UAS operators providing services to essential entities (energy, transport, water, health, digital infrastructure) may fall within NIS2 scope as either essential or important entities.

Key NIS2 obligations relevant to DARTA:

- **Article 21**: Security measures including supply chain security, incident handling, cryptography, and access control. Directly supported by multiple DARTA countermeasures.
- **Article 23**: Reporting of significant incidents to national authorities within 24 hours (early warning) and 72 hours (incident notification). DARTA countermeasure CM-013 addresses forensic readiness requirements needed to support timely incident reporting.

### EU Cyber Resilience Act (CRA)

Horizontal regulation imposing cybersecurity requirements on products with digital elements placed on the EU market. Drones sold in the EU are within scope as products with digital elements. Key CRA requirements relevant to DARTA:

- Security by design and by default requirements (relevant to CM-003, CM-007)
- Vulnerability handling and disclosure obligations
- Software update security requirements (relevant to firmware update integrity, CM-003)
- Documentation requirements including SBOM (relevant to CM-009)
- Reporting of actively exploited vulnerabilities to ENISA

The CRA is expected to create direct legal obligations for UAS manufacturers that align with several DARTA countermeasures.

---

## Aviation Standards

### DO-326A / ED-202A: Airworthiness Security Process Specification

The primary aviation cybersecurity process standard, developed by RTCA (DO-326A) and EUROCAE (ED-202A) in harmonization. Originally developed for commercial aviation, DO-326A is increasingly applied to UAS in the Certified operational category and referenced by regulators as the applicable standard for high-risk UAS operations.

DO-326A defines an airworthiness security process covering:

- Security risk assessment methodology
- Security controls specification
- Continuity of safe operation requirements
- Development assurance integration with DO-178C

DARTA countermeasures reference DO-326A where the standard provides specific technical guidance applicable to UAS.

**Companion documents**: DO-356A/ED-203A (Airworthiness Security Methods and Considerations), DO-355/ED-204 (Information Security Guidance for Continuing Airworthiness).

### ASTM F38 Committee on Unmanned Aircraft Systems

The ASTM F38 committee produces UAS-specific technical standards. Standards most directly relevant to DARTA:

- **ASTM F3411-22**: Standard Specification for Remote ID and Tracking. Defines the technical requirements for Remote ID broadcast. Referenced in DARTA CM-004.
- **ASTM F3322-22**: Standard Specification for Small UAS Parachute Recovery Systems. Relevant to safety-critical system integrity.
- **ASTM F3388**: Standard Guide for UAS Forensic Investigation. Referenced in DARTA CM-013.

### STANAG 4586: Standard Interfaces of UAV Control System

NATO standardization agreement defining standard interfaces for UAV control systems to enable interoperability between UAVs and Ground Control Systems from different manufacturers. STANAG 4586 includes security requirements for the C2 datalink and is referenced in DARTA CM-001 and CM-010.

---

## Industrial and IoT Security Standards

### IEC 62443: Industrial Automation and Control Systems Security

The IEC 62443 series provides security requirements and processes for industrial automation and control systems. Applicable to UAS in contexts where:

- The GCS or fleet management system has OT-like characteristics
- The drone's onboard systems (flight controller, avionics bus) are treated as industrial control components
- Enterprise drones operating in industrial environments

Relevant standards within the series:

- **IEC 62443-3-3**: System security requirements and security levels
- **IEC 62443-4-1**: Product security development life-cycle requirements
- **IEC 62443-4-2**: Technical security requirements for IACS components

### ISO/IEC 27001:2022: Information Security Management Systems

The general information security management standard. Applicable to organizations operating GCS infrastructure and UTM service providers. DARTA CM-005 and CM-008 reference relevant ISO 27001 control domains.

---

## Cross-Reference Matrix

The following table provides a high-level cross-reference between DARTA countermeasures and the primary applicable standards.

| CM ID | NIST 800-53 | DO-326A | ASTM F38 | STANAG | IEC 62443 | EU Regulation |
|---|---|---|---|---|---|---|
| CM-001 | SC-8 | Sec 6.2 | — | 4586 | — | — |
| CM-002 | SI-10 | — | — | — | — | — |
| CM-003 | SI-7 | Yes | — | — | 62443-4-2 | CRA |
| CM-004 | IA-3 | — | F3411-22 | — | — | 2019/945, FAA Part 89 |
| CM-005 | IA-2 | — | — | — | — | U-Space Reg. |
| CM-006 | SI-4 | DO-178C | — | — | 62443-3-3 SR6.1 | — |
| CM-007 | AC-3 | Sec 5 | — | — | 62443-4-2 CR1.1 | CRA |
| CM-008 | SC-7 | — | — | — | — | NIS2 Art.21 |
| CM-009 | SR-3 | — | — | — | — | CRA, NDAA |
| CM-010 | IA-3 | — | — | 4586 | 62443-3-3 SR1.2 | — |
| CM-011 | SI-10 | — | F3322 | — | — | 2019/945 |
| CM-012 | SC-28 | — | — | — | — | — |
| CM-013 | IR-4 | — | F3388 | — | — | NIS2 Art.23 |
