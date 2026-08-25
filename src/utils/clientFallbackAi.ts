import { CityData, CustomScenarioResult, RiskLevel } from '../types';

export interface CustomRiskFormInput {
  location: string;
  temperature: number;
  temperatureUnit: 'C' | 'F';
  humidity: number;
  exposure: string;
  activityLevel: string;
  vulnerableGroups: string[];
  environmentType: string;
  durationHours: number;
}

// Compute NOAA / Steadman Heat Index in Celsius
export function computeHeatIndexC(tempC: number, rhPct: number): number {
  const T = (tempC * 9) / 5 + 32;
  const R = rhPct;

  let HI = 0.5 * (T + 61.0 + (T - 68.0) * 1.2 + R * 0.094);

  if (HI >= 80) {
    HI =
      -42.379 +
      2.04901523 * T +
      10.14333127 * R -
      0.22475541 * T * R -
      0.00683783 * T * T -
      0.05481717 * R * R +
      0.00122874 * T * T * R +
      0.00085282 * T * R * R -
      0.00000199 * T * T * R * R;

    if (R < 13 && T >= 80 && T <= 112) {
      const adjustment = ((13 - R) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
      HI -= adjustment;
    } else if (R > 85 && T >= 80 && T <= 87) {
      const adjustment = ((R - 85) / 10) * ((87 - T) / 5);
      HI += adjustment;
    }
  }

  const hiC = ((HI - 32) * 5) / 9;
  return Math.round(hiC * 10) / 10;
}

export function computeClientCustomRisk(input: CustomRiskFormInput): CustomScenarioResult {
  const tempC = input.temperatureUnit === 'F' ? ((input.temperature - 32) * 5) / 9 : input.temperature;
  const rh = Math.max(5, Math.min(100, input.humidity));
  const heatIndex = computeHeatIndexC(tempC, rh);

  let riskScore = 40;
  if (heatIndex >= 54) riskScore = 96;
  else if (heatIndex >= 46) riskScore = 88;
  else if (heatIndex >= 40) riskScore = 78;
  else if (heatIndex >= 34) riskScore = 60;
  else riskScore = 38;

  if (input.exposure === 'direct_sun') riskScore += 6;
  if (input.exposure === 'high_asphalt') riskScore += 8;
  if (input.exposure === 'vehicle_cabin') riskScore += 10;
  if (input.exposure === 'ac_indoor') riskScore -= 28;

  if (input.activityLevel === 'heavy_labor') riskScore += 8;
  if (input.activityLevel === 'athletic') riskScore += 7;
  if (input.activityLevel === 'moderate_labor') riskScore += 4;

  if (input.vulnerableGroups.length > 0) {
    riskScore += Math.min(12, input.vulnerableGroups.length * 3);
  }

  if (input.durationHours >= 4) riskScore += 6;
  else if (input.durationHours >= 2) riskScore += 3;

  riskScore = Math.max(15, Math.min(100, Math.round(riskScore)));

  let riskLevel: RiskLevel = 'MODERATE';
  if (riskScore >= 90) riskLevel = 'EXTREME';
  else if (riskScore >= 78) riskLevel = 'VERY HIGH';
  else if (riskScore >= 60) riskLevel = 'HIGH';
  else if (riskScore >= 40) riskLevel = 'MODERATE';
  else riskLevel = 'LOW';

  const safeExposure =
    riskScore >= 90
      ? '10 - 15 minutes max before mandatory cooling'
      : riskScore >= 75
      ? '25 - 30 minutes in direct sun'
      : riskScore >= 55
      ? '45 - 60 minutes with continuous hydration'
      : 'Unrestricted with standard fluid intake';

  const hydration =
    riskScore >= 85
      ? '1.2 - 1.5 Liters/hour with ORS electrolytes'
      : riskScore >= 70
      ? '800ml - 1.0 Liter/hour with electrolyte replenishment'
      : '500ml - 750ml/hour';

  const extremeAlerts: CustomScenarioResult['extremeAlerts'] = [];

  if (heatIndex >= 50 || riskScore >= 85) {
    extremeAlerts.push({
      id: 'alt-stroke-danger',
      severity: 'CRITICAL',
      title: 'Imminent Heat Stroke & Hyperthermia Hazard',
      description: `At calculated Heat Index of ${heatIndex}°C with ${input.exposure.replace('_', ' ')} exposure, internal metabolic heat buildup outpaces dissipation, causing core body temperature to rapidly exceed 40°C.`,
      urgencyAction: 'Immediate cessation of strenuous activity and transfer to shaded/cooled sanctuary.',
    });
  }

  if (input.exposure === 'high_asphalt' || input.exposure === 'direct_sun') {
    extremeAlerts.push({
      id: 'alt-radiation-asphalt',
      severity: 'WARNING',
      title: 'Surface Re-Radiation Thermal Trap',
      description: `Pavement and asphalt thermal mass absorbs solar irradiance, re-emitting longwave infrared radiation that elevates microclimate temperatures 15°C–22°C above ambient air.`,
      urgencyAction: 'Wear insulated footwear, utilize reflective umbrellas, and avoid ground-level low-ventilation corridors.',
    });
  }

  if (input.vulnerableGroups.includes('elderly') || input.vulnerableGroups.includes('children')) {
    extremeAlerts.push({
      id: 'alt-vulnerable-protection',
      severity: 'CRITICAL',
      title: 'High-Vulnerability Demographic Strain',
      description: 'Children absorb radiant heat faster due to lower mass-to-surface ratios, while elderly individuals experience delayed thirst reflex and diminished vasodilation capacity.',
      urgencyAction: 'Keep high-risk individuals in actively cooled rooms (≤ 26°C) and provide chilled fluids every 20 minutes.',
    });
  }

  const recommendations: CustomScenarioResult['recommendations'] = [
    {
      category: 'Immediate Safety',
      title: 'Thermal Exposure Control',
      action: `Restrict outdoor transit and manual labor in ${input.location || 'this location'} during peak thermal hours (11:00 AM – 4:30 PM). Seek active air cooling immediately.`,
      urgency: (riskScore >= 75 ? 'Critical' : 'High') as 'Critical' | 'High',
    },
    {
      category: 'Hydration & Health',
      title: 'Electrolyte Replacement Protocol',
      action: `Maintain ${hydration}. Use Oral Rehydration Salts (ORS) or electrolyte solutions to prevent acute hypovolemic hyponatremia.`,
      urgency: 'Critical' as const,
    },
    {
      category: 'Activity & Work',
      title: 'Mandatory Active Rest Schedule',
      action:
        riskScore >= 80
          ? 'Enforce 15 minutes of work followed by 45 minutes of shaded recovery per hour.'
          : 'Enforce 30 minutes of work followed by 30 minutes of shaded recovery per hour.',
      urgency: 'High' as const,
    },
    {
      category: 'Environment',
      title: 'Radiation Shielding & Airflow',
      action: 'Utilize high-SPF UV shade tarps, wet cooling scarves, and ensure cross-ventilation in indoor quarters.',
      urgency: 'Medium' as const,
    },
  ];

  const detailedAnalysis = `### **HeatShield AI Microclimate & Physiological Assessment**

#### **1. Physiological Thermal Balance Mechanics**
At an ambient temperature of **${tempC}°C** and relative humidity of **${rh}%**, the effective **Heat Index is ${heatIndex}°C**. Because ambient temperatures approach or exceed human skin temperature (~35°C), the body cannot effectively lose heat via dry sensible radiation or convection. Under ${input.activityLevel.replace('_', ' ')} exertion, metabolic heat generation is high, making evaporative sweating the sole heat loss mechanism.

#### **2. Microclimate & Exposure Amplification**
- **Exposure Setting (${input.exposure.replace('_', ' ')}):** Under this environment, solar irradiance and thermal surface re-radiation significantly elevate the Mean Radiant Temperature ($MRT$).
- **Vulnerable Demographics:** Selected groups (${input.vulnerableGroups.join(', ') || 'General Public'}) face reduced physiological buffering, increasing the probability of heat syncope, exhaustion, or hyperthermic collapse.

#### **3. Operational Directives**
- **Safe Exposure:** Maximum continuous exposure should not exceed **${safeExposure}**.
- **Hydration Protocol:** Minimum intake of **${hydration}**.
- **Emergency Safeguard:** If symptoms of dizziness, confusion, or hot dry skin occur, initiate rapid evaporative cooling with cold water and seek medical aid immediately.`;

  return {
    heatIndex,
    riskScore,
    riskLevel,
    extremeAlerts,
    safeExposureLimit: safeExposure,
    hydrationRequirement: hydration,
    recommendations,
    detailedAnalysis,
    source: 'HeatShield Client AI Engine (Offline/Static Mode)',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isAiConfigured: true,
  };
}

export function generateClientAdvisorReply(query: string, city: CityData): string {
  const q = query.toLowerCase();

  if (q.includes('grid') || q.includes('power') || q.includes('electricity') || q.includes('transformer')) {
    return `### HeatShield Operational Briefing: Power Grid & Energy Resilience for ${city.name}
**Telemetry:** ${city.temperature}°C Ambient | ${city.humidity}% RH | **${city.heatIndex}°C Heat Index (Feels Like)** | Risk Level: **${city.riskLevel} (${city.riskScore}/100)**

Extreme thermal loads directly reduce distribution transformer efficiency and increase electrical line impedance. To prevent localized blackout cascades in ${city.name}:

1. **Mandatory Commercial Thermostat Setpoint at 26°C:** Enforce an emergency thermostat cap across all shopping centers, corporate buildings, and municipal offices to immediately reduce peak cooling load by 15–20%.
2. **Industrial Load Shifting:** Transition heavy industrial energy consumers to off-peak night shifts (11:00 PM – 06:00 AM) to preserve daytime residential reserves.
3. **Substation Thermal Management:** Deploy mobile mist cannons and forced-air cooling at high-load substations feeding hotspot commercial zones.`;
  }

  if (q.includes('worker') || q.includes('labor') || q.includes('construction') || q.includes('outdoor')) {
    return `### Labor Safety & Occupational Protocol for ${city.name}
**Telemetry:** ${city.temperature}°C Ambient | ${city.heatIndex}°C Heat Index | Risk Score: **${city.riskScore}/100**

Outdoor workers face severe risk of exertional heat illness under current microclimate conditions:

1. **Shift Schedule Revision:** Halt heavy physical labor between **11:00 AM and 4:30 PM**. Reschedule strenuous tasks to early morning (05:30 AM – 09:30 AM).
2. **Work-Rest Cycles:** Implement a strict **20-minute shaded rest break for every 40 minutes of moderate activity**.
3. **Electrolyte Supply:** Provide chilled water mixed with ORS (Oral Rehydration Salts) at all active work sites—plain water alone risks acute dilutional hyponatremia under high sweat rates.
4. **Buddy-System Monitoring:** Pair workers to continuously watch for early signs of cognitive slowing, ataxia, or cessation of sweating.`;
  }

  if (q.includes('school') || q.includes('child') || q.includes('kid')) {
    return `### School & Child Safety Advisory for ${city.name}
**Current Risk:** ${city.riskLevel} (${city.riskScore}/100) | Heat Index: ${city.heatIndex}°C

Children absorb radiant heat more rapidly than adults and have lower sweat rates:

1. **Cancel Outdoor Activities:** Suspend all outdoor physical education, sports matches, and midday playground recess.
2. **Classroom Thermal Comfort:** Move classes from uninsulated top-floor rooms to shaded ground-floor spaces; ensure ceiling fans and cross-ventilation are operating.
3. **Early Dismissal Protocol:** Dismiss students before the peak 12:30 PM solar radiation window if schools lack active air conditioning.
4. **Mandatory Hydration Intervals:** Ring school hydration bells every 30 minutes requiring students to drink at least 150ml of clean fluids.`;
  }

  return `### HeatShield Climate Intelligence Briefing for ${city.name}
**Live Telemetry:** ${city.temperature}°C Ambient (2m AGL) | ${city.humidity}% Humidity | **${city.heatIndex}°C Heat Index**  
**Risk Status:** **${city.riskLevel}** (${city.riskScore}/100) — *${city.riskScore >= 75 ? 'Immediate Action Required' : 'Elevated Vigilance'}*

#### Key Recommendations for ${city.name}:
- **Public Health:** Activate municipal hydration points and air-conditioned cooling sanctuaries near high-density transit corridors.
- **Hydration Protocol:** Maintain a minimum intake of 800ml–1.2L per hour with electrolyte replenishment for anyone outdoors.
- **Urban Hotspots:** Prioritize mobile cooling mist cannons in concrete-heavy commercial zones where surface temperatures exceed 55°C.
- **Medical Emergency:** Any individual exhibiting confusion, slurred speech, or loss of consciousness must be cooled rapidly with ice/cold water and transferred to emergency medical care (1122 / Edhi) immediately.`;
}
