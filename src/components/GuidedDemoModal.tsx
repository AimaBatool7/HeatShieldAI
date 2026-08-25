import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  X, 
  Flame, 
  Bot, 
  MapPin, 
  ShieldAlert, 
  TrendingUp, 
  Bell, 
  ListChecks, 
  PartyPopper,
  HeartPulse 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GuidedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (cityId: string) => void;
  onSimulateSpike: (delta: number) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({
  isOpen,
  onClose,
  onSelectCity,
  onSimulateSpike,
  onNavigateSection,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const demoSteps = [
    {
      title: 'Step 1: Select Multan (Extreme Arid Heat)',
      desc: 'Let us initialize our urban microclimate audit by focusing on Multan, known for intense desert solar insolation.',
      actionLabel: 'Select Multan & View Metrics',
      icon: MapPin,
      onExecute: () => {
        onSelectCity('multan');
        onNavigateSection('overview');
      },
    },
    {
      title: 'Step 2: Inspect 2m Ground-Level Intelligence',
      desc: 'Observe the 42°C ambient reading and 45°C calculated heat index at human breathing height (2m AGL).',
      actionLabel: 'Inspect Metric Cards',
      icon: ShieldAlert,
      onExecute: () => {
        onNavigateSection('overview');
      },
    },
    {
      title: 'Step 3: Explore Interactive Heat Map & Hotspots',
      desc: 'Click across Old City bazaar and industrial corridors to reveal severe +9°C surface thermal asphalt traps.',
      actionLabel: 'Open Interactive Heat Map',
      icon: Flame,
      onExecute: () => {
        onNavigateSection('heatmap');
      },
    },
    {
      title: 'Step 4: AI Heat Risk Score Engine (87/100 EXTREME)',
      desc: 'Review the multi-weighted radial score analyzing temperature, wet-bulb humidity, time-of-day, and trend velocity.',
      actionLabel: 'Review Risk Breakdown',
      icon: TrendingUp,
      onExecute: () => {
        onNavigateSection('overview');
      },
    },
    {
      title: 'Step 5: Query HeatShield AI Advisor (Gemini 3.7 Flash)',
      desc: 'Ask the dedicated climate intelligence assistant for specific urban cooling, school schedules, and energy load actions.',
      actionLabel: 'Launch AI Advisor Chat',
      icon: Bot,
      onExecute: () => {
        onNavigateSection('ai-advisor');
      },
    },
    {
      title: 'Step 6: Simulate Heat Spike (+3°C Temperature Surge)',
      desc: 'Simulate worsening afternoon heat (42°C → 45°C) to test how our AI system dynamically elevates risk alerts and triggers protocols.',
      actionLabel: 'Simulate Heat Surge',
      icon: Flame,
      onExecute: () => {
        onSimulateSpike(3);
        onNavigateSection('alerts');
      },
    },
    {
      title: 'Step 7: Automated Civic Alerts & Action Recommendations',
      desc: 'Inspect newly triggered critical heat emergency alerts and prioritized checklists for emergency EMS, power grids, and schools.',
      actionLabel: 'View Action Checklist',
      icon: ListChecks,
      onExecute: () => {
        onNavigateSection('recommendations');
      },
    },
    {
      title: 'Step 8: AI Scenario Simulator (Custom Microclimates)',
      desc: 'Simulate any custom temperature, relative humidity, solar exposure, labor intensity, and vulnerable demographics with instant Gemini AI intelligence.',
      actionLabel: 'Launch Scenario Analyzer',
      icon: HeartPulse,
      onExecute: () => {
        onNavigateSection('custom-risk-analyzer');
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      },
    },
  ];

  const step = demoSteps[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    step.onExecute();
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      demoSteps[currentStep - 1].onExecute();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                HACKATHON PRESENTATION MODE
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                HeatShield AI Guided Walkthrough
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Stage {currentStep + 1} of {demoSteps.length}</span>
            <span className="text-cyan-400 font-bold">{Math.round(((currentStep + 1) / demoSteps.length) * 100)}% Completed</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step Card */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2.5 text-cyan-300 font-bold text-sm sm:text-base">
            <Icon className="w-5 h-5 text-cyan-400" />
            <span>{step.title}</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {step.desc}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02]"
          >
            <span>{currentStep === demoSteps.length - 1 ? 'Finish Presentation' : step.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
