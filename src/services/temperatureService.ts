import { CityData, TemperatureZone, HourlyForecastItem, SmartAlertItem, RecommendationItem } from '../types';
import { calculateHeatRisk, calculateHeatIndex } from './heatRiskService';

/**
 * ============================================================================
 * REAL API ARCHITECTURE NOTE
 * ============================================================================
 * When integrating with the Hackathon Live Temperature Sensor / IoT Network:
 * 
 * 1. Set VITE_TEMPERATURE_API_URL or backend proxy endpoint in .env
 * 2. In getCityTemperature(cityId) and getTemperatureZones(cityId):
 *    Uncomment the fetch() block to consume the live 2m height IoT stream.
 * 3. The current implementation provides hyper-realistic data calibrated
 *    to historical climate profiles of Pakistani metropolitan zones.
 * ============================================================================
 */

export const CITIES_METADATA = [
  { id: 'multan', name: 'Multan', province: 'Punjab', country: 'Pakistan', baseTemp: 42, baseHumidity: 31, coords: { lat: 30.1575, lng: 71.5249 } },
  { id: 'lahore', name: 'Lahore', province: 'Punjab', country: 'Pakistan', baseTemp: 39, baseHumidity: 42, coords: { lat: 31.5204, lng: 74.3587 } },
  { id: 'karachi', name: 'Karachi', province: 'Sindh', country: 'Pakistan', baseTemp: 35, baseHumidity: 68, coords: { lat: 24.8607, lng: 67.0011 } },
  { id: 'islamabad', name: 'Islamabad', province: 'Federal Territory', country: 'Pakistan', baseTemp: 33, baseHumidity: 38, coords: { lat: 33.6844, lng: 73.0479 } },
  { id: 'faisalabad', name: 'Faisalabad', province: 'Punjab', country: 'Pakistan', baseTemp: 41, baseHumidity: 34, coords: { lat: 31.4504, lng: 73.135 } },
  { id: 'rawalpindi', name: 'Rawalpindi', province: 'Punjab', country: 'Pakistan', baseTemp: 36, baseHumidity: 40, coords: { lat: 33.5651, lng: 73.0169 } },
  { id: 'peshawar', name: 'Peshawar', province: 'Khyber Pakhtunkhwa', country: 'Pakistan', baseTemp: 39, baseHumidity: 36, coords: { lat: 34.0151, lng: 71.5249 } },
  { id: 'hyderabad', name: 'Hyderabad', province: 'Sindh', country: 'Pakistan', baseTemp: 43, baseHumidity: 33, coords: { lat: 25.396, lng: 68.3578 } },
];

function generateCityZones(cityName: string, baseTemp: number, baseHumidity: number, tempOffset: number = 0): TemperatureZone[] {
  const currentBase = baseTemp + tempOffset;

  const zoneTemplates = [
    {
      suffix: 'Old Walled City / Bazaar Core',
      type: 'Old City' as const,
      tempMod: +3.2,
      humMod: +4,
      surfaceMod: +9.5,
      canopy: 6,
      density: 'Ultra-Dense' as const,
      desc: 'Extremely narrow streets, high thermal mass brick buildings, severe lack of airflow and zero tree canopy.',
      interventions: ['Deploy mobile high-pressure mist cannons', 'Mandate canopy tarp shading across bazaar alleys', 'Install 4 public chilled water distribution points'],
      coords: { x: 48, y: 46, width: 22, height: 20 },
    },
    {
      suffix: 'Heavy Industrial & Power Corridor',
      type: 'Industrial' as const,
      tempMod: +4.1,
      humMod: -3,
      surfaceMod: +12.0,
      canopy: 4,
      density: 'High' as const,
      desc: 'Corrugated steel roofing, heavy generator thermal emissions, unshaded tarmac loading docks.',
      interventions: ['Apply high-albedo solar reflective white coating on rooftops', 'Stagger heavy machinery operating schedules away from 1-4 PM', 'Mandate 20-min hourly worker recovery breaks in cooled cabins'],
      coords: { x: 74, y: 24, width: 20, height: 26 },
    },
    {
      suffix: 'Central Commercial & High-Rise District',
      type: 'Commercial' as const,
      tempMod: +2.0,
      humMod: -1,
      surfaceMod: +7.8,
      canopy: 12,
      density: 'High' as const,
      desc: 'Significant HVAC waste heat expulsion, extensive dark asphalt parking lots, heavy vehicle idling.',
      interventions: ['Mandate commercial thermostat setpoint at 26°C', 'Activate reflective shade sails over outdoor parking lots', 'Encourage work-from-home or adjusted peak commute hours'],
      coords: { x: 30, y: 35, width: 20, height: 22 },
    },
    {
      suffix: 'Public Transit Terminal & Railway Hub',
      type: 'Transit' as const,
      tempMod: +2.4,
      humMod: +2,
      surfaceMod: +8.2,
      canopy: 8,
      density: 'High' as const,
      desc: 'Unsheltered passenger platforms, high metal surface heat, dense passenger bottlenecks.',
      interventions: ['Install overhead evaporative cooling fans on boarding platforms', 'Provide free ORS hydration kits at ticket gates', 'Deploy emergency medical first-responder bikes'],
      coords: { x: 22, y: 68, width: 24, height: 22 },
    },
    {
      suffix: 'Suburban Residential Townships',
      type: 'Residential' as const,
      tempMod: -0.8,
      humMod: +1,
      surfaceMod: +3.0,
      canopy: 24,
      density: 'Medium' as const,
      desc: 'Moderate residential density with scattered domestic gardens and standard concrete housing blocks.',
      interventions: ['Issue neighborhood heat advisories for vulnerable seniors', 'Establish public cooling shelter in community civic hall'],
      coords: { x: 62, y: 72, width: 28, height: 20 },
    },
    {
      suffix: 'Riverside Botanical & Green Belt',
      type: 'Greenery' as const,
      tempMod: -3.8,
      humMod: +7,
      surfaceMod: -4.5,
      canopy: 68,
      density: 'Low' as const,
      desc: 'Dense tree canopy and water body microclimate producing a strong local urban cooling oasis effect (-3.8°C cooler).',
      interventions: ['Designate as public natural cooling refuge', 'Extend park night illumination to allow safe evening community cooling'],
      coords: { x: 12, y: 15, width: 25, height: 24 },
    },
  ];

  return zoneTemplates.map((tpl, idx) => {
    const zoneTemp = Math.round((currentBase + tpl.tempMod) * 10) / 10;
    const zoneHum = Math.min(95, Math.max(15, Math.round(baseHumidity + tpl.humMod)));
    const zoneRisk = calculateHeatRisk(zoneTemp, zoneHum);

    return {
      id: `${cityName.toLowerCase()}-z${idx + 1}`,
      name: `${cityName} - ${tpl.suffix}`,
      type: tpl.type,
      temp: zoneTemp,
      humidity: zoneHum,
      heatIndex: zoneRisk.heatIndex,
      riskLevel: zoneRisk.riskLevel,
      riskScore: zoneRisk.riskScore,
      surfaceTemp: Math.round((zoneTemp + tpl.surfaceMod) * 10) / 10,
      canopyCoverPercent: tpl.canopy,
      populationDensity: tpl.density,
      sensorId: `HS-${cityName.slice(0, 3).toUpperCase()}-S0${idx + 1}`,
      coordinates: tpl.coords,
      description: tpl.desc,
      interventions: tpl.interventions,
    };
  });
}

function generateForecast(baseTemp: number, baseHumidity: number, tempOffset: number = 0): HourlyForecastItem[] {
  const hours = [
    { time: '11:00 AM', tempMod: -2.5, humMod: +5 },
    { time: '12:00 PM', tempMod: -0.5, humMod: +2 },
    { time: '01:00 PM', tempMod: +1.2, humMod: -2 },
    { time: '02:00 PM', tempMod: +2.8, humMod: -5 },
    { time: '03:00 PM', tempMod: +3.5, humMod: -6 },
    { time: '04:00 PM', tempMod: +2.1, humMod: -4 },
    { time: '05:00 PM', tempMod: +0.2, humMod: +1 },
    { time: '06:00 PM', tempMod: -1.8, humMod: +4 },
    { time: '07:00 PM', tempMod: -3.6, humMod: +8 },
  ];

  return hours.map((h, i) => {
    const temp = Math.round((baseTemp + tempOffset + h.tempMod) * 10) / 10;
    const humidity = Math.min(95, Math.max(15, Math.round(baseHumidity + h.humMod)));
    const hourNum = 11 + i;
    const risk = calculateHeatRisk(temp, humidity, hourNum, h.tempMod > 0 ? h.tempMod : 0);

    return {
      time: h.time,
      temp,
      humidity,
      heatIndex: risk.heatIndex,
      riskLevel: risk.riskLevel,
      riskScore: risk.riskScore,
    };
  });
}

function generateAlerts(cityName: string, riskLevel: string, temp: number): SmartAlertItem[] {
  const now = 'Just now';
  const alerts: SmartAlertItem[] = [];

  if (temp >= 42 || riskLevel === 'EXTREME') {
    alerts.push({
      id: `alert-1-${cityName}`,
      cityId: cityName.toLowerCase(),
      cityName,
      severity: 'EXTREME',
      title: `CRITICAL HEAT EMERGENCY: ${cityName}`,
      description: `Hyperlocal 2m sensors detected hazardous temperatures of ${temp}°C in commercial & industrial cores. High risk of hyperthermia.`,
      timestamp: now,
      read: false,
      actionableStep: 'Open municipal cooling shelters and suspend all non-essential outdoor work immediately.',
    });
  }

  if (temp >= 38 || riskLevel === 'VERY HIGH' || riskLevel === 'HIGH') {
    alerts.push({
      id: `alert-2-${cityName}`,
      cityId: cityName.toLowerCase(),
      cityName,
      severity: 'HIGH',
      title: `RAPID THERMAL SPIKE: ${cityName}`,
      description: `Afternoon solar radiation has driven heat index up by +3.2°C over the last 90 minutes. Power grid cooling demand surging.`,
      timestamp: '14 mins ago',
      read: false,
      actionableStep: 'Advise citizens to pre-cool living quarters and shift high-draw appliances away from peak window.',
    });
  }

  alerts.push({
    id: `alert-3-${cityName}`,
    cityId: cityName.toLowerCase(),
    cityName,
    severity: 'WATCH',
    title: `MICROCLIMATE DISPARITY WATCH`,
    description: `Urban Heat Island effect creating a +6.5°C temperature difference between Old City bazaar corridors and riverside green spaces.`,
    timestamp: '35 mins ago',
    read: true,
    actionableStep: 'Deploy water misting trucks to high-density commercial corridors.',
  });

  return alerts;
}

function generateRecommendations(cityName: string, temp: number, riskLevel: string): RecommendationItem[] {
  return [
    {
      id: 'rec-1',
      category: 'Public Safety',
      title: 'Rapid Deployment of Hydration & Misting Hubs',
      description: `Set up 15 urgent cooling pods in high-density walking corridors and bazaars across ${cityName}. Provide cold drinking water, electrolyte packets (ORS), and misting fans.`,
      urgency: temp >= 42 ? 'Critical' : 'High',
      affectedSector: 'Pedestrians, daily-wage laborers, elderly commuters',
      actionSteps: [
        'Coordinate with local municipal wards to position mobile water tankers',
        'Distribute wet towels and oral rehydration salts at transit junctions',
        'Deploy volunteer youth teams for active heat-exhaustion screening',
      ],
    },
    {
      id: 'rec-2',
      category: 'Energy',
      title: 'Power Grid Peak-Load Management & Pre-Cooling',
      description: 'Prepare for a 28% surge in cooling electricity load between 1:00 PM and 5:30 PM. Implement automated smart thermostat setpoint policies in government buildings.',
      urgency: temp >= 40 ? 'Critical' : 'High',
      affectedSector: 'Regional Electricity Distribution Companies (DISCOs) & commercial hubs',
      actionSteps: [
        'Pre-cool municipal and institutional buildings to 21°C before 11:00 AM, then hold at 26°C',
        'Temporarily throttle industrial heavy inductive loads during peak afternoon curve',
        'Station backup mobile diesel transformers at critical hospital feeders',
      ],
    },
    {
      id: 'rec-3',
      category: 'Infrastructure',
      title: 'Urban Heat Island Albedo & Shading Interventions',
      description: 'Prioritize unshaded asphalt streets and corrugated metal roofs that absorb and re-radiate intense solar heat back into human walking zones.',
      urgency: 'Medium',
      affectedSector: 'Municipal Works Department & Urban Development Authority',
      actionSteps: [
        'Deploy cool roof elastomeric coating subsidies for high-density residential blocks',
        'Erect temporary tensile shade canopies over open vegetable and fruit markets',
        'Spray water on major concrete arteries during peak noon hours to induce evaporative cooling',
      ],
    },
    {
      id: 'rec-4',
      category: 'Schools',
      title: 'Educational Schedule Adaptation & Transit Protection',
      description: 'Protect school-aged children by restricting outdoor athletic exposure and shifting classroom dismissal times to prevent travel during peak heat radiance.',
      urgency: temp >= 39 ? 'High' : 'Medium',
      affectedSector: 'Public & Private Schools, Daycares, Coaching Centers',
      actionSteps: [
        'Mandate 12:00 PM dismissal for morning shifts or switch to online afternoon sessions',
        'Strictly forbid unshaded outdoor physical drills or sports between 11 AM - 5 PM',
        'Ensure school water coolers are operational with shaded waiting sheds for parent pickups',
      ],
    },
    {
      id: 'rec-5',
      category: 'Emergency Response',
      title: 'Heatstroke Rapid Triage & Hospital Ice-Bath Capacity',
      description: `Equip district headquarter hospitals in ${cityName} with dedicated heat-illness stabilization bays and emergency rapid immersion tubs.`,
      urgency: temp >= 42 ? 'Critical' : 'High',
      affectedSector: 'Emergency Medical Services (Rescue 1122), District Hospitals',
      actionSteps: [
        'Stock emergency rooms with IV saline fluids, ice packs, and circulating cold-water mattresses',
        'Establish dedicated triage tents outside overcrowded emergency ward entrances',
        'Equip ambulances with instant thermoelectric cold packs and digital core thermometers',
      ],
    },
  ];
}

/**
 * Builds a complete CityData model for a city, with optional temperature offset (for simulation mode)
 */
export function buildCityData(cityMeta: typeof CITIES_METADATA[0], tempOffset: number = 0): CityData {
  const currentTemp = Math.round((cityMeta.baseTemp + tempOffset) * 10) / 10;
  const currentHumidity = cityMeta.baseHumidity;
  const riskResult = calculateHeatRisk(currentTemp, currentHumidity, 14, 2.5);
  const zones = generateCityZones(cityMeta.name, cityMeta.baseTemp, cityMeta.baseHumidity, tempOffset);
  const hourlyForecast = generateForecast(cityMeta.baseTemp, cityMeta.baseHumidity, tempOffset);
  const alerts = generateAlerts(cityMeta.name, riskResult.riskLevel, currentTemp);
  const recommendations = generateRecommendations(cityMeta.name, currentTemp, riskResult.riskLevel);

  return {
    id: cityMeta.id,
    name: cityMeta.name,
    province: cityMeta.province,
    country: cityMeta.country,
    coords: cityMeta.coords,
    temperature: currentTemp,
    humidity: currentHumidity,
    heatIndex: riskResult.heatIndex,
    riskLevel: riskResult.riskLevel,
    riskScore: riskResult.riskScore,
    measurementHeight: '2m',
    dataResolution: '20 min',
    lastUpdated: 'Live',
    trend: {
      current: currentTemp,
      previous: Math.round((currentTemp - 2.8) * 10) / 10,
      change: 2.8,
      direction: 'rising',
      explanation: `Temperature has risen by +2.8°C over the last 3 hours due to strong solar insolation and low wind velocity. Heat risk will peak between 2:30 PM and 4:00 PM.`,
    },
    contributions: riskResult.contributions,
    zones,
    hourlyForecast,
    dailyInsight: {
      text: `Afternoon temperatures in ${cityMeta.name} are ${currentTemp}°C, significantly exceeding seasonal baselines. Urban micro-zones with concrete density and low vegetation show up to +4.1°C additional thermal amplification.`,
      whyItMatters: `High heat combined with humidity prevents natural evaporative cooling through perspiration, accelerating physiological heat exhaustion within 25 minutes of active outdoor exposure.`,
      whatCitiesCanDo: `Activate municipal heat action protocols: open 24/7 public shaded cooling pavilions, deploy misting trucks across bazaar arteries, and enforce 26°C thermostat rules to avoid power brownouts.`,
      whoShouldPrioritize: `Outdoor daily laborers, construction workers, street vendors, delivery riders, elderly individuals, and pregnant women.`,
    },
    alerts,
    recommendations,
  };
}

/**
 * Service Methods
 */
export const temperatureService = {
  // Get list of all available city metadata
  getCities(): typeof CITIES_METADATA {
    return CITIES_METADATA;
  },

  // Get data for a specific city with an optional temperature simulation delta
  getCityTemperature(cityId: string, tempOffset: number = 0): CityData {
    // HACKATHON_INTEGRATION_POINT:
    // const response = await fetch(`/api/hackathon/sensors/city/${cityId}`);
    // return await response.json();

    const cityMeta = CITIES_METADATA.find((c) => c.id === cityId) || CITIES_METADATA[0];
    return buildCityData(cityMeta, tempOffset);
  },

  // Compare multiple cities
  compareCities(cityIds: string[], tempOffset: number = 0): CityData[] {
    return cityIds.map((id) => this.getCityTemperature(id, tempOffset));
  },

  // Retrieve zones for a city
  getTemperatureZones(cityId: string, tempOffset: number = 0): TemperatureZone[] {
    const data = this.getCityTemperature(cityId, tempOffset);
    return data.zones;
  },

  // Retrieve forecast for a city
  getTemperatureForecast(cityId: string, tempOffset: number = 0): HourlyForecastItem[] {
    const data = this.getCityTemperature(cityId, tempOffset);
    return data.hourlyForecast;
  },
};
