import React, { useState } from 'react';
import { 
  Database, 
  Ruler, 
  Clock, 
  Cpu, 
  Code2, 
  Check, 
  Copy, 
  Info, 
  ShieldCheck, 
  ExternalLink,
  Layers
} from 'lucide-react';

export const DataSourcePanel: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const apiSnippet = `// temperatureService.ts - Real Temperature API Integration
export async function getCityTemperature(cityId: string) {
  // 1. Fetch live 2m height IoT stream from Hackathon API
  const response = await fetch(\`https://api.heatshield-sensors.org/v1/telemetry/\${cityId}\`, {
    headers: { 'Authorization': \`Bearer \${process.env.TEMPERATURE_API_KEY}\` }
  });
  const liveData = await response.json();

  // 2. Feed directly into HeatRisk Engine & Gemini AI
  return calculateHeatRisk(liveData.temp_c, liveData.humidity_pct);
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(apiSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-8">
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                DATA INTEGRITY & TELEMETRY
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Temperature Intelligence Data Source
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              FORTIGUARD HACKATHON · SUBMISSION READY
            </span>
          </div>
        </div>

        {/* Core Explanation */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          <strong>HeatShield AI</strong> is engineered specifically to ingest hyperlocal urban temperature intelligence measured approximately <strong>2 meters above ground level</strong> (the biological human walking exposure zone). Unlike generic airport weather stations located miles outside city cores, hyperlocal micro-sensors reveal critical urban heat islands, shaded oasis anomalies, and asphalt radiant traps.
        </p>

        {/* 4 Specifications Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-cyan-400" />
              Measurement Height
            </div>
            <div className="text-xl font-black text-white mt-1">2 meters (2m)</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Above Ground Level (AGL)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Data Resolution
            </div>
            <div className="text-xl font-black text-white mt-1">20 minutes</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Rolling IoT frequency</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Data Type
            </div>
            <div className="text-sm font-bold text-white mt-1 truncate">Hyperlocal Intelligence</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Multi-zone microclimate</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              Integration Status
            </div>
            <div className="text-sm font-bold text-emerald-400 mt-1">Plug-and-Play API Ready</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Mock service calibrated</div>
          </div>

        </div>

        {/* Transparency Notice */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200/90 flex items-start space-x-3">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-amber-300 font-semibold block">Transparency Notice:</strong>
            <p>
              The current dataset uses realistic climate simulation models calibrated to historical seasonal records of Pakistani metropolitan areas. This simulated baseline enables immediate testing of AI advisory reasoning before connecting the official Hackathon IoT hardware feed.
            </p>
          </div>
        </div>

        {/* Real API Architecture Code Hook */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-2 font-mono">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>src/services/temperatureService.ts</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-cyan-300/90 overflow-x-auto leading-relaxed">
            {apiSnippet}
          </pre>
        </div>

      </div>
    </section>
  );
};
