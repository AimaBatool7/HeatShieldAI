import React, { useState } from 'react';
import { 
  Building2, 
  Scale, 
  Flame, 
  Droplets, 
  Thermometer, 
  AlertTriangle, 
  Plus, 
  X,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { temperatureService, CITIES_METADATA } from '../services/temperatureService';
import { CityData } from '../types';

interface CityComparisonProps {
  tempOffset: number;
}

export const CityComparison: React.FC<CityComparisonProps> = ({ tempOffset }) => {
  const allCities = temperatureService.getCities();
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>(['multan', 'lahore', 'karachi']);

  const comparedCitiesData = temperatureService.compareCities(selectedCityIds, tempOffset);

  const toggleCity = (cityId: string) => {
    if (selectedCityIds.includes(cityId)) {
      if (selectedCityIds.length > 2) {
        setSelectedCityIds(selectedCityIds.filter((id) => id !== cityId));
      }
    } else {
      setSelectedCityIds([...selectedCityIds, cityId]);
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'EXTREME':
        return 'bg-rose-950 text-rose-300 border-rose-700 font-bold animate-pulse';
      case 'VERY HIGH':
        return 'bg-orange-950 text-orange-300 border-orange-700 font-semibold';
      case 'HIGH':
        return 'bg-amber-950 text-amber-300 border-amber-700';
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-700';
    }
  };

  return (
    <section id="city-analysis" className="py-8 scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Cross-City Climate Comparison
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
              Comparative Risk
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Evaluate regional thermal disparities, wet-bulb traps and risk scores across Pakistani metropolitan hubs
          </p>
        </div>

        {/* City Toggle Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1">
            Toggle Metros:
          </span>
          {allCities.map((c) => {
            const isSelected = selectedCityIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCity(c.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Table Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-200">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Metropolitan City</th>
                <th className="py-3.5 px-4">Ambient Temp (2m)</th>
                <th className="py-3.5 px-4">Relative Humidity</th>
                <th className="py-3.5 px-4">Calculated Heat Index</th>
                <th className="py-3.5 px-4">AI Risk Score</th>
                <th className="py-3.5 px-4">Risk Classification</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Primary Vulnerability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {comparedCitiesData.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  
                  {/* City Name */}
                  <td className="py-4 px-4 sm:px-6 font-sans font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <div>
                      <div className="text-sm">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{c.province}</div>
                    </div>
                  </td>

                  {/* Temp */}
                  <td className="py-4 px-4 font-bold text-white text-base">
                    {c.temperature}°C
                  </td>

                  {/* Humidity */}
                  <td className="py-4 px-4 text-blue-400 font-semibold">
                    {c.humidity}%
                  </td>

                  {/* Heat Index */}
                  <td className="py-4 px-4 font-bold text-amber-300 text-base">
                    {c.heatIndex}°C
                  </td>

                  {/* Risk Score Visual Bar */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{c.riskScore}</span>
                      <div className="w-20 sm:w-28 h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-rose-500"
                          style={{ width: `${c.riskScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Risk Level Badge */}
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs border ${getRiskBadge(c.riskLevel)}`}>
                      {c.riskLevel}
                    </span>
                  </td>

                  {/* Vulnerability Summary */}
                  <td className="py-4 px-4 sm:px-6 font-sans text-xs text-slate-300 text-right">
                    {c.humidity > 55 ? (
                      <span className="text-blue-300">High Humidity Trap (Inhibited Sweat Evaporation)</span>
                    ) : c.temperature >= 42 ? (
                      <span className="text-rose-300">Extreme Arid Solar Radiance & Concrete Thermal Trap</span>
                    ) : (
                      <span className="text-amber-300">Dense Urban Heat Island Amplification</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Insight */}
        <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>
              <strong>Key Finding:</strong> Coastal metros like <em>Karachi</em> experience high heat index from humidity, whereas inland metros like <em>Multan</em> suffer severe direct dry heat radiance.
            </span>
          </div>
          <span className="font-mono text-[10px] text-cyan-400">
            {comparedCitiesData.length} Cities Active
          </span>
        </div>
      </div>
    </section>
  );
};
