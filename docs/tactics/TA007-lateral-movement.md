# TA007 — Lateral Movement

The adversary moves from an initial foothold within the UAS ecosystem to other connected drone platforms, GCS systems, backend infrastructure, enterprise networks, or adjacent UTM service providers. Lateral movement in UAS environments exploits the high degree of trust that typically exists between components of an integrated UAS operation.

---

### T007.001 — GCS to Fleet Propagation

**Platform scope**: GCS, UTM | **Minimum actor tier**: L2

**Description**: Lateral movement from a single compromised GCS to all other drones managed by the same fleet management system, exploiting shared credentials, management APIs, or mission template mechanisms.

**Sub-techniques**:
- Fleet management API abuse using stolen or session-persisted credentials to access all managed drones
- Shared credential reuse across an entire drone fleet enrolled in a common management platform
- Mission template or waypoint database poisoning that propagates to all fleet units on next mission sync

**Countermeasures**: CM-005 (UTM API Authentication), CM-008 (GCS Network Segmentation).

---

### T007.002 — Swarm Node Hopping

**Platform scope**: Swarm | **Minimum actor tier**: L2

**Description**: Propagation of malicious code, configuration changes, or adversarial commands from a single compromised swarm node to adjacent nodes via the inter-drone mesh communication channel.

**Sub-techniques**:
- Self-propagating mesh worm using swarm communication channel for node-to-node spread
- Swarm broadcast command channel hijacking to issue commands appearing to originate from the coordinator
- Consensus algorithm poisoning propagated across nodes to corrupt distributed decision-making

**Countermeasures**: CM-010 (Swarm Node Mutual Authentication and Integrity).

---

### T007.003 — Drone to Enterprise Network Pivot

**Platform scope**: Enterprise, GCS | **Minimum actor tier**: L2

**Description**: Use of the drone's companion computer, docking station, or data offload interface as a pivot point to gain access to the operator's enterprise network infrastructure, particularly when drones are connected to corporate systems during docking, battery charging, or data upload.

**Sub-techniques**:
- Wi-Fi credential harvesting at an automated docking station with enterprise network connectivity
- USB-based pivot from drone storage or companion computer to GCS host operating system
- VPN tunnel abuse for enterprise network lateral access when drone is connected to operator infrastructure

**Countermeasures**: CM-008 (GCS Network Segmentation), CM-007 (Physical Interface Protection).

---

### T007.004 — UTM Federation Abuse

**Platform scope**: GCS, UTM | **Minimum actor tier**: L3

**Description**: Exploitation of inter-UTM system federation protocols and trust relationships to propagate false data or gain unauthorized access to adjacent UTM service providers in a federated U-Space environment.

**Sub-techniques**:
- Cross-UTM provider data injection using trust relationship established through a compromised provider
- Federation authentication token exploitation to access adjacent UTM systems
- Airspace data poisoning propagated across federated providers affecting multiple national airspaces

**Countermeasures**: CM-005 (UTM and U-Space API Authentication and Authorization).

**Notes**: UTM federation is an emerging capability under EU U-Space regulation. The trust models between federated UTM providers are not yet fully defined and are likely to present exploitable weaknesses as the ecosystem matures.

---

### T007.005 — Companion Computer to Autopilot Pivot

**Platform scope**: Enterprise, Military | **Minimum actor tier**: L2

**Description**: Lateral movement from a compromised high-level companion computer (Linux single-board computer) to the flight controller via the internal serial or USB communication interface that carries MAVLink traffic between the two components.

**Sub-techniques**:
- MAVLink command injection from companion computer to flight controller via internal UART or USB link
- UART bridge exploitation using the companion computer's privileged interface access
- Parameter and waypoint modification using companion computer's trusted relationship with the autopilot

**Countermeasures**: CM-006 (Onboard Behavioral Anomaly Detection — monitoring of companion-to-autopilot command traffic).

---

## Detection Opportunities — TA007

| Technique | Detection Method | Data Source |
|---|---|---|
| T007.001 | Unexpected access to multiple fleet units from a single session | Fleet management access log |
| T007.002 | Rapid propagation of configuration changes across swarm | Swarm state monitoring |
| T007.003 | Unexpected network connections from drone docking station to enterprise systems | Network monitoring (CM-008) |
| T007.004 | Anomalous flight plan submissions appearing to originate from federated UTM partner | UTM audit log |
| T007.005 | Commands received by autopilot that do not correspond to GCS operator input | Command source attribution logging |
