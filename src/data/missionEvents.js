// Mission Events Catalog for Project Orbital (Screen I)

export const MISSION_EVENTS_POOL = [
  {
    id: 'solar_flare',
    title: 'CORONAL MASS EJECTION ENCOUNTER',
    phase: 'TRANSIT',
    icon: 'Sun',
    severity: 'HIGH',
    description:
      'Solar monitoring satellites alert of an unexpected X-class solar flare heading directly along our trajectory. A surge of high-energy protons is impinging upon spacecraft solar arrays and delicate avionics.',
    contextData: {
      fluxRate: '4,800 p/(cm²·s·sr)',
      radiationRisk: 'High single-event latchup probability'
    },
    choices: [
      {
        id: 'reorient_shield',
        label: 'Reorient Spacecraft Shielding Toward the Sun',
        description: 'Angle the bus to absorb the radiation pulse with thermal & radiation shielding. Requires thruster propellant and temporarily tilts solar arrays out of optimal sun-angle.',
        costDescription: '-40 kg Fuel | -15% Power for 24h',
        effects: {
          fuelDelta: -40,
          powerDamagePct: 0,
          reliabilityDelta: +2,
          sciencePoints: +25,
          log: 'Orientation maneuver executed. Shielding absorbed 94% of particle radiation without avionics corruption.'
        },
        requiresCheck: (craft) => craft.components.some(c => c.id === 'prot_radiation' || c.id === 'prot_thermal')
      },
      {
        id: 'safe_mode',
        label: 'Enter Safe-Mode & Power Down Non-Essential Payloads',
        description: 'Cut power to science payloads and computers to minimize electrical damage. Sacrifices continuous telemetry during storm transit.',
        costDescription: '-0 kg Fuel | Telemetry Gap (Zero Risk)',
        effects: {
          fuelDelta: 0,
          powerDamagePct: -4,
          reliabilityDelta: -1,
          sciencePoints: +5,
          log: 'Safe mode maintained spacecraft integrity. Systems rebooted nominally after particle front passed.'
        }
      },
      {
        id: 'measure_storm',
        label: 'Maintain Course and Record Particle Spectra',
        description: 'Keep instruments active to collect rare coronal mass ejection scientific data, risking electronic bit-flips.',
        costDescription: 'High risk to unshielded electronics | Big Science Reward',
        effects: {
          fuelDelta: 0,
          powerDamagePct: -10,
          reliabilityDelta: -6,
          sciencePoints: +65,
          log: 'Instruments gathered groundbreaking space weather data, though solar array efficiency suffered slight cell degradation.'
        }
      }
    ]
  },
  {
    id: 'comm_blackout',
    title: 'DEEP SPACE NETWORK COMM SIGNAL FADE',
    phase: 'MIDCOURSE',
    icon: 'Radio',
    severity: 'MEDIUM',
    description:
      'Downlink signal-to-noise ratio dropped below 4.2 dB. The spacecraft antenna gimbal is experiencing micro-stiction, causing slight pointing drift from Earth ground stations.',
    contextData: {
      snr: '3.8 dB (Marginal)',
      carrierLock: 'Intermittent'
    },
    choices: [
      {
        id: 'boost_power',
        label: 'Boost RF Transmitter Wattage to Maximum (Ka-Band Overdrive)',
        description: 'Deliver extra electrical wattage from the battery bank to the high-gain amplifier to overpower signal loss.',
        costDescription: '+80W Power Draw | Lowers Battery Margin',
        effects: {
          fuelDelta: 0,
          powerDamagePct: -5,
          reliabilityDelta: 0,
          sciencePoints: +15,
          log: 'Transmitter RF power boost locked deep space carrier signal. Continuous telemetry restored.'
        }
      },
      {
        id: 'autonomous_recal',
        label: 'Initiate Autonomous Star Tracker Re-Alignment',
        description: 'Run an onboard recalibration routine using star tracker quaternions to micro-step the antenna gimbal back to Earth center.',
        costDescription: 'Requires Star Tracker or Nav Computer | Zero Resource Cost',
        effects: {
          fuelDelta: -5,
          powerDamagePct: 0,
          reliabilityDelta: +3,
          sciencePoints: +20,
          log: 'Star tracker attitude lock completed. Gimbal pointing corrected to within 0.04 degrees.'
        },
        requiresCheck: (craft) => craft.components.some(c => c.category === 'navigation')
      },
      {
        id: 'buffer_data',
        label: 'Buffer Telemetry in Flash Memory and Wait for Earth Window',
        description: 'Stop real-time transmission and store all scientific packets in onboard solid-state memory until geometric alignment improves.',
        costDescription: 'Delayed telemetry uplink | +0 Resource Cost',
        effects: {
          fuelDelta: 0,
          powerDamagePct: 0,
          reliabilityDelta: -2,
          sciencePoints: +10,
          log: 'Data successfully buffered in flight storage. Downlinked after ground station handover.'
        }
      }
    ]
  },
  {
    id: 'fuel_valve_anomaly',
    title: 'PROPULSION FEED VALVE THERMAL DRIFT',
    phase: 'CRITICAL BURN PREP',
    icon: 'Flame',
    severity: 'HIGH',
    description:
      'Prior to the scheduled mid-course trajectory correction maneuver, pressure sensors in the propellant manifold register a 12% drop due to vacuum cold-welding tendencies on valve seats.',
    contextData: {
      manifoldPsi: '210 PSI (Nominal: 240 PSI)',
      valveTemp: '-45°C'
    },
    choices: [
      {
        id: 'cycle_heaters',
        label: 'Activate Line Heaters and Cycle Valve Duty Cycle',
        description: 'Warm the valve assembly to +15°C and cycle the solenoid in rapid pulses to break micro-ice seals.',
        costDescription: '-35W Heater Power for 3 hours',
        effects: {
          fuelDelta: -10,
          powerDamagePct: -3,
          reliabilityDelta: +4,
          sciencePoints: +10,
          log: 'Thermal pulse succeeded. Valve seals cleared and manifold pressure stabilized at 238 PSI.'
        }
      },
      {
        id: 'cold_gas_backup',
        label: 'Compensate with Reaction Control System (RCS) Verniers',
        description: 'Bypass the primary manifold and execute the burn using redundant attitude thrusters at longer burn duration.',
        costDescription: '-55 kg Propellant consumed due to lower efficiency',
        effects: {
          fuelDelta: -55,
          powerDamagePct: 0,
          reliabilityDelta: -3,
          sciencePoints: 0,
          log: 'RCS backup burn succeeded in maintaining transfer vector, but consumed additional propellant.'
        }
      }
    ]
  },
  {
    id: 'asteroid_opportunity',
    title: 'OPPORTUNISTIC NEAR-EARTH OBJECT FLYBY',
    phase: 'CRUISE',
    icon: 'Sparkles',
    severity: 'LOW',
    description:
      'Optical star trackers detect a previously uncharted 40-meter carbonaceous asteroid passing within 18,000 km of our flight trajectory. A modest delta-v burn could enable high-resolution flyby imagery.',
    contextData: {
      flybyDistance: '18,400 km',
      relativeVelocity: '4.2 km/s'
    },
    choices: [
      {
        id: 'flyby_burn',
        label: 'Execute Flyby Trajectory Adjustment Burn (25 m/s Delta-v)',
        description: 'Fire propulsion to close distance to 450 km for optical photography and infrared spectral scanning.',
        costDescription: '-30 kg Fuel | +80 Scientific Bonus Points',
        effects: {
          fuelDelta: -30,
          powerDamagePct: 0,
          reliabilityDelta: 0,
          sciencePoints: +80,
          log: 'Spectacular close-range flyby completed! New asteroid mineralogy cataloged by science instruments.'
        }
      },
      {
        id: 'long_range_camera',
        label: 'Capture Distant Telephoto Imagery Without Orbit Deviation',
        description: 'Keep current trajectory and utilize high-resolution optical zoom to image the body from current distance.',
        costDescription: 'Zero Propellant Cost | +25 Science Points',
        effects: {
          fuelDelta: 0,
          powerDamagePct: 0,
          reliabilityDelta: +1,
          sciencePoints: +25,
          log: 'Long-range images captured and downlinked. Trajectory remained 100% fuel-optimal.'
        },
        requiresCheck: (craft) => craft.components.some(c => c.id === 'inst_camera')
      },
      {
        id: 'ignore_opportunity',
        label: 'Maintain Mission Focus (Conserve Propellant)',
        description: 'Prioritize primary target objectives and preserve all reserves for final orbit insertion.',
        costDescription: 'Zero Cost | Zero Deviation',
        effects: {
          fuelDelta: 0,
          powerDamagePct: 0,
          reliabilityDelta: +1,
          sciencePoints: 0,
          log: 'Spacecraft maintained nominal cruise parameters toward primary mission destination.'
        }
      }
    ]
  }
];

