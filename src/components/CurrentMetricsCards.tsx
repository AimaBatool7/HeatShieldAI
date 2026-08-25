import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Flame, 
  AlertTriangle, 
  Clock, 
  Ruler, 
  Radio, 
  TrendingUp, 
  Info 
} from 'lucide-react';
import { CityData } from '../types';

interface CurrentMetricsCardsProps {
  city: CityData;
}

export const CurrentMetricsCards: React.FC<CurrentMetricsCardsProps> = ({ city }) => {
  // Risk styling helper
  const getRiskBadgeStyles = (level: string) => {
    switch (level) {
      case 'EXTREME':
        return 'bg-gradient-to-r from-rose-950 to-red-900 text-rose-200 border-rose-600 shadow-rose-900/30';
      case 'VERY HIGH':
        return 'bg-gradient-to-r from-orange-950 to-amber-900 text-orange-200 border-orange-600 shadow-orange-900/30';
      case 'HIGH':
        return 'bg-gradient-to-r from-amber-950 to-yellow-900 text-amber-200 border-amber-600 shadow-amber-900/30';
      case 'MODERATE':
        return 'bg-gradient-to-r from-yellow-950 to-emerald-950 text-yellow-200 border-yellow-600 shadow-yellow-900/30';
      default:
        return 'bg-gradient-to-r from-emerald-950 to-teal-950 text-emerald-200 border-emerald-600 shadow-emerald-900/30';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      
      {/* 1. Ambient Temperature */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-cyan-400" />
            Temperature
          </span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
            2m AGL
          </span>
        </div>

        <div className="mt-2 flex items-baseline space-x-1">
          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {city.temperature}
          </span>
          <span className="text-lg font-bold text-slate-400">°C</span>
        </div>

        <div className="mt-2 flex items-center text-[11px] text-amber-400 font-medium">
          <TrendingUp className="w-3 h-3 mr-1" />
          <span>+{city.trend.change}°C vs 3h prior</span>
        </div>
      </div>

      {/* 2. Relative Humidity */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-blue-400" />
            Humidity
          </span>
          <span className="text-[10px] text-blue-400 font-mono">
            RH%
          </span>
        </div>

        <div className="mt-2 flex items-baseline space-x-1">
          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {city.humidity}
          </span>
          <span className="text-lg font-bold text-slate-400">%</span>
        </div>

        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
          <span>Wet-Bulb: ~{Math.round((city.temperature * 0.6 + city.humidity * 0.15) * 10) / 10}°C</span>
        </div>
      </div>

      {/* 3. Calculated Heat Index */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            Heat Index
          </span>
          <span className="text-[10px] text-orange-400 font-semibold">
            Feels Like
          </span>
        </div>

        <div className="mt-2 flex items-baseline space-x-1">
          <span className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight">
            {city.heatIndex}
          </span>
          <span className="text-lg font-bold text-amber-500">°C</span>
        </div>

        <div className="mt-2 text-[11px] text-amber-400/90 font-medium">
          Physiological stress index
        </div>
      </div>

      {/* 4. AI Risk Level */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Risk Level
          </span>
          <span className="text-[10px] font-mono text-slate-300">
            {city.riskScore}/100
          </span>
        </div>

        <div className="mt-2">
          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs sm:text-sm font-black border shadow-md ${getRiskBadgeStyles(city.riskLevel)}`}>
            {city.riskLevel}
          </span>
        </div>

        <div className="mt-2 text-[11px] text-slate-400">
          AI Risk Model Classification
        </div>
      </div>

      {/* 5. Data Resolution & Height */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Ruler className="w-4 h-4 text-emerald-400" />
            Height / Res
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">
            IoT Tier-1
          </span>
        </div>

        <div className="mt-2">
          <div className="text-xl font-bold text-white tracking-tight">
            {city.measurementHeight} <span className="text-xs font-normal text-slate-400">height</span>
          </div>
          <div className="text-xs font-semibold text-slate-300">
            {city.dataResolution} <span className="text-slate-400 font-normal">refresh</span>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-slate-400">
          Hyperlocal ground elevation
        </div>
      </div>

      {/* 6. Last Updated / Sensor Status */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            Telemetry
          </span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        <div className="mt-2 flex items-baseline space-x-1.5">
          <span className="text-2xl font-black text-emerald-400 tracking-tight">
            LIVE
          </span>
          <span className="text-[11px] font-mono text-slate-400">99.8% Sync</span>
        </div>

        <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>Real-time IoT stream</span>
        </div>
      </div>

    </div>
  );
};
