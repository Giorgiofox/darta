# TA003 — Initial Access

The adversary gains an initial foothold into the UAS ecosystem through RF interfaces, network-connected GCS systems, supply chain compromise, physical proximity, or exploitation of UTM infrastructure. Initial access is the prerequisite for all subsequent execution, persistence, and lateral movement activity.

---

## Techniques

### T003.001 — RF Command Link Hijacking

**Platform scope**: Consumer, Enterprise, Military  
**Minimum actor tier**: L2

**Description**: Exploitation of unencrypted or weakly authenticated RF control channels to inject commands or seize full control of the C2 link, preventing the legitimate operator from controlling the drone.

**Sub-techniques**:
- MAVLink unauthenticated command injection (MAVLink 1 and unsigned MAVLink 2)
- RC protocol replay attacks targeting SBUS, CRSF, and ExpressLRS links
- DJI proprietary control link takeover using researched protocol weaknesses
- RF signal overpowering to displace legitimate GCS signal

**Relevant countermeasures**: CM-001 (Encrypted and Authenticated C2 Link).

**References**: Rodday, N. M. (2016). Hacking a professional drone. Black Hat USA.

---

### T003.002 — GNSS Spoofing

**Platform scope**: All  
**Minimum actor tier**: L2

**Description**: Transmission of counterfeit GNSS signals at power levels sufficient to override authentic satellite signals, causing the drone's position and navigation solution to shift toward adversary-controlled coordinates or triggering safety behaviors based on falsified position.

**Sub-techniques**:
- Civil GPS L1 C/A code spoofing using SDR transmitter
- Multi-constellation spoofing covering GPS, GLONASS, and Galileo simultaneously
- Meaconing — rebroadcast of delayed authentic GNSS signals
- Time spoofing to trigger mission phase errors or waypoint execution at incorrect positions

**Relevant countermeasures**: CM-002 (GNSS Anti-Spoofing and Anti-Jamming).

**References**: Tippenhauer, N. O. et al. (2011). On the requirements for successful GPS spoofing attacks. ACM CCS.

---

### T003.003 — GCS Network Compromise

**Platform scope**: GCS, UTM  
**Minimum actor tier**: L2

**Description**: Exploitation of network-layer vulnerabilities in the Ground Control Station environment to gain access to the operator interface and flight management system.

**Sub-techniques**:
- GCS software remote code execution via unpatched vulnerabilities (QGroundControl, Mission Planner CVEs)
- Operator workstation compromise via spear-phishing targeting UAS operators
- Wi-Fi lateral access to GCS-connected network segment
- VPN credential theft and reuse for remote GCS access

**Relevant countermeasures**: CM-008 (GCS Network Segmentation and Hardening).

---

### T003.004 — Supply Chain Compromise

**Platform scope**: All  
**Minimum actor tier**: L3

**Description**: Insertion of malicious code, hardware backdoors, or altered components during the manufacturing, distribution, or maintenance phases of the UAS lifecycle.

**Sub-techniques**:
- Trojanized firmware distributed via manufacturer or third-party update server
- Compromised autopilot or flight controller hardware with embedded implant
- Malicious component insertion during supply chain transit or warehousing
- Tampered maintenance tooling that modifies firmware during authorized service

**Relevant countermeasures**: CM-003 (Firmware Integrity and Secure Boot), CM-009 (UAS Supply Chain Risk Management).

---

### T003.005 — Physical Interface Exploitation

**Platform scope**: All  
**Minimum actor tier**: L1

**Description**: Direct physical access to the drone or GCS to extract stored credentials, dump firmware, modify configuration, or implant malicious code via hardware debug interfaces.

**Sub-techniques**:
- UART, JTAG, and SWD debug port access on flight controller hardware
- USB-based firmware flashing exploit on unprotected autopilot
- microSD card physical removal and payload injection
- Boot sequence manipulation at power-on via hardware means

**Relevant countermeasures**: CM-007 (Physical Debug Interface Protection).

---

### T003.006 — UTM / U-Space API Abuse

**Platform scope**: GCS, UTM  
**Minimum actor tier**: L2

**Description**: Exploitation of weak authentication, authorization flaws, or logic errors in UTM and U-Space service APIs to inject false flight plans, create unauthorized airspace reservations, or manipulate deconfliction data for other airspace users.

**Sub-techniques**:
- Weak or absent API authentication exploitation to submit unauthorized flight plans
- IDOR and authorization bypass to access or modify other operators' flight plans
- False airspace reservation injection to deny legitimate operators access to airspace
- Remote ID spoofing via UTM API submission of falsified operator identity

**Relevant countermeasures**: CM-005 (UTM and U-Space API Authentication and Authorization).

---

### T003.007 — Rogue Ground Station Deployment

**Platform scope**: Consumer, Enterprise  
**Minimum actor tier**: L2

**Description**: Deployment of a counterfeit GCS that impersonates the legitimate operator station, using higher RF power or network-level interposition to capture and redirect C2 traffic.

**Sub-techniques**:
- GCS impersonation via stronger RF signal displacing legitimate GCS
- Wi-Fi SSID spoofing for network-linked GCS architectures
- Rogue telemetry gateway injection intercepting MAVLink telemetry stream

**Relevant countermeasures**: CM-001 (Encrypted and Authenticated C2 Link).

---

### T003.008 — Swarm Entry via Compromised Node

**Platform scope**: Swarm  
**Minimum actor tier**: L2

**Description**: Initial access to a drone swarm achieved by compromising a single swarm member and using it as an authenticated entry point into the broader swarm communication network.

**Sub-techniques**:
- Mesh network packet injection via single compromised node
- Swarm join protocol exploitation to insert a rogue node without authentication
- Rogue node physical insertion into swarm formation area

**Relevant countermeasures**: CM-010 (Swarm Node Mutual Authentication and Integrity).

---

## Detection Opportunities

| Technique | Detection Method | Data Source |
|---|---|---|
| T003.001 | Unexpected mode changes or command responses in telemetry | GCS telemetry monitoring |
| T003.002 | Sudden large position discontinuity; INS/GNSS divergence | Onboard anomaly detection (CM-006) |
| T003.003 | Anomalous GCS host process behavior; network IDS alerts | Endpoint detection; network monitoring |
| T003.004 | Firmware hash mismatch on boot verification | Secure boot log (CM-003) |
| T003.005 | Physical security breach of drone storage area | Physical access log; tamper evidence |
| T003.006 | Duplicate or conflicting flight plans in UTM system | UTM audit log |
| T003.007 | Two simultaneous GCS signals detected on C2 frequency | RF monitoring |
| T003.008 | Unknown node attempting to join swarm mesh | Swarm node authentication log (CM-010) |
