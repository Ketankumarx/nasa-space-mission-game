# ORBITAL — The 3D Space Mission Simulator

> **Design. Launch. Explore. Discover.**  
> A playable, educational browser-based 3D aerospace mission simulator built for NASA Space Apps and competitive aerospace hackathons.

---

## 🚀 Overview

**ORBITAL** puts the player in the command seat of a space agency director. Design a deep-space scientific spacecraft, balance realistic aerospace engineering constraints (Delta-v, power budgets, communication link budgets, thermal shielding, and mass limits), select an orbital launch vehicle, execute a cinematic launch, navigate interplanetary space, resolve critical mid-flight anomalies, and perform remote sensing operations in destination orbit.

Built with **React 18**, **Three.js**, **Tailwind CSS**, and the **Web Audio API** for 100% offline, zero-asset-dependency reliability.

---

## 🛰️ Main Game Screens & Architecture

### **Screen A: Main Menu**
- Cinematic 3D Earth rendered in Three.js with realistic starfield, atmospheric Rayleigh rim scattering, and a modular scientific satellite orbiting on an inclination plane.
- Game navigation: **Start New Mission**, **Resume Saved Mission** (LocalStorage auto-detection), **Flight Directive & Tutorial**, and **Aerospace Encyclopedia**.
- Procedural audio engine with volume toggle and background telemetry ambient hum.

### **Screen B: Mission Selection**
Select between three distinct planetary exploration campaigns:
1. **Lunar Exploration (Artemis Horizon)** — *Standard (Level 1)*: Reach low polar lunar orbit, map permanently shadowed craters, and search for water-ice volatiles.
2. **Mars Expedition (Ares Odyssey)** — *Advanced (Level 2)*: Execute a 210-day interplanetary Hohmann transfer, navigate severe radiation, and compensate for a 57% solar power drop.
3. **Asteroid Research (Psyche Prospector)** — *Expert (Level 3)*: High Delta-v rendezvous (6,600 m/s) with a near-Earth asteroid to analyze primordial metallic composition.

### **Screen C: Mission Briefing Dossier**
- Detailed technical dossier showing distance (km), one-way communication latency, solar flux factor ($1/d^2$), primary and secondary scientific objectives, allocated budget, and environmental hazards.

### **Screen D: 3D Spacecraft Designer**
- Interactive CAD assembly bay with live 3D preview that dynamically updates as hardware is installed:
  - **Propulsion**: Bipropellant Chemical Engine vs. High-Efficiency Hall-Effect Xenon Ion Thruster.
  - **Power Generation**: Standard Silicon Solar Wings vs. Gallium-Arsenide (GaAs) Ultra-Flex Arrays.
  - **Power Storage**: Lithium-Ion Battery Packs vs. High-Density Solid-State Battery Banks.
  - **Communication**: Medium-Gain X-Band Horn vs. Deep Space High-Gain 2.4m Parabolic Dish.
  - **Scientific Instruments**: Multispectral Optical Camera, Infrared & UV Spectrometer, Ground-Penetrating Radar Sounder, and Omnidirectional Radiation Detector.
  - **Protection & Shielding**: Multi-Layer Thermal Insulation (MLI) and Beryllium-Polyethylene Radiation Shielding.
  - **Guidance & Computing**: Autonomous Star Trackers and Rad-Hardened Flight Computers.
- CAD controls: 3-axis rotation, zoom, wireframe structural inspection, and auto-rotation toggle.

### **Screen E: Real-Time Engineering Dynamics**
- Functional physics and resource kernel:
  - **Tsiolkovsky Rocket Equation**: $\Delta v = I_{sp} \cdot g_0 \cdot \ln(m_{wet} / m_{dry})$
  - **Power Balance**: Calculates power generation at Earth (1 AU) and drops irradiance at destination based on the Inverse Square Law ($I = I_0 / d^2$).
  - **Mass & Payload Capacity**: Tracks dry mass, propellant mass, and wet mass against launch vehicle limits.
  - **Link Budget**: Checks antenna range against destination distance.
  - **Live Constraint Validation**: Displays real-time warnings (e.g., power deficits at Mars, insufficient Delta-v) and blocks invalid configurations from proceeding.

### **Screen F: Launch Vehicle Integration**
- Three fictional rocket classes inspired by real-world vehicles:
  - **AeroLift Medium (Class-2)**: Falcon 9 / Atlas V class ($65M, 4,200 kg capacity, 98% reliability).
  - **Titan-Heavy (Class-3)**: Falcon Heavy / Delta IV Heavy class ($135M, 9,500 kg capacity, 95% reliability).
  - **Nova SuperHeavy (Class-4)**: Saturn V / SLS class ($260M, 22,000 kg capacity, direct high-energy injection bonus).
- Verifies wet mass compatibility and fiscal budget constraints.

### **Screen G: Cinematic 3D Launch Experience**
- Rocket on launchpad with gantry tower and umbilical arms.
- Precision 10-second countdown with procedural synthesizer audio beeps.
- Ignition sequence with flame cone, billowing dynamic smoke particles, and sub-bass engine roar.
- Atmospheric ascent with dynamic sky color fading from morning blue into space black.
- First-stage booster cutoff and staging separation at altitude.
- Live telemetry HUD: altitude (km), orbital velocity (m/s & km/h), propellant reserve (%), and flight regime.
- Fast-forward / skip insertion controls.

### **Screen H: 3D Interplanetary Space Journey**
- Interactive 3D heliocentric / planetocentric map displaying the Sun, Earth, destination planet, and elliptical Hohmann transfer trajectory curve.
- Spacecraft traversing along the orbital spline with dual camera modes (Spacecraft Follow Cam vs. Solar System Map).
- Mission timeline milestones (Trans-Injection, Midcourse Correction, Deep Space Cruise, Destination Orbit Insertion).

### **Screen I: In-Flight Mission Events**
- Realistic space anomalies during cruise:
  - **Coronal Mass Ejection (CME)**: High proton flux threatening avionics.
  - **Deep Space Network Comm Fade**: Antenna pointing drift requiring star tracker recalibration.
  - **Propulsion Feed Valve Thermal Drift**: Cold-welding anomaly requiring heater cycling.
  - **Opportunistic Asteroid Flyby**: Trade propellant reserves for high-value science data.
- Player decisions alter spacecraft health, fuel reserves, reliability, and scientific discoveries.

### **Screen J: Scientific Operations at Destination**
- Close orbital view of the detailed spinning planet (Moon, Mars, or Asteroid) with surface scanning reticles.
- Interactive experiment bay deploying equipped instruments:
  - *Optical Camera*: High-resolution surface mosaic imaging.
  - *Spectrometer*: Infrared absorption mineralogy & atmospheric gas analysis.
  - *Radar Sounder*: Subsurface dielectric ice profiling.
  - *Radiation Detector*: Solar wind & cosmic ray mapping.
- Real-time 3D scanning beam and strobe effects with telemetry audio pings.

### **Screen K: Mission Results & Performance Debrief**
- Composite mission evaluation:
  - **Final NASA Letter Grade**: A+, A, B, C, D, or F.
  - **Success Percentage**: Weighted calculation based on objectives, discoveries, fiscal efficiency, and spacecraft reliability.
  - **Confetti Celebration** for successful missions.
  - **Complete Flight Recorder Log** detailing every mission milestone.
  - **One-Click Export**: Download official NASA debrief `.txt` report.
  - Restart / redesign workflow.

---

## 📚 Aerospace Education & Tutorial

- **Aerospace Encyclopedia Modal**: Explains orbital mechanics, the Tsiolkovsky equation, Delta-v, power budgeting in deep space, free-space path loss, space radiation, and vacuum thermal control with KaTeX mathematical formulas.
- **Flight Directive Tutorial**: Interactive 6-step walkthrough for first-time players.

---

## 🛠️ Technology Stack

- **Frontend**: React 18
- **Build Tool**: Vite 5
- **3D Graphics**: Three.js (Procedural canvas textures for planets, stars, solar arrays, and foil — 0 external image dependencies)
- **Styling**: Tailwind CSS with custom aerospace cyber-HUD design system
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Audio Engine**: Procedural Web Audio API Synthesizer (custom oscillators, biquad filters, and noise generators)
- **Persistence**: Browser LocalStorage

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build for production (Vercel-ready)
npm run build

# 4. Preview production build
npm run preview
```

---

## 🌐 Deploy to Vercel

This repository is 100% pre-configured for instant deployment on [Vercel](https://vercel.com/):
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

