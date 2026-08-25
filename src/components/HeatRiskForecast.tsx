import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  Thermometer, 
  Flame, 
  Info, 
  Calendar, 
  Activity 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Area, 
  ComposedChart 
} from 'recharts';
import { CityData, HourlyForecastItem } from '../types';

interface HeatRiskForecastProps {
  city: CityData;
}

export const HeatRiskForecast: React.FC<HeatRiskForecastProps> = ({ city }) => {
  const forecast = city.hourlyForecast;

  // Custom chart tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-slate-700 p-3 rounded-xl shadow-xl text-xs font-mono">
          <div className="font-bold text-white mb-1 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-cyan-400" />
            {label}
          </div>
          <div className="text-cyan-400">
            Temperature: <strong className="text-white">{payload[0]?.value}°C</strong>
          </div>
          <div className="text-amber-400">
            Heat Index: <strong className="text-white">{payload[1]?.value}°C</strong>
          </div>
          {payload[2] && (
            <div className="text-rose-400">
              Risk Score: <strong className="text-white">{payload[2]?.value}/100</strong>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <section id="predictions" className="py-8 scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Heat Risk Forecast
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
              Predictive Horizons
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Hourly hyperlocal temperature and risk level trajectory for <span className="text-cyan-300 font-semibold">{city.name}</span>
          </p>
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-amber-300 font-medium">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span>Demo Forecast Model · Real-time Sensor Projected</span>
        </div>
      </div>

      {/* Grid: Charts + Forecast Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Forecast Chart */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Temperature & Heat Index Trajectory (°C)
              </h3>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                Ambient Temp
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Heat Index
              </span>
            </div>
          </div>

          {/* Recharts Container */}
          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="heatIndex" stroke="#f59e0b" strokeWidth={2.5} fill="url(#amberGrad)" />
                <Line type="monotone" dataKey="temp" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#06b6d4' }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Peak Thermal Window: <strong>02:00 PM – 04:00 PM</strong></span>
            <span className="text-rose-400 font-semibold">Max Heat Index: {Math.max(...forecast.map(f => f.heatIndex))}°C</span>
          </div>
        </div>

        {/* Secondary Chart: Risk Score Bar Chart */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Predicted Risk Score
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">0 - 100 PTS</span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecast} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value: any) => [`${value} / 100`, 'Heat Risk Score']}
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="riskScore" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Scores above <strong>80</strong> trigger mandatory emergency municipal alerts.
          </div>
        </div>

      </div>

      {/* Hourly Timeline Cards Table */}
      <div className="mt-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Chronological Forecast Breakdown (Next Periods)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {forecast.map((item, idx) => {
            let riskColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
            if (item.riskLevel === 'EXTREME') riskColor = 'text-rose-400 bg-rose-950/80 border-rose-700 font-black animate-pulse';
            else if (item.riskLevel === 'VERY HIGH') riskColor = 'text-orange-400 bg-orange-950/80 border-orange-700 font-bold';
            else if (item.riskLevel === 'HIGH') riskColor = 'text-amber-400 bg-amber-950/80 border-amber-700';

            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="text-[11px] font-bold text-slate-400 font-mono">
                  {item.time}
                </div>

                <div className="my-2">
                  <div className="text-xl font-black text-white">
                    {item.temp}°C
                  </div>
                  <div className="text-[10px] text-amber-400">
                    HI: {item.heatIndex}°C
                  </div>
                </div>

                <span className={`px-1.5 py-0.5 rounded text-[9px] border ${riskColor}`}>
                  {item.riskLevel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
