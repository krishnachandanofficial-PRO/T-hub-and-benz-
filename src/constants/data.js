export const APP_COLORS = {
  cyan: '#00F0FF',
  teal: '#00E5A3',
  obsidian: '#03070C',
  silver: '#C4B896',
  darkPanel: 'rgba(10,18,30,0.85)',
};

export const VEHICLE_DATA = {
  model: 'Mercedes-Benz EQS 580 4MATIC',
  socPercent: 84,
  rangeKm: 462,
  arrivalSocPercent: 36,
  speedKmh: 112,
  outsideTempC: 28,
  cabinTempC: 22,
  chargingPowerKw: 0,
  batteryCapacityKwh: 107.8,
};

export const ROUTE_DATA = {
  origin: 'Bengaluru (Silk Board)',
  destination: 'Hyderabad (Gachibowli)',
  totalKm: 568,
  remainingKm: 184,
  timeRemainingMin: 108,
  nextTurn: 'Bear Left to NH-48 Ultra-Fast Corridor',
  nextTurnKm: 3.8,
  nextChargingHub: 'KM-112 Express Plaza',
  nextChargingKm: 72,
  arrivalTime: '12:18 PM',
};

export const RANGE_TOGGLES = [
  {
    id: 'eco_ac',
    label: 'Turn Off Rear Cabin Climate / Eco-AC',
    addKm: 18,
    icon: 'Wind',
    color: '#00E5A3',
  },
  {
    id: 'aero',
    label: 'Engage Active Aero-Shutters & Lower Air Suspension',
    addKm: 24,
    icon: 'Zap',
    color: '#00F0FF',
  },
  {
    id: 'speed',
    label: 'Cap Highway Cruise Speed to 95 km/h',
    addKm: 31,
    icon: 'Gauge',
    color: '#00E5A3',
  },
  {
    id: 'display',
    label: 'Eco-Dim Passenger Hyperscreen & Seat Warmers',
    addKm: 9,
    icon: 'Monitor',
    color: '#00F0FF',
  },
];

export const AURA_SCORE_DATA = {
  ocpp: 0.97,
  velocity: 0.94,
  silentFail: 0.04,
  grid: 0.91,
  ratedKw: 120,
  actualKw: 118,
  unchargedWalkAways: 0,
  verifiedFastSessions: 16,
  primaryHub: 'KM-112 Express Plaza Hub A',
  backupHub: 'KM-120 Greenfield Hub B',
  backupKmAhead: 8.5,
  emergencyReservePercent: 15,
};

export const CHARGING_SLOT = {
  hub: 'KM-112 Express Plaza',
  bay: 'Bay #02',
  startTime: '11:30 AM',
  endTime: '11:50 AM',
  duration: 20,
  powerKw: 120,
  delayedStartTime: '11:42 AM',
  delayedEndTime: '12:02 PM',
};

export const LOUNGE_ORDER = {
  hub: 'Starbucks & Highway Artisan Lounge @ KM-112 Express Plaza',
  items: [
    { name: 'Double Espresso', price: 149 },
    { name: 'Butter Croissant', price: 89 },
    { name: 'Sparkling Water 500ml', price: 59 },
  ],
  arrivalEta: '11:28 AM',
  affiliatePercent: 12,
};

export const MOBILE_VAN_DATA = {
  etaMin: 9,
  deliverKwh: 40,
  vanId: 'MB-EV-POD-KA-07',
  operator: 'Mercedes-Benz Mobile Energy Services',
  gpsCoords: '13.0827° N, 77.5877° E',
  highway: 'NH-48, KM-184',
};

export const COMPETITOR_DATA = [
  { feature: 'Silent Offline Detection', eqAura: true, statiq: false, chargeZone: false, plugShare: false },
  { feature: 'True kW Derating Alerts', eqAura: true, statiq: false, chargeZone: true, plugShare: false },
  { feature: 'Dynamic Slot Locking', eqAura: true, statiq: true, chargeZone: false, plugShare: false },
  { feature: 'Mobile Van SOS Dispatch', eqAura: true, statiq: false, chargeZone: false, plugShare: false },
  { feature: 'OCPP 2.0.1 Live Telemetry', eqAura: true, statiq: true, chargeZone: true, plugShare: false },
  { feature: 'ETA-Synced Reservation', eqAura: true, statiq: false, chargeZone: false, plugShare: false },
];

export const ONBOARDING_STEPS = [
  {
    step: 1,
    title: 'The Luxury Cockpit',
    subtitle: 'Mercedes-Benz + Apple CarPlay Ultra',
    description:
      'Experience the fusion of Mercedes-Benz MBUX Hyperscreen intelligence and Apple CarPlay Ultra precision. The obsidian-black interface with bioluminescent accents provides instant situational awareness without cognitive load.',
    highlight: 'Left dock shows real-time 5G, EV status, and squircle app icons.',
    icon: 'Car',
    color: '#00F0FF',
  },
  {
    step: 2,
    title: '3D Volumetric Holographic Navigation',
    subtitle: 'Möbius Strip Wireframe FUI',
    description:
      'The centerpiece is a live Three.js WebGL Möbius strip wireframe with a glowing energy orb tracing your highway journey. Parametric math ($R + s\\cos(t/2)$) renders a continuous loop symbolizing range infinity — no dead ends.',
    highlight: 'Toggle the range-boosting vehicle systems in the floating HUD panel.',
    icon: 'Globe',
    color: '#00E5A3',
  },
  {
    step: 3,
    title: 'Aura Flow Serenity Indicator',
    subtitle: 'Zero-Panic Reliability Engine',
    description:
      'The calm breathing teal pill — "Aura Flow: 98.4% Serene" — hides a 4-layer mathematical reliability engine. Tap it to reveal OCPP live telemetry, kW derating guards, passive silent-station detection, and dual Plan-B buffer routing.',
    highlight: 'Tap the Aura Flow pill -> Deep Telemetry pop-up with animated formulas.',
    icon: 'Shield',
    color: '#00F0FF',
  },
  {
    step: 4,
    title: 'Smart Slot-Lock & ETA Sync',
    subtitle: 'Dynamic 20-Minute Charging Reservation',
    description:
      'Your 20-minute fast-charge slot at KM-112 Express Plaza Bay #02 is pre-locked to your live ETA. If highway traffic delays you, the reservation slides forward automatically via OCPI/UEI protocol — zero stress, zero rebooking.',
    highlight: 'Tap "Smart Slot-Lock" -> Simulate a +12 min traffic delay.',
    icon: 'Clock',
    color: '#00E5A3',
  },
  {
    step: 5,
    title: 'Rapid Assist Mobile EV Charging SOS',
    subtitle: 'Mercedes-Benz Mobile Energy Pod',
    description:
      'If you reach 0% battery or a station is offline, our autonomous Mercedes-Benz Mobile Energy Pod is dispatched to your exact highway GPS coordinates. ETA: 9 minutes. +40 kWh delivered. Calm voice assurance keeps the driver serene.',
    highlight: 'Tap the SOS icon or the Chaos Monkey button to simulate dispatch.',
    icon: 'Truck',
    color: '#FF6B35',
  },
  {
    step: 6,
    title: 'Judge Chaos Monkey & Business Deck',
    subtitle: 'Live Stress-Test & MBRDI Pitch',
    description:
      'The bottom control bar lets judges inject live scenarios: silent charger walkaway, 120kW to 22kW power derating, and 0% battery SOS. The Business Deck pop-up covers ICP, competitor matrix, and 4-stream revenue model with interactive calculators.',
    highlight: 'Open the Business Deck from the CarPlay sidebar briefcase icon.',
    icon: 'BarChart3',
    color: '#00F0FF',
  },
];

export const AI_CANNED_RESPONSES = [
  {
    triggers: ['ac', 'climate', 'air conditioning', 'cool', 'temperature'],
    response:
      'Switching off Rear Cabin Climate Control recovers **+18 km** of range. With the current SoC of 84% and 184 km remaining, your arrival SoC improves from 36% to **~42%**. I recommend enabling Eco-AC mode which maintains 24°C using 40% less energy.',
  },
  {
    triggers: ['charger broken', 'station offline', 'charger not working', 'broken', 'offline', 'malfunction'],
    response:
      'No stress. Aura Flow has pre-verified **Backup Hub B at KM-120 Greenfield** within your 15% reserve battery buffer. Your slot automatically transfers in ~8 seconds via OCPI 2.2.1. ETA impact: +4 minutes only. The driver is always covered.',
  },
  {
    triggers: ['speed', 'slow down', '95', 'cruise', 'limit'],
    response:
      'Capping cruise speed from 112 km/h to **95 km/h** recovers the most range: **+31 km**. Combined with Eco-AC and Aero-Shutters, you gain +73 km total, raising arrival SoC from 36% to **~52%**. Travel time increases by ~22 minutes.',
  },
  {
    triggers: ['range', 'how far', 'distance', 'km', 'battery'],
    response:
      'Current range: **462 km rated**, **184 km to Hyderabad**. You have **278 km buffer** today. Enable all 4 range-booster toggles and your arrival SoC jumps from 36% to **~58%**. You could skip the KM-112 stop entirely if preferred.',
  },
  {
    triggers: ['charge', 'charging', 'hub', 'plaza', 'station'],
    response:
      'Your pre-locked slot is **Bay #02, KM-112 Express Plaza, 11:30-11:50 AM** at 120kW. A Starbucks espresso pre-order is ready. Backup Hub B at KM-120 is Aura-verified at 118kW actual output. No phantom chargers in this corridor today.',
  },
  {
    triggers: ['sos', 'rapid assist', 'van', 'rescue', 'help', 'depleted', '0%'],
    response:
      'Mercedes-Benz Mobile Energy Pod **MB-EV-POD-KA-07** is on standby. In a 0% scenario, dispatch takes **<30 seconds** and the pod arrives in **9 minutes** delivering **+40 kWh** — enough to reach the nearest hub with 25% SoC. You are always supported.',
  },
  {
    triggers: ['aura', 'score', 'reliability', 'trust', 'assurance', 'serenity'],
    response:
      'Aura Flow is currently **98.4% Serene**. Formula: 0.35 * OCPP(0.97) + 0.30 * Velocity(0.94) + 0.25 * (1 - SilentFail)(0.96) + 0.10 * Grid(0.91) = **0.952** weighted score. Zero walk-aways in last 6 hours. 16 verified 120kW sessions at KM-112 today.',
  },
  {
    triggers: ['business', 'revenue', 'model', 'money', 'profit', 'investor'],
    response:
      'EQ Aura has 4 revenue streams: 1. B2C Slot Lock Fee ₹49-₹99/trip (or ₹299/mo subscription), 2. B2B CPO Roaming Commission 5-8% per kWh, 3. OEM/Fleet Telemetry API SaaS licensing, 4. Highway Lounge Commerce Affiliate 10-15%. At 50,000 highway trips/month, ARR exceeds ₹18 Cr.',
  },
  {
    triggers: ['competitor', 'statiq', 'chargezone', 'plugshare', 'compare'],
    response:
      'EQ Aura is the only platform with all 4 moats: Silent Offline Detection, True kW Derating Alerts, Dynamic Slot Locking, and Mobile Van SOS. Statiq has slot booking but no derating alerts. ChargeZone has basic kW display but no silent offline alerts. PlugShare is crowdsourced — unreliable for time-sensitive trips.',
  },
];

export const DEFAULT_AI_RESPONSE =
  'I am **MBUX Aura Concierge**, your highway intelligence companion. I can answer questions about range optimization, charging reliability, route adjustments, rapid assist protocols, and business metrics. What would you like to know?';
