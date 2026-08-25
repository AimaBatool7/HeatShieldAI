import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus, AlertCircle, Bot, Sparkles } from 'lucide-react';
import { CityData } from '../types';

interface TrendAnalysisProps {
  city: CityData;
}

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ city }) => {
  const { current, previous, change, direction, explanation } = city.trend;

  const isRising = direction === 'rising';
  const isFalling = direction === 'falling';

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Temperature Trend
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
          Rolling 3-Hour Delta
        </span>
      </div>

      <div className="my-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Current */}
        <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
          <div className="text-[11px] text-slate-400">Current Temp</div>
          <div className="text-2xl font-black text-white mt-1">
            {current}°C
          </div>
          <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Live Sensor</div>
        </div>

        {/* Previous */}
        <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
          <div className="text-[11px] text-slate-400">3h Previous</div>
          <div className="text-2xl font-black text-slate-300 mt-1">
            {previous}°C
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Baseline</div>
        </div>

        {/* Change */}
        <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
          <div className="text-[11px] text-slate-400">Net Delta</div>
          <div className="text-2xl font-black text-amber-400 mt-1 flex items-baseline gap-0.5">
            +{change}
            <span className="text-sm font-normal text-slate-400">°C</span>
          </div>
          <div className="text-[10px] text-amber-400 font-medium mt-0.5">Accelerating</div>
        </div>

        {/* Direction */}
        <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
          <div className="text-[11px] text-slate-400">Trajectory</div>
          <div className="text-xl font-bold text-rose-400 mt-1 flex items-center gap-1">
            {isRising ? (
              <>
                <ArrowUpRight className="w-5 h-5 text-rose-500" />
                <span>↑ Rising</span>
              </>
            ) : isFalling ? (
              <>
                <ArrowDownRight className="w-5 h-5 text-cyan-400" />
                <span>↓ Falling</span>
              </>
            ) : (
              <>
                <Minus className="w-5 h-5 text-slate-400" />
                <span>Stable</span>
              </>
            )}
          </div>
          <div className="text-[10px] text-rose-400/80 font-mono mt-0.5">Rapid accumulation</div>
        </div>
      </div>

      {/* AI Explanation Banner */}
      <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-start space-x-3 text-xs text-slate-300">
        <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 shrink-0 mt-0.5">
          <Bot className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-0.5">
            AI Microclimate Assessment:
          </span>
          <p className="leading-relaxed text-slate-200">
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
};
