import React, { useState } from 'react';
import { 
  ListChecks, 
  ShieldCheck, 
  Zap, 
  Building2, 
  GraduationCap, 
  Ambulance, 
  CheckSquare, 
  Square, 
  Flame, 
  Sparkles,
  AlertTriangle,
  Users
} from 'lucide-react';
import { CityData, RecommendationItem } from '../types';

interface AiRecommendationsProps {
  city: CityData;
}

export const AiRecommendations: React.FC<AiRecommendationsProps> = ({ city }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Public Safety': return ShieldCheck;
      case 'Energy': return Zap;
      case 'Infrastructure': return Building2;
      case 'Schools': return GraduationCap;
      case 'Emergency Response': return Ambulance;
      default: return ListChecks;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'Critical':
        return 'bg-rose-950 text-rose-300 border-rose-700 font-black animate-pulse';
      case 'High':
        return 'bg-orange-950 text-orange-300 border-orange-700 font-bold';
      case 'Medium':
        return 'bg-amber-950 text-amber-300 border-amber-700 font-semibold';
      default:
        return 'bg-cyan-950 text-cyan-300 border-cyan-700 font-medium';
    }
  };

  const categories = ['ALL', 'Public Safety', 'Energy', 'Infrastructure', 'Schools', 'Emergency Response'];

  const filteredRecs = city.recommendations.filter((rec) => {
    if (activeCategory === 'ALL') return true;
    return rec.category === activeCategory;
  });

  return (
    <section id="recommendations" className="py-8 scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <ListChecks className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              AI Recommended Actions
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
              Prescriptive Intelligence
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Prioritized municipal and institutional action protocols tailored to <span className="text-cyan-300 font-semibold">{city.name}</span> ({city.temperature}°C)
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecs.map((rec) => {
          const Icon = getCategoryIcon(rec.category);

          return (
            <div
              key={rec.id}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                {/* Card Top Row */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {rec.category}
                      </span>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {rec.title}
                      </h3>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] border shrink-0 ${getUrgencyBadge(rec.urgency)}`}>
                    {rec.urgency}
                  </span>
                </div>

                {/* Body Description */}
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {rec.description}
                </p>

                {/* Affected Sector */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start space-x-2 text-[11px] text-slate-400">
                  <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Target:</strong> {rec.affectedSector}</span>
                </div>

                {/* Action Checklist */}
                <div className="mt-4 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Execution Checklist:
                  </span>
                  {rec.actionSteps.map((step, idx) => {
                    const stepKey = `${rec.id}-step-${idx}`;
                    const isDone = !!completedSteps[stepKey];

                    return (
                      <button
                        key={idx}
                        onClick={() => toggleStep(stepKey)}
                        className={`w-full flex items-start space-x-2.5 p-2 rounded-lg text-left text-xs transition-all ${
                          isDone
                            ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60'
                            : 'bg-slate-950/40 text-slate-300 border border-slate-800/60 hover:bg-slate-950'
                        }`}
                      >
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        )}
                        <span className={isDone ? 'line-through text-emerald-300/80' : ''}>
                          {step}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>AI Confidence: 94.2%</span>
                <span className="text-cyan-400">City Ward Feed Active</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
