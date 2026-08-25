export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH' | 'EXTREME';

export interface TemperatureZone {
  id: string;
  name: string;
  type: 'Commercial' | 'Residential' | 'Industrial' | 'Greenery' | 'Transit' | 'Old City';
  temp: number;
  humidity: number;
  heatIndex: number;
  riskLevel: RiskLevel;
  riskScore: number;
  surfaceTemp: number;
  canopyCoverPercent: number;
  populationDensity: 'High' | 'Medium' | 'Low' | 'Ultra-Dense';
  sensorId: string;
  coordinates: { x: number; y: number; width?: number; height?: number };
  description: string;
  interventions: string[];
}

export interface HourlyForecastItem {
  time: string;
  temp: number;
  humidity: number;
  heatIndex: number;
  riskLevel: RiskLevel;
  riskScore: number;
}

export interface SmartAlertItem {
  id: string;
  cityId: string;
  cityName: string;
  severity: 'EXTREME' | 'HIGH' | 'WATCH' | 'INFO';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionableStep: string;
}

export interface RecommendationItem {
  id: string;
  category: 'Public Safety' | 'Energy' | 'Infrastructure' | 'Schools' | 'Emergency Response';
  title: string;
  description: string;
  urgency: 'Critical' | 'High' | 'Medium' | 'Preventative';
  affectedSector: string;
  actionSteps: string[];
}

export interface CityData {
  id: string;
  name: string;
  province: string;
  country: string;
  coords: { lat: number; lng: number };
  temperature: number;
  humidity: number;
  heatIndex: number;
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  measurementHeight: string; // e.g. "2m"
  dataResolution: string; // e.g. "20 min"
  lastUpdated: string; // e.g. "Live"
  trend: {
    current: number;
    previous: number;
    change: number;
    direction: 'rising' | 'falling' | 'stable';
    explanation: string;
  };
  contributions: {
    temperature: number; // percentage
    humidity: number;
    timeOfDay: number;
    recentTrend: number;
  };
  zones: TemperatureZone[];
  hourlyForecast: HourlyForecastItem[];
  dailyInsight: {
    text: string;
    whyItMatters: string;
    whatCitiesCanDo: string;
    whoShouldPrioritize: string;
  };
  alerts: SmartAlertItem[];
  recommendations: RecommendationItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
  isAi?: boolean;
}

export interface CustomScenarioInput {
  location: string;
  temperature: number;
  temperatureUnit: 'C' | 'F';
  humidity: number;
  exposure: 'direct_sun' | 'shaded' | 'indoor_uncooled' | 'indoor_ac' | 'vehicle' | 'high_asphalt';
  activityLevel: 'sedentary' | 'light_walking' | 'moderate_work' | 'heavy_labor' | 'athletics';
  vulnerableGroups: string[];
  environmentType: 'dense_urban' | 'industrial' | 'suburban' | 'rural_field' | 'coastal';
  durationHours: number;
}

export interface ExtremeAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'ADVISORY';
  title: string;
  description: string;
  urgencyAction: string;
}

export interface CustomScenarioResult {
  heatIndex: number;
  riskScore: number;
  riskLevel: RiskLevel;
  extremeAlerts: ExtremeAlert[];
  safeExposureLimit: string;
  hydrationRequirement: string;
  recommendations: {
    category: 'Immediate Safety' | 'Activity & Work' | 'Hydration & Health' | 'Vulnerable Protection' | 'Environment';
    title: string;
    action: string;
    urgency: 'Critical' | 'High' | 'Medium';
  }[];
  detailedAnalysis: string;
  source: string;
  timestamp: string;
  isAiConfigured?: boolean;
}
