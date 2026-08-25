import React from 'react';
import { 
  Radio, 
  Cpu, 
  BrainCircuit, 
  Bot, 
  ListChecks, 
  ArrowRight, 
  ShieldCheck, 
  Building, 
  Zap, 
  Hammer, 
  Sparkles,
  Layers
} from 'lucide-react';

export const DataFlowHowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Collect',
      desc: 'Receive hyperlocal temperature intelligence measured at 2m above ground level.',
      icon: Radio,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      num: '02',
      title: 'Analyze',
      desc: 'Calculate physiological heat index, wet-bulb stress, and spatial risk levels.',
      icon: Cpu,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      num: '03',
      title: 'Understand',
      desc: 'Use Gemini 3.7 Flash AI to identify microclimate patterns and community vulnerabilities.',
      icon: BrainCircuit,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      num: '04',
      title: 'Act',
      desc: 'Provide actionable recommendations for public safety, energy, and resilient urban planning.',
      icon: ListChecks,
      color: 'from-purple-500 to-rose-500',
    },
  ];

  const impacts = [
    {
      title: 'Public Safety',
      desc: 'Help vulnerable communities, outdoor laborers, and school children respond safely to dangerous heatwaves.',
      icon: ShieldCheck,
      color: 'text-rose-400 bg-rose-950/60 border-rose-800',
    },
    {
      title: 'Smart Cities',
      desc: 'Support municipal authorities with data-driven urban heat island mitigation and zoning policies.',
      icon: Building,
      color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800',
    },
    {
      title: 'Energy Grid',
      desc: 'Forecast peak cooling electricity demand surges to prevent regional brownouts and transformer burnout.',
      icon: Zap,
      color: 'text-amber-400 bg-amber-950/60 border-amber-800',
    },
    {
      title: 'Infrastructure',
      desc: 'Target unshaded asphalt corridors with cool pavement coatings, misting hubs, and urban tree canopy programs.',
      icon: Hammer,
      color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
    },
  ];

  return (
    <section className="py-10 space-y-12">
      
      {/* 1. How It Works (4 Steps) */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            How HeatShield AI Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            A real-time end-to-end data pipeline transforming raw microclimate sensor streams into life-saving civic decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-2xl font-black font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
                      {step.num}
                    </span>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mt-3">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Step {idx + 1} of 4</span>
                  {idx < 3 ? <ArrowRight className="w-3.5 h-3.5 text-cyan-400" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Designed for Real-World Impact */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
            CLIMATE TECH PURPOSE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Designed for Real-World Impact
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Targeting the intersection of extreme heat, public health, energy efficiency, and municipal infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {impacts.map((imp, idx) => {
            const Icon = imp.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-3.5 ${imp.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {imp.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {imp.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center text-[10px] font-mono text-slate-400">
                  <span>Verified Hackathon Metric</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
