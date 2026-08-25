import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Flame, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Eye, 
  Filter, 
  Sparkles,
  Megaphone
} from 'lucide-react';
import { SmartAlertItem, CityData } from '../types';

interface SmartAlertsProps {
  alerts: SmartAlertItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const SmartAlerts: React.FC<SmartAlertsProps> = ({
  alerts,
  onMarkRead,
  onMarkAllRead,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [selectedProtocolAlert, setSelectedProtocolAlert] = useState<SmartAlertItem | null>(null);

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity === 'ALL') return true;
    return alert.severity === filterSeverity;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'EXTREME':
        return {
          pill: 'bg-rose-950 text-rose-300 border-rose-700 font-black animate-pulse',
          dot: 'bg-rose-500',
          icon: Flame,
        };
      case 'HIGH':
        return {
          pill: 'bg-orange-950 text-orange-300 border-orange-700 font-bold',
          dot: 'bg-orange-500',
          icon: AlertTriangle,
        };
      case 'WATCH':
        return {
          pill: 'bg-amber-950 text-amber-300 border-amber-700 font-medium',
          dot: 'bg-amber-500',
          icon: Bell,
        };
      default:
        return {
          pill: 'bg-cyan-950 text-cyan-300 border-cyan-700 font-medium',
          dot: 'bg-cyan-500',
          icon: Bell,
        };
    }
  };

  return (
    <section id="alerts" className="py-8 scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-rose-500 animate-bounce" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Smart Alerts & Civic Warnings
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white">
                {unreadCount} Active
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time automated threshold warnings generated from hyperlocal sensor analytics
          </p>
        </div>

        {/* Filter & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            {['ALL', 'EXTREME', 'HIGH', 'WATCH'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterSeverity === sev
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-all"
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const config = getSeverityBadge(alert.severity);
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  alert.read
                    ? 'bg-slate-950/60 border-slate-800/80 opacity-75'
                    : 'bg-slate-900/90 border-slate-700/80 shadow-lg'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${config.pill}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.2 rounded text-[10px] border ${config.pill}`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {alert.cityName}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug">
                      {alert.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      {alert.description}
                    </p>

                    <div className="mt-2 text-xs text-cyan-300/90 flex items-start gap-1.5 pt-1">
                      <strong className="text-cyan-400 font-semibold shrink-0">Action Protocol:</strong>
                      <span>{alert.actionableStep}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <button
                    onClick={() => setSelectedProtocolAlert(alert)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-semibold transition-all flex items-center space-x-1"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>View Protocol</span>
                  </button>

                  {!alert.read ? (
                    <button
                      onClick={() => onMarkRead(alert.id)}
                      className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 py-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Mark Read</span>
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">Acknowledged</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            No active alerts matching the selected filter.
          </div>
        )}
      </div>

      {/* Protocol Modal */}
      {selectedProtocolAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                  Municipal Dispatch Protocol
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedProtocolAlert.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProtocolAlert(null)}
                className="text-slate-400 hover:text-white text-sm font-mono px-2 py-1 bg-slate-800 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p><strong>Target Region:</strong> {selectedProtocolAlert.cityName}</p>
              <p><strong>Trigger Condition:</strong> Hyperlocal thermal threshold exceeded (2m ground-level sensors).</p>
              <p className="text-cyan-300"><strong>Recommended Municipal Action:</strong> {selectedProtocolAlert.actionableStep}</p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  onMarkRead(selectedProtocolAlert.id);
                  setSelectedProtocolAlert(null);
                }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl text-xs"
              >
                Acknowledge & Deploy Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
