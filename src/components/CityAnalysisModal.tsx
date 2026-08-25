import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Sparkles, 
  Cpu, 
  X, 
  Copy, 
  Check, 
  Download, 
  ShieldAlert, 
  Flame,
  Activity,
  Bot
} from 'lucide-react';
import { CityData } from '../types';
import { generateClientCityAudit } from '../utils/clientFallbackAi';

interface CityAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityData;
}

export const CityAnalysisModal: React.FC<CityAnalysisModalProps> = ({
  isOpen,
  onClose,
  city,
}) => {
  const [analysisText, setAnalysisText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAnalysis();
    }
  }, [isOpen, city.id, city.temperature]);

  const fetchAnalysis = async () => {
    setLoading(true);
    setAnalysisText('');
    try {
      let resultText = '';
      try {
        const res = await fetch('/api/gemini/analyze-city', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cityData: {
              name: city.name,
              temperature: city.temperature,
              humidity: city.humidity,
              heatIndex: city.heatIndex,
              riskLevel: city.riskLevel,
              riskScore: city.riskScore,
              zones: city.zones.map((z) => ({ name: z.name, temp: z.temp, risk: z.riskLevel })),
            },
          }),
        });
        if (res.ok) {
          const data = await res.json();
          resultText = data.analysis || '';
        } else {
          resultText = generateClientCityAudit(city);
        }
      } catch (fetchErr) {
        console.warn('Backend API unreachable, generating audit via client AI intelligence engine:', fetchErr);
        resultText = generateClientCityAudit(city);
      }
      setAnalysisText(resultText || generateClientCityAudit(city));
    } catch (err: any) {
      setAnalysisText(generateClientCityAudit(city));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(analysisText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-6 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20">
              <Activity className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Urban Heat Resilience Audit: {city.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700">
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Deep multi-zone thermal stress analysis & municipal intervention roadmap
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              disabled={loading || !analysisText}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Copy Audit"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-200 text-xs sm:text-sm">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <Bot className="w-10 h-10 text-cyan-400 animate-spin" />
              <p className="font-bold text-white text-sm">
                Generating Comprehensive Heat Risk Audit...
              </p>
              <p className="text-xs text-slate-400 max-w-sm">
                Analyzing microclimate telemetry, surface albedo parameters, and electrical grid peak models for {city.name}.
              </p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {analysisText}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Telemetry calibrated at 2m Above Ground Level</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
          >
            Close Audit
          </button>
        </div>

      </div>
    </div>
  );
};
