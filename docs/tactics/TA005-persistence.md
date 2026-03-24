# TA005 — Persistence

The adversary establishes mechanisms to maintain long-term access to compromised UAS systems or infrastructure across firmware updates, power cycles, reboots, and operator remediation attempts. Persistence in UAS systems is particularly concerning because standard remediation actions such as firmware reflashing may be insufficient if the implant is embedded in the bootloader or a protected flash partition.

---

### T005.001 — Firmware Implant

**Platform scope**: All | **Minimum actor tier**: L3

**Description**: Modification of flight controller or companion computer firmware to embed backdoor code in a location that survives standard firmware update procedures, typically the bootloader or a protected flash partition.

**Sub-techniques**:
- Autopilot firmware backdoor embedded in application flash alongside legitimate firmware
- Companion computer persistent implant using Linux rootkit or modified init system
- Bootloader-level persistence surviving application-layer firmware updates
- Signed firmware update bypass via exploitation of key management weaknesses

**Countermeasures**: CM-003 (Firmware Integrity and Secure Boot), CM-007 (Physical Interface Protection).

**Notes**: This technique requires either supply chain access or prior execution-level compromise. Detection requires hardware-level flash integrity verification, not merely application-layer checksum comparison.

---

### T005.002 — Parameter Store Manipulation

**Platform scope**: All | **Minimum actor tier**: L2

**Description**: Modification of the autopilot's non-volatile parameter storage (EEPROM, internal flash, or SD card parameter file) to encode malicious configuration values that are automatically reloaded at each boot cycle without requiring code execution.

**Sub-techniques**:
- EEPROM and flash parameter corruption encoding adversarial failsafe behavior
- Fail-safe mode redefinition to trigger adversary-favorable actions on signal loss
- Geofence boundary removal or expansion from persistent parameter set
- Authentication credential replacement in stored parameter configuration

**Countermeasures**: CM-003, CM-006.

**Notes**: Parameter store manipulation is more accessible than firmware implantation and may persist through application firmware updates if the parameter store is preserved across updates (as is typical for user convenience).

---

### T005.003 — GCS Persistence

**Platform scope**: GCS, UTM | **Minimum actor tier**: L2

**Description**: Establishment of persistent unauthorized access within the Ground Control Station host operating system through scheduled tasks, startup scripts, malicious plugins, or remote access tools.

**Sub-techniques**:
- Malicious GCS plugin configured for automatic loading on GCS software startup
- OS-level persistence via cron job, systemd unit, or Windows registry Run key
- Credential harvesting implant maintaining access to GCS credentials for lateral movement
- Remote access trojan (RAT) installation on GCS host for persistent operator network access

**Countermeasures**: CM-008 (GCS Network Segmentation and Hardening).

---

### T005.004 — Cloud Backend Persistence

**Platform scope**: GCS, UTM | **Minimum actor tier**: L2

**Description**: Maintenance of unauthorized long-term access to cloud-based fleet management platforms, telemetry storage systems, or UTM backend infrastructure through stolen credentials or implanted access mechanisms.

**Sub-techniques**:
- API key theft and long-term reuse for fleet management access
- OAuth refresh token exfiltration and persistent reuse
- Cloud function or serverless compute backdoor providing persistent execution capability
- Compromised database credential persistence for direct data store access

**Countermeasures**: CM-005 (UTM API Authentication), CM-008.

---

### T005.005 — Swarm Node Persistence

**Platform scope**: Swarm | **Minimum actor tier**: L3

**Description**: Persistent compromise of one or more nodes within a drone swarm, ensuring the adversary retains access to the swarm network even after partial remediation efforts remove the compromise from other nodes.

**Sub-techniques**:
- Persistent mesh network implant surviving individual node firmware updates
- Swarm coordination protocol backdoor enabling persistent command injection
- Compromised node identity key enabling re-authentication to swarm after suspected compromise

**Countermeasures**: CM-010 (Swarm Node Mutual Authentication and Integrity).

---

## Detection Opportunities — TA005

| Technique | Detection Method | Data Source |
|---|---|---|
| T005.001 | Flash region hash mismatch against known-good baseline | Hardware-level integrity verification |
| T005.002 | Parameter values outside expected operational range at boot | Parameter audit on each power-on |
| T005.003 | Unexpected scheduled tasks or startup entries on GCS host | Endpoint detection; configuration audit |
| T005.004 | API access from unexpected geographic locations or at unusual times | Cloud access log anomaly detection |
| T005.005 | Node maintaining connectivity to swarm after declared compromise | Swarm membership audit |
