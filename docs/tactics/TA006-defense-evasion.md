# TA006 — Defense Evasion

The adversary takes deliberate actions to avoid detection by human operators, ground-based Counter-UAS sensors, RF monitoring infrastructure, or automated anomaly detection systems. Defense evasion techniques may be used throughout the attack lifecycle to extend the duration of undetected access.

---

### T006.001 — Telemetry Manipulation

**Platform scope**: All | **Minimum actor tier**: L2

**Description**: Alteration of telemetry data transmitted from the drone to the GCS to conceal adversarial actions or misrepresent the drone's actual operational state to the human operator.

**Sub-techniques**:
- Altitude and position value falsification in downlink telemetry to mask actual flight path
- Battery level spoofing to prevent early RTL while extending adversary-controlled flight duration
- Operational mode status concealment hiding unauthorized mode transitions from GCS display
- Error and fault flag suppression in telemetry downlink to prevent operator awareness of anomalous states

**Countermeasures**: CM-006 (Onboard Behavioral Anomaly Detection), CM-001 (authenticated telemetry).

---

### T006.002 — Remote ID Suppression or Spoofing

**Platform scope**: Consumer, Enterprise | **Minimum actor tier**: L1

**Description**: Disabling or falsifying Remote ID broadcasts to prevent identification of the drone or its operator by law enforcement, Counter-UAS systems, UTM services, or other airspace users.

**Sub-techniques**:
- Remote ID broadcast complete suppression via hardware modification or firmware exploit
- False operator ID injection in RID frame to misdirect identification
- False serial number broadcast for drone identity obfuscation
- Remote ID broadcast frequency jamming to prevent reception by ground-based RID receivers

**Countermeasures**: CM-004 (Remote ID Broadcast Integrity).

---

### T006.003 — RF Emission Minimization

**Platform scope**: All | **Minimum actor tier**: L2

**Description**: Deliberate reduction of RF emissions during the mission to evade detection by RF-based Counter-UAS sensors, including the use of pre-programmed autonomous flight profiles that require minimal or no active C2 link during execution.

**Sub-techniques**:
- Pre-programmed fully autonomous mission upload with no active RF C2 during flight
- Frequency hopping to avoid passive spectrum monitoring systems
- Directional antenna use to minimize detectable RF footprint from ground-based sensors
- Low-power transmission modes during approach and critical mission phases

**Countermeasures**: No direct countermeasure available to the target operator. C-UAS operators should use acoustic and optical detection to supplement RF-based detection.

---

### T006.004 — Onboard Log Manipulation

**Platform scope**: All | **Minimum actor tier**: L2

**Description**: Deletion, overwriting, or corruption of onboard flight logs, event records, and black box data to impede forensic investigation after an incident.

**Sub-techniques**:
- SD card flight log selective deletion targeting the time window of adversarial activity
- ArduPilot DataFlash log corruption via direct flash memory write
- PX4 ulog file manipulation or replacement with sanitized version
- Timestamp falsification in stored logs to confuse timeline reconstruction

**Countermeasures**: CM-012 (Onboard Data Encryption and Secure Storage) — integrity-protected logs resist undetected modification.

---

### T006.005 — Safe Mode Exploitation

**Platform scope**: All | **Minimum actor tier**: L2

**Description**: Deliberate exploitation of the reduced security posture that exists during drone emergency safe mode, failsafe activation, or recovery mode, to execute commands or actions that are blocked under normal operational conditions.

**Sub-techniques**:
- Unauthorized command injection during failsafe activation when authentication may be relaxed
- Safe mode parameter modification exploiting reduced validation during emergency procedures
- Recovery mode firmware replacement using bootloader access that is only available during recovery

**Countermeasures**: CM-006, CM-007.

---

### T006.006 — Physical Signature Reduction

**Platform scope**: Military, Swarm | **Minimum actor tier**: L3

**Description**: Purpose-built modification of drone physical characteristics, propulsion configuration, or flight behavior to reduce acoustic, thermal, optical, and radar cross-section signatures detectable by Counter-UAS sensor systems.

**Sub-techniques**:
- Low-RPM propeller configuration and acoustic dampening for reduced acoustic signature
- Thermal signature minimization via motor management and airframe thermal insulation
- Low-observable surface treatment and anti-strobe operation for optical signature reduction
- Nap-of-the-earth and terrain-masking flight profile to exploit ground clutter

**Countermeasures**: No direct countermeasure within the DARTA scope. C-UAS systems addressing this technique require multi-sensor fusion across RF, acoustic, optical, and radar domains.

---

## Detection Opportunities — TA006

| Technique | Detection Method | Data Source |
|---|---|---|
| T006.001 | Discrepancy between GCS-displayed state and independent sensor readings | Independent telemetry verification; ground observation |
| T006.002 | Absence of expected RID broadcast from known drone | Ground-based RID monitoring infrastructure |
| T006.003 | Acoustic or optical detection without corresponding RF signature | Multi-sensor C-UAS fusion |
| T006.004 | Log file hash mismatch or gap in continuous log sequence | Integrity-protected log comparison (CM-012) |
| T006.005 | Unexpected behavior patterns during or immediately after failsafe events | Post-incident log review |
| T006.006 | Anomaly in acoustic or thermal C-UAS sensor data without RF correlation | Multi-sensor C-UAS fusion |
