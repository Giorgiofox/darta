# TA004 — Execution

The adversary executes malicious actions on compromised UAS systems, GCS software, or autonomous decision-making components to achieve operational objectives. Execution techniques require a prior foothold established via TA003 or assume physical access.

---

### T004.001 — Malicious Command Injection

**Platform scope**: All | **Minimum actor tier**: L2

**Description**: Transmission of crafted commands to the flight controller to alter altitude, heading, speed, operational mode, or mission parameters without operator authorization.

**Sub-techniques**:
- MAVLink SET_MODE and SET_POSITION_TARGET injection
- RC override channel injection via captured or replayed signals
- Waypoint table overwrite to redirect mission
- Forced RTL, Land, or Disarm commands mid-flight

**Countermeasures**: CM-001, CM-006.

---

### T004.002 — Firmware Exploitation

**Platform scope**: All | **Minimum actor tier**: L2

**Description**: Exploitation of memory safety vulnerabilities, logic errors, or insufficient input validation in autopilot firmware or onboard OS to achieve arbitrary code execution with elevated privilege.

**Sub-techniques**:
- Buffer overflow in MAVLink packet parser (documented in ArduPilot and PX4 CVEs)
- Arbitrary code execution via crafted parameter upload (PARAM_SET abuse)
- Bootloader unlock and exploit via unprotected firmware update path
- RTOS task injection via scheduler or IPC vulnerability

**Countermeasures**: CM-003, CM-007.

---

### T004.003 — Malicious Code Deployment

**Platform scope**: All | **Minimum actor tier**: L2

**Description**: Installation and execution of malicious software on the drone's onboard Linux companion computer, flight controller, or GCS host system.

**Sub-techniques**:
- Ransomware targeting stored mission data, survey outputs, and operator files
- Wiper payload targeting flight logs and waypoint database to destroy evidence
- Rootkit on Linux companion computer (Raspberry Pi, NVIDIA Jetson) for persistent covert access
- Bootkit installation on companion computer for pre-OS persistence

**Countermeasures**: CM-003, CM-006, CM-008.

---

### T004.004 — Sensor Data Manipulation

**Platform scope**: All | **Minimum actor tier**: L2

**Description**: Injection of falsified sensor readings to corrupt the drone's environmental awareness and cause erratic flight behavior, controlled misdirection, or safety system failure.

**Sub-techniques**:
- IMU accelerometer and gyroscope data injection via companion interface
- Barometric altitude sensor data spoofing
- Optical flow sensor signal manipulation
- LiDAR and proximity sensor blinding or false return injection

**Countermeasures**: CM-006 (onboard anomaly detection cross-correlating sensor sources).

---

### T004.005 — AI and ML Model Exploitation

**Platform scope**: Swarm | **Minimum actor tier**: L3

**Description**: Corruption or adversarial manipulation of onboard AI decision models used for autonomous navigation, object detection, or swarm coordination.

**Sub-techniques**:
- Training data poisoning at the supply chain or update stage
- Adversarial input injection at inference time to cause misclassification
- Model weight corruption via unauthorized access to model storage
- Swarm consensus algorithm manipulation through crafted inter-drone messages

**Countermeasures**: CM-003 (model integrity), CM-009 (supply chain), CM-010 (swarm integrity).

---

### T004.006 — Time-Triggered Execution

**Platform scope**: All | **Minimum actor tier**: L2

**Description**: Delayed or time-keyed execution of malicious payloads configured to activate at absolute mission timestamps or relative mission phase transitions, enabling the adversary to be physically absent during execution.

**Sub-techniques**:
- Absolute time trigger using GPS UTC epoch synchronization
- Relative mission phase trigger activating after waypoint N or elapsed time T
- Geo-fenced position-based execution activating when drone enters defined coordinates

**Countermeasures**: CM-003, CM-006.

---

### T004.007 — Replay Attack

**Platform scope**: Consumer, Enterprise | **Minimum actor tier**: L1

**Description**: Recording of previously captured valid command packets and their retransmission at a later time to force drone actions without operator knowledge or intent.

**Sub-techniques**:
- Command packet replay causing unintended takeoff, landing, or waypoint execution
- Telemetry frame replay to GCS to deceive operator about drone state while malicious actions occur
- Authentication token or handshake replay to establish unauthorized C2 session

**Countermeasures**: CM-001 (replay protection via sequence counters or timestamps).

---

## Detection Opportunities — TA004

| Technique | Detection Method | Data Source |
|---|---|---|
| T004.001 | Commands received without corresponding GCS transmission | GCS-side command log vs. drone-side command log comparison |
| T004.002 | Unexpected process execution or memory anomalies on companion | Host-based monitoring on companion computer |
| T004.003 | New processes, modified files, unusual network connections | Endpoint detection on companion/GCS |
| T004.004 | Sensor value inconsistency across redundant sensors | Onboard sensor fusion anomaly detection |
| T004.005 | Unexpected model inference outputs given known inputs | ML output monitoring |
| T004.006 | Unexpected behavior at specific times or locations | Mission parameter audit |
| T004.007 | Command received with timestamp older than replay window | Sequence counter and timestamp validation |
