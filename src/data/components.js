// Spacecraft Components Catalog for Project Orbital

export const COMPONENT_CATEGORIES = [
  { id: 'propulsion', name: 'PROPULSION', required: true, description: 'Generates thrust for trajectory correction and orbit insertion.' },
  { id: 'power', name: 'POWER GENERATION', required: true, description: 'Harvests solar energy or produces electrical power.' },
  { id: 'storage', name: 'POWER STORAGE', required: true, description: 'Maintains spacecraft operations during solar eclipses.' },
  { id: 'communication', name: 'COMMUNICATION', required: true, description: 'Downlinks telemetry, scientific data and uplinks commands.' },
  { id: 'instruments', name: 'SCIENTIFIC SUITE', required: false, description: 'Payload instruments required to achieve science objectives.' },
  { id: 'protection', name: 'SHIELDING & THERMAL', required: false, description: 'Protects critical hardware against radiation and vacuum thermal extremes.' },
  { id: 'navigation', name: 'GUIDANCE & COMPUTING', required: true, description: 'Autonomous attitude control and orbital navigation computation.' }
];

export const COMPONENTS = {
  // --- PROPULSION ---
  propulsion: [
    {
      id: 'prop_chemical',
      name: 'Bipropellant Chemical Engine',
      category: 'propulsion',
      type: 'chemical',
      cost: 45, // $M
      mass: 420, // kg dry
      fuelCapacityKg: 1200, // fuel mass provided
      isp: 325, // seconds (specific impulse)
      thrustN: 450, // N
      powerDraw: 35, // W (pumps & valving)
      powerGen: 0,
      reliability: 96, // %
      description: 'High thrust hypergolic bipropellant rocket engine. Capable of rapid, impulsive orbit insertion burns, but heavier fuel mass requirement.',
      statsHighlight: 'Isp: 325s | Rapid Burn Rate | High Reliability'
    },
    {
      id: 'prop_electric',
      name: 'Hall-Effect Electric Ion Thruster',
      category: 'propulsion',
      type: 'electric',
      cost: 75,
      mass: 220,
      fuelCapacityKg: 450, // xenon propellant
      isp: 2800, // seconds - ultra high efficiency!
      thrustN: 0.25,
      powerDraw: 650, // high electrical power consumption!
      powerGen: 0,
      reliability: 91,
      description: 'Ultra-high efficiency electrostatic xenon ion propulsion. Extremely high specific impulse allows massive fuel mass savings, but requires substantial continuous electrical wattage.',
      statsHighlight: 'Isp: 2,800s | 650W Power Demand | Low Fuel Mass'
    }
  ],

  // --- POWER GENERATION ---
  power: [
    {
      id: 'pwr_standard_solar',
      name: 'Standard Silicon Solar Wings',
      category: 'power',
      cost: 25,
      mass: 85,
      powerGen: 800, // Watts at 1 AU
      powerDraw: 0,
      efficiencyDegradationRate: 0.05,
      reliability: 95,
      description: 'Proven dual articulated photovoltaic panels. Adequate power generation for inner solar system missions; output drops at Mars distance.',
      statsHighlight: '800W @ 1 AU | Low Cost | Standard Durability'
    },
    {
      id: 'pwr_advanced_solar',
      name: 'Gallium-Arsenide (GaAs) Ultra-Flex Arrays',
      category: 'power',
      cost: 65,
      mass: 140,
      powerGen: 1850, // Watts at 1 AU
      powerDraw: 0,
      efficiencyDegradationRate: 0.02,
      reliability: 98,
      description: 'High-efficiency multi-junction GaAs solar arrays with circular folding deployment. Generates abundant power even under lower irradiance at Mars and asteroid orbits.',
      statsHighlight: '1,850W @ 1 AU | Superior Mars Irradiance Output'
    }
  ],

  // --- POWER STORAGE ---
  storage: [
    {
      id: 'stor_battery_standard',
      name: 'Standard Li-Ion Battery Pack',
      category: 'storage',
      cost: 15,
      mass: 60,
      capacityWattHours: 1200,
      powerDraw: 5,
      powerGen: 0,
      reliability: 94,
      description: 'Standard rechargeable energy buffer. Provides essential power during eclipse transitions and orientation adjustments.',
      statsHighlight: '1.2 kWh Storage | Lightweight'
    },
    {
      id: 'stor_battery_advanced',
      name: 'High-Density Solid-State Battery Bank',
      category: 'storage',
      cost: 35,
      mass: 110,
      capacityWattHours: 3500,
      powerDraw: 8,
      powerGen: 0,
      reliability: 98,
      description: 'Advanced solid-electrolyte battery with expanded thermal envelope and deep discharge tolerance for long shadow periods.',
      statsHighlight: '3.5 kWh Storage | Deep Thermal Stability'
    }
  ],

  // --- COMMUNICATION ---
  communication: [
    {
      id: 'comm_standard',
      name: 'Standard Medium-Gain X-Band Horn Antenna',
      category: 'communication',
      cost: 20,
      mass: 45,
      dataRateKbps: 64,
      rangeRating: 'Medium (Up to 1.5 AU)',
      maxRangeKm: 80000000,
      powerDraw: 60,
      powerGen: 0,
      reliability: 96,
      description: 'Omnidirectional and medium-gain communication system. Perfect for Lunar orbits and near-Earth space; throughput drops significantly at Mars.',
      statsHighlight: '64 kbps | 60W Power | 80M km Range'
    },
    {
      id: 'comm_highgain',
      name: 'Deep Space High-Gain 2.4m Parabolic Dish',
      category: 'communication',
      cost: 55,
      mass: 115,
      dataRateKbps: 1024,
      rangeRating: 'Deep Space (Up to 10 AU)',
      maxRangeKm: 500000000,
      powerDraw: 140,
      powerGen: 0,
      reliability: 97,
      description: 'High-gain steerable reflector dish utilizing Ka-band transmission. Enables high-bandwidth scientific downlinks across interplanetary distances with the Deep Space Network.',
      statsHighlight: '1,024 kbps | High-Bandwidth Telemetry'
    }
  ],

  // --- SCIENTIFIC INSTRUMENTS (Multiple can be selected) ---
  instruments: [
    {
      id: 'inst_camera',
      name: 'High-Resolution Multispectral Imager',
      shortKey: 'camera',
      category: 'instruments',
      cost: 45,
      mass: 55,
      powerDraw: 75,
      powerGen: 0,
      reliability: 95,
      scienceValue: 40,
      description: 'Sub-meter optical camera with 16 narrow-band filters. Essential for capturing high-definition terrain surface maps and optical navigation confirmation.',
      statsHighlight: 'Optical Imagery | +40 Science Potential'
    },
    {
      id: 'inst_spectrometer',
      name: 'Infrared & UV Absorption Spectrometer',
      shortKey: 'spectrometer',
      category: 'instruments',
      cost: 55,
      mass: 70,
      powerDraw: 90,
      powerGen: 0,
      reliability: 93,
      scienceValue: 50,
      description: 'Identifies chemical signatures, minerals, volatile compounds, and atmospheric methane traces through absorption spectrum analysis.',
      statsHighlight: 'Chemical Analysis | +50 Science Potential'
    },
    {
      id: 'inst_radar',
      name: 'Synthetic Aperture Ground-Penetrating Radar',
      shortKey: 'radar',
      category: 'instruments',
      cost: 50,
      mass: 85,
      powerDraw: 120,
      powerGen: 0,
      reliability: 94,
      scienceValue: 45,
      description: 'Penetrates planetary regolith up to 300 meters deep to detect subterranean ice sheets, lava tubes, and structural aquifers.',
      statsHighlight: 'Subsurface Profiling | +45 Science Potential'
    },
    {
      id: 'inst_radiation',
      name: 'Omnidirectional Particle & Radiation Detector',
      shortKey: 'radiation',
      category: 'instruments',
      cost: 30,
      mass: 35,
      powerDraw: 40,
      powerGen: 0,
      reliability: 97,
      scienceValue: 35,
      description: 'Monitors galactic cosmic ray flux, solar energetic particles (SEP), and planetary magnetospheric interaction zones.',
      statsHighlight: 'Cosmic Ray Telemetry | +35 Science Potential'
    }
  ],

  // --- PROTECTION & THERMAL ---
  protection: [
    {
      id: 'prot_thermal',
      name: 'Multi-Layer Thermal Insulation (MLI)',
      category: 'protection',
      cost: 20,
      mass: 50,
      powerDraw: 15, // electric heaters
      powerGen: 0,
      thermalShielding: 85, // %
      radiationShielding: 15, // %
      reliability: 98,
      description: 'Gold-mylar thermal blanket with active louvers and heating elements. Protects internal avionics against severe solar heating and eclipse freeze.',
      statsHighlight: '+85% Thermal Shielding | 15W Heaters'
    },
    {
      id: 'prot_radiation',
      name: 'Beryllium-Polyethylene Radiation Shielding',
      category: 'protection',
      cost: 40,
      mass: 140,
      powerDraw: 0,
      powerGen: 0,
      thermalShielding: 25,
      radiationShielding: 80, // %
      reliability: 99,
      description: 'Dense composite shielding protecting sensitive microprocessor electronics from single-event upsets caused by deep-space solar flares and Van Allen belts.',
      statsHighlight: '+80% Cosmic Ray Hardening | Prevents Glitches'
    }
  ],

  // --- NAVIGATION & GUIDANCE ---
  navigation: [
    {
      id: 'nav_star_tracker',
      name: 'Dual Autonomous Optical Star Trackers',
      category: 'navigation',
      cost: 30,
      mass: 25,
      powerDraw: 35,
      powerGen: 0,
      navAccuracyArcsec: 1.5,
      reliability: 96,
      description: 'Matches star constellations against an onboard stellar catalog to calculate spacecraft 3-axis orientation with arcsecond precision.',
      statsHighlight: '1.5" Precision Attitude Determination'
    },
    {
      id: 'nav_computer',
      name: 'Rad-Hardened Deep Space Flight Computer',
      category: 'navigation',
      cost: 50,
      mass: 40,
      powerDraw: 80,
      powerGen: 0,
      navAccuracyArcsec: 0.5,
      reliability: 99,
      description: 'Triple-modular redundant (TMR) fault-tolerant flight computer. Capable of real-time autonomous trajectory correction and event recovery.',
      statsHighlight: 'Triple-Redundant | High Autonomous Recovery'
    }
  ]
};

// Base Spacecraft Chassis / Bus stats
export const BASE_BUS = {
  name: 'Orion-Modular Deep Space Bus',
  mass: 380, // kg
  cost: 40, // $M
  basePowerDraw: 45, // W (avionics, bus telemetry)
  baseReliability: 98
};

