# Platform Taxonomy

DARTA defines five platform categories that determine the applicability of individual techniques. Technique entries specify their platform scope using the shorthand labels defined below. A technique may apply to one or more categories. The special value "All" indicates that the technique is applicable across all platform categories without meaningful distinction.

---

## Category Definitions

### Consumer / Hobbyist UAS

**Shorthand**: `Consumer`

Commercial off-the-shelf drones designed for recreational or hobbyist use. These platforms are characterized by:

- Proprietary closed communication protocols (DJI OcuSync, Lightbridge; Autel SkyLink)
- Limited or no support for open autopilot firmware (ArduPilot, PX4)
- Remote ID capability required by regulation from 2024 onward in EU (Class C0/C1) and US (Part 89)
- Cloud-synchronized flight data via manufacturer mobile applications
- No hardware security mechanisms such as secure boot or hardware root of trust in typical production configurations
- Operator interface via smartphone application or proprietary remote controller

**Typical attack surface**: DJI SDK and protocol vulnerabilities, Remote ID bypass, video downlink interception, GPS spoofing, manufacturer cloud API.

**Representative platforms**: DJI Mini 4 Pro, DJI Air 3, Autel Evo Nano+, Parrot Anafi.

---

### Enterprise / Professional UAS

**Shorthand**: `Enterprise`

Higher-capability platforms designed for commercial operations including infrastructure inspection, precision agriculture, survey and mapping, public safety, and logistics. These platforms are characterized by:

- Open autopilot support (ArduPilot, PX4) or configurable datalinks alongside proprietary options
- Higher payload capacity enabling specialized sensor integration (multispectral, LiDAR, EO/IR, SAR)
- Longer endurance and BVLOS capability in many configurations
- Integration with enterprise fleet management software and cloud platforms
- Often connected to corporate IT infrastructure during docking, data offload, and maintenance
- Growing Remote ID and UTM integration requirements

**Typical attack surface**: Open autopilot vulnerabilities (MAVLink, parameter injection), GCS software vulnerabilities, fleet management API, payload data channels, companion computer interfaces.

**Representative platforms**: DJI Matrice 350 RTK, WingtraOne Gen II, Autel Dragonfish, Freefly Alta X, Zipline Platform 2.

---

### Military Tactical UAS

**Shorthand**: `Military`

Military-grade systems spanning Group 1 (hand-launched, under 20 lb) through Group 5 (large, MALE/HALE) categories per US DoD classification. These platforms are characterized by:

- Encrypted and authenticated datalinks (STANAG 4586 compliance for larger systems)
- Hardened GNSS receivers with anti-jam and anti-spoof capability in higher tiers
- Electronic warfare resistance measures for higher-value platforms
- Redundant communication pathways
- Formal airworthiness and software assurance processes (DO-178C level equivalents for many systems)
- Significant variation in security posture between Group 1-2 and Group 4-5 platforms

**Typical attack surface**: Group 1-2 platforms often use commercial components with limited hardening and are closer to Enterprise in their attack surface. Group 4-5 platforms present a more hardened target but have larger infrastructure footprints (satellite links, ground data terminals) introducing additional attack surface.

**Representative platforms**: AeroVironment RQ-11 Raven (Group 1), AeroVironment RQ-20 Puma (Group 2), General Atomics MQ-9 Reaper (Group 5), Textron Aerosonde (Group 3).

---

### GCS and UTM Infrastructure

**Shorthand**: `GCS` / `UTM`

Operator-side infrastructure including Ground Control Station software, operator workstations, fleet management platforms, and UAS Traffic Management (UTM) and U-Space service provider systems. These components are characterized by:

- Ground-based IT infrastructure with an enterprise or OT-like attack surface
- High-value target: compromise enables manipulation of all drones managed by the system
- UTM/U-Space systems handle safety-critical airspace deconfliction data
- Increasing API exposure as UTM systems federate and integrate with other UTM providers and ANSPs
- Often connected to operator enterprise networks, creating pivot opportunities

**Note**: GCS and UTM are listed as separate shorthand values in technique entries where the distinction is material (e.g., UTM API abuse applies specifically to UTM infrastructure rather than local GCS software).

**Representative software and platforms**: QGroundControl, Mission Planner, DJI FlightHub 2, Autel Enterprise Suite, Airmap, ANRA, Wing UTM, Altitude Angel.

---

### Swarm and Autonomous Systems

**Shorthand**: `Swarm`

Multi-UAS coordinated systems operating via mesh inter-drone communication, autonomous decision-making, and distributed task allocation without continuous human-in-the-loop control. These systems are characterized by:

- Inter-drone communication protocols (MAVLink 2, custom mesh, IEEE 802.11s adaptations)
- Distributed or elected leader-follower coordination architectures
- Onboard AI/ML inference for navigation, object detection, and coordination
- Reduced or absent real-time human operator oversight in fully autonomous modes
- Novel attack surface: swarm consensus manipulation and node-hopping attacks have no direct analog in single-drone or enterprise IT contexts

**Representative systems**: Intel Shooting Star (civil entertainment), DARPA OFFSET program (military), various defense industry swarm programs under development.

---

## Scope Assignment Conventions

Technique scope assignments follow these conventions:

- `All`: The technique is applicable across all five platform categories without requiring significant adaptation.
- A subset of categories: The technique is practically applicable to the listed categories. This does not imply immunity for unlisted categories; it indicates that the technique is not a primary threat for those platforms given their typical architecture and operational context.
- `Consumer / Enterprise`: Applies to commercially derived platforms typically using DJI, Autel, or open autopilot architectures.
- `Enterprise / Military`: Applies to more capable platforms with dedicated companion computers, specialized payloads, or higher-assurance communication systems.
- `GCS / UTM`: Applies to operator-side infrastructure rather than the airborne platform itself.
- `Swarm`: Applies specifically to multi-drone coordinated architectures; not applicable to single-drone operations.

Practitioners should treat scope assignments as guidance rather than hard constraints. A technique scoped to `Military` may become relevant to an `Enterprise` operator whose platform incorporates military-grade components, operates in a contested RF environment, or carries high-value payload data.
