// Mission Data for Project Orbital

export const MISSIONS = [
  {
    id: 'lunar',
    title: 'LUNAR EXPLORATION',
    codename: 'ARTEMIS HORIZON',
    target: 'The Moon (Luna)',
    tagline: 'Establish high-resolution orbital reconnaissance and search for polar volatile ice deposits.',
    difficulty: 'STANDARD (LEVEL 1)',
    difficultyRating: 1,
    budget: 450, // Millions USD
    targetDistanceKm: 384400,
    travelDurationDays: 4,
    requiredDeltaV: 3950, // m/s (Trans-Lunar Injection + Lunar Orbit Insertion)
    solarFluxFactor: 1.0, // AU ~ 1.0
    communicationDelaySec: 1.3,
    description:
      'Enter a low 100km polar lunar orbit to map permanently shadowed craters at the south pole, verify water-ice signatures, and record far-side communications telemetry.',
    objectives: {
      primary: [
        { id: 'lunar_orbit', text: 'Achieve stable polar lunar orbit with Delta-v margin > 5%', reward: 35 },
        { id: 'lunar_radar', text: 'Map subsurface regolith ice using Ground Radar Sounder', reward: 35, requiredInstrument: 'radar' }
      ],
      secondary: [
        { id: 'lunar_photo', text: 'Capture ultra-high resolution photography of Shackleton Crater', reward: 15, requiredInstrument: 'camera' },
        { id: 'lunar_radiation', text: 'Measure cosmic ray and solar particle radiation in cis-lunar space', reward: 15, requiredInstrument: 'radiation' }
      ]
    },
    technicalChallenges: [
      'Precision Lunar Orbit Insertion (LOI) burn requirements',
      'Extreme thermal cycles in lunar shade (-180°C to +120°C)',
      'Communication occlusion when passing behind the lunar far side'
    ],
    rewards: {
      scientificPoints: 500,
      prestige: 'Pioneer Medal of Lunar Exploration',
      unlockBadge: 'MOON_EXPLORER'
    },
    visuals: {
      color: '#cbd5e1',
      planetRadius: 1.2,
      orbitRadius: 18,
      textureType: 'moon',
      glowColor: '#94a3b8'
    }
  },
  {
    id: 'mars',
    title: 'MARS EXPEDITION',
    codename: 'ARES ODYSSEY',
    target: 'Mars (The Red Planet)',
    tagline: 'Execute interplanetary Hohmann transfer to analyze the Martian atmosphere and geological history.',
    difficulty: 'ADVANCED (LEVEL 2)',
    difficultyRating: 2,
    budget: 780, // Millions USD
    targetDistanceKm: 225000000,
    travelDurationDays: 210,
    requiredDeltaV: 5700, // m/s (Trans-Mars Injection + Midcourse + Mars Orbit Insertion)
    solarFluxFactor: 0.43, // 1 / 1.52^2 - solar panels produce only 43% power at Mars!
    communicationDelaySec: 750, // ~12.5 minutes one way
    description:
      'A deep space interplanetary mission traversing 225 million kilometers. The spacecraft must survive severe deep space radiation belts, overcome solar power loss past Earth orbit, and perform autonomous orbit insertion.',
    objectives: {
      primary: [
        { id: 'mars_transfer', text: 'Complete 210-day interplanetary Hohmann transfer to Mars', reward: 30 },
        { id: 'mars_spectro', text: 'Perform infrared atmospheric spectroscopy detecting methane & vapor', reward: 40, requiredInstrument: 'spectrometer' }
      ],
      secondary: [
        { id: 'mars_camera', text: 'Capture multi-spectral orbital imagery of Valles Marineris & Olympus Mons', reward: 15, requiredInstrument: 'camera' },
        { id: 'mars_radar', text: 'Profile polar ice caps and underground aquifers using Radar Sounder', reward: 15, requiredInstrument: 'radar' }
      ]
    },
    technicalChallenges: [
      'Dramatic 57% decrease in solar irradiance at 1.52 AU (High power generation required)',
      '14-minute one-way speed-of-light communication latency requires autonomous navigation',
      'Long-duration micro-meteoroid and deep space cosmic ray exposure'
    ],
    rewards: {
      scientificPoints: 1200,
      prestige: 'Distinguished Interplanetary Commander',
      unlockBadge: 'RED_PLANET_VANGUARD'
    },
    visuals: {
      color: '#f97316',
      planetRadius: 1.8,
      orbitRadius: 32,
      textureType: 'mars',
      glowColor: '#ef4444'
    }
  },
  {
    id: 'asteroid',
    title: 'ASTEROID RESEARCH',
    codename: 'PSYCHE PROSPECTOR',
    target: 'Asteroid 101955 Bennu / Psyche',
    tagline: 'Rendezvous with a primordial near-Earth asteroid and analyze metallic & mineral composition.',
    difficulty: 'EXPERT (LEVEL 3)',
    difficultyRating: 3,
    budget: 620, // Millions USD
    targetDistanceKm: 140000000,
    travelDurationDays: 360,
    requiredDeltaV: 6600, // m/s (High delta-v for asteroid rendezvous & matching inclination)
    solarFluxFactor: 0.35,
    communicationDelaySec: 480,
    description:
      'Rendezvous with a low-gravity carbonaceous/metallic asteroid. Requires high specific impulse propulsion, robust navigation, and multi-spectral sensors to characterize primordial solar system building blocks.',
    objectives: {
      primary: [
        { id: 'ast_rendezvous', text: 'Perform precision orbital phasing and low-gravity rendezvous', reward: 35 },
        { id: 'ast_mineral', text: 'Analyze rare-earth metals and silicate spectral composition', reward: 35, requiredInstrument: 'spectrometer' }
      ],
      secondary: [
        { id: 'ast_surface_radar', text: 'Measure asteroid mass distribution and internal density via radar', reward: 15, requiredInstrument: 'radar' },
        { id: 'ast_radiation_field', text: 'Detect solar wind interaction and magnetic deflection anomalies', reward: 15, requiredInstrument: 'radiation' }
      ]
    },
    technicalChallenges: [
      'Immense Delta-v requirement (6,600 m/s) demanding high-efficiency propulsion',
      'Micro-gravity navigation requires high-precision star trackers and autonomous guidance',
      'Complex orbital plane inclination change maneuvers'
    ],
    rewards: {
      scientificPoints: 1600,
      prestige: 'Master of Deep Space Exploration',
      unlockBadge: 'ASTEROID_PROSPECTOR'
    },
    visuals: {
      color: '#a3a3a3',
      planetRadius: 1.0,
      orbitRadius: 25,
      textureType: 'asteroid',
      glowColor: '#737373'
    }
  }
];

