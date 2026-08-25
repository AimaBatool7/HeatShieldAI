import React from 'react';
import { Lightbulb, AlertCircle, ShieldAlert, HeartPulse, Building, Users, Sparkles } from 'lucide-react';
import { CityData } from '../types';

interface UrbanHeatInsightsProps {
  city: CityData;
}

export const UrbanHeatInsights: React.FC<UrbanHeatInsightsProps> = ({ city }) => {
  const { text, whyItMatters, whatCitiesCanDo, whoShouldPrioritize } = city.dailyInsight;

  return (
    <section className="py-6">
      <div className="rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center space-x-2.5 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider uppercase block">
              Automated Climate Intelligence
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Today's Urban Heat Insight: {city.name}
            </h2>
          </div>
        </div>

        {/* Main Insight Quote */}
        <blockquote className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed border-l-4 border-cyan-400 pl-4 py-1 mb-6 bg-slate-950/30 rounded-r-xl">
          "{text}"
        </blockquote>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Why It Matters */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 shadow-sm space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <HeartPulse className="w-4 h-4 text-amber-400" />
              <span>Why It Matters</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {whyItMatters}
            </p>
          </div>

          {/* What Cities Can Do */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 shadow-sm space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>What Cities Can Do</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {whatCitiesCanDo}
            </p>
          </div>

          {/* Who Should Prioritize Action */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 shadow-sm space-y-2">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <Users className="w-4 h-4 text-rose-400" />
              <span>Who Should Prioritize</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {whoShouldPrioritize}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
