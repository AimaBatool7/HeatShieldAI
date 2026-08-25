import React, { useState } from 'react';
import { 
  Flame, 
  Layers, 
  MapPin, 
  Eye, 
  TreePine, 
  Factory, 
  Building, 
  Train, 
  Home, 
  CheckCircle2, 
  Info, 
  ShieldAlert, 
  Maximize2,
  Sparkles,
  RefreshCw,
  Compass
} from 'lucide-react';
import { CityData, TemperatureZone, RiskLevel } from '../types';

interface InteractiveHeatMapProps {
  city: CityData;
}

export const InteractiveHeatMap: React.FC<InteractiveHeatMapProps> = ({ city }) => {
  const [selectedZone, setSelectedZone] = useState<TemperatureZone | null>(city.zones[0] || null);
  const [mapMode, setMapMode] = useState<'ambient' | 'surface' | 'canopy'>('ambient');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  // Keep selected zone updated if city changes
  React.useEffect(() => {
    if (city.zones.length > 0) {
      setSelectedZone(city.zones[0]);
    }
  }, [city.id]);

  const getZoneColor = (zone: TemperatureZone) => {
    if (mapMode === 'canopy') {
      if (zone.canopyCoverPercent > 40) return { bg: 'fill-emerald-500/50 stroke-emerald-400', badge: 'text-emerald-400 bg-emerald-950/80' };
      if (zone.canopyCoverPercent > 15) return { bg: 'fill-teal-500/40 stroke-teal-400', badge: 'text-teal-400 bg-teal-950/80' };
      return { bg: 'fill-amber-600/40 stroke-amber-500', badge: 'text-rose-400 bg-rose-950/80' };
    }

    const value = mapMode === 'surface' ? zone.surfaceTemp : zone.temp;

    if (value >= 43 || zone.riskLevel === 'EXTREME') {
      return { 
        bg: 'fill-rose-600/60 stroke-rose-400', 
        badge: 'text-rose-300 bg-rose-950 border-rose-700',
        dot: 'bg-rose-500'
      };
    }
    if (value >= 40 || zone.riskLevel === 'VERY HIGH') {
      return { 
        bg: 'fill-orange-500/55 stroke-orange-400', 
        badge: 'text-orange-300 bg-orange-950 border-orange-700',
        dot: 'bg-orange-500'
      };
    }
    if (value >= 37 || zone.riskLevel === 'HIGH') {
      return { 
        bg: 'fill-amber-500/50 stroke-amber-400', 
        badge: 'text-amber-300 bg-amber-950 border-amber-700',
        dot: 'bg-amber-500'
      };
    }
    if (value >= 34 || zone.riskLevel === 'MODERATE') {
      return { 
        bg: 'fill-emerald-500/45 stroke-emerald-400', 
        badge: 'text-emerald-300 bg-emerald-950 border-emerald-700',
        dot: 'bg-emerald-500'
      };
    }
    return { 
      bg: 'fill-cyan-500/45 stroke-cyan-400', 
      badge: 'text-cyan-300 bg-cyan-950 border-cyan-700',
      dot: 'bg-cyan-500'
    };
  };

  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'Old City': return Building;
      case 'Industrial': return Factory;
      case 'Commercial': return Building;
      case 'Transit': return Train;
      case 'Greenery': return TreePine;
      default: return Home;
    }
  };

  const filteredZones = city.zones.filter((z) => {
    if (filterRisk === 'ALL') return true;
    return z.riskLevel === filterRisk;
  });

  return (
    <section id="heatmap" className="py-8 scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Interactive Urban Heat Map
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
              GIS Grid View
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Hyperlocal microclimate zoning for <span className="text-cyan-300 font-semibold">{city.name}</span> measured at 2m elevation
          </p>
        </div>

        {/* Map Mode Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setMapMode('ambient')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mapMode === 'ambient'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ambient (2m)
            </button>
            <button
              onClick={() => setMapMode('surface')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mapMode === 'surface'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Surface Radiance
            </button>
            <button
              onClick={() => setMapMode('canopy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mapMode === 'canopy'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Canopy Cover %
            </button>
          </div>
        </div>
      </div>

      {/* Main Map + Side Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Visual Geospatial GIS Canvas */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col min-h-[460px]">
          
          {/* Top GIS Status Bar */}
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3 text-slate-300 font-mono">
              <span className="flex items-center gap-1 text-cyan-400">
                <Compass className="w-3.5 h-3.5" />
                {city.coords.lat.toFixed(4)}° N, {city.coords.lng.toFixed(4)}° E
              </span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <span className="hidden sm:inline text-slate-400">Grid: 500m² Micro-mesh</span>
            </div>

            {/* Color Legend */}
            <div className="flex items-center space-x-1.5 text-[10px] font-bold">
              <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">Cool</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">Low</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700">Mod</span>
              <span className="px-1.5 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-700">High</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 animate-pulse">Extreme</span>
            </div>
          </div>

          {/* Interactive SVG Heat Map Grid */}
          <div className="relative flex-1 p-4 flex items-center justify-center bg-slate-950">
            {/* Background Map Contours / Grid Lines */}
            <svg 
              className="w-full h-full max-h-[420px] select-none" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Background Grid Pattern */}
                <pattern id="gisGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                  <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#1e293b" strokeWidth="0.3" strokeDasharray="0.8,0.8" />
                </pattern>

                {/* Radar Heat Glow Filters */}
                <radialGradient id="hotspotGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Grid Background */}
              <rect width="100" height="100" fill="url(#gisGrid)" />

              {/* Decorative City Road Network / Arteries */}
              <path d="M 0 50 Q 30 45, 50 50 T 100 50" fill="none" stroke="#334155" strokeWidth="0.8" strokeDasharray="2,1" />
              <path d="M 50 0 Q 55 30, 50 50 T 50 100" fill="none" stroke="#334155" strokeWidth="0.8" strokeDasharray="2,1" />
              <path d="M 10 20 L 90 80" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              <path d="M 20 85 L 80 15" fill="none" stroke="#1e293b" strokeWidth="0.5" />

              {/* Render Temperature Zones */}
              {city.zones.map((zone) => {
                const styles = getZoneColor(zone);
                const isSelected = selectedZone?.id === zone.id;
                const { x, y, width = 22, height = 22 } = zone.coordinates;

                const displayVal = mapMode === 'surface' ? `${zone.surfaceTemp}°C` : `${zone.temp}°C`;

                return (
                  <g
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className="cursor-pointer transition-all duration-300 group"
                  >
                    {/* Zone Boundary Box with smooth rounded corners */}
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      rx="3"
                      className={`${styles.bg} stroke-[0.8] transition-all duration-300 ${
                        isSelected
                          ? 'stroke-white stroke-[1.6] filter drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                          : 'hover:stroke-cyan-300 hover:stroke-[1.2]'
                      }`}
                    />

                    {/* Zone Sensor Node Center Circle */}
                    <circle
                      cx={x + width / 2}
                      cy={y + height / 2 - 2}
                      r={isSelected ? '2.5' : '1.8'}
                      className={`${isSelected ? 'fill-white stroke-cyan-400 stroke-[0.8]' : 'fill-slate-900 stroke-white stroke-[0.5]'} transition-all`}
                    />

                    {/* Sensor ID Text */}
                    <text
                      x={x + width / 2}
                      y={y + 4.5}
                      textAnchor="middle"
                      className="fill-slate-200 text-[3.2px] font-mono font-bold tracking-tight pointer-events-none"
                    >
                      {zone.type}
                    </text>

                    {/* Temperature Pill on Map */}
                    <rect
                      x={x + width / 2 - 6.5}
                      y={y + height / 2 + 2}
                      width="13"
                      height="4.5"
                      rx="1.5"
                      fill="#020617"
                      stroke={isSelected ? '#38bdf8' : '#334155'}
                      strokeWidth="0.4"
                    />

                    <text
                      x={x + width / 2}
                      y={y + height / 2 + 5.2}
                      textAnchor="middle"
                      className={`text-[3.2px] font-black font-mono pointer-events-none ${
                        zone.riskLevel === 'EXTREME'
                          ? 'fill-rose-400'
                          : zone.riskLevel === 'VERY HIGH'
                          ? 'fill-orange-400'
                          : 'fill-cyan-300'
                      }`}
                    >
                      {displayVal}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Floating Quick Overlay for currently highlighted zone */}
            {selectedZone && (
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2.5 rounded-xl text-xs text-white max-w-xs shadow-xl pointer-events-none">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-cyan-300">{selectedZone.name}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${getZoneColor(selectedZone).badge}`}>
                    {selectedZone.riskLevel}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-300 font-mono">
                  <span>Air: <strong>{selectedZone.temp}°C</strong></span>
                  <span>Surface: <strong className="text-rose-400">{selectedZone.surfaceTemp}°C</strong></span>
                  <span>Canopy: <strong>{selectedZone.canopyCoverPercent}%</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Interactive Zone Selection Strip */}
          <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
              Select Zone:
            </span>
            {city.zones.map((zone) => {
              const isSelected = selectedZone?.id === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-bold'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {zone.type} ({zone.temp}°C)
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Zone Deep Dive Panel */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          {selectedZone ? (
            <div className="space-y-4">
              
              {/* Header */}
              <div className="pb-3 border-b border-slate-800 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                    {selectedZone.sensorId} · 2m Sensor
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5 leading-snug">
                    {selectedZone.name}
                  </h3>
                </div>

                <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${getZoneColor(selectedZone).badge}`}>
                  {selectedZone.riskLevel}
                </span>
              </div>

              {/* Thermal Breakdown Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Ambient Air (2m)</div>
                  <div className="text-2xl font-black text-white mt-0.5">
                    {selectedZone.temp}°C
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Heat Index: {selectedZone.heatIndex}°C
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] text-rose-400 font-medium">Asphalt / Surface</div>
                  <div className="text-2xl font-black text-rose-300 mt-0.5">
                    {selectedZone.surfaceTemp}°C
                  </div>
                  <div className="text-[10px] text-rose-400/80 mt-0.5">
                    +{Math.round((selectedZone.surfaceTemp - selectedZone.temp) * 10) / 10}°C thermal trap
                  </div>
                </div>
              </div>

              {/* Urban Characteristics */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                    Tree Canopy Coverage
                  </span>
                  <span className="font-bold text-white font-mono">{selectedZone.canopyCoverPercent}%</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-400" />
                    Population Density
                  </span>
                  <span className="font-bold text-white font-mono">{selectedZone.populationDensity}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                {selectedZone.description}
              </p>

              {/* Priority Interventions Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Targeted Cooling Actions
                </span>

                <div className="space-y-1.5">
                  {selectedZone.interventions.map((action, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center py-10">
              <MapPin className="w-8 h-8 mb-2 text-slate-600" />
              <p className="text-xs">Click any zone on the heat map to inspect microclimate data.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
