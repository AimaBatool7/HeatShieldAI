import { RiskLevel } from '../types';

export interface HeatRiskCalculationResult {
  heatIndex: number;
  riskLevel: RiskLevel;
  riskScore: number;
  explanation: string;
  recommendedActions: string[];
  contributions: {
    temperature: number;
    humidity: number;
    timeOfDay: number;
    recentTrend: number;
  };
}

/**
 * Calculates Heat Index in Celsius using the NOAA / Steadman regression formula.
 */
export function calculateHeatIndex(temperatureC: number, humidityPercent: number): number {
  const T = (temperatureC * 9) / 5 + 32; // Fahrenheit
  const RH = humidityPercent;

  // Simple formula if temp is low
  let HI_F = 0.5 * (T + 61.0 + (T - 68.0) * 1.2 + RH * 0.094);

  // If HI_F is >= 80F, apply full Rothfusz regression
  if (HI_F >= 80) {
    HI_F =
      -42.379 +
      2.04901523 * T +
      10.14333127 * RH -
      0.22475541 * T * RH -
      0.00683783 * T * T -
      0.05481717 * RH * RH +
      0.00122874 * T * T * RH +
      0.00085282 * T * RH * RH -
      0.00000199 * T * T * RH * RH;

    // Adjustments
    if (RH < 13 && T >= 80 && T <= 112) {
      const adj = ((13 - RH) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
      HI_F -= adj;
    } else if (RH > 85 && T >= 80 && T <= 87) {
      const adj = ((RH - 85) / 10) * ((87 - T) / 5);
      HI_F += adj;
    }
  }

  const HI_C = ((HI_F - 32) * 5) / 9;
  return Math.round(HI_C * 10) / 10;
}

/**
 * HeatShield AI Urban Heat Risk Engine
 * Inputs: Temperature (°C), Humidity (%), optional time of day (0-24), temperature delta/trend
 */
export function calculateHeatRisk(
  temperature: number,
  humidity: number,
  hourOfDay: number = 14,
  temperatureDelta: number = 2.0
): HeatRiskCalculationResult {
  const heatIndex = calculateHeatIndex(temperature, humidity);

  // Temperature baseline score (0 - 55 pts)
  // 25°C = 5pts, 35°C = 30pts, 45°C = 50pts, 50°C = 55pts
  let tempPoints = Math.max(0, Math.min(55, (temperature - 20) * 1.8));

  // Humidity wet-bulb stress contribution (0 - 25 pts)
  // Higher humidity inhibits sweat evaporation
  let humidityPoints = (humidity / 100) * 25;
  if (temperature > 36 && humidity > 50) {
    humidityPoints += 5; // compounding tropical-arid heat trap
  }

  // Solar & Time of Day modifier (0 - 10 pts)
  // Peak solar irradiance typically 12:00 - 16:30
  let timePoints = 4;
  if (hourOfDay >= 12 && hourOfDay <= 16) {
    timePoints = 10;
  } else if (hourOfDay >= 10 && hourOfDay <= 18) {
    timePoints = 7;
  } else {
    timePoints = 2;
  }

  // Trend acceleration factor (0 - 10 pts)
  let trendPoints = Math.max(0, Math.min(10, temperatureDelta * 2.5));

  // Total Risk Score (0 - 100)
  const totalScore = Math.min(100, Math.max(5, Math.round(tempPoints + humidityPoints + timePoints + trendPoints)));

  // Risk Classification
  let riskLevel: RiskLevel = 'LOW';
  let explanation = '';
  let recommendedActions: string[] = [];

  if (totalScore >= 80 || heatIndex >= 44 || temperature >= 43) {
    riskLevel = 'EXTREME';
    explanation = `Critical heat emergency. Heat index reached ${heatIndex}°C with rapid thermal accumulation. Prolonged outdoor exposure poses severe risk of heat stroke and cardiovascular strain.`;
    recommendedActions = [
      'Activate municipal emergency cooling centers across high-density zones',
      'Mandate suspension of outdoor physical labor between 11:30 AM and 4:30 PM',
      'Deploy mobile hydration units and misting stations along public transit routes',
      'Pre-cool municipal facilities to manage peak electrical transformer overload',
    ];
  } else if (totalScore >= 68 || heatIndex >= 39 || temperature >= 39) {
    riskLevel = 'VERY HIGH';
    explanation = `Dangerous heat conditions. High thermal stress index (${heatIndex}°C). Outdoor activities will quickly cause heat exhaustion and muscle cramping.`;
    recommendedActions = [
      'Issue citywide heat warnings via SMS and local broadcast systems',
      'Stagger construction and sanitation shift hours into early morning/night',
      'Ensure high-volume water supply and shaded rest stations for public markets',
      'Inspect electrical transmission sub-stations in dense commercial cores',
    ];
  } else if (totalScore >= 50 || heatIndex >= 34 || temperature >= 34) {
    riskLevel = 'HIGH';
    explanation = `Elevated heat stress. Unshaded areas and concrete corridors will trap significant radiant heat. Sensitive groups require immediate precaution.`;
    recommendedActions = [
      'Advise vulnerable populations (elderly, children) to remain indoors in shaded/cooled rooms',
      'Maintain regular electrolyte hydration and wear loose, breathable cotton garments',
      'Optimize air conditioning thermostats to 26°C to prevent sudden power surges',
    ];
  } else if (totalScore >= 30 || heatIndex >= 28 || temperature >= 28) {
    riskLevel = 'MODERATE';
    explanation = `Moderate heat load. Comfort decreases during direct midday sun. General population safe with adequate fluid replenishment.`;
    recommendedActions = [
      'Encourage continuous hydration throughout working hours',
      'Monitor children and athletic activities during direct sunlight',
    ];
  } else {
    riskLevel = 'LOW';
    explanation = `Safe thermal baseline. Ambient and radiant temperatures within comfortable physiological tolerance.`;
    recommendedActions = [
      'Routine municipal operations can proceed normally',
      'Standard civic hydration guidelines remain active',
    ];
  }

  // Calculate relative contribution percentages for the breakdown UI
  const sum = tempPoints + humidityPoints + timePoints + trendPoints || 1;
  const contributions = {
    temperature: Math.round((tempPoints / sum) * 100),
    humidity: Math.round((humidityPoints / sum) * 100),
    timeOfDay: Math.round((timePoints / sum) * 100),
    recentTrend: Math.round((trendPoints / sum) * 100),
  };

  return {
    heatIndex,
    riskLevel,
    riskScore: totalScore,
    explanation,
    recommendedActions,
    contributions,
  };
}
