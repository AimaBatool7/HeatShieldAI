import React from 'react';
import { MapPin, Flame, Thermometer } from 'lucide-react';
import { temperatureService, CITIES_METADATA } from '../services/temperatureService';
import { CityData } from '../types';

interface CitySelectorProps {
  currentCityId: string;
  onSelectCity: (cityId: string) => void;
  tempOffset: number;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  currentCityId,
  onSelectCity,
  tempOffset,
}) => {
  const cities = temperatureService.getCities();

  return (
    <section className="bg-slate-900/60 border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-200 tracking-wide uppercase">
              Hyperlocal City Network (Pakistani Metros)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            Select a metropolitan region to load real-time microclimate intelligence
          </span>
        </div>

        {/* City Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {cities.map((city) => {
            const isSelected = city.id === currentCityId;
            const cityTemp = Math.round((city.baseTemp + tempOffset) * 10) / 10;
            
            // Risk color tag
            let riskTagColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
            if (cityTemp >= 43) {
              riskTagColor = 'text-rose-400 bg-rose-950/60 border-rose-800';
            } else if (cityTemp >= 40) {
              riskTagColor = 'text-orange-400 bg-orange-950/60 border-orange-800';
            } else if (cityTemp >= 36) {
              riskTagColor = 'text-amber-400 bg-amber-950/60 border-amber-800';
            }

            return (
              <button
                key={city.id}
                id={`city-btn-${city.id}`}
                onClick={() => onSelectCity(city.id)}
                className={`relative p-2.5 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-500 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                )}
                
                <div className="text-xs font-bold text-slate-100 truncate">
                  {city.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {city.province}
                </div>

                <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <div className="flex items-center text-xs font-mono font-bold text-white">
                    <Thermometer className="w-3 h-3 text-cyan-400 mr-0.5" />
                    {cityTemp}°C
                  </div>

                  <span className={`text-[9px] font-bold px-1 py-0.2 rounded border ${riskTagColor}`}>
                    {cityTemp >= 43 ? 'EXTREME' : cityTemp >= 40 ? 'V.HIGH' : cityTemp >= 36 ? 'HIGH' : 'MOD'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
