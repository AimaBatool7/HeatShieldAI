import React from 'react';
import { 
  Bot, 
  Flame, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Radio, 
  Cpu, 
  ThermometerSnowflake 
} from 'lucide-react';
import { CityData } from '../types';

interface HeroHeaderProps {
  currentCity: CityData;
  tempOffset: number;
  onSimulateToggle: () => void;
  onAskAi: () => void;
  onAnalyzeRisk: () => void;
  onOpenScenarioAnalyzer: () => void;
  onStartDemo: () => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  currentCity,
  tempOffset,
  onSimulateToggle,
  onAskAi,
  onAnalyzeRisk,
  onOpenScenarioAnalyzer,
  onStartDemo,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      {tempOffset > 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-rose-500/5 pointer-events-none -z-10 animate-pulse" />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-medium shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>Temperature Intelligence Online</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-blue-400" />
            <span>Hyperlocal 2m Microclimate Telemetry</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-xs font-medium">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Gemini 3.7 Flash AI Core</span>
          </div>

          {tempOffset > 0 ? (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-950 border border-rose-700/80 text-rose-300 text-xs font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>SIMULATION ACTIVE: +{tempOffset}°C THERMAL SURGE</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <span>DEMO DATA · API READY</span>
            </div>
          )}
        </div>

        {/* Main Hero Title and Subtitle */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              AI-Powered{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                Urban Heat Intelligence
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Turn hyperlocal temperature data into actionable intelligence for safer, smarter and more resilient cities.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-analyze-risk-btn"
                onClick={onOpenScenarioAnalyzer}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-slate-950" />
                <span>AI Scenario Analyzer</span>
              </button>

              <button
                id="hero-ask-ai-btn"
                onClick={onAskAi}
                className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-semibold text-sm rounded-xl shadow-sm transition-all hover:border-cyan-400 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Ask AI Advisor</span>
              </button>

              <button
                id="hero-simulate-btn"
                onClick={onSimulateToggle}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-all ${
                  tempOffset > 0
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-lg shadow-rose-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/30'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{tempOffset > 0 ? `Reset Heat (+${tempOffset}°C)` : 'Simulate Heat Spike (+2°C)'}</span>
              </button>

              <button
                id="hero-demo-walkthrough-btn"
                onClick={onStartDemo}
                className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm rounded-xl transition-all"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Guided Demo</span>
              </button>
            </div>
          </div>

          {/* Quick Telemetry Glance Card */}
          <div className="lg:col-span-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl shadow-slate-950/50 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Live Urban Focus
                </span>
                <span className="font-mono text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                  {currentCity.name}, PK
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 py-3">
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-400">Ambient Temp (2m)</div>
                  <div className="text-2xl font-black text-white flex items-baseline gap-1 mt-0.5">
                    {currentCity.temperature}
                    <span className="text-sm font-semibold text-slate-400">°C</span>
                  </div>
                  <div className="text-[10px] text-amber-400 font-medium mt-0.5 flex items-center gap-1">
                    <TrendingUp className="w-2.5 h-2.5" />
                    +{currentCity.trend.change}°C (3h)
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-400">Calculated Heat Index</div>
                  <div className="text-2xl font-black text-amber-300 flex items-baseline gap-1 mt-0.5">
                    {currentCity.heatIndex}
                    <span className="text-sm font-semibold text-amber-500">°C</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Feels like extreme
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] text-slate-400">AI Risk Class:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    currentCity.riskLevel === 'EXTREME'
                      ? 'bg-rose-950 text-rose-300 border border-rose-700'
                      : currentCity.riskLevel === 'VERY HIGH'
                      ? 'bg-orange-950 text-orange-300 border border-orange-700'
                      : 'bg-amber-950 text-amber-300 border border-amber-700'
                  }`}>
                    {currentCity.riskLevel}
                  </span>
                </div>
                <div className="font-mono text-cyan-400 text-xs font-bold">
                  {currentCity.riskScore}/100 Risk
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
