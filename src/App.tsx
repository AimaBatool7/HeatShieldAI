import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroHeader } from './components/HeroHeader';
import { CitySelector } from './components/CitySelector';
import { CurrentMetricsCards } from './components/CurrentMetricsCards';
import { HeatRiskScoreGauge } from './components/HeatRiskScoreGauge';
import { TrendAnalysis } from './components/TrendAnalysis';
import { InteractiveHeatMap } from './components/InteractiveHeatMap';
import { AiCustomRiskAnalyzer } from './components/AiCustomRiskAnalyzer';
import { AiHeatAdvisor } from './components/AiHeatAdvisor';
import { AiRecommendations } from './components/AiRecommendations';
import { HeatRiskForecast } from './components/HeatRiskForecast';
import { SmartAlerts } from './components/SmartAlerts';
import { CityComparison } from './components/CityComparison';
import { UrbanHeatInsights } from './components/UrbanHeatInsights';
import { DataFlowHowItWorks } from './components/DataFlowHowItWorks';
import { DataSourcePanel } from './components/DataSourcePanel';
import { GuidedDemoModal } from './components/GuidedDemoModal';
import { CityAnalysisModal } from './components/CityAnalysisModal';
import { temperatureService } from './services/temperatureService';
import { SmartAlertItem } from './types';
import { 
  ShieldAlert, 
  Flame, 
  Radio, 
  Cpu, 
  Globe, 
  Heart, 
  ArrowUp,
  ExternalLink 
} from 'lucide-react';

export default function App() {
  const [selectedCityId, setSelectedCityId] = useState<string>('multan');
  const [tempOffset, setTempOffset] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isGuidedDemoOpen, setIsGuidedDemoOpen] = useState<boolean>(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState<boolean>(false);

  // Compute live city data reactively based on selection & temperature simulation delta
  const cityData = useMemo(() => {
    return temperatureService.getCityTemperature(selectedCityId, tempOffset);
  }, [selectedCityId, tempOffset]);

  // Manage alert statuses locally
  const [alertsState, setAlertsState] = useState<Record<string, boolean>>({});

  const unreadAlertsCount = useMemo(() => {
    return cityData.alerts.filter((a) => !alertsState[a.id] && !a.read).length;
  }, [cityData.alerts, alertsState]);

  const handleMarkAlertRead = (id: string) => {
    setAlertsState((prev) => ({ ...prev, [id]: true }));
  };

  const handleMarkAllAlertsRead = () => {
    const updated: Record<string, boolean> = { ...alertsState };
    cityData.alerts.forEach((a) => {
      updated[a.id] = true;
    });
    setAlertsState(updated);
  };

  const mergedAlerts: SmartAlertItem[] = useMemo(() => {
    return cityData.alerts.map((a) => ({
      ...a,
      read: alertsState[a.id] !== undefined ? alertsState[a.id] : a.read,
    }));
  }, [cityData.alerts, alertsState]);

  // Simulation toggling
  const handleSimulateToggle = () => {
    if (tempOffset === 0) setTempOffset(2);
    else if (tempOffset === 2) setTempOffset(4);
    else if (tempOffset === 4) setTempOffset(6);
    else setTempOffset(0);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentCity={cityData}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        unreadAlertsCount={unreadAlertsCount}
        isSimulating={tempOffset > 0}
        tempOffset={tempOffset}
        onSimulateToggle={handleSimulateToggle}
        onStartDemo={() => setIsGuidedDemoOpen(true)}
        onAnalyzeCity={() => setIsAnalysisModalOpen(true)}
      />

      {/* 2. Hero Header */}
      <HeroHeader
        currentCity={cityData}
        tempOffset={tempOffset}
        onSimulateToggle={handleSimulateToggle}
        onAskAi={() => scrollToSection('ai-advisor')}
        onAnalyzeRisk={() => setIsAnalysisModalOpen(true)}
        onOpenScenarioAnalyzer={() => scrollToSection('custom-risk-analyzer')}
        onStartDemo={() => setIsGuidedDemoOpen(true)}
      />

      {/* 3. Pakistani Metropolitan City Selector */}
      <CitySelector
        currentCityId={selectedCityId}
        onSelectCity={(id) => setSelectedCityId(id)}
        tempOffset={tempOffset}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Section 1: Overview & Metrics */}
        <section id="overview" className="space-y-6 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Live Thermal Intelligence: {cityData.name}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Ground-level 2m microclimate sensor readings · Updated in real-time
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-mono">
                {cityData.province}, {cityData.country}
              </span>
            </div>
          </div>

          {/* Large Metric Cards */}
          <CurrentMetricsCards city={cityData} />

          {/* 2-Column Risk Score Radial Gauge & Trend Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <HeatRiskScoreGauge city={cityData} />
            </div>
            <div className="lg:col-span-6">
              <TrendAnalysis city={cityData} />
            </div>
          </div>

          {/* Urban Heat Insights */}
          <UrbanHeatInsights city={cityData} />
        </section>

        {/* Section 2: AI Heat Risk & Scenario Analyzer */}
        <AiCustomRiskAnalyzer
          currentCityName={cityData.name}
          defaultTemp={cityData.temperature}
          defaultHumidity={cityData.humidity}
        />

        {/* Section 3: Interactive Heat Map */}
        <InteractiveHeatMap city={cityData} />

        {/* Section 4: AI Heat Advisor Chat */}
        <AiHeatAdvisor city={cityData} />

        {/* Section 5: Heat Risk Forecast & Trajectory Charts */}
        <HeatRiskForecast city={cityData} />

        {/* Section 6: Smart Alerts Center */}
        <SmartAlerts
          alerts={mergedAlerts}
          onMarkRead={handleMarkAlertRead}
          onMarkAllRead={handleMarkAllAlertsRead}
        />

        {/* Section 7: Cross-City Comparison */}
        <CityComparison tempOffset={tempOffset} />

        {/* Section 8: AI Recommended Actions */}
        <AiRecommendations city={cityData} />

        {/* Section 9: How It Works & Real-World Impact */}
        <DataFlowHowItWorks />

        {/* Section 10: Transparent Data Source & Architecture Panel */}
        <DataSourcePanel />

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight">HeatShield AI</span>
              <p className="text-[11px] text-slate-500">
                Predict Heat · Protect People · Build Resilient Cities
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
            <button onClick={() => scrollToSection('overview')} className="hover:text-cyan-400 transition-colors">
              Overview
            </button>
            <button onClick={() => scrollToSection('custom-risk-analyzer')} className="hover:text-cyan-400 transition-colors">
              AI Risk Analyzer
            </button>
            <button onClick={() => scrollToSection('heatmap')} className="hover:text-cyan-400 transition-colors">
              Heat Map
            </button>
            <button onClick={() => scrollToSection('ai-advisor')} className="hover:text-cyan-400 transition-colors">
              AI Advisor
            </button>
            <button onClick={() => scrollToSection('predictions')} className="hover:text-cyan-400 transition-colors">
              Predictions
            </button>
            <button onClick={() => scrollToSection('alerts')} className="hover:text-cyan-400 transition-colors">
              Alerts
            </button>
            <button onClick={() => scrollToSection('city-analysis')} className="hover:text-cyan-400 transition-colors">
              City Analysis
            </button>
            <button onClick={() => scrollToSection('recommendations')} className="hover:text-cyan-400 transition-colors">
              Recommendations
            </button>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span className="inline-flex items-center gap-1 text-slate-500 font-mono">
              <Radio className="w-3 h-3 text-emerald-400" />
              Sensor Mesh: Online
            </span>
            <span className="text-slate-700">|</span>
            <span className="inline-flex items-center gap-1 text-slate-500 font-mono">
              <Cpu className="w-3 h-3 text-indigo-400" />
              Gemini 3.7 Flash
            </span>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600">
          <p>© {new Date().getFullYear()} HeatShield AI Climate Technology. Built for Urban Resilience.</p>
          <p className="mt-2 sm:mt-0">Hyperlocal Urban Temperature Intelligence · 2m AGL Standard</p>
        </div>
      </footer>

      {/* Modals */}
      <GuidedDemoModal
        isOpen={isGuidedDemoOpen}
        onClose={() => setIsGuidedDemoOpen(false)}
        onSelectCity={(id) => setSelectedCityId(id)}
        onSimulateSpike={(delta) => setTempOffset(delta)}
        onNavigateSection={(id) => scrollToSection(id)}
      />

      <CityAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        city={cityData}
      />

    </div>
  );
}
