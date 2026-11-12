export type CosmicFilter = 'all' | 'nebulae' | 'stars' | 'dead_stars';

export interface CosmicEpoch {
  id: string;
  index: string;
  phase: string;
  timecode: string;
  title: string;
  subtitle: string;
  description: string;
  alignment: 'center' | 'left' | 'right';
  scrollRange: [number, number];
  expansionScaleLabel: string;
  metrics: {
    label: string;
    value: string;
  }[];
  objectFocus: {
    name: string;
    classification: string;
    composition: string;
    filterKey: CosmicFilter;
  };
}

export const COSMIC_EPOCHS: CosmicEpoch[] = [
  {
    id: 'singularity',
    index: '01',
    phase: 'SECTION 01 / 08 // PRE-IGNITION VOID',
    timecode: 'T = 0.000000 s',
    title: 'QUARK-GLUON PLASMA CORE',
    subtitle: 'A roiling 10³² K sphere of primordial liquid light suspended in absolute vacuum.',
    description:
      'Before cosmic inflation, all matter, nebula gas, future stars, and stellar remnants exist as an asymptotically free Quark-Gluon Plasma Core—a turbulent, zero-viscosity relativistic fluid laced with magnetic reconnection arcs. Scroll down to destabilize the core and trigger the 8-stage expansion.',
    alignment: 'center',
    scrollRange: [0.0, 0.125],
    expansionScaleLabel: '1.00 R₀ (CONFINED)',
    metrics: [
      { label: 'CORE TEMPERATURE', value: '1.42 × 10³² K (PLANCK)' },
      { label: 'ENERGY DENSITY', value: '10⁹⁴ g/cm³ (QGP)' },
      { label: 'STATE OF MATTER', value: 'COLOR-DECONFINED FLUID' },
    ],
    objectFocus: {
      name: 'Quark-Gluon Plasma Core',
      classification: 'Color-Deconfined Relativistic Fluid',
      composition: 'Free Up/Down/Strange Quarks & Gluon Flux Tubes',
      filterKey: 'all',
    },
  },
  {
    id: 'detonation',
    index: '02',
    phase: 'SECTION 02 / 08 // BIG BANG RUPTURE',
    timecode: 'T = +10⁻³⁶ s',
    title: 'CATACLYSMIC DETONATION',
    subtitle: 'The Quark-Gluon Plasma Core breaches critical confinement and detonates.',
    description:
      'Internal thermal and magnetic flux pressure breaches the Planck threshold. Relativistic gluon arcs rupture across the boiling plasma sphere as it explodes into an omnidirectional shockwave, hurling superheated primordial matter across space.',
    alignment: 'left',
    scrollRange: [0.125, 0.25],
    expansionScaleLabel: '10⁴ R₀ (BLAST FRONT)',
    metrics: [
      { label: 'BLAST VELOCITY', value: '0.9998 c (RELATIVISTIC)' },
      { label: 'CORE TEMPERATURE', value: '1.42 × 10³² K' },
      { label: 'SHOCKWAVE FRONT', value: 'RADIAL RUPTURE' },
    ],
    objectFocus: {
      name: 'Relativistic Shockwave Front',
      classification: 'Supersonic Cherenkov Blast Wave',
      composition: 'Superheated Quark-Gluon Plasma & Photons',
      filterKey: 'all',
    },
  },
  {
    id: 'plasma_shells',
    index: '03',
    phase: 'SECTION 03 / 08 // PRIMORDIAL FIREBALL',
    timecode: 'T = +10⁻⁶ s',
    title: 'PRIMORDIAL PLASMA WAVE',
    subtitle: 'Ionized shock shells and baryon-photon plasma race outward from ground zero.',
    description:
      'In the immediate aftermath of detonation, dense quark-gluon plasma streams and ionized radiation waves expand rapidly outward. Protons and neutrons forge the first atomic nuclei inside the expanding cosmic fireball.',
    alignment: 'right',
    scrollRange: [0.25, 0.375],
    expansionScaleLabel: '0.42 LIGHT YEARS',
    metrics: [
      { label: 'PLASMA DENSITY', value: '3.8 × 10¹⁴ g/cm³' },
      { label: 'THERMAL STATE', value: '10¹² K (QUARK-GLUON)' },
      { label: 'WAVE TRAJECTORY', value: 'OMNIDIRECTIONAL' },
    ],
    objectFocus: {
      name: 'Baryon-Photon Plasma Wave',
      classification: 'Ionized Primordial Radiation Shell',
      composition: 'Protons, Neutrons, Deuterium & Helium Nuclei',
      filterKey: 'nebulae',
    },
  },
  {
    id: 'recombination',
    index: '04',
    phase: 'SECTION 04 / 08 // COSMIC RECOMBINATION',
    timecode: 'T = +380,000 YRS',
    title: 'PRIMORDIAL GAS FILAMENTS',
    subtitle: 'The expanding blast wave cools enough for photons and neutral gas to decouple.',
    description:
      'As the explosion expands across deep space, temperatures drop below 3,000 K. Free electrons bind to nuclei, transforming the opaque fireball into vast, transparent cosmic filaments of primordial hydrogen and helium gas.',
    alignment: 'left',
    scrollRange: [0.375, 0.5],
    expansionScaleLabel: '84.0 MILLION LY',
    metrics: [
      { label: 'DECOUPLING TEMP', value: '2,970 K (CMB GLOW)' },
      { label: 'REDSHIFT INDEX', value: 'z ≈ 1,089' },
      { label: 'MATTER RATIO', value: '75% H / 25% He' },
    ],
    objectFocus: {
      name: 'Primordial Molecular Filaments',
      classification: 'Cooling Pre-Nebular Gas Webs',
      composition: 'Neutral Hydrogen (H I) & Primordial Helium',
      filterKey: 'nebulae',
    },
  },
  {
    id: 'nebulae',
    index: '05',
    phase: 'SECTION 05 / 08 // NEBULAR NURSERIES',
    timecode: 'T = +180,000,000 YRS',
    title: 'BILLOWING NEBULAE',
    subtitle: 'Ionized Hydrogen-Alpha and Oxygen-III clouds unfurl across the expanding void.',
    description:
      'Turbulent shock fronts sculpt the expanding gas into colossal emission and reflection nebulae. Glowing turquoise, magenta, and amber molecular pillars blossom across light-years, cradling high-density knots of collapsing dust.',
    alignment: 'right',
    scrollRange: [0.5, 0.625],
    expansionScaleLabel: '1.40 BILLION LY',
    metrics: [
      { label: 'EMISSION SPECTRA', value: 'H-α 656nm / O-III 501nm' },
      { label: 'NURSERY SPAN', value: '140.8 LIGHT YEARS' },
      { label: 'TURBULENCE INDEX', value: 'MACH 14.2 FILAMENTS' },
    ],
    objectFocus: {
      name: 'Ionized Emission Nebulae',
      classification: 'H II Regions & Molecular Dust Pillars',
      composition: 'Ionized Hydrogen, Oxygen-III & Cosmic Silicates',
      filterKey: 'nebulae',
    },
  },
  {
    id: 'protostars',
    index: '06',
    phase: 'SECTION 06 / 08 // STELLAR DAWN',
    timecode: 'T = +550,000,000 YRS',
    title: 'IGNITION OF FIRST SUNS',
    subtitle: 'Thermonuclear fusion ignites blue hypergiants and blazing protostellar cores.',
    description:
      'Inside the expanding nebular clouds, gravity crushes gas pockets until core temperatures surpass 10 million Kelvin. Brilliant Population III blue supergiants and young main-sequence stars ignite, bathing the expanding cosmos in starlight.',
    alignment: 'left',
    scrollRange: [0.625, 0.75],
    expansionScaleLabel: '9.80 BILLION LY',
    metrics: [
      { label: 'IGNITION THRESHOLD', value: '1.5 × 10⁷ K CORE' },
      { label: 'DOMINANT CLASS', value: 'O & B HYPERGIANTS' },
      { label: 'LUMINOSITY PEAK', value: '10⁶ × SOLAR OUTPUT' },
    ],
    objectFocus: {
      name: 'Blue Hypergiants & Protostars',
      classification: 'Population III & Early Main-Sequence Suns',
      composition: 'Proton-Proton & CNO Cycle Fusion Plasma',
      filterKey: 'stars',
    },
  },
  {
    id: 'galaxies',
    index: '07',
    phase: 'SECTION 07 / 08 // GALACTIC VORTICES',
    timecode: 'T = +6,200,000,000 YRS',
    title: 'SPIRAL STREAMS & GIANTS',
    subtitle: 'Thousands of golden suns and red supergiants sweep outward in spiral arms.',
    description:
      'Continued cosmic expansion stretches stellar nurseries into sweeping galactic streams. Main-sequence yellow suns, orange K-type giants, and swollen crimson supergiants orbit within vast rotating filaments as dark energy accelerates the expansion.',
    alignment: 'right',
    scrollRange: [0.75, 0.875],
    expansionScaleLabel: '46.5 BILLION LY',
    metrics: [
      { label: 'STELLAR SPECTRUM', value: 'O / B / A / F / G / K / M' },
      { label: 'HUBBLE FLOW', value: '67.4 km/s/Mpc' },
      { label: 'GALACTIC ARMS', value: '4 SPIRAL STREAMS' },
    ],
    objectFocus: {
      name: 'Main-Sequence & Red Supergiants',
      classification: 'Mature Stellar Populations',
      composition: 'Helium-to-Carbon & Heavy Element Nucleosynthesis',
      filterKey: 'stars',
    },
  },
  {
    id: 'dead_stars',
    index: '08',
    phase: 'SECTION 08 / 08 // STELLAR GRAVEYARD',
    timecode: 'T = +13,800,000,000 YRS',
    title: 'DEAD STARS, PULSARS & BLACK HOLES',
    subtitle: 'Relativistic black holes, spinning pulsars, neutron stars, and white dwarfs at the outer horizon.',
    description:
      'At the outermost frontier of the 8-stage expansion, exhausted massive stars collapse into relativistic black holes ringed by gravitationally lensed accretion disks and photon spheres, alongside rapidly spinning pulsars sweeping twin synchrotron beams across the void.',
    alignment: 'left',
    scrollRange: [0.875, 1.0],
    expansionScaleLabel: '93.0 BILLION LY',
    metrics: [
      { label: 'EVENT HORIZON', value: 'R_s = 2GM / c² (KERR)' },
      { label: 'PULSAR SPIN PERIOD', value: '1.39 MILLISECONDS' },
      { label: 'COSMIC HORIZON', value: '93.0 BILLION LY' },
    ],
    objectFocus: {
      name: 'Black Holes, Pulsars & White Dwarfs',
      classification: 'Kerr Black Holes, Accretion Disks & Degenerate Remnants',
      composition: 'Spacetime Singularities, Photon Spheres & Neutron Matter',
      filterKey: 'dead_stars',
    },
  },
];

export const FILTER_OPTIONS: { key: CosmicFilter; label: string; countLabel: string; dotColor: string }[] = [
  { key: 'all', label: 'All Cosmic Matter', countLabel: '100%', dotColor: '#f4f6ff' },
  { key: 'nebulae', label: 'Nebula Clouds', countLabel: '20 Clouds', dotColor: '#55d9f4' },
  { key: 'stars', label: 'Living Stars', countLabel: '32,000 Suns', dotColor: '#fde68a' },
  { key: 'dead_stars', label: 'Dead Stars & Black Holes', countLabel: '100 Remnants', dotColor: '#c084fc' },
];
