import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const TACTICS = [
  {
    id: "TA001", name: "Reconnaissance", short: "RECON",
    desc: "The adversary collects information about target UAS platforms, operators, communication infrastructure, mission profiles, and supply chain.",
    color: "#4A9EFF",
    techniques: [
      { id: "T001.001", name: "UAS Platform Identification", platform: ["All"], actorMin: 1,
        desc: "Collection of technical details on drone model, firmware version, onboard OS, autopilot type, and hardware components via open sources, RF scanning, or reverse engineering.",
        subs: ["Firmware version enumeration via OTA traffic", "Autopilot identification (ArduPilot, PX4, DJI)", "Hardware component OSINT", "RF signature and modulation analysis"] },
      { id: "T001.002", name: "Operator and Mission Profiling", platform: ["All"], actorMin: 1,
        desc: "Identification of operator identity, flight corridors, operational schedules, and mission objectives through OSINT and Remote ID monitoring.",
        subs: ["Remote ID broadcast interception", "FAA/EASA registration lookup", "Social media and flight log OSINT", "Physical observation of launch zones"] },
      { id: "T001.003", name: "Communication Protocol Reconnaissance", platform: ["Consumer","Enterprise","Military"], actorMin: 1,
        desc: "Active or passive enumeration of RF links, frequencies, modulation schemes, encryption status, and control protocols in use.",
        subs: ["MAVLink traffic passive capture", "DJI OcuSync/Lightbridge RF scanning", "C2 frequency hopping pattern analysis", "Video downlink identification"] },
      { id: "T001.004", name: "GCS and Backend Infrastructure Mapping", platform: ["GCS","UTM"], actorMin: 2,
        desc: "Discovery of Ground Control Station software, network topology, cloud API endpoints, and UTM service interfaces.",
        subs: ["GCS software fingerprinting", "UTM/U-Space API endpoint discovery", "Cloud service enumeration", "VPN and authentication mechanism detection"] },
      { id: "T001.005", name: "Supply Chain and Component Research", platform: ["All"], actorMin: 2,
        desc: "Research into drone manufacturers, component suppliers, software dependencies, and known CVEs affecting specific hardware or firmware versions.",
        subs: ["Component provenance research", "CVE enumeration against autopilot/GCS software", "Third-party library dependency mapping", "Manufacturing chain analysis"] },
      { id: "T001.006", name: "Swarm Architecture Discovery", platform: ["Swarm"], actorMin: 2,
        desc: "Analysis of swarm communication topologies, coordination algorithms, leader-follower relationships, and inter-drone mesh protocols.",
        subs: ["Mesh network topology inference", "Leader node identification", "Swarm coordination protocol analysis", "Timing and synchronization pattern extraction"] },
    ]
  },
  {
    id: "TA002", name: "Resource Development", short: "RES-DEV",
    desc: "The adversary acquires, develops, or stages capabilities required to execute an attack against UAS systems.",
    color: "#F59E0B",
    techniques: [
      { id: "T002.001", name: "Acquire RF Attack Infrastructure", platform: ["All"], actorMin: 1,
        desc: "Procurement or construction of software-defined radio hardware, directional antennas, signal jammers, and GNSS spoofing transmitters.",
        subs: ["SDR hardware procurement (HackRF, USRP, RTL-SDR)", "High-gain directional antenna assembly", "GPS/GNSS spoofing device construction", "Commercial jammer acquisition"] },
      { id: "T002.002", name: "Develop or Acquire Exploit Capabilities", platform: ["All"], actorMin: 2,
        desc: "Development, purchase, or adaptation of exploit code targeting UAS firmware, autopilot software, GCS applications, or UTM APIs.",
        subs: ["MAVLink protocol exploit development", "GCS software vulnerability exploitation", "Firmware extraction and RE toolchain", "UTM API fuzzing and exploitation"] },
      { id: "T002.003", name: "Obtain or Modify a Rogue UAS", platform: ["All"], actorMin: 1,
        desc: "Acquisition or compromise of a drone to be used as a proximity attack platform, relay node, or physical delivery vehicle.",
        subs: ["Commercial drone modification", "Compromised friendly drone repurposing", "FPV platform adaptation for payload delivery"] },
      { id: "T002.004", name: "Develop Malicious Firmware or Software", platform: ["All"], actorMin: 2,
        desc: "Creation of trojanized firmware images, malicious GCS plugins, or backdoored autopilot configurations intended for supply chain delivery.",
        subs: ["Trojanized autopilot firmware build", "Malicious GCS plugin development", "Backdoored parameter file creation", "Supply chain implant development"] },
      { id: "T002.005", name: "Stage Attack Infrastructure", platform: ["GCS","UTM"], actorMin: 2,
        desc: "Preparation of C2 infrastructure, rogue GCS instances, spoofing relay servers, or UTM impersonation endpoints.",
        subs: ["Rogue GCS deployment", "MITM relay infrastructure setup", "Fake UTM/U-Space endpoint staging", "Encrypted adversarial C2 channel"] },
    ]
  },
  {
    id: "TA003", name: "Initial Access", short: "INIT-ACC",
    desc: "The adversary gains an initial foothold into the UAS ecosystem through RF interfaces, network-connected GCS, supply chain compromise, or physical proximity.",
    color: "#EF4444",
    techniques: [
      { id: "T003.001", name: "RF Command Link Hijacking", platform: ["Consumer","Enterprise","Military"], actorMin: 2,
        desc: "Exploitation of unencrypted or weakly authenticated RF control channels to inject commands or seize the C2 link.",
        subs: ["MAVLink unauthenticated command injection", "RC protocol replay (SBUS, CRSF, ExpressLRS)", "DJI control link takeover", "RF signal overpowering"] },
      { id: "T003.002", name: "GNSS Spoofing", platform: ["All"], actorMin: 2,
        desc: "Transmission of counterfeit GNSS signals to manipulate the drone's position, navigation, and timing systems.",
        subs: ["Civil GPS L1 C/A spoofing", "Multi-constellation spoofing", "Meaconing (signal rebroadcast)", "Time spoofing for mission disruption"] },
      { id: "T003.003", name: "GCS Network Compromise", platform: ["GCS","UTM"], actorMin: 2,
        desc: "Exploitation of network vulnerabilities in the Ground Control Station environment to access the operator interface.",
        subs: ["GCS software RCE exploitation", "Operator workstation compromise via phishing", "Wi-Fi lateral access to GCS subnet", "VPN credential theft"] },
      { id: "T003.004", name: "Supply Chain Compromise", platform: ["All"], actorMin: 3,
        desc: "Insertion of malicious code, hardware backdoors, or altered components during manufacturing, distribution, or maintenance.",
        subs: ["Trojanized firmware via update server", "Compromised autopilot hardware", "Malicious component insertion", "Tampered distribution channel"] },
      { id: "T003.005", name: "Physical Interface Exploitation", platform: ["All"], actorMin: 1,
        desc: "Direct physical access to drone or GCS to extract credentials, dump firmware, or implant malicious code via debug interfaces.",
        subs: ["UART / JTAG / SWD debug port access", "USB firmware flashing exploit", "microSD card payload injection", "Boot sequence manipulation"] },
      { id: "T003.006", name: "UTM / U-Space API Abuse", platform: ["GCS","UTM"], actorMin: 2,
        desc: "Exploitation of authentication weaknesses in UTM/U-Space APIs to inject false flight plans or manipulate deconfliction data.",
        subs: ["Weak API authentication exploitation", "Unauthorized flight plan injection", "False airspace reservation", "Remote ID spoofing via UTM API"] },
      { id: "T003.007", name: "Rogue Ground Station Deployment", platform: ["Consumer","Enterprise"], actorMin: 2,
        desc: "Deployment of a counterfeit GCS that impersonates the legitimate operator station to intercept or redirect C2 traffic.",
        subs: ["GCS impersonation via stronger RF signal", "Wi-Fi SSID spoofing", "Rogue telemetry gateway injection"] },
      { id: "T003.008", name: "Swarm Entry via Compromised Node", platform: ["Swarm"], actorMin: 2,
        desc: "Initial access to a drone swarm achieved by compromising a single swarm member used as an entry point.",
        subs: ["Mesh network injection via single node", "Swarm join protocol exploitation", "Rogue node insertion into swarm topology"] },
    ]
  },
  {
    id: "TA004", name: "Execution", short: "EXEC",
    desc: "The adversary executes malicious actions on compromised UAS systems, GCS software, or autonomous decision-making components.",
    color: "#F97316",
    techniques: [
      { id: "T004.001", name: "Malicious Command Injection", platform: ["All"], actorMin: 2,
        desc: "Transmission of crafted commands to the flight controller to alter altitude, heading, speed, mode, or mission parameters.",
        subs: ["MAVLink SET_MODE / SET_POSITION injection", "RC override channel injection", "Waypoint table overwrite", "Forced RTL / Land / Disarm command"] },
      { id: "T004.002", name: "Firmware Exploitation", platform: ["All"], actorMin: 2,
        desc: "Exploitation of vulnerabilities in autopilot firmware or onboard OS to achieve arbitrary code execution with elevated privileges.",
        subs: ["Buffer overflow in MAVLink parser", "Code execution via crafted parameter upload", "Bootloader exploit", "RTOS task injection"] },
      { id: "T004.003", name: "Malicious Code Deployment", platform: ["All"], actorMin: 2,
        desc: "Installation and execution of malicious software on the drone's onboard computer, companion processor, or GCS host.",
        subs: ["Ransomware targeting mission data", "Wiper payload targeting flight logs", "Rootkit on companion computer", "Bootkit for persistent control"] },
      { id: "T004.004", name: "Sensor Data Manipulation", platform: ["All"], actorMin: 2,
        desc: "Injection of falsified sensor readings to corrupt the drone's environmental awareness and cause erratic flight behavior.",
        subs: ["IMU accelerometer/gyroscope injection", "Barometer altitude spoofing", "Optical flow sensor manipulation", "LiDAR / proximity sensor blinding"] },
      { id: "T004.005", name: "AI and ML Model Exploitation", platform: ["Swarm"], actorMin: 3,
        desc: "Corruption or adversarial manipulation of onboard AI models used for autonomous navigation or swarm coordination.",
        subs: ["Training data poisoning", "Adversarial input injection at inference", "Model weight corruption", "Swarm consensus algorithm manipulation"] },
      { id: "T004.006", name: "Time-Triggered Execution", platform: ["All"], actorMin: 2,
        desc: "Delayed or time-keyed execution of malicious payloads triggered by absolute timestamps or mission phase transitions.",
        subs: ["Absolute time trigger using GPS UTC", "Relative mission phase trigger", "Geo-fenced position-based execution"] },
      { id: "T004.007", name: "Replay Attack", platform: ["Consumer","Enterprise"], actorMin: 1,
        desc: "Recording and retransmission of previously captured valid command packets to force drone actions without operator knowledge.",
        subs: ["Command packet replay (takeoff, land, waypoint)", "Telemetry frame replay to deceive GCS", "Authentication token replay"] },
    ]
  },
  {
    id: "TA005", name: "Persistence", short: "PERSIST",
    desc: "The adversary maintains long-term access to compromised UAS systems or infrastructure across reboots and remediation attempts.",
    color: "#8B5CF6",
    techniques: [
      { id: "T005.001", name: "Firmware Implant", platform: ["All"], actorMin: 3,
        desc: "Modification of flight controller or companion computer firmware to embed persistent backdoor code that survives standard updates.",
        subs: ["Autopilot firmware backdoor", "Companion computer persistent implant", "Bootloader-level persistence", "Signed firmware bypass"] },
      { id: "T005.002", name: "Parameter Store Manipulation", platform: ["All"], actorMin: 2,
        desc: "Modification of persistent autopilot non-volatile parameter storage to encode malicious values that reload at each boot.",
        subs: ["EEPROM/flash parameter corruption", "Fail-safe behavior redefinition", "Geofence boundary removal", "Authentication credential replacement"] },
      { id: "T005.003", name: "GCS Persistence", platform: ["GCS","UTM"], actorMin: 2,
        desc: "Establishment of persistent access within the GCS operating environment via scheduled tasks, startup scripts, or implanted plugins.",
        subs: ["Malicious GCS plugin auto-load", "OS-level persistence (cron, systemd, registry)", "Credential harvesting implant", "Remote access trojan on GCS host"] },
      { id: "T005.004", name: "Cloud Backend Persistence", platform: ["GCS","UTM"], actorMin: 2,
        desc: "Maintenance of unauthorized access to cloud-based fleet management, telemetry storage, or UTM backend systems.",
        subs: ["API key theft and reuse", "OAuth refresh token persistence", "Cloud function backdoor", "Database credential persistence"] },
      { id: "T005.005", name: "Swarm Node Persistence", platform: ["Swarm"], actorMin: 3,
        desc: "Persistent compromise of swarm nodes enabling re-entry into the swarm network after partial remediation.",
        subs: ["Persistent mesh network implant", "Swarm coordination protocol backdoor", "Node identity spoofing for re-insertion"] },
    ]
  },
  {
    id: "TA006", name: "Defense Evasion", short: "DEF-EVA",
    desc: "The adversary avoids detection by operators, C-UAS sensors, RF monitoring systems, or automated anomaly detection.",
    color: "#06B6D4",
    techniques: [
      { id: "T006.001", name: "Telemetry Manipulation", platform: ["All"], actorMin: 2,
        desc: "Alteration of telemetry data to conceal adversarial actions or misrepresent the drone's actual state to operators.",
        subs: ["Altitude/position falsification", "Battery level spoofing", "Mode status concealment", "Error flag suppression in downlink"] },
      { id: "T006.002", name: "Remote ID Suppression or Spoofing", platform: ["Consumer","Enterprise"], actorMin: 1,
        desc: "Disabling or falsifying Remote ID broadcasts to prevent identification by law enforcement, C-UAS systems, or UTM services.",
        subs: ["RID broadcast suppression", "False operator ID injection", "False serial number broadcast", "RID frequency jamming"] },
      { id: "T006.003", name: "RF Emission Minimization", platform: ["All"], actorMin: 2,
        desc: "Reduction of RF emissions to evade detection by RF-based C-UAS sensors, including pre-programmed silent autonomous flight.",
        subs: ["Pre-programmed autonomous mission with no active RF C2", "Frequency hopping to avoid monitoring", "Directional antenna for reduced RF footprint", "Low-power transmission during approach"] },
      { id: "T006.004", name: "Onboard Log Manipulation", platform: ["All"], actorMin: 2,
        desc: "Deletion, overwriting, or corruption of onboard flight logs and black box data to impede forensic investigation.",
        subs: ["SD card flight log deletion", "ArduPilot DataFlash log corruption", "PX4 ulog manipulation", "Timestamp falsification"] },
      { id: "T006.005", name: "Safe Mode Exploitation", platform: ["All"], actorMin: 2,
        desc: "Exploitation of reduced security posture during drone safe mode or failsafe recovery to execute normally blocked actions.",
        subs: ["Unauthorized command injection during failsafe", "Safe mode parameter modification", "Recovery mode firmware replacement"] },
      { id: "T006.006", name: "Physical Signature Reduction", platform: ["Military","Swarm"], actorMin: 3,
        desc: "Modification of drone physical characteristics to reduce acoustic, thermal, or optical signatures detectable by C-UAS sensors.",
        subs: ["Low-RPM acoustic reduction", "Thermal signature minimization", "Counter-optical operation", "Terrain masking flight profile"] },
    ]
  },
  {
    id: "TA007", name: "Lateral Movement", short: "LAT-MOV",
    desc: "The adversary moves from an initial foothold to other connected drone platforms, GCS systems, or enterprise networks.",
    color: "#10B981",
    techniques: [
      { id: "T007.001", name: "GCS to Fleet Propagation", platform: ["GCS","UTM"], actorMin: 2,
        desc: "Lateral movement from a compromised GCS to other drones managed by the same fleet management system.",
        subs: ["Fleet management API abuse for multi-drone access", "Shared credential reuse across fleet", "Mission template poisoning across fleet"] },
      { id: "T007.002", name: "Swarm Node Hopping", platform: ["Swarm"], actorMin: 2,
        desc: "Propagation of malicious code from a single compromised swarm node to adjacent nodes via inter-drone mesh communication.",
        subs: ["Mesh worm self-propagation", "Swarm broadcast channel hijacking", "Consensus algorithm poisoning"] },
      { id: "T007.003", name: "Drone to Enterprise Network Pivot", platform: ["Enterprise","GCS"], actorMin: 2,
        desc: "Use of the drone or companion computer as a pivot point to access operator enterprise networks.",
        subs: ["Wi-Fi credential harvesting at docking station", "USB-based pivot to GCS host OS", "VPN tunnel abuse for network access"] },
      { id: "T007.004", name: "UTM Federation Abuse", platform: ["GCS","UTM"], actorMin: 3,
        desc: "Exploitation of inter-UTM federation protocols to propagate false data or access adjacent UTM service providers.",
        subs: ["Cross-UTM provider data injection", "Federation trust exploitation", "Airspace data poisoning across providers"] },
      { id: "T007.005", name: "Companion Computer to Autopilot Pivot", platform: ["Enterprise","Military"], actorMin: 2,
        desc: "Lateral movement from a compromised companion computer (Linux SBC) to the flight controller via internal serial or USB interfaces.",
        subs: ["MAVLink pivot from companion to flight controller", "UART/USB bridge exploitation", "Parameter modification via companion interface"] },
    ]
  },
  {
    id: "TA008", name: "Collection & Exfiltration", short: "EXFIL",
    desc: "The adversary intercepts or exfiltrates data from UAS systems including video feeds, telemetry, flight plans, and sensor outputs.",
    color: "#EC4899",
    techniques: [
      { id: "T008.001", name: "Video Feed Interception", platform: ["Consumer","Enterprise","Military"], actorMin: 1,
        desc: "Passive or active interception of unencrypted or weakly encrypted video downlinks from drone to GCS.",
        subs: ["DJI OcuSync video downlink capture", "Analog FPV feed capture via SDR", "H.264/H.265 stream interception", "IR/thermal video feed interception"] },
      { id: "T008.002", name: "Telemetry Stream Interception", platform: ["All"], actorMin: 1,
        desc: "Capture of MAVLink or proprietary telemetry to extract real-time position, mission, and system health data.",
        subs: ["MAVLink telemetry passive RF capture", "Proprietary protocol capture after RE", "APRS-based telemetry interception"] },
      { id: "T008.003", name: "Mission Data Exfiltration", platform: ["All"], actorMin: 2,
        desc: "Unauthorized extraction of stored flight plans, waypoint databases, survey outputs, and mission files.",
        subs: ["Physical SD card extraction", "GCS database exfiltration", "Cloud-synced mission data access", "Survey and mapping data theft"] },
      { id: "T008.004", name: "Specialized Payload Data Interception", platform: ["Enterprise","Military"], actorMin: 2,
        desc: "Interception of data from specialized payloads including multispectral sensors, LiDAR, SIGINT, or EO/IR cameras.",
        subs: ["Multispectral/hyperspectral imagery theft", "LiDAR point cloud exfiltration", "SIGINT payload data intercept", "SAR data exfiltration (military)"] },
      { id: "T008.005", name: "Side-Channel Data Extraction", platform: ["All"], actorMin: 3,
        desc: "Extraction of sensitive data through analysis of power consumption, electromagnetic emissions, or timing characteristics.",
        subs: ["Power analysis of cryptographic operations", "EM leakage from flight controller", "Timing side-channel on authentication"] },
    ]
  },
  {
    id: "TA009", name: "Impact", short: "IMPACT",
    desc: "The adversary causes direct physical, operational, or informational harm to UAS systems, operators, or critical infrastructure.",
    color: "#DC2626",
    techniques: [
      { id: "T009.001", name: "Drone Hijacking", platform: ["All"], actorMin: 2,
        desc: "Full or partial takeover of drone flight control to redirect the vehicle to an adversary-chosen location or mission.",
        subs: ["Complete C2 link seizure", "Waypoint injection for rerouting", "Forced landing at adversary-controlled site", "Forced loiter / mission denial"] },
      { id: "T009.002", name: "Forced Crash or Destruction", platform: ["All"], actorMin: 2,
        desc: "Intentional causing of drone loss of control, crash, or in-flight destruction through malicious commands or manipulated sensor data.",
        subs: ["Motor disarm command injection in flight", "GPS spoofing toward terrain", "Pitch/roll limit removal for structural failure", "Altitude floor removal over hazards"] },
      { id: "T009.003", name: "Mission Disruption and Denial", platform: ["All"], actorMin: 1,
        desc: "Prevention of the drone from completing its intended mission through jamming, denial of communications, or flight path interference.",
        subs: ["RF uplink jamming", "GPS denial forcing RTL/landing", "Geofence injection restricting flight area", "Persistent noise floor elevation"] },
      { id: "T009.004", name: "Weaponization and Payload Delivery", platform: ["Military","Consumer"], actorMin: 1,
        desc: "Use of a compromised or hijacked drone to deliver physical payloads including explosives, hazardous materials, or electronic attack devices.",
        subs: ["Explosive payload delivery", "CBRN agent dispersal", "Electronic warfare device drop", "Kinetic strike via controlled collision"] },
      { id: "T009.005", name: "Data Destruction", platform: ["All"], actorMin: 2,
        desc: "Irreversible deletion or corruption of mission-critical data, flight logs, or GCS configuration.",
        subs: ["Onboard storage wipe", "GCS database corruption", "Cloud backup deletion via API", "Cryptographic key destruction"] },
      { id: "T009.006", name: "Infrastructure Attack via UAS Vector", platform: ["Military","Swarm"], actorMin: 2,
        desc: "Use of a drone as a physical or cyber attack vector against ground infrastructure including power, communications, or secure facilities.",
        subs: ["Physical collision with critical infrastructure", "Covert RF eavesdropping device placement", "Cyber attack payload delivery", "Communications relay disruption"] },
    ]
  },
];

const COUNTERMEASURES = [
  { id: "CM-001", name: "Encrypted and Authenticated C2 Link", tacticIds: ["TA003","TA004"],
    desc: "All C2 communications between GCS and drone must use mutual-authentication encryption (AES-256 minimum) with replay protection.",
    refs: ["NIST SP 800-53 SC-8", "DO-326A Sec 6.2", "EUROCAE ED-202A", "STANAG 4586"] },
  { id: "CM-002", name: "GNSS Anti-Spoofing and Anti-Jamming", tacticIds: ["TA003","TA009"],
    desc: "Multi-constellation GNSS receivers with spoofing detection, INS/IMU fallback, and signal authentication (Galileo OSNMA, GPS CHIPS).",
    refs: ["NIST SP 800-53 SI-10", "RTCA DO-316", "ICAO Annex 10", "FAA AC 20-138E"] },
  { id: "CM-003", name: "Firmware Integrity and Secure Boot", tacticIds: ["TA003","TA005"],
    desc: "Cryptographic signing and hardware-enforced verification of all firmware images at boot using a hardware root of trust.",
    refs: ["NIST SP 800-53 SI-7", "NIST SP 800-193", "DO-326A", "IEC 62443-4-2 CR 3.4"] },
  { id: "CM-004", name: "Remote ID Broadcast Integrity", tacticIds: ["TA006"],
    desc: "Tamper-resistant Remote ID broadcast per ASTM F3411-22 with detection and alerting of suppression or spoofing attempts.",
    refs: ["ASTM F3411-22", "EU Reg. 2019/945", "FAA Part 89", "NIST SP 800-53 IA-3"] },
  { id: "CM-005", name: "UTM and U-Space API Authentication", tacticIds: ["TA003","TA007"],
    desc: "OAuth 2.0 or mTLS for all UTM/U-Space API interactions with role-based access control and anomaly detection.",
    refs: ["NIST SP 800-53 IA-2", "EUROCAE ED-269", "SESAR U-Space Spec", "ISO/IEC 27001 A.9"] },
  { id: "CM-006", name: "Onboard Behavioral Anomaly Detection", tacticIds: ["TA004","TA006"],
    desc: "Real-time monitoring of flight control inputs, sensor streams, and communication patterns for spoofing, injection, or hijacking indicators.",
    refs: ["NIST SP 800-53 SI-4", "DO-178C", "IEC 62443-3-3 SR 6.1", "MITRE ATT&CK for ICS"] },
  { id: "CM-007", name: "Physical Debug Interface Protection", tacticIds: ["TA003","TA005"],
    desc: "Disabling or cryptographically protecting all JTAG/UART/USB debug interfaces on production hardware.",
    refs: ["NIST SP 800-53 AC-3", "IEC 62443-4-2 CR 1.1", "NIST SP 800-193", "DO-326A Sec 5"] },
  { id: "CM-008", name: "GCS Network Segmentation and Hardening", tacticIds: ["TA003","TA005","TA007"],
    desc: "Isolation of GCS from enterprise networks, least-privilege access enforcement, host hardening, and network anomaly detection.",
    refs: ["NIST SP 800-53 SC-7", "CIS Controls v8 Control 12", "ISO/IEC 27001 A.13", "NSA/CISA Segmentation Guide"] },
  { id: "CM-009", name: "UAS Supply Chain Risk Management", tacticIds: ["TA002","TA003"],
    desc: "Component provenance verification, SBOM maintenance, vendor security assessments, and prohibition of high-risk source components.",
    refs: ["NIST SP 800-161r1", "NIST SP 800-53 SR-3", "US NDAA Sec. 848", "EU Cyber Resilience Act"] },
  { id: "CM-010", name: "Swarm Node Mutual Authentication", tacticIds: ["TA003","TA005","TA007"],
    desc: "Cryptographic mutual authentication between all swarm nodes with message integrity to prevent rogue insertion and hopping.",
    refs: ["NIST SP 800-53 IA-3", "IEEE 1609.2", "STANAG 4586", "IEC 62443-3-3 SR 1.2"] },
  { id: "CM-011", name: "Tamper-Resistant Geofencing", tacticIds: ["TA004","TA009"],
    desc: "Cryptographically signed geofence zone definitions with hardware-enforced boundaries that cannot be overridden by software command.",
    refs: ["EU Reg. 2019/945", "FAA Part 107", "ASTM F3322", "NIST SP 800-53 SI-10"] },
  { id: "CM-012", name: "Onboard Data Encryption", tacticIds: ["TA008"],
    desc: "Encryption of all sensitive data at rest on onboard storage with secure key management and tamper-evident log integrity.",
    refs: ["NIST SP 800-53 SC-28", "ISO/IEC 27001 A.10", "DO-326A", "NIST SP 800-111"] },
  { id: "CM-013", name: "Incident Response and Forensic Readiness", tacticIds: ["TA009"],
    desc: "Immutable, integrity-protected flight logs and telemetry records with defined procedures for post-incident forensic investigation.",
    refs: ["NIST SP 800-53 IR-4", "NIST SP 800-86", "ASTM F3388", "NIS2 Directive Art. 23"] },
];

const PLATFORMS_LIST = ["All", "Consumer", "Enterprise", "Military", "GCS", "UTM", "Swarm"];
const ACTOR_LABELS = { 1: "L1 – Opportunistic", 2: "L2 – Technical", 3: "L3 – Nation-State" };
const ACTOR_COLORS = { 1: "#10B981", 2: "#F59E0B", 3: "#EF4444" };

// ─── STYLES ──────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080C14;
    --bg2: #0D1220;
    --bg3: #111827;
    --bg4: #1A2236;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --text: #E8EDF5;
    --text2: #8B9BB4;
    --text3: #556070;
    --accent: #4A9EFF;
    --accent2: #2D6FCC;
    --red: #EF4444;
    --green: #10B981;
    --amber: #F59E0B;
    --mono: 'Space Mono', monospace;
    --sans: 'Syne', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    font-size: 15px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--accent2); border-radius: 3px; }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; gap: 2rem;
    padding: 0 2rem; height: 56px;
    background: rgba(8,12,20,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    font-family: var(--mono); font-size: 18px; font-weight: 700;
    color: var(--accent); letter-spacing: 0.08em; cursor: pointer;
    flex-shrink: 0;
  }
  .nav-links { display: flex; gap: 0.25rem; flex: 1; }
  .nav-btn {
    background: none; border: none; cursor: pointer;
    font-family: var(--sans); font-size: 13px; font-weight: 600;
    color: var(--text2); padding: 0.4rem 0.9rem; border-radius: 6px;
    transition: all 0.15s; letter-spacing: 0.04em; text-transform: uppercase;
  }
  .nav-btn:hover { color: var(--text); background: var(--bg4); }
  .nav-btn.active { color: var(--accent); background: rgba(74,158,255,0.1); }

  /* HERO */
  .hero {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 6rem 2rem 4rem;
    position: relative; overflow: hidden;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(74,158,255,0.07) 0%, transparent 70%),
                radial-gradient(ellipse 40% 40% at 80% 80%, rgba(139,92,246,0.05) 0%, transparent 60%);
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(74,158,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(74,158,255,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 90% 70% at 50% 40%, black 0%, transparent 80%);
  }
  .hero-content { position: relative; text-align: center; max-width: 860px; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(74,158,255,0.1); border: 1px solid rgba(74,158,255,0.2);
    padding: 0.35rem 1rem; border-radius: 100px; margin-bottom: 2rem;
    font-family: var(--mono); font-size: 11px; color: var(--accent);
    letter-spacing: 0.12em; text-transform: uppercase;
  }
  .hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
  .hero-title {
    font-size: clamp(4rem, 12vw, 9rem); font-weight: 800;
    line-height: 0.9; letter-spacing: -0.03em;
    background: linear-gradient(135deg, #fff 0%, var(--accent) 60%, #8B5CF6 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }
  .hero-subtitle {
    font-family: var(--mono); font-size: clamp(0.7rem, 1.5vw, 0.9rem);
    color: var(--text2); letter-spacing: 0.15em; text-transform: uppercase;
    margin-bottom: 2rem;
  }
  .hero-desc {
    font-size: 1.1rem; color: var(--text2); max-width: 620px;
    margin: 0 auto 3rem; line-height: 1.7;
  }
  .hero-stats {
    display: flex; gap: 3rem; justify-content: center; margin-bottom: 3rem;
    flex-wrap: wrap;
  }
  .hero-stat { text-align: center; }
  .hero-stat-num { font-family: var(--mono); font-size: 2.5rem; font-weight: 700; color: var(--accent); line-height: 1; }
  .hero-stat-label { font-size: 12px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.3rem; }
  .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .btn-primary {
    background: var(--accent); color: #000; border: none; cursor: pointer;
    padding: 0.75rem 2rem; border-radius: 8px; font-family: var(--sans);
    font-size: 14px; font-weight: 700; letter-spacing: 0.05em;
    transition: all 0.2s; text-transform: uppercase;
  }
  .btn-primary:hover { background: #6AB5FF; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(74,158,255,0.3); }
  .btn-secondary {
    background: var(--bg4); color: var(--text); border: 1px solid var(--border2);
    cursor: pointer; padding: 0.75rem 2rem; border-radius: 8px;
    font-family: var(--sans); font-size: 14px; font-weight: 600;
    letter-spacing: 0.05em; transition: all 0.2s; text-transform: uppercase;
  }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-1px); }

  /* SECTION */
  .section { padding: 5rem 2rem; max-width: 1400px; margin: 0 auto; }
  .section-header { margin-bottom: 3rem; }
  .section-label {
    font-family: var(--mono); font-size: 11px; color: var(--accent);
    letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.75rem;
  }
  .section-title {
    font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800;
    color: var(--text); line-height: 1.1; letter-spacing: -0.02em;
  }
  .section-desc { color: var(--text2); margin-top: 1rem; max-width: 600px; line-height: 1.7; }

  /* MATRIX */
  .matrix-controls {
    display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; align-items: center;
  }
  .filter-group { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .filter-btn {
    background: var(--bg3); border: 1px solid var(--border); border-radius: 6px;
    padding: 0.35rem 0.8rem; font-family: var(--mono); font-size: 11px;
    color: var(--text2); cursor: pointer; transition: all 0.15s; white-space: nowrap;
  }
  .filter-btn:hover { border-color: var(--border2); color: var(--text); }
  .filter-btn.active { background: rgba(74,158,255,0.12); border-color: rgba(74,158,255,0.4); color: var(--accent); }
  .filter-divider { width: 1px; background: var(--border); margin: 0 0.5rem; }

  .matrix-grid {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: 6px;
    min-width: 0;
  }
  .matrix-tactic-header {
    padding: 0.7rem 0.5rem; border-radius: 6px 6px 0 0;
    text-align: center; cursor: pointer; transition: all 0.2s;
    border: 1px solid var(--border);
  }
  .matrix-tactic-header:hover { filter: brightness(1.2); }
  .matrix-tactic-id { font-family: var(--mono); font-size: 9px; opacity: 0.7; margin-bottom: 3px; }
  .matrix-tactic-name { font-size: 11px; font-weight: 700; line-height: 1.2; }
  .matrix-tactic-count { font-family: var(--mono); font-size: 10px; opacity: 0.6; margin-top: 3px; }

  .matrix-tech {
    border: 1px solid var(--border); border-radius: 4px;
    padding: 0.5rem; cursor: pointer; transition: all 0.15s;
    background: var(--bg2); position: relative; overflow: hidden;
  }
  .matrix-tech:hover { border-color: var(--border2); background: var(--bg3); transform: translateY(-1px); }
  .matrix-tech.selected { border-color: var(--accent); background: rgba(74,158,255,0.08); }
  .matrix-tech.dimmed { opacity: 0.25; }
  .matrix-tech-id { font-family: var(--mono); font-size: 9px; color: var(--text3); margin-bottom: 3px; }
  .matrix-tech-name { font-size: 11px; font-weight: 600; color: var(--text); line-height: 1.3; }
  .matrix-tech-actor {
    position: absolute; top: 4px; right: 4px;
    width: 6px; height: 6px; border-radius: 50%;
  }

  /* DETAIL PANEL */
  .detail-panel {
    margin-top: 1.5rem; background: var(--bg2); border: 1px solid var(--border2);
    border-radius: 12px; overflow: hidden;
    animation: slideDown 0.2s ease;
  }
  @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  .detail-header {
    padding: 1.5rem 2rem; border-bottom: 1px solid var(--border);
    display: flex; gap: 1.5rem; align-items: flex-start; flex-wrap: wrap;
  }
  .detail-id { font-family: var(--mono); font-size: 13px; color: var(--accent); margin-bottom: 0.5rem; }
  .detail-name { font-size: 1.4rem; font-weight: 800; color: var(--text); }
  .detail-body { padding: 1.5rem 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
  @media(max-width:700px){ .detail-body{grid-template-columns:1fr;} }
  .detail-section-title { font-family: var(--mono); font-size: 10px; color: var(--accent); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.75rem; }
  .detail-desc { color: var(--text2); font-size: 14px; line-height: 1.7; }
  .detail-sub {
    display: flex; align-items: flex-start; gap: 0.6rem;
    padding: 0.5rem 0; border-bottom: 1px solid var(--border); font-size: 13px; color: var(--text2);
  }
  .detail-sub:last-child { border-bottom: none; }
  .detail-sub-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); flex-shrink: 0; margin-top: 7px; }
  .platform-tag {
    display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px;
    font-family: var(--mono); font-size: 10px; background: rgba(74,158,255,0.1);
    border: 1px solid rgba(74,158,255,0.2); color: var(--accent); margin: 0.15rem;
  }
  .actor-badge {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.3rem 0.8rem; border-radius: 100px;
    font-family: var(--mono); font-size: 11px; font-weight: 700;
  }

  /* COUNTERMEASURES */
  .cm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1rem; }
  .cm-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 10px; padding: 1.5rem; transition: all 0.2s; cursor: pointer;
  }
  .cm-card:hover { border-color: var(--border2); background: var(--bg3); transform: translateY(-2px); }
  .cm-card-header { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; }
  .cm-id { font-family: var(--mono); font-size: 12px; color: var(--green); background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); padding: 0.3rem 0.6rem; border-radius: 4px; flex-shrink: 0; }
  .cm-name { font-size: 15px; font-weight: 700; color: var(--text); line-height: 1.3; }
  .cm-desc { font-size: 13px; color: var(--text2); line-height: 1.6; margin-bottom: 1rem; }
  .cm-refs { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .cm-ref { font-family: var(--mono); font-size: 10px; color: var(--text3); background: var(--bg4); border: 1px solid var(--border); padding: 0.2rem 0.5rem; border-radius: 3px; }

  /* ABOUT */
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
  @media(max-width:800px){ .about-grid{grid-template-columns:1fr;} }
  .about-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 2rem;
  }
  .about-card-icon { font-size: 2rem; margin-bottom: 1rem; }
  .about-card-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; }
  .about-card-text { color: var(--text2); font-size: 14px; line-height: 1.7; }

  /* FOOTER */
  .footer {
    border-top: 1px solid var(--border); padding: 2rem;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: gap;
    background: var(--bg2); gap: 1rem;
  }
  .footer-logo { font-family: var(--mono); font-size: 16px; font-weight: 700; color: var(--accent); }
  .footer-text { font-size: 12px; color: var(--text3); }
  .footer-badge {
    font-family: var(--mono); font-size: 10px; color: var(--text3);
    background: var(--bg3); border: 1px solid var(--border); padding: 0.3rem 0.7rem; border-radius: 4px;
  }

  /* TACTIC DETAIL PAGE */
  .tactic-page { padding: 5rem 2rem 4rem; max-width: 1200px; margin: 0 auto; }
  .back-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: none; border: none; cursor: pointer;
    font-family: var(--mono); font-size: 12px; color: var(--text2);
    margin-bottom: 2rem; transition: color 0.15s; letter-spacing: 0.05em;
  }
  .back-btn:hover { color: var(--accent); }
  .tactic-hero {
    padding: 2.5rem; border-radius: 16px; margin-bottom: 2.5rem;
    border: 1px solid var(--border);
  }
  .tech-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 10px;
    padding: 1.5rem; margin-bottom: 1rem; cursor: pointer; transition: all 0.2s;
  }
  .tech-card:hover { border-color: var(--border2); background: var(--bg3); }
  .tech-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 0.75rem; }
  .tech-card-id { font-family: var(--mono); font-size: 12px; color: var(--accent); }
  .tech-card-name { font-size: 16px; font-weight: 700; color: var(--text); }
  .tech-card-desc { font-size: 14px; color: var(--text2); line-height: 1.6; margin-bottom: 1rem; }
  .tech-subs { display: flex; flex-direction: column; gap: 0.4rem; }
  .tech-sub { font-size: 13px; color: var(--text2); padding-left: 1rem; border-left: 2px solid var(--border); }

  /* OVERVIEW CARDS */
  .overview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .overview-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 10px;
    padding: 1.5rem; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden;
  }
  .overview-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    border-radius: 3px 0 0 3px;
  }
  .overview-card:hover { border-color: var(--border2); transform: translateY(-2px); }
  .overview-card-id { font-family: var(--mono); font-size: 11px; color: var(--text3); margin-bottom: 0.5rem; }
  .overview-card-name { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 0.5rem; }
  .overview-card-desc { font-size: 13px; color: var(--text2); line-height: 1.5; }
  .overview-card-count { font-family: var(--mono); font-size: 11px; margin-top: 1rem; opacity: 0.6; }

  /* TECHNIQUE DETAIL */
  .technique-page { padding: 5rem 2rem 4rem; max-width: 1000px; margin: 0 auto; }

  /* RESPONSIVE */
  @media(max-width:1100px){
    .matrix-grid { grid-template-columns: repeat(3,1fr); }
  }
  @media(max-width:700px){
    .matrix-grid { grid-template-columns: repeat(2,1fr); }
    .hero-stats { gap: 1.5rem; }
  }
  @media(max-width:500px){
    .matrix-grid { grid-template-columns: 1fr; }
  }
`;

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState("home");
  const [activeTactic, setActiveTactic] = useState(null);
  const [activeTechnique, setActiveTechnique] = useState(null);
  const [selectedTech, setSelectedTech] = useState(null);
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [filterActor, setFilterActor] = useState(0);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const totalTechs = TACTICS.reduce((s, t) => s + t.techniques.length, 0);
  const totalSubs = TACTICS.reduce((s, t) => s + t.techniques.reduce((ss, tt) => ss + tt.subs.length, 0), 0);

  const isTechVisible = (tech) => {
    if (filterPlatform !== "All" && !tech.platform.includes(filterPlatform) && !tech.platform.includes("All")) return false;
    if (filterActor > 0 && tech.actorMin > filterActor) return false;
    return true;
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "matrix", label: "Matrix" },
    { id: "tactics", label: "Tactics" },
    { id: "countermeasures", label: "Countermeasures" },
    { id: "about", label: "About" },
  ];

  const goToTactic = (tactic) => {
    setActiveTactic(tactic);
    setActiveTechnique(null);
    setView("tactic");
  };

  const goToTechnique = (tech, tactic) => {
    setActiveTechnique({ ...tech, tacticId: tactic.id, tacticName: tactic.name, tacticColor: tactic.color });
    setView("technique");
  };

  return (
    <div>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => setView("home")}>DARTA</div>
        <div className="nav-links">
          {navItems.map(n => (
            <button key={n.id} className={`nav-btn ${view === n.id || (view === "tactic" && n.id === "tactics") || (view === "technique" && n.id === "tactics") ? "active" : ""}`}
              onClick={() => { setView(n.id); setActiveTactic(null); setActiveTechnique(null); }}>
              {n.label}
            </button>
          ))}
        </div>
        <a className="btn-secondary" style={{fontSize:"12px", padding:"0.4rem 1rem", textDecoration:"none"}}
          href="https://raw.githubusercontent.com/Giorgiofox/darta/main/docs/DARTA_v0.1.pdf" download>
          ↓ Download v0.1
        </a>
      </nav>

      {/* VIEWS */}
      {view === "home" && <HomeView goToMatrix={() => setView("matrix")} goToTactics={() => setView("tactics")} totalTechs={totalTechs} totalSubs={totalSubs} goToTactic={goToTactic} />}
      {view === "matrix" && <MatrixView selectedTech={selectedTech} setSelectedTech={setSelectedTech} filterPlatform={filterPlatform} setFilterPlatform={setFilterPlatform} filterActor={filterActor} setFilterActor={setFilterActor} isTechVisible={isTechVisible} goToTactic={goToTactic} goToTechnique={goToTechnique} />}
      {view === "tactics" && <TacticsView goToTactic={goToTactic} />}
      {view === "tactic" && activeTactic && <TacticDetailView tactic={activeTactic} goBack={() => setView("tactics")} goToTechnique={goToTechnique} />}
      {view === "technique" && activeTechnique && <TechniqueDetailView tech={activeTechnique} goBack={() => { setView("tactic"); }} countermeasures={COUNTERMEASURES.filter(c => c.tacticIds.includes(activeTechnique.tacticId))} />}
      {view === "countermeasures" && <CountermeasuresView />}
      {view === "about" && <AboutView />}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">DARTA</div>
        <div className="footer-text">Drone Attack Research and Tactic Analysis by Giorgio Campiotti — v0.1 Draft — March 2026</div>
        <div className="footer-badge">UNCLASSIFIED — FOR RESEARCH AND EDUCATIONAL PURPOSES</div>
      </footer>
    </div>
  );
}

// ─── HOME VIEW ────────────────────────────────────────────────────────────────
function HomeView({ goToMatrix, goToTactics, totalTechs, totalSubs, goToTactic }) {
  return (
    <>
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            v0.1 Draft — Community Review Open
          </div>
          <h1 className="hero-title">DARTA</h1>
          <p className="hero-subtitle">Drone Attack Research &amp; Tactic Analysis</p>
          <p className="hero-desc">
            A structured TTP framework for Unmanned Aerial Systems cybersecurity.
            Covering civil consumer drones, enterprise UAS, military tactical systems,
            GCS &amp; UTM infrastructure, and autonomous swarms.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">9</div>
              <div className="hero-stat-label">Tactics</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{totalTechs}</div>
              <div className="hero-stat-label">Techniques</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{totalSubs}</div>
              <div className="hero-stat-label">Sub-Techniques</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">13</div>
              <div className="hero-stat-label">Countermeasures</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">5</div>
              <div className="hero-stat-label">Platform Scopes</div>
            </div>
          </div>
          <div className="hero-actions">
            <button className="btn-primary" onClick={goToMatrix}>Explore the Matrix</button>
            <button className="btn-secondary" onClick={goToTactics}>Browse Tactics</button>
          </div>
        </div>
      </section>

      {/* Tactic overview strip */}
      <div style={{background:"var(--bg2)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"3rem 2rem"}}>
        <div style={{maxWidth:"1400px", margin:"0 auto"}}>
          <div style={{fontFamily:"var(--mono)", fontSize:"11px", color:"var(--accent)", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"1.5rem"}}>Nine Tactical Phases</div>
          <div className="overview-grid">
            {TACTICS.map(t => (
              <div key={t.id} className="overview-card" onClick={() => goToTactic(t)}
                style={{"--card-color": t.color}}>
                <div style={{position:"absolute",left:0,top:0,bottom:0,width:"3px",background:t.color,borderRadius:"3px 0 0 3px"}} />
                <div className="overview-card-id">{t.id}</div>
                <div className="overview-card-name">{t.name}</div>
                <div className="overview-card-desc">{t.desc}</div>
                <div className="overview-card-count">{t.techniques.length} techniques</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Positioning */}
      <div style={{padding:"5rem 2rem", maxWidth:"1000px", margin:"0 auto"}}>
        <div style={{fontFamily:"var(--mono)", fontSize:"11px", color:"var(--accent)", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"0.75rem"}}>Framework Positioning</div>
        <h2 style={{fontSize:"clamp(1.6rem,4vw,2.4rem)", fontWeight:"800", marginBottom:"1.5rem", letterSpacing:"-0.02em"}}>Built on the shoulders of SPARTA and ATT&amp;CK</h2>
        <p style={{color:"var(--text2)", lineHeight:"1.8", marginBottom:"2rem", fontSize:"15px"}}>
          DARTA is explicitly modeled on the structural approach of <strong style={{color:"var(--text)"}}>MITRE ATT&amp;CK</strong> and The Aerospace Corporation's <strong style={{color:"var(--text)"}}>SPARTA</strong> matrix for spacecraft. Where SPARTA covers the threat landscape for satellites and space systems, DARTA extends the same disciplined TTP taxonomy to the drone domain — a rapidly evolving attack surface with no equivalent public framework.
        </p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"1rem"}}>
          {[
            {name:"MITRE ATT&CK", role:"Structural conventions, TTP taxonomy approach", url:"https://attack.mitre.org"},
            {name:"SPARTA", role:"Direct analog — spacecraft domain, methodology source", url:"https://sparta.aerospace.org"},
            {name:"DroneSec", role:"Real-world UAS incident intelligence baseline", url:"https://dronesec.com"},
            {name:"NIST SP 800-53", role:"Countermeasure control mapping", url:"https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final"},
            {name:"DO-326A / ED-202A", role:"Aviation cybersecurity process standards", url:"https://eurocae.net/news/posts/2019/march/eurocae-ed-202a-update/"},
            {name:"ASTM F38", role:"UAS-specific standards (Remote ID, forensics)", url:"https://www.astm.org/committee-f38.html"},
          ].map(r => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
              style={{background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"8px", padding:"1rem", display:"block", textDecoration:"none", transition:"border-color 0.15s, transform 0.15s"}}
              onMouseEnter={e => { e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="translateY(0)"; }}>
              <div style={{fontFamily:"var(--mono)", fontSize:"12px", color:"var(--accent)", marginBottom:"0.4rem"}}>{r.name} ↗</div>
              <div style={{fontSize:"12px", color:"var(--text2)", lineHeight:"1.5"}}>{r.role}</div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── MATRIX VIEW ──────────────────────────────────────────────────────────────
function MatrixView({ selectedTech, setSelectedTech, filterPlatform, setFilterPlatform, filterActor, setFilterActor, isTechVisible, goToTactic, goToTechnique }) {
  const activeTacticForTech = selectedTech ? TACTICS.find(t => t.techniques.some(tt => tt.id === selectedTech.id)) : null;

  return (
    <div className="section" style={{paddingTop:"5rem"}}>
      <div className="section-header">
        <div className="section-label">Navigator</div>
        <h2 className="section-title">DARTA Matrix</h2>
        <p className="section-desc">Click any technique to inspect details. Filter by platform scope or adversary tier. Click a tactic header to view all techniques in that phase.</p>
      </div>

      <div className="matrix-controls">
        <div style={{fontFamily:"var(--mono)", fontSize:"11px", color:"var(--text3)", letterSpacing:"0.1em"}}>PLATFORM</div>
        <div className="filter-group">
          {PLATFORMS_LIST.map(p => (
            <button key={p} className={`filter-btn ${filterPlatform === p ? "active" : ""}`} onClick={() => setFilterPlatform(p)}>{p}</button>
          ))}
        </div>
        <div className="filter-divider" />
        <div style={{fontFamily:"var(--mono)", fontSize:"11px", color:"var(--text3)", letterSpacing:"0.1em"}}>ACTOR</div>
        <div className="filter-group">
          <button className={`filter-btn ${filterActor === 0 ? "active" : ""}`} onClick={() => setFilterActor(0)}>All</button>
          {[1,2,3].map(l => (
            <button key={l} className={`filter-btn ${filterActor === l ? "active" : ""}`} onClick={() => setFilterActor(l)}
              style={filterActor === l ? {borderColor: ACTOR_COLORS[l], color: ACTOR_COLORS[l], background: `${ACTOR_COLORS[l]}18`} : {}}>
              L{l}
            </button>
          ))}
        </div>
        {(filterPlatform !== "All" || filterActor > 0) && (
          <button className="filter-btn" onClick={() => { setFilterPlatform("All"); setFilterActor(0); }} style={{borderColor:"rgba(239,68,68,0.4)", color:"var(--red)"}}>
            Clear filters
          </button>
        )}
      </div>

      <div style={{overflowX:"auto"}}>
        <div className="matrix-grid" style={{minWidth:"900px"}}>
          {TACTICS.map(tactic => (
            <div key={tactic.id}>
              <div className="matrix-tactic-header"
                style={{background: `${tactic.color}18`, borderColor: `${tactic.color}40`, color: tactic.color}}
                onClick={() => goToTactic(tactic)}>
                <div className="matrix-tactic-id">{tactic.id}</div>
                <div className="matrix-tactic-name">{tactic.short}</div>
                <div className="matrix-tactic-count">{tactic.techniques.filter(isTechVisible).length}/{tactic.techniques.length}</div>
              </div>
              <div style={{display:"flex", flexDirection:"column", gap:"6px", marginTop:"6px"}}>
                {tactic.techniques.map(tech => {
                  const visible = isTechVisible(tech);
                  const sel = selectedTech && selectedTech.id === tech.id;
                  return (
                    <div key={tech.id}
                      className={`matrix-tech ${sel ? "selected" : ""} ${!visible ? "dimmed" : ""}`}
                      onClick={() => visible && setSelectedTech(sel ? null : tech)}>
                      <div className="matrix-tech-actor" style={{background: ACTOR_COLORS[tech.actorMin]}} />
                      <div className="matrix-tech-id">{tech.id}</div>
                      <div className="matrix-tech-name">{tech.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actor legend */}
      <div style={{display:"flex", gap:"1.5rem", marginTop:"1.5rem", flexWrap:"wrap"}}>
        <div style={{fontFamily:"var(--mono)", fontSize:"11px", color:"var(--text3)"}}>MIN. ACTOR TIER:</div>
        {[1,2,3].map(l => (
          <div key={l} style={{display:"flex", alignItems:"center", gap:"0.5rem"}}>
            <div style={{width:"8px", height:"8px", borderRadius:"50%", background:ACTOR_COLORS[l]}} />
            <span style={{fontFamily:"var(--mono)", fontSize:"11px", color:"var(--text2)"}}>{ACTOR_LABELS[l]}</span>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {selectedTech && activeTacticForTech && (
        <div className="detail-panel">
          <div className="detail-header">
            <div style={{flex:1}}>
              <div className="detail-id">{selectedTech.id}</div>
              <div className="detail-name">{selectedTech.name}</div>
              <div style={{marginTop:"0.75rem", display:"flex", gap:"0.5rem", flexWrap:"wrap", alignItems:"center"}}>
                <div className="actor-badge" style={{background: `${ACTOR_COLORS[selectedTech.actorMin]}18`, border: `1px solid ${ACTOR_COLORS[selectedTech.actorMin]}40`, color: ACTOR_COLORS[selectedTech.actorMin]}}>
                  Min. {ACTOR_LABELS[selectedTech.actorMin]}
                </div>
                {selectedTech.platform.map(p => <span key={p} className="platform-tag">{p}</span>)}
              </div>
            </div>
            <div style={{display:"flex", gap:"0.75rem", flexShrink:0}}>
              <button className="btn-secondary" style={{fontSize:"12px",padding:"0.4rem 1rem"}} onClick={() => goToTechnique(selectedTech, activeTacticForTech)}>Full Detail →</button>
              <button className="btn-secondary" style={{fontSize:"12px",padding:"0.4rem 1rem"}} onClick={() => setSelectedTech(null)}>✕</button>
            </div>
          </div>
          <div className="detail-body">
            <div>
              <div className="detail-section-title">Description</div>
              <div className="detail-desc">{selectedTech.desc}</div>
            </div>
            <div>
              <div className="detail-section-title">Sub-Techniques ({selectedTech.subs.length})</div>
              {selectedTech.subs.map((s, i) => (
                <div key={i} className="detail-sub">
                  <div className="detail-sub-dot" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TACTICS VIEW ─────────────────────────────────────────────────────────────
function TacticsView({ goToTactic }) {
  return (
    <div className="section" style={{paddingTop:"5rem"}}>
      <div className="section-header">
        <div className="section-label">All Tactics</div>
        <h2 className="section-title">Nine Tactical Phases</h2>
        <p className="section-desc">DARTA organizes adversarial behavior into nine ordered tactical phases, from initial reconnaissance through final impact.</p>
      </div>
      <div className="overview-grid">
        {TACTICS.map(t => (
          <div key={t.id} className="overview-card" onClick={() => goToTactic(t)} style={{"--card-color": t.color}}>
            <div style={{position:"absolute",left:0,top:0,bottom:0,width:"3px",background:t.color,borderRadius:"3px 0 0 3px"}} />
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.5rem"}}>
              <div className="overview-card-id">{t.id}</div>
              <div style={{fontFamily:"var(--mono)", fontSize:"11px", color:t.color, background:`${t.color}18`, border:`1px solid ${t.color}30`, padding:"0.15rem 0.5rem", borderRadius:"3px"}}>{t.techniques.length} tech.</div>
            </div>
            <div className="overview-card-name">{t.name}</div>
            <div className="overview-card-desc">{t.desc}</div>
            <div style={{marginTop:"1rem", fontFamily:"var(--mono)", fontSize:"10px", color:"var(--text3)"}}>
              {t.techniques.slice(0,3).map(tt => tt.id).join(" · ")} {t.techniques.length > 3 ? `+${t.techniques.length-3}` : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TACTIC DETAIL VIEW ───────────────────────────────────────────────────────
function TacticDetailView({ tactic, goBack, goToTechnique }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="tactic-page">
      <button className="back-btn" onClick={goBack}>← Back to Tactics</button>
      <div className="tactic-hero" style={{background:`${tactic.color}0D`, borderColor:`${tactic.color}30`}}>
        <div style={{fontFamily:"var(--mono)", fontSize:"13px", color:tactic.color, marginBottom:"0.5rem"}}>{tactic.id}</div>
        <h1 style={{fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:"800", color:"var(--text)", letterSpacing:"-0.02em", marginBottom:"1rem"}}>{tactic.name}</h1>
        <p style={{color:"var(--text2)", fontSize:"15px", lineHeight:"1.7", maxWidth:"700px"}}>{tactic.desc}</p>
        <div style={{marginTop:"1.5rem", fontFamily:"var(--mono)", fontSize:"12px", color:tactic.color}}>{tactic.techniques.length} techniques in this phase</div>
      </div>

      {tactic.techniques.map(tech => (
        <div key={tech.id} className="tech-card" onClick={() => setExpanded(expanded === tech.id ? null : tech.id)}>
          <div className="tech-card-header">
            <div>
              <div className="tech-card-id">{tech.id}</div>
              <div className="tech-card-name">{tech.name}</div>
            </div>
            <div style={{display:"flex", gap:"0.5rem", alignItems:"center", flexShrink:0}}>
              <div className="actor-badge" style={{background:`${ACTOR_COLORS[tech.actorMin]}18`, border:`1px solid ${ACTOR_COLORS[tech.actorMin]}40`, color:ACTOR_COLORS[tech.actorMin], fontSize:"11px"}}>
                L{tech.actorMin}+
              </div>
              {tech.platform.slice(0,2).map(p => <span key={p} className="platform-tag">{p}</span>)}
              <button onClick={e => { e.stopPropagation(); goToTechnique(tech, tactic); }} className="btn-secondary" style={{fontSize:"11px",padding:"0.3rem 0.7rem"}}>Detail →</button>
            </div>
          </div>
          <div className="tech-card-desc">{tech.desc}</div>
          {expanded === tech.id && (
            <div className="tech-subs">
              <div style={{fontFamily:"var(--mono)", fontSize:"10px", color:"var(--accent)", letterSpacing:"0.15em", marginBottom:"0.5rem"}}>SUB-TECHNIQUES</div>
              {tech.subs.map((s, i) => <div key={i} className="tech-sub">{s}</div>)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── TECHNIQUE DETAIL VIEW ────────────────────────────────────────────────────
function TechniqueDetailView({ tech, goBack, countermeasures }) {
  return (
    <div className="technique-page">
      <button className="back-btn" onClick={goBack}>← Back to {tech.tacticName}</button>
      <div style={{background:`${tech.tacticColor}0D`, border:`1px solid ${tech.tacticColor}30`, borderRadius:"16px", padding:"2.5rem", marginBottom:"2rem"}}>
        <div style={{fontFamily:"var(--mono)", fontSize:"12px", color:tech.tacticColor, marginBottom:"0.5rem"}}>{tech.tacticId} — {tech.tacticName}</div>
        <div style={{fontFamily:"var(--mono)", fontSize:"14px", color:"var(--accent)", marginBottom:"0.5rem"}}>{tech.id}</div>
        <h1 style={{fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:"800", color:"var(--text)", letterSpacing:"-0.02em", marginBottom:"1.5rem"}}>{tech.name}</h1>
        <p style={{color:"var(--text2)", fontSize:"15px", lineHeight:"1.8", marginBottom:"1.5rem"}}>{tech.desc}</p>
        <div style={{display:"flex", gap:"0.75rem", flexWrap:"wrap", alignItems:"center"}}>
          <div className="actor-badge" style={{background:`${ACTOR_COLORS[tech.actorMin]}18`, border:`1px solid ${ACTOR_COLORS[tech.actorMin]}40`, color:ACTOR_COLORS[tech.actorMin]}}>
            Min. {ACTOR_LABELS[tech.actorMin]}
          </div>
          {tech.platform.map(p => <span key={p} className="platform-tag">{p}</span>)}
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem", marginBottom:"2rem"}}>
        <div style={{background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"10px", padding:"1.5rem"}}>
          <div style={{fontFamily:"var(--mono)", fontSize:"10px", color:"var(--accent)", letterSpacing:"0.15em", marginBottom:"1rem"}}>SUB-TECHNIQUES ({tech.subs.length})</div>
          {tech.subs.map((s, i) => (
            <div key={i} style={{display:"flex", gap:"0.75rem", padding:"0.6rem 0", borderBottom:"1px solid var(--border)", alignItems:"flex-start"}}>
              <div style={{width:"5px", height:"5px", borderRadius:"50%", background:"var(--accent)", flexShrink:0, marginTop:"7px"}} />
              <span style={{fontSize:"14px", color:"var(--text2)", lineHeight:"1.5"}}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"10px", padding:"1.5rem"}}>
          <div style={{fontFamily:"var(--mono)", fontSize:"10px", color:"var(--green)", letterSpacing:"0.15em", marginBottom:"1rem"}}>APPLICABLE COUNTERMEASURES</div>
          {countermeasures.length > 0 ? countermeasures.map(cm => (
            <div key={cm.id} style={{padding:"0.75rem", background:"var(--bg3)", borderRadius:"6px", marginBottom:"0.75rem"}}>
              <div style={{fontFamily:"var(--mono)", fontSize:"11px", color:"var(--green)", marginBottom:"0.3rem"}}>{cm.id}</div>
              <div style={{fontSize:"13px", fontWeight:"700", color:"var(--text)", marginBottom:"0.4rem"}}>{cm.name}</div>
              <div style={{display:"flex", flexWrap:"wrap", gap:"0.3rem"}}>
                {cm.refs.map(r => <span key={r} className="cm-ref">{r}</span>)}
              </div>
            </div>
          )) : <div style={{fontSize:"13px", color:"var(--text3)"}}>No direct countermeasures mapped for this technique yet.</div>}
        </div>
      </div>
    </div>
  );
}

// ─── COUNTERMEASURES VIEW ─────────────────────────────────────────────────────
function CountermeasuresView() {
  const [selected, setSelected] = useState(null);
  return (
    <div className="section" style={{paddingTop:"5rem"}}>
      <div className="section-header">
        <div className="section-label">Defensive Controls</div>
        <h2 className="section-title">Countermeasures</h2>
        <p className="section-desc">Thirteen defensive controls mapped to NIST SP 800-53, DO-326A, ASTM F38, STANAG 4586, and regulatory frameworks including EU U-Space, NIS2, and the Cyber Resilience Act.</p>
      </div>
      <div className="cm-grid">
        {COUNTERMEASURES.map(cm => (
          <div key={cm.id} className="cm-card" onClick={() => setSelected(selected === cm.id ? null : cm.id)}
            style={selected === cm.id ? {borderColor:"rgba(16,185,129,0.4)", background:"rgba(16,185,129,0.05)"} : {}}>
            <div className="cm-card-header">
              <div className="cm-id">{cm.id}</div>
              <div className="cm-name">{cm.name}</div>
            </div>
            <div className="cm-desc">{cm.desc}</div>
            {selected === cm.id && (
              <div style={{marginBottom:"1rem"}}>
                <div style={{fontFamily:"var(--mono)", fontSize:"10px", color:"var(--accent)", letterSpacing:"0.15em", marginBottom:"0.5rem"}}>ADDRESSES TACTICS</div>
                <div style={{display:"flex", gap:"0.4rem", flexWrap:"wrap"}}>
                  {cm.tacticIds.map(tid => {
                    const t = TACTICS.find(tt => tt.id === tid);
                    return t ? <span key={tid} style={{fontFamily:"var(--mono)", fontSize:"11px", color:t.color, background:`${t.color}18`, border:`1px solid ${t.color}30`, padding:"0.2rem 0.6rem", borderRadius:"4px"}}>{tid} {t.name}</span> : null;
                  })}
                </div>
              </div>
            )}
            <div className="cm-refs">
              {cm.refs.map(r => <span key={r} className="cm-ref">{r}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ABOUT VIEW ───────────────────────────────────────────────────────────────
function AboutView() {
  return (
    <div className="section" style={{paddingTop:"5rem"}}>
      <div className="section-header">
        <div className="section-label">Framework</div>
        <h2 className="section-title">About DARTA</h2>
        <p className="section-desc">Drone Attack Research and Tactic Analysis by Giorgio Campiotti — an open-source TTP framework for the UAS cybersecurity community.</p>
      </div>
      <div className="about-grid">
        <div>
          <div className="about-card" style={{marginBottom:"1rem"}}>
            <div className="about-card-title">What is DARTA?</div>
            <div className="about-card-text">DARTA is a structured, open-source threat framework cataloging the adversarial Tactics, Techniques, and Procedures (TTPs) applicable to Unmanned Aerial Systems across civil, commercial, and military domains. It provides a common language for UAS security practitioners, operators, regulators, manufacturers, and red teams.</div>
          </div>
          <div className="about-card" style={{marginBottom:"1rem"}}>
            <div className="about-card-title">Who is it for?</div>
            <div className="about-card-text">Security engineers conducting UAS threat models, red teams scoping drone security assessments, standards bodies developing UAS cybersecurity regulations, manufacturers implementing security by design, and operators assessing their exposure across civil and military contexts.</div>
          </div>
          <div className="about-card">
            <div className="about-card-title">Disclaimer</div>
            <div className="about-card-text">DARTA is unclassified and released for research and educational purposes. Nothing herein constitutes authorization to perform offensive activities against UAS systems. DARTA is not affiliated with MITRE Corporation or The Aerospace Corporation.</div>
          </div>
        </div>
        <div>
          <div className="about-card" style={{marginBottom:"1rem"}}>
            <div className="about-card-title">Roadmap</div>
            <div className="about-card-text" style={{marginBottom:"1rem"}}>DARTA v0.1 establishes the foundational framework. Planned future versions:</div>
            {[
              {v:"v0.2", label:"Real-world incident validation — mapping of documented UAS security incidents to DARTA technique IDs"},
              {v:"v0.3", label:"Detection guidance — per-technique IoC and sensor data source guidance for C-UAS operators"},
              {v:"v0.4", label:"Directed energy and EW extension — complementing SPARTA coverage"},
              {v:"v1.0", label:"Community validated release — expert advisory board review and formal public release"},
            ].map(r => (
              <div key={r.v} style={{display:"flex", gap:"1rem", padding:"0.75rem 0", borderBottom:"1px solid var(--border)"}}>
                <div style={{fontFamily:"var(--mono)", fontSize:"12px", color:"var(--accent)", flexShrink:0, paddingTop:"2px"}}>{r.v}</div>
                <div style={{fontSize:"13px", color:"var(--text2)", lineHeight:"1.5"}}>{r.label}</div>
              </div>
            ))}
          </div>
          <div className="about-card">
            <div className="about-card-title">Download</div>
            <div className="about-card-text" style={{marginBottom:"1rem"}}>DARTA v0.1 is available as a structured Word document with complete tactics, techniques, countermeasures, regulatory landscape, and usage guide.</div>
            <a className="btn-primary" style={{width:"100%", display:"block", textAlign:"center", textDecoration:"none"}}
              href="https://raw.githubusercontent.com/Giorgiofox/darta/main/docs/DARTA_v0.1.pdf" download>
              ↓ Download DARTA v0.1 (.pdf)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
