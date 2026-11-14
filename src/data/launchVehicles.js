// Launch Vehicle Catalog for Project Orbital
// Inspired by real-world launch vehicle classes (Falcon 9/Heavy, Atlas V, Vulcan, Saturn V/SLS)

export const LAUNCH_VEHICLES = [
  {
    id: 'lv_medium',
    name: 'AeroLift Medium (Class-2)',
    realWorldInspiration: 'Falcon 9 / Atlas V 401 class',
    cost: 65, // $M
    payloadCapacityKg: 4200, // to GTO / escape trajectory
    reliability: 98, // %
    performanceRating: 'NOMINAL',
    maxFairingDiameterMeters: 4.0,
    fairingVolumeM3: 75,
    stages: 2,
    fuelType: 'RP-1 / Liquid Oxygen (Kerolox)',
    description:
      'Economical, reliable two-stage medium-lift launch vehicle with re-usable booster heritage. Ideal for compact lunar probes and lightweight interplanetary probes.',
    advantages: ['Lowest launch cost', 'Highest flight heritage (98% reliability)'],
    limitations: ['Limited to 4,200 kg total spacecraft wet mass']
  },
  {
    id: 'lv_heavy',
    name: 'Titan-Heavy (Class-3)',
    realWorldInspiration: 'Falcon Heavy / Delta IV Heavy class',
    cost: 135,
    payloadCapacityKg: 9500,
    reliability: 95,
    performanceRating: 'SUPERIOR',
    maxFairingDiameterMeters: 5.2,
    fairingVolumeM3: 145,
    stages: 2,
    fuelType: 'Cryogenic Liquid Hydrogen / LOX & Kerolox',
    description:
      'Triple-core heavy-lift workhorse capable of placing heavy scientific payloads onto high-energy trans-Mars and asteroid transfer trajectories.',
    advantages: ['High payload capacity (9,500 kg)', 'Accommodates complex multi-instrument suites'],
    limitations: ['Significant cost addition ($135M)']
  },
  {
    id: 'lv_superheavy',
    name: 'Nova SuperHeavy (Class-4)',
    realWorldInspiration: 'Saturn V / SLS Block 1B class',
    cost: 260,
    payloadCapacityKg: 22000,
    reliability: 94,
    performanceRating: 'MAXIMUM INSERTION ENERGY',
    maxFairingDiameterMeters: 8.4,
    fairingVolumeM3: 380,
    stages: 3,
    fuelType: 'Solid Rocket Boosters + Hydrolox Core Stage',
    description:
      'Monolithic super heavy-lift rocket with an exploration upper stage. Imparts high initial injection velocity, drastically reducing interplanetary transit times.',
    advantages: ['Massive 22,000 kg capacity', 'Direct injection reduces spacecraft onboard Delta-v demand by 400 m/s'],
    limitations: ['Highest cost ($260M) - requires ample mission budget']
  }
];

