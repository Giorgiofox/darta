# TA009 — Impact

The adversary causes direct physical, operational, or informational harm to UAS systems, their operators, third parties, or critical infrastructure. Impact techniques represent the final phase of an adversarial campaign and may be the culmination of preceding reconnaissance, access, and evasion activities, or may be executed directly without prior access in the case of kinetic or RF-based attacks.

---

### T009.001 — Drone Hijacking

**Platform scope**: All | **Minimum actor tier**: L2

**Description**: Full or partial takeover of drone flight control to redirect the vehicle to an adversary-chosen location or mission profile, denying the legitimate operator control of their platform.

**Sub-techniques**:
- Complete C2 link seizure locking out the legitimate operator
- Waypoint injection to reroute an active autonomous mission
- Forced landing at an adversary-controlled site for physical recovery of the drone and its payload
- Forced loiter holding the drone in a location where it cannot complete its mission

**Countermeasures**: CM-001 (Encrypted and Authenticated C2 Link), CM-002 (GNSS Anti-Spoofing).

---

### T009.002 — Forced Crash or Destruction

**Platform scope**: All | **Minimum actor tier**: L2

**Description**: Intentional causing of drone loss of control, in-flight structural failure, or controlled crash through malicious commands, manipulated sensor data, or deliberate navigation into hazardous terrain, water, or obstacles.

**Sub-techniques**:
- Motor disarm command injection during flight causing immediate power loss
- GPS spoofing navigating the drone into terrain, water, or an obstacle
- Pitch and roll limit parameter removal causing aerodynamic structural failure at high speed
- Altitude floor parameter removal above water or mountainous terrain

**Countermeasures**: CM-001, CM-002, CM-006, CM-011 (tamper-resistant geofencing providing minimum safe altitude enforcement).

**Notes**: Forced crash may be used to destroy a high-value payload, deny the operator the use of their asset, or cause collateral damage to persons or property on the ground. This technique has legal implications under aviation law in most jurisdictions regardless of the method used.

---

### T009.003 — Mission Disruption and Denial

**Platform scope**: All | **Minimum actor tier**: L1

**Description**: Prevention of the drone from completing its intended mission through RF jamming, GNSS denial, communications interference, or flight path restriction injection, without necessarily achieving persistent access to the drone.

**Sub-techniques**:
- RF uplink jamming causing loss of C2 link and triggering failsafe (RTL or land)
- GNSS denial forcing automatic return-to-launch or landing behavior
- Geofence injection restricting the drone's operational flight area to prevent mission completion
- Persistent RF noise floor elevation preventing reconnection after temporary signal loss

**Countermeasures**: CM-001, CM-002, CM-011.

**Notes**: This technique is accessible at L1 using commercially available jamming equipment. The use of jamming equipment is illegal in most jurisdictions. The operational impact may be severe for time-critical missions such as emergency response or infrastructure inspection under tight scheduling.

---

### T009.004 — Weaponization and Payload Delivery

**Platform scope**: Military, Consumer | **Minimum actor tier**: L1

**Description**: Use of a compromised, hijacked, or adversary-operated drone to deliver physical payloads including explosive devices, hazardous materials, electronic warfare packages, or kinetic strike capability against a ground target.

**Sub-techniques**:
- Explosive or fragmentation payload delivery via modified payload bay or drop mechanism
- Chemical, biological, radiological, or nuclear agent dispersal using modified payload
- Electronic warfare or RF attack device delivery and placement at a target location
- Kinetic strike via controlled high-speed collision with target infrastructure or personnel

**Countermeasures**: Physical countermeasures are outside DARTA scope. CM-004 (Remote ID) and UTM geofencing (CM-011) may provide early warning or flight restriction, but physical interdiction of weaponized drones requires C-UAS kinetic or electronic effectors.

**Notes**: This technique requires no prior cyber access when the adversary operates their own drone. The threat has been extensively documented in conflict zones. The technique is listed in DARTA because adversary access to a legitimate operator's drone significantly increases the impact potential and reduces the adversary's logistics burden.

---

### T009.005 — Data Destruction

**Platform scope**: All | **Minimum actor tier**: L2

**Description**: Irreversible deletion, overwriting, or cryptographic rendering-inaccessible of mission-critical data, flight records, survey outputs, or GCS configuration to deny the operator access to their own operational data and impede post-incident investigation.

**Sub-techniques**:
- Onboard SD card storage complete wipe via malicious command or script
- GCS database and configuration file deletion or corruption
- Cloud storage backup deletion via API access with stolen credentials
- Cryptographic key destruction rendering encrypted onboard data permanently unrecoverable

**Countermeasures**: CM-012 (Onboard Data Encryption — including integrity protection), CM-013 (Incident Response and Forensic Readiness — immutable log backups).

---

### T009.006 — Infrastructure Attack via UAS Vector

**Platform scope**: Military, Swarm | **Minimum actor tier**: L2

**Description**: Use of a drone, whether compromised or adversary-operated, as a vector for physical or cyber attack against ground-based infrastructure including power generation, communications towers, data centers, or secure facilities.

**Sub-techniques**:
- Physical collision with critical infrastructure components (power lines, antenna arrays, cooling systems)
- Covert placement of an RF eavesdropping device in a location inaccessible by other means
- Cyber attack payload delivery — dropping a malicious USB device or placing a hardware implant
- Communications relay or satellite uplink antenna disruption via physical means

**Countermeasures**: Physical protection of critical infrastructure assets. CM-004 and CM-011 provide limited mitigation by restricting drone operations near designated sensitive sites.

---

## Detection Opportunities — TA009

| Technique | Detection Method | Data Source |
|---|---|---|
| T009.001 | Loss of GCS control responsiveness; unexpected flight path deviation | GCS telemetry; operator observation |
| T009.002 | Sudden altitude loss; attitude sensor anomaly; loss of telemetry | GCS telemetry; onboard anomaly detection |
| T009.003 | GCS link quality degradation; GNSS signal loss or anomaly indicator | GCS link quality metrics; GNSS health flags |
| T009.004 | Visual or acoustic detection of approaching drone; Remote ID monitoring | Physical security; C-UAS sensors |
| T009.005 | Missing or corrupted log files discovered during post-flight review | Integrity-protected log audit (CM-012) |
| T009.006 | Visual or acoustic detection; Remote ID; thermal imaging | C-UAS sensor fusion; physical security monitoring |
