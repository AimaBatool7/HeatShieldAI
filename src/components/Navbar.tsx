import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Flame, 
  Bot, 
  TrendingUp, 
  Bell, 
  Building2, 
  ListChecks, 
  Sparkles, 
  Menu, 
  X, 
  Radio, 
  Gauge,
  HeartPulse
} from 'lucide-react';
import { CityData } from '../types';

interface NavbarProps {
  currentCity: CityData;
  activeSection: string;
  setActiveSection: (section: string) => void;
  unreadAlertsCount: number;
  isSimulating: boolean;
  tempOffset: number;
  onSimulateToggle: () => void;
  onStartDemo: () => void;
  onAnalyzeCity: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  activeSection,
  setActiveSection,
  unreadAlertsCount,
  isSimulating,
  tempOffset,
  onSimulateToggle,
  onStartDemo,
  onAnalyzeCity,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Gauge },
    { id: 'custom-risk-analyzer', label: 'AI Risk Analyzer', icon: HeartPulse },
    { id: 'heatmap', label: 'Heat Map', icon: Flame },
    { id: 'ai-advisor', label: 'AI Advisor', icon: Bot },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unreadAlertsCount },
    { id: 'city-analysis', label: 'City Analysis', icon: Building2 },
    { id: 'recommendations', label: 'Recommendations', icon: ListChecks },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                  HeatShield AI
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  CLIMATE-TECH
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Predict Heat · Protect People · Build Resilient Cities
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold animate-bounce">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* Live Status Pill */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-full text-[11px] text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-emerald-400 font-medium">Online</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">{currentCity.name} {currentCity.temperature}°C</span>
            </div>

            {/* Simulation / Demo Badge Button */}
            <button
              id="simulate-heat-btn"
              onClick={onSimulateToggle}
              title="Demonstrate dynamic AI response when temperature increases"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                tempOffset > 0
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-500/20 animate-pulse'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{tempOffset > 0 ? `+${tempOffset}°C Spike Active` : 'Simulate Heat'}</span>
            </button>

            {/* Guided Demo Button */}
            <button
              id="start-demo-btn"
              onClick={onStartDemo}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Guided Demo</span>
            </button>

            {/* Analyze City Button */}
            <button
              id="analyze-city-nav-btn"
              onClick={onAnalyzeCity}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-lg shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              <Activity className="w-3.5 h-3.5 text-slate-950" />
              <span>Analyze City</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              id="mobile-simulate-btn"
              onClick={onSimulateToggle}
              className={`p-1.5 rounded-lg border ${
                tempOffset > 0 ? 'bg-rose-500/20 text-rose-300 border-rose-500/50' : 'bg-slate-800 text-amber-400 border-slate-700'
              }`}
            >
              <Flame className="w-4 h-4" />
            </button>
            
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-5 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs">
            <div className="flex items-center space-x-2">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-mono">Hyperlocal Sensor 2m Online</span>
            </div>
            <span className="font-semibold text-cyan-400">{currentCity.name}: {currentCity.temperature}°C</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartDemo();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 bg-slate-800 text-cyan-300 rounded-lg text-xs font-semibold border border-slate-700"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Start Guided Demo Walkthrough</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onAnalyzeCity();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 bg-cyan-500 text-slate-950 rounded-lg text-xs font-bold"
            >
              <Activity className="w-4 h-4 text-slate-950" />
              <span>Run Deep City Heat Analysis</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
