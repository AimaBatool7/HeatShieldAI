import React from 'react';
import { Flame, Info, AlertTriangle, ShieldCheck, Sun, Droplets, Clock, TrendingUp } from 'lucide-react';
import { CityData } from '../types';

interface HeatRiskScoreGaugeProps {
  city: CityData;
}

export const HeatRiskScoreGauge: React.FC<HeatRiskScoreGaugeProps> = ({ city }) => {
  const score = city.riskScore;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  // Use 240 degree gauge (arc from -120 to +120)
  const strokeDashoffset = circumference - (score / 100) * (circumference * 0.75);

  const getScoreColor = (val: number) => {
    if (val >= 80) return '#f43f5e'; // rose-500
    if (val >= 68) return '#f97316'; // orange-500
    if (val >= 50) return '#eab308'; // yellow-500
    if (val >= 30) return '#10b981'; // emerald-500
    return '#06b6d4'; // cyan-500
  };

  const currentColor = getScoreColor(score);

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Flame className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            AI Heat Risk Score
          </h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
          PROPRIETARY RISK ENGINE
        </span>
      </div>

      {/* Main Radial Visualization */}
      <div className="my-6 flex flex-col items-center justify-center relative">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
            {/* Background Track */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="currentColor"
              strokeWidth="14"
              className="text-slate-800"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * 0.25}
              strokeLinecap="round"
            />
            {/* Value Arc */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke={currentColor}
              strokeWidth="14"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Score */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              {score}
            </span>
            <span className="text-xs font-bold text-slate-400 -mt-1">
              / 100
            </span>
            <span
              className="mt-1 text-[11px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider"
              style={{ color: currentColor, backgroundColor: `${currentColor}18` }}
            >
              {city.riskLevel}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 text-center max-w-xs mt-1">
          {city.dailyInsight.text.slice(0, 110)}...
        </p>
      </div>

      {/* Contribution Factors Breakdown */}
      <div className="space-y-2.5 pt-3 border-t border-slate-800">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Risk Factor Contribution</span>
          <span className="text-[10px] font-normal lowercase">calculated weights</span>
        </div>

        <div className="space-y-2">
          {/* Temp contribution */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Temperature Contribution
              </span>
              <span className="font-mono font-bold text-white">{city.contributions.temperature}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-700"
                style={{ width: `${city.contributions.temperature}%` }}
              />
            </div>
          </div>

          {/* Humidity contribution */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                Humidity (Wet-Bulb Stress)
              </span>
              <span className="font-mono font-bold text-white">{city.contributions.humidity}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-700"
                style={{ width: `${city.contributions.humidity}%` }}
              />
            </div>
          </div>

          {/* Time-of-day contribution */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Solar Radiance Peak (Afternoon)
              </span>
              <span className="font-mono font-bold text-white">{city.contributions.timeOfDay}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-700"
                style={{ width: `${city.contributions.timeOfDay}%` }}
              />
            </div>
          </div>

          {/* Recent trend */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                Thermal Acceleration Trend
              </span>
              <span className="font-mono font-bold text-white">{city.contributions.recentTrend}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-700"
                style={{ width: `${city.contributions.recentTrend}%` }}
              />
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-3 p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[10px] text-slate-400 flex items-start space-x-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            Calculated by HeatShield AI Urban Risk Engine. Not an official medical or government standard. Consult civic authorities for statutory declarations.
          </span>
        </div>
      </div>
    </div>
  );
};
