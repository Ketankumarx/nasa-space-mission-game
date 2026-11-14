// Aerospace Education & Engineering Guide for Project Orbital

export const LEARN_TOPICS = [
  {
    id: 'orbital_mechanics',
    title: 'Orbital Mechanics & Hohmann Transfers',
    category: 'Astrodynamics',
    summary: 'How spacecraft move through space without falling back to Earth.',
    equation: 'v = \\sqrt{G \\cdot M / r}',
    content: `
### What is an Orbit?
An orbit is not a place where there is zero gravity. At the altitude of the International Space Station (400 km), Earth's gravitational pull is still roughly 90% as strong as it is on the ground! 

A satellite stays in orbit because it moves sideways so rapidly (approximately 7.8 km/s or 28,000 km/h) that as gravity pulls it downward toward Earth, the surface of the Earth curves away beneath it at the exact same rate. In the famous words of Douglas Adams, orbiting is essentially "throwing yourself at the ground and missing."

### Interplanetary Hohmann Transfer
To travel from Earth to another planet (like Mars), a spacecraft does not fly in a straight line. Instead, it enters an elliptical transfer orbit around the Sun called a **Hohmann Transfer Orbit**:
1. **Trans-Mars Injection (TMI)**: The spacecraft fires its engine in the direction of its Earth orbit, boosting its apoapsis (furthest point) out to the orbit of Mars.
2. **Coasting**: The probe coasts in free-fall around the Sun for about 7 to 9 months.
3. **Mars Orbit Insertion (MOI)**: Upon arrival, the spacecraft must fire its engine retrograde (backward) to slow down and allow Mars's gravity to capture it into orbit.
    `
  },
  {
    id: 'deltav_equation',
    title: 'Delta-V & The Tsiolkovsky Rocket Equation',
    category: 'Propulsion',
    summary: 'The universal currency of space travel and the tyranny of rocket mass.',
    equation: '\\Delta v = I_{sp} \\cdot g_0 \\cdot \\ln\\left(\\frac{m_{wet}}{m_{dry}}\\right)',
    content: `
### What is Delta-V (Δv)?
In spaceflight, distance is not measured in kilometers — it is measured in **Delta-v** (change in velocity, measured in meters per second). 

Every maneuver (escaping Earth, reaching the Moon, entering Mars orbit, changing orbital inclination) requires a specific amount of Delta-v. If your spacecraft does not have enough Delta-v in its propellant tanks, you will be physically unable to complete your mission.

### The Tyranny of the Rocket Equation
Konstantin Tsiolkovsky proved that because a rocket must carry its own fuel, every additional kilogram of fuel requires more fuel just to lift that fuel!
- $I_{sp}$ (Specific Impulse): The efficiency of the rocket engine in seconds. Chemical engines have $I_{sp} \\approx 300\\text{--}450\\text{ s}$; Ion thrusters have $I_{sp} > 2,500\\text{ s}$.
- $m_{wet}$: Total mass of spacecraft including full fuel tanks.
- $m_{dry}$: Mass of the spacecraft with empty fuel tanks.
- $\\ln$: Natural logarithm, meaning fuel requirements grow **exponentially** as needed Delta-v increases!
    `
  },
  {
    id: 'power_budget',
    title: 'Electrical Power & The Inverse Square Law',
    category: 'Power Systems',
    summary: 'Why solar panels shrink in effectiveness as you travel away from the Sun.',
    equation: 'I = \\frac{I_0}{d^2}',
    content: `
### The Power Budget
Every onboard computer, transmitter radio, star tracker and scientific camera consumes electrical power measured in Watts (W). 

If a spacecraft consumes more power than its solar arrays generate, the onboard batteries will slowly drain to zero. Once batteries are depleted, the spacecraft enters a cold, silent "dead-bus" state and cannot communicate with Earth.

### The Inverse Square Law of Solar Irradiance
Solar light spreads out in a sphere as it radiates from the Sun. Consequently, the power available to solar panels decreases with the **square of the distance ($d^2$)**:
- At **Earth (1.0 AU)**: Sunlight delivers $\\sim 1,361\\text{ W/m}^2$.
- At **Mars (1.52 AU)**: $1 / (1.52)^2 \\approx 0.43$. Solar panels produce **less than half** the power they make at Earth!
- In the **Asteroid Belt (2.7 AU)**: Solar flux drops to just **14%**. Deep space probes to Jupiter and beyond often must use nuclear thermal generators (RTGs) instead of solar panels.
    `
  },
  {
    id: 'comm_systems',
    title: 'Deep Space Communications & Path Loss',
    category: 'Telecommunications',
    summary: 'Talking across hundreds of millions of kilometers of interplanetary void.',
    equation: 'P_{rx} \\propto \\frac{P_{tx} \\cdot G_{tx} \\cdot G_{rx}}{\\lambda^2 \\cdot d^2}',
    content: `
### Communicating with Deep Space
Radio waves travel at the speed of light ($300,000\\text{ km/s}$).
- From the **Moon**: Signals take roughly $1.3\\text{ seconds}$ one-way.
- From **Mars**: Signals take between **4 to 22 minutes** to reach Earth depending on orbital positions! This means real-time joystick control from Earth is physically impossible. Spacecraft must be autonomous.

### Free-Space Path Loss
Radio signals diverge over distance. High-gain parabolic dish antennas focus radio energy into an extremely narrow beam directed toward NASA's Deep Space Network (giant 70-meter dish antennas located in California, Spain, and Australia). Without high-gain antennas, interplanetary data downlinks drop to a painful trickle of only a few bits per second.
    `
  },
  {
    id: 'space_radiation',
    title: 'Space Radiation & Electronic Hardening',
    category: 'Space Environment',
    summary: 'Cosmic rays, Van Allen belts, and single-event upsets.',
    equation: '\\text{Dose} = \\int \\Phi(E) \\cdot S(E) \\, dE',
    content: `
### The Hostile Cosmic Environment
Earth's atmosphere and magnetic field shield us from harmful cosmic rays. In interplanetary space, spacecraft are bombarded by:
1. **Galactic Cosmic Rays (GCRs)**: Ultra-relativistic atomic nuclei originating from distant supernovae.
2. **Solar Energetic Particles (SEP)**: Massive clouds of charged protons ejected during solar flares and coronal mass ejections.

### Single-Event Upsets (SEU)
When a high-energy heavy ion penetrates a microchip, it deposits electrical charge that can flip a digital bit from a 0 to a 1. This can cause computer reboots, memory corruption, or even permanent hardware burnouts ("latch-up"). Aerospace engineers use **rad-hardened microprocessors** and **triple-modular redundancy (TMR)**, where three identical computers calculate the same result and vote on the answer.
    `
  },
  {
    id: 'thermal_management',
    title: 'Vacuum Thermal Control & Insulation',
    category: 'Thermodynamics',
    summary: 'How to survive when one side of your ship is +120°C and the other is -150°C.',
    equation: 'Q = \\epsilon \\cdot \\sigma \\cdot A \\cdot (T^4 - T_{space}^4)',
    content: `
### Extreme Heat and Extreme Cold
In the vacuum of space, there is no air to conduct heat or produce convection currents. Heat can only be transferred through **radiation**:
- The sunlit side of a spacecraft can boil at over $+120^\\circ\\text{C}$.
- The shadow side facing dark space can freeze at $-180^\\circ\\text{C}$.

### Multi-Layer Insulation (MLI)
Those shiny gold and silver foil blankets wrapped around satellites are called **Multi-Layer Insulation (MLI)**. They consist of dozens of thin sheets of aluminized Mylar separated by fine scrim cloth in a vacuum, reflecting thermal infrared radiation and keeping internal scientific instruments at a comfortable, stable operating temperature.
    `
  }
];

