import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  Thermometer, 
  Droplets, 
  Sun, 
  Clock, 
  Users, 
  Activity, 
  CheckCircle2, 
  Copy, 
  Check, 
  RefreshCw, 
  Zap, 
  AlertOctagon, 
  ArrowRight,
  Info,
  ShieldCheck,
  HeartPulse,
  Building2,
  Car,
  Umbrella,
  Compass
} from 'lucide-react';
import { CustomScenarioInput, CustomScenarioResult, ExtremeAlert, RiskLevel } from '../types';

interface AiCustomRiskAnalyzerProps {
  currentCityName?: string;
  defaultTemp?: number;
  defaultHumidity?: number;
}

const PRESET_SCENARIOS = [
  {
    title: '☀️ Outdoor Construction Labor',
    location: 'Jacobabad, Sindh',
    temp: 47,
    humidity: 38,
    exposure: 'direct_sun' as const,
    activityLevel: 'heavy_labor' as const,
    vulnerableGroups: ['outdoor_workers'],
    environmentType: 'industrial' as const,
    durationHours: 4,
  },
  {
    title: '🏫 School Afternoon Dismissal',
    location: 'Lahore, Punjab',
    temp: 42,
    humidity: 50,
    exposure: 'high_asphalt' as const,
    activityLevel: 'light_walking' as const,
    vulnerableGroups: ['children'],
    environmentType: 'dense_urban' as const,
    durationHours: 1.5,
  },
  {
    title: '👵 Elderly Resident (Non-AC Room)',
    location: 'Multan, Punjab',
    temp: 40,
    humidity: 55,
    exposure: 'indoor_uncooled' as const,
    activityLevel: 'sedentary' as const,
    vulnerableGroups: ['elderly', 'cardiovascular'],
    environmentType: 'dense_urban' as const,
    durationHours: 6,
  },
  {
    title: '🚗 Traffic Warden / Delivery Rider',
    location: 'Karachi, Sindh',
    temp: 39,
    humidity: 68,
    exposure: 'high_asphalt' as const,
    activityLevel: 'moderate_work' as const,
    vulnerableGroups: ['outdoor_workers'],
    environmentType: 'coastal' as const,
    durationHours: 5,
  },
];

export const AiCustomRiskAnalyzer: React.FC<AiCustomRiskAnalyzerProps> = ({
  currentCityName = 'Multan',
  defaultTemp = 42,
  defaultHumidity = 35,
}) => {
  const [formData, setFormData] = useState<CustomScenarioInput>({
    location: currentCityName,
    temperature: defaultTemp,
    temperatureUnit: 'C',
    humidity: defaultHumidity,
    exposure: 'direct_sun',
    activityLevel: 'heavy_labor',
    vulnerableGroups: ['outdoor_workers', 'elderly'],
    environmentType: 'dense_urban',
    durationHours: 2,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CustomScenarioResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Quick temperature conversion display helper
  const tempFahrenheit = Math.round((formData.temperature * 9) / 5 + 32);

  const handleApplyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setFormData({
      location: preset.location,
      temperature: preset.temp,
      temperatureUnit: 'C',
      humidity: preset.humidity,
      exposure: preset.exposure,
      activityLevel: preset.activityLevel,
      vulnerableGroups: preset.vulnerableGroups,
      environmentType: preset.environmentType,
      durationHours: preset.durationHours,
    });
  };

  const toggleVulnerableGroup = (group: string) => {
    setFormData((prev) => {
      const exists = prev.vulnerableGroups.includes(group);
      return {
        ...prev,
        vulnerableGroups: exists
          ? prev.vulnerableGroups.filter((g) => g !== group)
          : [...prev.vulnerableGroups, group],
      };
    });
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/gemini/analyze-custom-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }

      const data: CustomScenarioResult = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error('Custom risk analysis error:', err);
      setErrorMsg(
        err?.message || 'Unable to connect to Gemini AI. Please check server status and retry.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAnalysis = () => {
    if (!result) return;
    const summary = `HeatShield AI Risk Assessment for ${formData.location}
Temperature: ${formData.temperature}°C | Humidity: ${formData.humidity}% | Perceived Heat Index: ${result.heatIndex}°C
AI Risk Level: ${result.riskLevel} (Score: ${result.riskScore}/100)
Safe Exposure Limit: ${result.safeExposureLimit}
Hydration Requirement: ${result.hydrationRequirement}

Alerts:
${result.extremeAlerts.map((a) => `- [${a.severity}] ${a.title}: ${a.description}`).join('\n')}

Recommendations:
${result.recommendations.map((r) => `- ${r.title} (${r.category} - ${r.urgency}): ${r.action}`).join('\n')}

Detailed Assessment:
${result.detailedAnalysis}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskColor = (level: RiskLevel | string) => {
    switch (level) {
      case 'EXTREME':
      case 'CRITICAL':
        return {
          bg: 'bg-rose-950/70',
          border: 'border-rose-600',
          text: 'text-rose-400',
          badge: 'bg-rose-900 text-rose-200 border-rose-700 animate-pulse',
        };
      case 'VERY HIGH':
        return {
          bg: 'bg-orange-950/70',
          border: 'border-orange-600',
          text: 'text-orange-400',
          badge: 'bg-orange-900 text-orange-200 border-orange-700',
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-950/70',
          border: 'border-amber-600',
          text: 'text-amber-400',
          badge: 'bg-amber-900 text-amber-200 border-amber-700',
        };
      case 'MODERATE':
        return {
          bg: 'bg-yellow-950/70',
          border: 'border-yellow-600',
          text: 'text-yellow-400',
          badge: 'bg-yellow-900 text-yellow-200 border-yellow-700',
        };
      default:
        return {
          bg: 'bg-emerald-950/70',
          border: 'border-emerald-600',
          text: 'text-emerald-400',
          badge: 'bg-emerald-900 text-emerald-200 border-emerald-700',
        };
    }
  };

  return (
    <section id="custom-risk-analyzer" className="py-8 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-md shadow-cyan-500/20">
              <HeartPulse className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  AI Heat Risk & Scenario Analyzer
                </h2>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-gradient-to-r from-cyan-950 to-blue-950 text-cyan-300 border border-cyan-700/60 shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Gemini AI Powered
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Simulate any custom location, microclimate condition, and exposure scenario to generate instant medical-grade heat safety intelligence and alerts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Scenarios Pill Bar */}
      <div className="mb-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Quick Scenario Presets:
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Click any scenario to auto-fill telemetry parameters
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PRESET_SCENARIOS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-left px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800/80 hover:border-cyan-500/40 text-xs text-slate-200 transition-all flex flex-col justify-between group shadow-sm"
            >
              <span className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {preset.title}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-between">
                <span>{preset.location}</span>
                <span className="font-mono text-cyan-400 font-semibold">{preset.temp}°C · {preset.humidity}% RH</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Form & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Scenario Input Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                Scenario Parameters
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                2m Microclimate Model
              </span>
            </div>

            {/* 1. Location Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Target Location / City:
                </span>
                <span className="text-[11px] font-normal text-slate-400">e.g. Jacobabad, Multan, Karachi</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter city, district or zone..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
              />
            </div>

            {/* 2. Temperature & Humidity Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Temperature */}
              <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                    Ambient Temp:
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-300">
                    {formData.temperature}°C <span className="text-[10px] text-slate-500">({tempFahrenheit}°F)</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="55"
                  step="0.5"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>20°C</span>
                  <span>35°C</span>
                  <span>45°C</span>
                  <span>55°C</span>
                </div>
              </div>

              {/* Relative Humidity */}
              <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    Humidity:
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {formData.humidity}% RH
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  step="1"
                  value={formData.humidity}
                  onChange={(e) => setFormData({ ...formData, humidity: parseInt(e.target.value, 10) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>10%</span>
                  <span>40%</span>
                  <span>70%</span>
                  <span>95%</span>
                </div>
              </div>

            </div>

            {/* 3. Solar / Exposure Condition */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Exposure & Microclimate Condition:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'direct_sun', label: '☀️ Direct Sun', desc: 'No shade' },
                  { id: 'shaded', label: '⛱️ Shaded Area', desc: 'Canopy cover' },
                  { id: 'indoor_uncooled', label: '🏢 Indoor (No AC)', desc: 'Fan only' },
                  { id: 'indoor_ac', label: '❄️ Indoor (AC)', desc: 'Climate controlled' },
                  { id: 'vehicle', label: '🚗 Vehicle Cabin', desc: 'Thermal entrapment' },
                  { id: 'high_asphalt', label: '🛣️ Asphalt Corridor', desc: 'High albedo drop' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, exposure: item.id as any })}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                      formData.exposure === item.id
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-slate-100">{item.label}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Physical Activity Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                Physical Activity Level:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'sedentary', label: 'Sedentary / Rest', sub: 'Low metabolic rate' },
                  { id: 'light_walking', label: 'Walking / Commute', sub: 'Moderate steps' },
                  { id: 'moderate_work', label: 'Manual Work', sub: 'Outdoor vendor' },
                  { id: 'heavy_labor', label: 'Heavy Labor', sub: 'Construction/farming' },
                  { id: 'athletics', label: 'Athletic Sports', sub: 'High exertion' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, activityLevel: item.id as any })}
                    className={`p-2 rounded-xl text-left border transition-all text-xs ${
                      formData.activityLevel === item.id
                        ? 'bg-indigo-950/80 border-indigo-400 text-indigo-200 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="text-slate-100">{item.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Vulnerable Demographics (Multi-select) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  Vulnerable Demographics Present:
                </span>
                <span className="text-[10px] text-slate-500">Select all that apply</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'elderly', label: 'Elderly (65+)' },
                  { id: 'children', label: 'Infants & Children' },
                  { id: 'outdoor_workers', label: 'Outdoor Laborers' },
                  { id: 'pregnant', label: 'Pregnant Individuals' },
                  { id: 'cardiovascular', label: 'Cardiovascular Illness' },
                  { id: 'pets', label: 'Livestock & Pets' },
                ].map((v) => {
                  const selected = formData.vulnerableGroups.includes(v.id);
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => toggleVulnerableGroup(v.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center space-x-1.5 ${
                        selected
                          ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500 shadow-sm font-semibold'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${selected ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                      <span>{v.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Exposure Duration */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Continuous Exposure Duration:
                </label>
                <span className="text-xs font-mono font-bold text-cyan-300">
                  {formData.durationHours} Hours
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0.5, 1, 2, 4, 6].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setFormData({ ...formData, durationHours: dur })}
                    className={`py-1.5 rounded-xl text-xs font-mono border transition-all ${
                      formData.durationHours === dur
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {dur}h
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Processing with Gemini AI Engine...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Analyze Heat Risk with Gemini AI</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: AI Analysis Results & Extreme Heat Alerts (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {errorMsg && (
            <div className="bg-rose-950/80 border border-rose-700/80 rounded-2xl p-4 text-rose-200 text-xs flex items-start space-x-3 shadow-lg">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">AI Generation Alert</p>
                <p>{errorMsg}</p>
                <button
                  onClick={handleAnalyze}
                  className="mt-2 px-3 py-1 bg-rose-800 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
                >
                  Retry Analysis
                </button>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="h-full min-h-[420px] bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 shadow-inner">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <div className="max-w-md space-y-1.5">
                <h3 className="text-base font-bold text-white">
                  Ready to Simulate & Evaluate Custom Heat Scenarios
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Adjust temperature, humidity, exposure, and activity parameters on the left or select a preset, then click <strong className="text-cyan-300">"Analyze Heat Risk with Gemini AI"</strong> to generate predictive thermal stress models, instant extreme alerts, and medical-grade recommendations.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  NOAA Heat Index Calibrated
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  Gemini Multi-Model Fallback
                </span>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[420px] bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 animate-spin flex items-center justify-center p-1">
                  <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-cyan-400 animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  Synthesizing Thermal Physiology & Microclimate Intelligence
                </h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Connecting to Gemini AI to compute perceived heat index, evaluate metabolic thermal accumulation, and draft critical life-safety directives...
                </p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Top Banner: Perceived Heat Index & Risk Classification */}
              {(() => {
                const styling = getRiskColor(result.riskLevel);
                return (
                  <div className={`${styling.bg} border ${styling.border} rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${styling.badge}`}>
                            {result.riskLevel} RISK
                          </span>
                          <span className="text-xs text-slate-300 font-medium">
                            {formData.location}
                          </span>
                        </div>
                        <div className="flex items-baseline space-x-3">
                          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            {result.heatIndex}°C
                          </span>
                          <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
                            Perceived Heat Index (Feels Like)
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          Ambient 2m: <strong className="text-white">{formData.temperature}°C</strong> · Relative Humidity: <strong className="text-white">{formData.humidity}%</strong>
                        </p>
                      </div>

                      {/* Risk Score Gauge Metric */}
                      <div className="bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800 flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-[10px] uppercase font-bold text-slate-400">AI Heat Risk Score</div>
                          <div className="text-2xl font-black font-mono text-cyan-300">
                            {result.riskScore}<span className="text-xs text-slate-500">/100</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 flex items-center justify-center font-bold text-xs text-white">
                          {result.riskScore}%
                        </div>
                      </div>

                    </div>

                    {/* Operational Limits Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5">
                        <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Safe Continuous Exposure Limit</div>
                          <div className="text-white font-bold">{result.safeExposureLimit}</div>
                        </div>
                      </div>

                      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5">
                        <Droplets className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Hydration Standard</div>
                          <div className="text-white font-bold">{result.hydrationRequirement}</div>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })()}

              {/* Extreme Situational Alerts & Danger Warnings */}
              {result.extremeAlerts && result.extremeAlerts.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <AlertOctagon className="w-4 h-4 text-rose-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Situational Extreme Heat Alerts ({result.extremeAlerts.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {result.extremeAlerts.map((alert, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border text-xs shadow-md transition-all ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-rose-950/80 border-rose-600 text-rose-100'
                            : alert.severity === 'WARNING'
                            ? 'bg-orange-950/80 border-orange-600 text-orange-100'
                            : 'bg-amber-950/80 border-amber-600 text-amber-100'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                alert.severity === 'CRITICAL'
                                  ? 'bg-rose-900 text-rose-200 border border-rose-700 animate-pulse'
                                  : 'bg-orange-900 text-orange-200 border border-orange-700'
                              }`}
                            >
                              {alert.severity}
                            </span>
                            <span className="font-bold text-white text-xs sm:text-sm">
                              {alert.title}
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                          {alert.description}
                        </p>
                        {alert.urgencyAction && (
                          <div className="mt-2 pt-2 border-t border-rose-900/50 flex items-center space-x-1.5 text-[11px] font-semibold text-rose-300">
                            <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Action: {alert.urgencyAction}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Recommendations Grid */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      AI Safety & Medical Protocols
                    </span>
                    <span className="text-[11px] text-cyan-300 font-mono">
                      Tailored for {formData.location}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {result.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-2"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase">
                              {rec.category}
                            </span>
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                                rec.urgency === 'Critical'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                  : rec.urgency === 'High'
                                  ? 'bg-orange-950 text-orange-300 border border-orange-800'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {rec.urgency}
                            </span>
                          </div>
                          <div className="font-bold text-slate-100 text-xs">
                            {rec.title}
                          </div>
                          <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                            {rec.action}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Markdown Narrative Assessment with Copy Control */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Thermal Physiological Assessment Narrative
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      Source: {result.source}
                    </span>
                    <button
                      onClick={handleCopyAnalysis}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center space-x-1"
                      title="Copy full assessment"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px] text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {result.detailedAnalysis}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </section>
  );
};
